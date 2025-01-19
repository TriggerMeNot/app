# Environment Variables
This document describes the environment variables required for the AREA server.

## Server Configuration
- `PORT` - Port number for the server
::: tip
`Port` Is not used in the Dockerfile.
:::

- `SALT_ROUNDS` - Number of salt rounds for password hashing (Recommended: 10 or more)
- `JWT_SECRET` - Secret key for JWT token generation (Used for user authentication)
- `JWT_FORGOT_PASSWORD_SECRET` - Secret key for password reset tokens (Used for password reset)
- `REDIRECT_URI` - OAuth redirect URI, the base URL of the client application

## Email
See [Email](/server/emails) for more information.
- `RESEND_API_KEY` - API key for Resend email service
- `RESEND_DOMAIN` - Domain configured for Resend

## Services
### GitHub
See [GitHub OAuth Apps](/server/services/github) for more information.
- `GITHUB_ID` - GitHub OAuth application client ID
- `GITHUB_SECRET` - GitHub OAuth application client secret
- `GITHUB_APP` - GitHub App identifier

### Google
See [Google OAuth2](/server/services/google) for more information.
- `GOOGLE_ID` - Google OAuth client ID
- `GOOGLE_SECRET` - Google OAuth client secret

### Discord
See [Discord OAuth2](/server/services/discord) for more information.
- `DISCORD_ID` - Discord application client ID
- `DISCORD_SECRET` - Discord application client secret
- `DISCORD_BOT_TOKEN` - Discord bot token

### Microsoft
See [Microsoft OAuth2](/server/services/microsoft) for more information.
- `MICROSOFT_TENANT` - Microsoft Azure tenant ID
- `MICROSOFT_ID` - Microsoft application client ID
- `MICROSOFT_SECRET` - Microsoft application client secret

## Database
- `DATABASE_URL` - PostgreSQL connection URL (e.g. `postgres://user:password@host:port/database`)
- `POSTGRES_USER` - PostgreSQL username
- `POSTGRES_PASSWORD` - PostgreSQL password
- `POSTGRES_DB` - PostgreSQL database name
