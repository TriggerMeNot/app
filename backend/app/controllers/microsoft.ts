import { Context } from "@hono";
import { db } from "../db/config.ts";
import { and, eq } from "drizzle-orm/expressions";
import { SERVICES } from "../db/seed.ts";
import { oauths as oauthSchema } from "../schemas/oauths.ts";
import { oidcs as oidcSchema } from "../schemas/oidcs.ts";
import { users as userSchema } from "../schemas/users.ts";
import { sign } from "@hono/jwt";

async function linkMicrosoft(code: string, redirect_uri_path: string) {
  // Get the access token and refresh token
  const {
    access_token: token,
    expires_in: tokenExpiresIn,
    refresh_token: refreshToken,
  } = await fetch(
    `https://login.microsoftonline.com/${
      Deno.env.get("MICROSOFT_TENANT")
    }/oauth2/v2.0/token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: Deno.env.get("MICROSOFT_ID")!,
        client_secret: Deno.env.get("MICROSOFT_SECRET")!,
        code,
        grant_type: "authorization_code",
        redirect_uri: Deno.env.get("REDIRECT_URI")! + redirect_uri_path,
        scope: "email profile openid offline_access https://graph.microsoft.com/Mail.Read https://graph.microsoft.com/Mail.Send https://graph.microsoft.com/User.Read",
      }),
    },
  )
    .then((res) => {
      if (!res.ok) {
        throw {
          status: res.status,
          body: res.statusText,
        };
      }
      return res.json();
    })
    .catch((err) => {
      throw {
        status: 400,
        body: err,
      };
    });

  // Get information about the user
  const {
    id: microsoftUserId,
    displayName: username,
    mail: email,
  } = await fetch(`https://graph.microsoft.com/v1.0/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => {
      if (!res.ok) {
        throw {
          status: res.status,
          body: res.statusText,
        };
      }
      return res.json();
    })
    .catch((err) => {
      throw {
        status: 400,
        body: err,
      };
    });

  return {
    microsoftUserId,
    username,
    email,
    token,
    tokenExpiresIn,
    refreshToken,
    actualTime: Math.floor(Date.now() / 1000),
  };
}

async function microsoftRefreshToken(
  userId: number,
  refreshToken: string,
) {
  const {
    access_token: token,
    expires_in: tokenExpiresIn,
    refresh_token: newRefreshToken,
  } = await fetch(
    `https://login.microsoftonline.com/${
      Deno.env.get("MICROSOFT_TENANT")
    }/oauth2/v2.0/token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: Deno.env.get("MICROSOFT_ID")!,
        client_secret: Deno.env.get("MICROSOFT_SECRET")!,
        grant_type: "refresh_token",
        scope:
          "email profile openid offline_access https://graph.microsoft.com/Mail.Read https://graph.microsoft.com/Mail.Send https://graph.microsoft.com/User.Read",
        refresh_token: refreshToken,
      }),
    },
  )
    .then((res) => {
      if (!res.ok) {
        throw {
          status: res.status,
          body: res.statusText,
        };
      }
      return res.json();
    })
    .catch((err) => {
      throw {
        status: 400,
        body: err,
      };
    });

  await db.update(oauthSchema).set({
    token,
    tokenExpiresAt: Math.floor(Date.now() / 1000) + tokenExpiresIn,
    refreshToken: newRefreshToken,
    refreshTokenExpiresAt: Math.floor(Date.now() / 1000) +
      (tokenExpiresIn * 24),
  }).where(
    and(
      eq(oauthSchema.userId, userId),
      eq(oauthSchema.serviceId, SERVICES.Microsoft.id!),
    ),
  );

  return token;
}

async function authenticate(ctx: Context) {
  const { code } = ctx.req.valid("json" as never);

  return await linkMicrosoft(code, "/login/microsoft")
    .then(async ({
      microsoftUserId,
      username,
      email,
      token,
      tokenExpiresIn,
      refreshToken,
      actualTime,
    }) => {
      // Get the user ID / create a new user if not found
      const users = await db
        .select()
        .from(userSchema)
        .where(eq(userSchema.email, email))
        .limit(1);
      const userId = users.length ? users[0].id : await db
        .insert(userSchema)
        .values({
          email,
          username,
          password: null,
        })
        .returning()
        .then((newUser) => newUser[0].id);

      await db
        .insert(oidcSchema)
        .values({
          userId,
          serviceId: SERVICES.Microsoft.id!,
          serviceUserId: microsoftUserId,
          token,
          tokenExpiresAt: actualTime + tokenExpiresIn,
          refreshToken,
          refreshTokenExpiresAt: actualTime + (90 * 24 * 60 * 60), // 90 days in seconds
        })
        .onConflictDoUpdate({
          target: [oidcSchema.userId, oidcSchema.serviceId],
          set: {
            token,
            tokenExpiresAt: actualTime + tokenExpiresIn,
            refreshToken,
            refreshTokenExpiresAt: actualTime + (90 * 24 * 60 * 60), // 90 days in seconds
          },
        });

      const payload = {
        sub: userId,
        role: "user",
        exp: actualTime + 60 * 60 * 24, // Token expires in 24 hours
      };

      const jwtToken = await sign(payload, Deno.env.get("JWT_SECRET")!);

      return ctx.json({
        message: "Login/Register successful",
        token: jwtToken,
      });
    })
    .catch((err) => {
      return ctx.json(
        { message: "Login/Register failed", error: err.body },
        err.status,
      );
    });
}

async function isAuthorized(ctx: Context) {
  const userId = ctx.get("jwtPayload").sub;

  const users = await db
    .select()
    .from(oauthSchema)
    .where(
      and(
        eq(oauthSchema.userId, userId),
        eq(oauthSchema.serviceId, SERVICES.Microsoft.id!),
      ),
    )
    .limit(1);

  return ctx.json({ authorized: users.length ? true : false });
}

async function authorize(ctx: Context) {
  const userId = ctx.get("jwtPayload").sub;
  const { code } = ctx.req.valid("json" as never);

  return await linkMicrosoft(code, "/services/microsoft")
    .then(async ({
      microsoftUserId,
      token,
      tokenExpiresIn,
      refreshToken,
      actualTime,
    }) => {
      await db.insert(oauthSchema).values({
        userId,
        serviceId: SERVICES.Microsoft.id!,
        serviceUserId: microsoftUserId,
        token,
        tokenExpiresAt: actualTime + tokenExpiresIn,
        refreshToken,
        refreshTokenExpiresAt: actualTime + (90 * 24 * 60 * 60), // 90 days in seconds
      }).onConflictDoUpdate({
        target: [oauthSchema.userId, oauthSchema.serviceId],
        set: {
          token,
          tokenExpiresAt: actualTime + tokenExpiresIn,
          refreshToken,
          refreshTokenExpiresAt: actualTime + (90 * 24 * 60 * 60), // 90 days in seconds
        },
      });

      return ctx.json({ message: "Connection successful" });
    })
    .catch((err) => {
      return ctx.json(
        { message: "Connection failed", error: err.body },
        err.status,
      );
    });
}

export default {
  authenticate,
  authorize,
  isAuthorized,
  microsoftRefreshToken,
};
