"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Heart, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simple validation
    if (!username || !password) {
      setError("Please enter both username and password");
      setIsLoading(false);
      return;
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // For demo purposes - hardcoded credentials
    // In a real app, this would be a server-side authentication
    if (username === "girlfriend" && password === "loveyou") {
      router.push("/");
    } else {
      setError("Invalid username or password");
    }

    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-pink-50 to-white p-4">
      <div className="absolute left-4 top-4">
        <Button
          variant="ghost"
          className="p-2 text-pink-700 hover:bg-pink-100 hover:text-pink-800"
          onClick={() => router.push("/")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="mb-6 text-center">
          <div className="mb-4 inline-flex items-center justify-center rounded-full bg-pink-100 p-2">
            <Heart className="h-8 w-8 fill-pink-500 text-pink-500" />
          </div>
          <h1 className="text-3xl font-bold text-pink-700">Welcome Back!</h1>
          <p className="mt-2 text-pink-600">
            Sign in to see all our special memories
          </p>
        </div>

        <Card className="border-pink-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-pink-700">Login</CardTitle>
            <CardDescription>
              Enter your details to access your account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              {error && (
                <Alert
                  variant="destructive"
                  className="border-red-200 bg-red-50 text-red-800"
                >
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="username" className="text-pink-700">
                  Username
                </Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="border-pink-200 focus:border-pink-400 focus:ring-pink-400"
                  placeholder="Enter your username"
                  autoComplete="username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-pink-700">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-pink-200 pr-10 focus:border-pink-400 focus:ring-pink-400"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full bg-pink-500 hover:bg-pink-600"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-pink-600">
            Hint: Username is "girlfriend" and password is "loveyou" 💕
          </p>
        </div>
      </motion.div>

      <div className="fixed bottom-0 left-0 right-0 p-4 text-center text-pink-600">
        <p className="text-sm">Made with love for my special someone</p>
      </div>
    </div>
  );
}
