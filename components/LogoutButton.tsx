// File: components/LogoutButton.tsx
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";

export function LogoutButton() {
    const router = useRouter();

    async function handleLogout() {
        await axios.post("/api/auth/logout");
        toast.success("Logged out");
        router.push("/login");
    }

    return (
        <Button variant="destructive" onClick={handleLogout}>
            Logout
        </Button>
    );
}
