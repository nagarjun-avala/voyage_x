// File: hooks/useSession.ts
"use client";

import { useEffect, useState } from "react";
import axios from "axios";

type User = {
    id: string;
    name: string;
    username?: string;
    email: string;
    role: string;
    avatar?: string;
};

export function useSession() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await axios.get("/api/auth/me");
                setUser(res.data);
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        }
        fetchUser();
    }, []);

    return { user, loading };
}