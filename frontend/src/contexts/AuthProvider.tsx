import { createContext, useContext, useState } from "react";
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

const AuthContext = createContext({
  user: null,
  token: "",
  //@ts-ignore
  loginWithUsernameAndPassword: async (data: z.infer<typeof LoginSchema>) => {},
  loginWithGithub: async () => {},
  logOut: () => {},
  checkIfLoggedIn: () => true as boolean | false as boolean,
});


const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("site") || "");
  const navigate = useNavigate();

  //@ts-ignore
  const loginWithUsernameAndPassword = async (data: z.infer<typeof LoginSchema>) => {};

  const loginWithGithub = async () => {};

  const logOut = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("site");
    navigate("/login");
  };

  const checkIfLoggedIn = (): boolean => {
    // fetch /me and set user if logged in
    return false;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
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
