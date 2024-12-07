"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { signIn, useSession } from "next-auth/react";

interface LoginData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<LoginData>({
    email: "",
    password: "",
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<Partial<LoginData>>({});
  const router = useRouter();
  const { data: session, status } = useSession();

  // Redirect authenticated users to the home page
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async () => {
    setIsLoading(true);

    if (formData.email && formData.password) {
      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (result?.error) {
        setSuccess(false);
        setError({ email: undefined, password: undefined });
      } else {
        setSuccess(true);
        setError({});
        setFormData({ email: "", password: "" });
        router.push("/"); // Redirect to home page upon successful login
      }
    } else {
      setSuccess(false);
      setError({
        email: formData.email ? undefined : "Email is required",
        password: formData.password ? undefined : "Password is required",
      });
    }

    setIsLoading(false);
  };

  const handleRegisterRedirect = () => {
    router.push("/register");
  };

  // Show loading or error based on session status
  if (status === "loading") {
    return <div></div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Access your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            {error.email && (
              <p className="text-sm text-red-500">{error.email}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            {error.password && (
              <p className="text-sm text-red-500">{error.password}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button className="w-full" onClick={handleLogin} disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </Button>
          <Button
            className="w-full"
            variant="outline"
            onClick={handleRegisterRedirect}
          >
            Register
          </Button>
        </CardFooter>
        {success && (
          <Alert className="mt-4">
            <AlertDescription>
              Login successful! Redirecting to your dashboard...
            </AlertDescription>
          </Alert>
        )}
      </Card>
    </div>
  );
}
