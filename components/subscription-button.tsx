"use client"

import axios from "axios";
import { useState } from "react";
import { Sparkles } from "lucide-react";

import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";

interface SubscriptionButtonProps {
    isPro: boolean;
};

export const SubscriptionButton = ({ isPro = false }: SubscriptionButtonProps) => {
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const onClick = async () => {
        try {
            setLoading(true);

            const res = await axios.get("/api/stripe");
            window.location.href = res.data.url;
        } catch (error) {
            toast({
                variant: "destructive",
                description: "Something went wrong"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button size="sm" variant={isPro ? "default" : "premium"} disabled={loading} onClick={onClick}>
            {isPro ? "Manage Subscription" : "Upgrade"}
            {!isPro && <Sparkles className="h-4 w-4 ml-2 fill-white" />}
        </Button>
    );
};