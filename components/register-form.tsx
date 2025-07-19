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
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Link from "next/link";
import { RegisterFormSchema, RegisterFormState } from "@/lib/definitions"

export function RegisterForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormState>({
        resolver: zodResolver(RegisterFormSchema),
    });

    const onSubmit = async (data: RegisterFormState) => {
        setLoading(true);
        try {
            // const res = await axios.post("/api/auth/register", data);
            toast.success("Regestered successfully", {
                description: "Welcome Greatings, Nagarjun A",
                onAutoClose: () => {
                    router.push("/login");
                }
            });
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Register failed");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle><h1 className="text-2xl font-bold text-center">Create an Account</h1></CardTitle>
                    <CardDescription className="mb-4">
                        Enter your details below to register to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form method="POST" className="space-y-6">
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-3">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    {...register("name")}
                                    required
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-sm">
                                        {errors.name.message}
                                    </p>
                                )}
                            </div>
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
                                <Label htmlFor="password">Password</Label>
                                <Input {...register("password")} required />
                                {errors.password && (
                                    <p className="text-red-500 text-sm">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <Input {...register("confirmPassword")} required />
                                {errors.confirmPassword && (
                                    <p className="text-red-500 text-sm">
                                        {errors.confirmPassword.message}
                                    </p>
                                )}
                            </div>
                            <Button onClick={handleSubmit(onSubmit)} type="submit" className="w-full" disabled={loading}>
                                {loading ? "Registering..." : "Register"}
                            </Button>

                        </div>
                        <div className="mt-4 text-center text-sm">
                            Already have an account?{" "}
                            <Link href="/login" className="underline underline-offset-4">
                                Log in
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
