// File: app/not-found.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Ghost } from "lucide-react";

export default function NotFound() {
    return (
        <div className="flex h-[80vh] flex-col items-center justify-center text-center space-y-6 px-4">
            <div className="flex items-center justify-center bg-muted rounded-full w-20 h-20">
                <Ghost className="w-10 h-10 text-muted-foreground" />
            </div>
            <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight">Page Not Found</h1>
                <p className="text-muted-foreground text-sm">
                    Sorry, the page you are looking for does not exist or has been moved.
                </p>
            </div>
            <Button asChild>
                <Link href="/">Go to Home</Link>
            </Button>
        </div>
    );
}
