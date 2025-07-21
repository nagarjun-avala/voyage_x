import { z } from "zod";

// zod schema
export const bookingSchema = z.object({
    title: z.string().min(3),
    guestName: z.string().min(2),
    guestEmail: z.string().email(),
    checkIn: z.string(),
    checkOut: z.string(),
    roomId: z.string(),
    mealPlan: z.string(),
    notes: z.string().optional(),
    adults: z.number().min(1),
    children: z.number().min(0),
});


export type BookingFormSchema = z.infer<typeof bookingSchema>;
export const mealPlanRates: Record<string, number> = {
    NONE: 0,
    BREAKFAST: 500,
    HALF_BOARD: 1000,
    FULL_BOARD: 1500,
};