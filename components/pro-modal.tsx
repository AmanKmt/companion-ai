"use client"

import axios from "axios";
import { useEffect, useState } from "react";

import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { Separator } from "./ui/separator";
import { useProModal } from "@/hooks/use-pro-modal";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";

export const ProModal = () => {
    const proModal = useProModal();
    const { toast } = useToast();

    const [loading, setLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);
 
    const onSubscribe = async () => {
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

    if (!isMounted) {
        return null;
    }

    return (
        <Dialog open={proModal.isOpen} onOpenChange={proModal.onClose}>
            <DialogContent>
                <DialogHeader className="space-y-4">
                    <DialogTitle className="text-center">
                        Upgrade to Pro
                    </DialogTitle>

                    <DialogDescription className="text-center space-y-2">
                        Create <span className="text-sky-500 mx-1 font-medium">Custom AI</span> Companions.
                    </DialogDescription>
                </DialogHeader>

                <Separator />

                <div className="flex justify-between">
                    <p className="text-2xl font-medium">&#8377;49<span className="text-sm font-normal">.99 / month</span></p>
                    <Button variant="premium" disabled={loading} onClick={onSubscribe}>
                        Subscribe
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};