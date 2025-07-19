// File: app/page.tsx
"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-100 via-blue-200 to-white dark:from-gray-900 dark:to-black">
      <div className="flex flex-col items-center space-y-6 text-center px-4">
        <Image
          src="/voyagex.png"
          alt="VoyageX Logo"
          width={100}
          height={100}
          className="drop-shadow-lg"
        />
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-blue-800 dark:text-blue-200">
          Welcome to VoyageX
        </h1>
        <p className="text-lg max-w-xl text-blue-700 dark:text-blue-300">
          Manage your cruise experience like never before. Book, Order, and Connect with ease.
        </p>
        <div className="space-x-4">
          <Button onClick={() => router.push("/login")} size="lg">
            Login
          </Button>
          <Button variant="outline" onClick={() => router.push("/register")} size="lg">
            Register
          </Button>
        </div>
      </div>
    </main>
  );
}
