"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Link from "next/link";
import { LoginFormSchema, LoginFormState } from "@/lib/definitions"
import axios from "axios"
import { roleRedirectMap } from "@/lib/roleRedirect";

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormState>({
        resolver: zodResolver(LoginFormSchema),
    });

    const onSubmit = async (data: LoginFormState) => {
        setLoading(true);
        try {
            const res = await axios.post("/api/auth/login", data);
            if (res?.data?.error) {
                toast.error(res.data.error.message || "Login failed");
            } else {
                toast.success("Logged in successfully", {
                    description: `Welcome back, ${res?.data?.user.name || res?.data?.user.username}!`,
                    onAutoClose: () => {
                        router.push(roleRedirectMap[res?.data?.user.role] || "/dashboard");
                    }
                });
            }
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                toast.error(err.response?.data?.message || "Login failed");
            } else {
                toast.error("Login failed");
            }
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle><h1 className="text-2xl font-bold text-center">Login to VoyageX</h1></CardTitle>
                    <CardDescription className="mb-4">
                        Enter your username below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form method="POST" className="space-y-6">
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-3">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    {...register("username")}
                                    required
                                />
                                {errors.username && (
                                    <p className="text-red-500 text-sm">
                                        {errors.username.message}
                                    </p>
                                )}
                            </div>
                            <div className="grid gap-3">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    <Link href={"#"} className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                                        Forgot your password?
                                    </Link>
                                </div>
                                <Input {...register("password")} required />
                                {errors.password && (
                                    <p className="text-red-500 text-sm">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>
                            <Button onClick={handleSubmit(onSubmit)} type="submit" className="w-full" disabled={loading}>
                                {loading ? "Logging in..." : "Login"}
                            </Button>

                        </div>
                        <div className="mt-4 text-center text-sm">
                            Don&apos;t have an account?{" "}
                            <Link href="/register" className="underline underline-offset-4">
                                Register
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
