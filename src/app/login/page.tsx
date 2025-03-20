"use client";

import type React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Heart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();

  const handleDiscordLogin = async () => {
    await signIn("discord", { callbackUrl: "/" });
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
            Sign in with Discord to see all our special memories
          </p>
        </div>

        <Card className="border-pink-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-pink-700">Login</CardTitle>
            <CardDescription>
              Click below to sign in with your Discord account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleDiscordLogin}
              className="w-full bg-[#5865F2] hover:bg-[#4752C4]"
            >
              <svg
                className="mr-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 127.14 96.36"
                fill="currentColor"
              >
                <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
              </svg>
              Sign in with Discord
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      <div className="fixed bottom-0 left-0 right-0 p-4 text-center text-pink-600">
        <p className="text-sm">Made with love for my special someone</p>
      </div>
    </div>
  );
}
