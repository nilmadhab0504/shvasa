"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<RegisterData>({
    name: "",
    email: "",
    password: "",
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<Partial<RegisterData>>({});
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async () => {
    setIsLoading(true);

    if (formData.name && formData.email && formData.password) {
      try {
        const response = await fetch("/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          setSuccess(true);
          setError({});
          setFormData({ name: "", email: "", password: "" });
          setTimeout(() => {
            router.push("/login");
          }, 2000); // Redirect after 2 seconds
        } else {
          setSuccess(false);
          setError({ email: "Registration failed. Please try again." });
        }
      } catch (err) {
        setSuccess(false);
        setError({ email: "Something went wrong. Please try again." });
      }
    } else {
      setSuccess(false);
      setError({
        name: formData.name ? undefined : "Name is required",
        email: formData.email ? undefined : "Email is required",
        password: formData.password ? undefined : "Password is required",
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>Create a new account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            {error.name && <p className="text-sm text-red-500">{error.name}</p>}
          </div>
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
            {error.email && <p className="text-sm text-red-500">{error.email}</p>}
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
            {error.password && <p className="text-sm text-red-500">{error.password}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button className="w-full" onClick={handleRegister} disabled={isLoading}>
            {isLoading ? "Registering..." : "Register"}
          </Button>
          <Button
            className="w-full"
            variant="outline"
            onClick={() => router.push("/login")}
          >
            Already have an account? Login
          </Button>
        </CardFooter>
        {success && (
          <Alert className="mt-4">
            <AlertDescription>
              Registration successful! Redirecting to login...
            </AlertDescription>
          </Alert>
        )}
      </Card>
    </div>
  );
}
