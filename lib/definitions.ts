import { z } from 'zod'

// Register
export const RegisterFormSchema = z.object({
    name: z
        .string()
        .min(3, { message: 'Name must be at least 3 characters long.' })
        .trim(),
    username: z
        .string()
        .min(3, "Username must be at least 3 characters long")
        .trim(),
    password: z
        .string()
        .min(8, { message: 'Be at least 8 characters long' })
        .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
        .regex(/[0-9]/, { message: 'Contain at least one number.' })
        .regex(/[^a-zA-Z0-9]/, {
            message: 'Contain at least one special character.',
        })
        .trim(),
    confirmPassword: z.string().min(8, "Confirm Password must be at least 8 characters long"),
    email: z.string().email({ message: 'Please enter a valid email.' }).trim(),

}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
});

export type RegisterFormState = z.infer<typeof RegisterFormSchema>;

// Log In
export const LoginFormSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters long"),
    password: z.string()
        .min(8, { message: 'Be at least 8 characters long' })
        .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
        .regex(/[0-9]/, { message: 'Contain at least one number.' })
        .regex(/[^a-zA-Z0-9]/, {
            message: 'Contain at least one special character.',
        })
        .trim(),
});

export type LoginFormState = z.infer<typeof LoginFormSchema>;