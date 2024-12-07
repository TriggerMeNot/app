import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod"
import { ReactNode } from "react";

const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID as string;

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

type AuthContextType = {
  user: any;
  token: string | undefined;
  backendAddress: string;
  setBackendAddress: (address: string) => void;
  registerWithUsernameAndPassword: (data: z.infer<typeof RegisterSchema>) => Promise<void>;
  loginWithUsernameAndPassword: (data: z.infer<typeof LoginSchema>) => Promise<void>;
  loginWithGithub: () => Promise<void>;
  logOut: () => void;
  checkIfLoggedIn: () => boolean;
  isLoading?: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: undefined,
  backendAddress: import.meta.env.VITE_BACKEND_DEFAULT_ADDRESS as string || "http://localhost:8080",
  setBackendAddress: (_address: string) => {},
  registerWithUsernameAndPassword: async (_data: z.infer<typeof RegisterSchema>) => {},
  loginWithUsernameAndPassword: async (_data: z.infer<typeof LoginSchema>) => {},
  loginWithGithub: async () => {},
  logOut: () => {},
  checkIfLoggedIn: () => false,
  isLoading: false,
});


const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | undefined>(() => localStorage.getItem("token") || undefined);
  const [backendAddress, setBackendAddress] = useState<string>(import.meta.env.VITE_BACKEND_DEFAULT_ADDRESS as string || "http://localhost:8080");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const [githubCode, setGithubCode] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    setGithubCode(code);
    console.log(code);
    window.history.replaceState({}, document.title, window.location.pathname);
  }, [navigate]);

  useEffect(() => {
    if (githubCode) {
      (async () => {
        try {
          setIsLoading(true);
          const response = await fetch(`${backendAddress}/api/auth/github`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ code: githubCode }),
          });

          if (response.ok) {
            const { user, token } = await response.json();
            setUser(user);
            setToken(token);
            localStorage.setItem("token", token);
            setIsLoading(false);
            navigate("/");
          } else {
            const error = await response.json();
            console.error(error);
            setIsLoading(false);
          }
        } catch (error) {
          console.error(error);
          setIsLoading(false);
        }
      })();
    }
  }, [githubCode]);

  useEffect(() => {
    if (backendAddress) {
      let sanitizedAddress = backendAddress.trim();
      if (!sanitizedAddress.startsWith("http")) {
        sanitizedAddress = `http://${sanitizedAddress}`;
      }
      if (sanitizedAddress.endsWith("/")) {
        sanitizedAddress = sanitizedAddress.slice(0, -1);
      }
      setBackendAddress(sanitizedAddress);
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
        const { user, token } = await response.json();
        setUser(user);
        setToken(token);
        localStorage.setItem("token", token);
        setIsLoading(false);
        navigate("/");
      } else {
        const error = await response.json();
        console.error(error);
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
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
        const { user, token } = await response.json();
        setUser(user);
        setToken(token);
        localStorage.setItem("token", token);
        setIsLoading(false);
        navigate("/");
      } else {
        const error = await response.json();
        console.error(error);
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  }

  const loginWithGithub = async () => {
    if (!GITHUB_CLIENT_ID) {
      console.error("GITHUB_CLIENT_ID is not set.");
      return;
    }
    setIsLoading(true);
    window.location.assign(`https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${window.location.origin}/login`);
    setIsLoading(false);
  };

  const logOut = () => {
    setUser(null);
    setToken(undefined);
    localStorage.removeItem("site");
    navigate("/login");
  };

  const checkIfLoggedIn = (): boolean => {
    if (token) return true;
    return false;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        backendAddress,
        setBackendAddress,
        registerWithUsernameAndPassword,
        loginWithUsernameAndPassword,
        loginWithGithub,
        logOut,
        checkIfLoggedIn,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
export const useAuth = () => useContext(AuthContext);
