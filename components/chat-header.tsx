"use client"

import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Companion, Message } from "@prisma/client";
import { ChevronLeft, Edit, MessagesSquare, MoreVertical, Trash } from "lucide-react";

import { Button } from "./ui/button";
import { toast } from "./ui/use-toast";
import { BotAvatar } from "./bot-avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

interface ChatHeaderProps {
    companion: Companion & {
        messages: Message[];
        _count: {
            messages: number;
        }
    };
};

export const ChatHeader = ({ companion }: ChatHeaderProps) => {
    const router = useRouter();
    const { user } = useUser();

    const onDelete = async () => {
        try {
            await axios.delete(`/api/companion/${companion.id}`);

            toast({
                description: "Success",
            });

            router.refresh();
            router.push("/");
        } catch (error) {
            toast({
                variant: "destructive",
                description: "Something went wrong",
            });
        }
    };

    return (
        <div className="flex w-full justify-between items-center border-b border-primary/10 pb-4">
            <div className="flex gap-x-2 items-center">
                <Button onClick={() => router.back()} size="icon" variant="ghost">
                    <ChevronLeft className="h-8 w-8" />
                </Button>

                <BotAvatar src={companion.src} />

                <div className="flex flex-col gap-y-1">
                    <div className="flex items-center gap-x-2">
                        <p className="font-bold">
                            {companion.name}
                        </p>

                        <div className="flex items-center text-xs text-muted-foreground">
                            <MessagesSquare className="w-3 h-3 mr-1" />
                            {companion._count.messages}
                        </div>
                    </div>

                    <p className="text-xs text-muted-foreground">
                        Created by @{companion.username}
                    </p>
                </div>
            </div>

            {user?.id === companion.userId && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="icon">
                            <MoreVertical className="h-5 w-5" />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/companion/${companion.id}`)} className="cursor-pointer">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                        </DropdownMenuItem>

                        <DropdownMenuItem className="text-rose-600 dark:text-rose-600 cursor-pointer" onClick={onDelete}>
                            <Trash className="w-4 h-4 mr-2" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </div>
    );
};