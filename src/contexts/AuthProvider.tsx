import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod"
import { ReactNode } from "react";

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
});


const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | undefined>(() => localStorage.getItem("token") || undefined);
  const [backendAddress, setBackendAddress] = useState<string>(import.meta.env.VITE_BACKEND_DEFAULT_ADDRESS as string || "http://localhost:8080");
  const navigate = useNavigate();

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
      console.log(data);
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
        navigate("/");
      } else {
        const error = await response.json();
        console.error(error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const registerWithUsernameAndPassword = async (data: z.infer<typeof RegisterSchema>) => {
    try {
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
        navigate("/");
      } else {
        const error = await response.json();
        console.error(error);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const loginWithGithub = async () => {
    try {
      const response = await fetch(`${backendAddress}/api/auth/github`, {
        method: "GET",
      });

      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url;
      } else {
        const error = await response.json();
        console.error(error);
      }
    } catch (error) {
      console.error(error);
    }
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
export const useAuth = () => useContext(AuthContext);
