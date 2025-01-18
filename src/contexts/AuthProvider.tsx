import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod"
import { ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import { App } from '@capacitor/app';
import { Browser } from '@capacitor/browser';

export const LoginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
})

export const RegisterSchema = LoginSchema.extend({
  username: z.string().min(3, { message: "Username must be at least 3 characters." }),
  confirmPassword: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." })
    .refine((data) => /[A-Z]/.test(data), {
      message: "Password must contain at least one uppercase letter.",
    })
    .refine((data) => /[a-z]/.test(data), {
      message: "Password must contain at least one lowercase letter.",
    })
    .refine((data) => /[0-9]/.test(data), {
      message: "Password must contain at least one number.",
    }),
}).refine(
  (data) => data.confirmPassword === data.password,
  {
    message: "Passwords must match.",
    path: ["confirmPassword"],
  }
);

type Action = {
  id: number;
  name: string;
  description: string;
};

type Reaction = {
  id: number;
  name: string;
  description: string;
};

type Service = {
  description: ReactNode;
  name: string;
  actions: Action[];
  reactions: Reaction[];
  oauths?: {
    authenticate_uri: string;
    authorization_uri: string;
  };
};

type AuthContextType = {
  user: any;
  about: any;
  token: string | undefined;
  backendAddress: string;
  setBackendAddress: (address: string) => void;
  registerWithUsernameAndPassword: (data: z.infer<typeof RegisterSchema>) => Promise<void>;
  loginWithUsernameAndPassword: (data: z.infer<typeof LoginSchema>) => Promise<void>;
  logOut: () => void;
  checkIfLoggedIn: () => boolean;
  isLoading: boolean;
  services: Service[];
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  about: null,
  token: undefined,
  backendAddress: localStorage.getItem("site") || import.meta.env.VITE_BACKEND_DEFAULT_ADDRESS as string || "http://localhost:8080",
  setBackendAddress: (_address: string) => {},
  registerWithUsernameAndPassword: async (_data: z.infer<typeof RegisterSchema>) => {},
  loginWithUsernameAndPassword: async (_data: z.infer<typeof LoginSchema>) => {},
  logOut: () => {},
  checkIfLoggedIn: () => false,
  isLoading: false,
  services: [],
});

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") as string) : null);
  const [token, setToken] = useState<string | undefined>(() => localStorage.getItem("token") || undefined);
  const [backendAddress, setBackendAddress] = useState<string>(localStorage.getItem("site") || import.meta.env.VITE_BACKEND_DEFAULT_ADDRESS as string || "http://localhost:8080");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [services, setServices] = useState<Service[]>([]);
  const [about, setAbout] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [githubCode, setGithubCode] = useState<string | null>(null);
  const [googleCode, setGoogleCode] = useState<string | null>(null);
  const [microsoftCode, setMicrosoftCode] = useState<string | null>(null);
  const [discordCode, setDiscordCode] = useState<string | null>(null);

  useEffect(() => {
    App.addListener("appUrlOpen", async (event) => {
      if (event.url.startsWith(about.client.redirect_uri)) {
        const slug = event.url.split(about.client.redirect_uri)[1];
        Browser.close();
        navigate(slug);
      }
    });
  }, [about]);

  const getServices = useCallback(async () => {
    try {
      const response = await fetch(`${backendAddress}/about.json`);
      if (response.ok) {
        const data = await response.json();
        setAbout(data);
        setServices(data.server.services);
      } else {
        const error = await response.json();
        toast({ title: "Error", description: error.message });
      }
    } catch (error) {
      toast({ title: "Error", description: (error instanceof Error) ? error.message : "An unknown error occurred." });
    }
  }, [backendAddress]);

  useEffect(() => {
    const fn = async () => {
      if (!token) return;
      try {
        const response = await fetch(`${backendAddress}/api/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const user = await response.json();
          localStorage.setItem("user", JSON.stringify(user));
          setUser(user);
          setIsLoading(false);
        } else {
          const error = await response.json();
          toast({ title: "Error", description: error.message });
          setIsLoading(false);
          navigate("/login");
        }

      } catch (error) {
        toast({ title: "Error", description: (error instanceof Error) ? error.message : "An unknown error occurred." });
        setIsLoading(false);
        navigate("/login");
      }
    }

    fn();
  }, [token]);

  useEffect(() => {
    const fn = async () => {
      if (window.location.pathname !== "/login/github") return;
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      if (!code) return;

      if (urlParams.get("setup_action") === "install") {
        navigate(`/services/github?code=${code}&setup_action=install`);
      } else {
        setGithubCode(code);
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }

    window.addEventListener("load", fn);

    return () => {
      window.removeEventListener("load", fn);
    }
  }, []);

  useEffect(() => {
    if (githubCode) {
      (async () => {
        try {
          setIsLoading(true);
          const response = await fetch(`${backendAddress}/api/github/authenticate`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ code: githubCode }),
          });

          if (response.ok) {
            const { token } = await response.json();
            setToken(token);
            localStorage.setItem("token", token);
            toast({ title: "Success", description: "Successfully logged in using Github." });
            navigate("/");
          } else {
            const error = await response.json();
            setIsLoading(false);
            toast({ title: "Error", description: error.message });
          }
        } catch (error) {
          toast({ title: "Error", description: (error instanceof Error) ? error.message : "An unknown error occurred." });
          setIsLoading(false);
        }
      })();
    }
  }, [githubCode]);

  useEffect(() => {
    const fn = async () => {
      if (window.location.pathname !== "/login/google") return;
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      if (!code) return;

      setGoogleCode(code);
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    window.addEventListener("load", fn);

    return () => {
      window.removeEventListener("load", fn);
    }
  }, []);

  useEffect(() => {
    if (googleCode) {
      (async () => {
        try {
          setIsLoading(true);
          const response = await fetch(`${backendAddress}/api/google/authenticate`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ code: googleCode }),
          });

          if (response.ok) {
            const { token } = await response.json();
            setToken(token);
            localStorage.setItem("token", token);
            toast({ title: "Success", description: "Successfully logged in using Google." });
            navigate("/");
          } else {
            const error = await response.json();
            setIsLoading(false);
            toast({ title: "Error", description: error.message });
          }
        } catch (error) {
          toast({ title: "Error", description: (error instanceof Error) ? error.message : "An unknown error occurred." });
          setIsLoading(false);
        }
      })();
    }
  }, [googleCode]);

  useEffect(() => {
    const fn = async () => {
      if (window.location.pathname !== "/login/microsoft") return;
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      if (!code) return;

      setMicrosoftCode(code);
      window.history.replaceState({}, document.title, window.location.pathname);
    };

    window.addEventListener("load", fn);

    return () => {
      window.removeEventListener("load", fn);
    }
  }, []);

  useEffect(() => {
    if (microsoftCode) {
      (async () => {
        try {
          setIsLoading(true);
          const response = await fetch(`${backendAddress}/api/microsoft/authenticate`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ code: microsoftCode }),
          });

          if (response.ok) {
            const { token } = await response.json();
            setToken(token);
            localStorage.setItem("token", token);
            toast({ title: "Success", description: "Successfully logged in using Microsoft." });
            navigate("/");
          } else {
            const error = await response.json();
            setIsLoading(false);
            toast({ title: "Error", description: error.message });
          }
        } catch (error) {
          toast({ title: "Error", description: (error instanceof Error) ? error.message : "An unknown error occurred." });
          setIsLoading(false);
        }
      })();
    }
  }, [microsoftCode]);

  useEffect(() => {
    const fn = async () => {
      if (window.location.pathname !== "/login/discord") return;
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      if (!code) return;

      setDiscordCode(code);
      window.history.replaceState({}, document.title, window.location.pathname);
    };

    window.addEventListener("load", fn);

    return () => {
      window.removeEventListener("load", fn);
    }
  }, []);

  useEffect(() => {
    if (discordCode) {
      (async () => {
        try {
          setIsLoading(true);
          const response = await fetch(`${backendAddress}/api/discord/authenticate`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ code: discordCode }),
          });

          if (response.ok) {
            const { token } = await response.json();
            setToken(token);
            localStorage.setItem("token", token);
            toast({ title: "Success", description: "Successfully logged in using Discord." });
            navigate("/");
          } else {
            const error = await response.json();
            setIsLoading(false);
            toast({ title: "Error", description: error.message });
          }
        } catch (error) {
          toast({ title: "Error", description: (error instanceof Error) ? error.message : "An unknown error occurred." });
          setIsLoading(false);
        }
      })();
    }
  }, [discordCode]);

  useEffect(() => {
    if (backendAddress) {
      let sanitizedAddress = backendAddress.trim();
      if (sanitizedAddress.endsWith("/")) {
        sanitizedAddress = sanitizedAddress.slice(0, -1);
      }
      localStorage.setItem("site", sanitizedAddress);
      setBackendAddress(sanitizedAddress);
      getServices();
    }
  }, [backendAddress]);

  const loginWithUsernameAndPassword = async (data: z.infer<typeof LoginSchema>) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${backendAddress}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(data as Record<string, string>),
      });

      if (response.ok) {
        const { token } = await response.json();
        setToken(token);
        localStorage.setItem("token", token);
        toast({ title: "Success", description: "Successfully logged in." });
        navigate("/");
      } else {
        const error = await response.json();
        toast({ title: "Error", description: error.message });
        setIsLoading(false);
      }
    } catch (error) {
      toast({ title: "Error", description: (error instanceof Error) ? error.message : "An unknown error occurred." });
      setIsLoading(false);
    }
  };

  const registerWithUsernameAndPassword = async (data: z.infer<typeof RegisterSchema>) => {
    try {
      setIsLoading(true);
      const { confirmPassword, ...registerData } = data;
      const response = await fetch(`${backendAddress}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(registerData as Record<string, string>),
      });

      if (response.ok) {
        const { token } = await response.json();
        localStorage.setItem("user", JSON.stringify(user));
        setToken(token);
        localStorage.setItem("token", token);
        toast({ title: "Success", description: "Successfully registered." });
        navigate("/");
      } else {
        const error = await response.json();
        toast({ title: "Error", description: error.message });
        setIsLoading(false);
      }
    } catch (error) {
      toast({ title: "Error", description: (error instanceof Error) ? error.message : "An unknown error occurred." });
      setIsLoading(false);
    }
  };

  const logOut = () => {
    setUser(null);
    setToken(undefined);
    localStorage.removeItem("site");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const checkIfLoggedIn = () => {
    return !!token;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        about,
        token,
        backendAddress,
        setBackendAddress,
        registerWithUsernameAndPassword,
        loginWithUsernameAndPassword,
        logOut,
        checkIfLoggedIn,
        isLoading,
        services,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
export const useAuth = () => useContext(AuthContext);
