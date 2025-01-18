import { useAuth } from "@/contexts/AuthProvider";
import { useEffect, useState } from "react";
import { forgotPassword, resetPassword } from "@/utils/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const emailSchema = z.string().email("Invalid email address");

const passwordSchema = z
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
  });

const ForgotPassword = () => {
  const { backendAddress } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);

  const [token, setToken] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    const url = new URL(window.location.href);
    const tokenParam = url.searchParams.get("token");
    if (tokenParam) {
      setToken(tokenParam);
    }
  }, []);

  const handleForgotPassword = () => {
    try {
      emailSchema.parse(email.trim());
      setEmailError(null);

      forgotPassword(backendAddress, email)
        .then(() => {
          toast({
            title: "Success",
            description: "Reset link sent to your email",
          });
        })
        .catch((error) => {
          toast({
            title: "Error",
            description: error.message,
          });
        });
    } catch (error) {
      if (error instanceof z.ZodError) {
        setEmailError(error.errors[0].message);
      }
    }
  };

  const handleResetPassword = () => {
    try {
      passwordSchema.parse(newPassword.trim());
      setPasswordError(null);

      resetPassword(backendAddress, token!, newPassword)
        .then(() => {
          toast({
            title: "Success",
            description: "Password reset successfully",
          });
          navigate("/login");
        })
        .catch((error) => {
          toast({
            title: "Error",
            description: error.message,
          });
        });
    } catch (error) {
      if (error instanceof z.ZodError) {
        setPasswordError(error.errors[0].message);
      }
    }
  };

  return (
    <div className={cn("flex items-center justify-center h-screen p-4")}>
      <Card className={cn("w-full max-w-md shadow-lg")}>
        <CardHeader>
          <CardTitle className="text-center">
            {token ? "Reset Password" : "Forgot Password"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {token ? (
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="Enter your new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              {passwordError && (
                <p className="text-sm text-red-600">{passwordError}</p>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {emailError && (
                <p className="text-sm text-red-600">{emailError}</p>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button
            className="w-full"
            onClick={token ? handleResetPassword : handleForgotPassword}
            disabled={token ? !newPassword : !email}
          >
            {token ? "Reset Password" : "Send Reset Link"}
          </Button>
          <Button
            className="w-full"
            onClick={() => navigate("/login")}
            variant={"secondary"}
          >
            Back to login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ForgotPassword;
