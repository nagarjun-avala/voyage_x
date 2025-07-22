"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookingFormSchema, bookingSchema, mealPlanRates } from "@/lib/validations/booking";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { Room } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import z from "zod";
import { Label } from "../ui/label";

export default function BookingForm() {
    const router = useRouter();
    const [rooms, setRooms] = useState<Room[]>([]);
    const [amount, setAmount] = useState<number>(0);
    const [capacityError, setCapacityError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<z.infer<typeof bookingSchema>>({
        resolver: zodResolver(bookingSchema),
        defaultValues: {
            title: "Family Trip to Maldives",
            guestName: "",
            guestEmail: "",
            checkIn: new Date().toISOString().split("T")[0],
            checkOut: new Date(Date.now() + 86400000).toISOString().split("T")[0],
            roomId: "",
            mealPlan: "NONE",
            notes: "",
            adults: 1,
            children: 0,
        },
    });

    const roomId = watch("roomId");
    const adults = watch("adults");
    const children = watch("children");
    const mealPlan = watch("mealPlan");

    useEffect(() => {
        fetch("/api/rooms")
            .then((res) => res.json())
            .then((data) => setRooms(data));
    }, []);

    useEffect(() => {
        const room = rooms.find((r) => r.id === roomId);
        if (room) {
            const total = adults + children;

            if (total > room.capacity) {
                setCapacityError(`🚫 Max capacity of ${room.capacity} exceeded.`);
            } else {
                setCapacityError(null);
            }

            const roomCharge = adults * room.pricePerAdult + children * room.pricePerChild;
            const mealCharge = mealPlanRates[mealPlan] || 0;
            setAmount(roomCharge + mealCharge);
        }
    }, [roomId, adults, children, mealPlan, rooms]);

    useEffect(() => {
        const room = rooms.find((r) => r.id === roomId);
        if (room) {
            const total = adults + children;

            // Auto-adjust if over capacity
            if (total > room.capacity) {
                const excess = total - room.capacity;

                if (children >= excess) {
                    setValue("children", children - excess);
                } else {
                    setValue("children", 0);
                    setValue("adults", Math.max(1, adults - (excess - children)));
                }
            }
        }
    }, [adults, children, roomId, rooms, setValue]); // Just on roomId change



    const onSubmit = async (data: BookingFormSchema) => {
        const res = await fetch("/api/dashboard/bookings", {
            method: "POST",
            body: JSON.stringify({ ...data, amount }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (res.ok) {
            const { booking } = await res.json();
            toast.success("Booking successful!");
            router.push(`/bookings/${booking?.id}/receipt`);
        } else {
            toast.error("Booking failed.");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input {...register("title")} placeholder="Booking title" />
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:space-y-0 md:space-x-2">
                <Input {...register("guestName")} placeholder="Guest name" />
                <Input {...register("guestEmail")} placeholder="Guest email" type="email" />
            </div>
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:space-y-0 md:space-x-2">
                <div className="flex-1">
                    <Label className="mb-2">Check-in Date</Label>
                    <Input {...register("checkIn")} type="date" />
                </div>
                <div className="flex-1">
                    <Label className="mb-2">Check-out Date</Label>
                    <Input {...register("checkOut")} type="date" />
                </div>
                <div className="flex-1">
                    <Label className="mb-2">Adults</Label>
                    <Input {...register("adults", { valueAsNumber: true })} type="number" min={1} />
                </div>
                <div className="flex-1">
                    <Label className="mb-2">Children</Label>
                    <Input {...register("children", { valueAsNumber: true })} type="number" min={0} />
                </div>
            </div>
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:space-y-0 md:space-x-2">
            </div>
            {capacityError && (
                <p className="text-sm text-red-500">{capacityError}</p>
            )}
            <div className="mb-4 flex items-center flex-col gap-3 md:flex-row md:space-y-0 md:space-x-2">
                <div>
                    <Select onValueChange={(val) => setValue("roomId", val)} defaultValue="">
                        <SelectTrigger>
                            <SelectValue placeholder="Select room" />
                        </SelectTrigger>
                        <SelectContent>
                            {rooms.map((room) => (
                                <SelectItem key={room.id} value={room.id}>
                                    {room.name} (capacity: {room.capacity})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                {roomId && (
                    <p className="text-sm text-muted-foreground">
                        🧍 Max Capacity: {rooms.find((r) => r.id === roomId)?.capacity || 0}
                    </p>
                )}
                <div>


                    <Select onValueChange={(val) => setValue("mealPlan", val)} defaultValue="NONE">
                        <SelectTrigger>
                            <SelectValue placeholder="Meal Plan" />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.keys(mealPlanRates).map((plan) => (
                                <SelectItem key={plan} value={plan}>
                                    {plan.replaceAll("_", " ")} (+{formatCurrency(mealPlanRates[plan])})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <p className="text-sm font-semibold text-muted-foreground">💰 Estimated: {formatCurrency(amount)}</p>
            </div>

            <Textarea {...register("notes")} placeholder="Additional notes..." />


            <Button className="float-end" type="submit" disabled={isSubmitting || !!capacityError}>
                {isSubmitting ? "Booking..." : "Booking now"}
            </Button>


            {errors && (
                <div className="text-red-500 text-sm">
                    {Object.values(errors)
                        .map((e) => e?.message)
                        .join(", ")}
                </div>
            )}
        </form>
    );
}
