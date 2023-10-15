"use client"

import * as z from "zod";
import axios from "axios";
import { Wand2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Category, Companion } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { ImageUpload } from "@/components/image-upload";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const PREAMBLE = `The Supreme Personality of Godhead has no duty to perform and His senses are interchangeable. Each of His senses can perform the activities of every other sense. There is nobody equal to or greater than Him. He has multifarious energies that are so expansive and intricate that all the components of activity such as knowledge, capability and endeavor are automatically performed as a natural sequence. The Personality of Godhead is perfect and complete, and because He is completely perfect, all emanations from Him, such as this phenomenal world, are perfectly equipped as complete wholes. Whatever is produced of the Complete Whole is also complete in itself. Because He is the Complete Whole, even though so many complete units emanate from Him, He remains the complete balance.
`;

const SEED_CHAT = `Human: Hi Krishna, how's your day been?
Shree Krishna: Busy as always. Between listning prayers of my beautiful souls. How about you?

Human: How can i be your favorite devotee?

Human: I am so depressed in this material life, how can i attain eternal peace?
`;

interface CompanionFormProps {
    initialData: Companion | null;
    categories: Category[];
};

const formSchema = z.object({
    name: z.string().min(3, {
        message: "Name is required",
    }),

    description: z.string().min(1, {
        message: "Description is required",
    }),

    instructions: z.string().min(200, {
        message: "Instructions require at least 200 characters",
    }),

    seed: z.string().min(200, {
        message: "Seed require at least 200 characters",
    }),

    src: z.string().min(1, {
        message: "Image is required",
    }),

    categoryId: z.string().min(1, {
        message: "Category is required",
    }),
});

export const CompanionForm = ({ initialData, categories }: CompanionFormProps) => {
    const router = useRouter();

    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: "",
            description: "",
            instructions: "",
            seed: "",
            src: "",
            categoryId: undefined,
        },
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            if (initialData) {
                await axios.patch(`/api/companion/${initialData.id}`, values);
            } else {
                await axios.post("/api/companion", values);
            }

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
        <div className="h-full p-4 space-y-2 max-w-3xl mx-auto">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-10">
                    <div className="space-y-2 w-full">
                        <div>
                            <h3 className=" text-lg font-medium">
                                General Information
                            </h3>

                            <p className="text-sm text-muted-foreground">
                                General information about your Companion
                            </p>
                        </div>

                        <Separator className="bg-primary/10" />
                    </div>

                    <FormField
                        name="src"
                        render={({ field }) => (
                            <FormItem className="flex flex-col items-center justify-normal space-y-4">
                                <FormControl>
                                    <ImageUpload disabled={isLoading} onChange={field.onChange} value={field.value} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            name="name"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem className="col-span-2 md:col-span-1">
                                    <FormLabel>
                                        Name
                                    </FormLabel>

                                    <FormControl>
                                        <Input disabled={isLoading} placeholder="Shree Krishna" {...field} />
                                    </FormControl>

                                    <FormDescription>
                                        This is how your AI Companion will be named.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name="description"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem className="col-span-2 md:col-span-1">
                                    <FormLabel>
                                        Description
                                    </FormLabel>

                                    <FormControl>
                                        <Input disabled={isLoading} placeholder="God of Universe" {...field} />
                                    </FormControl>

                                    <FormDescription>
                                        Short description for your AI Companion.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name="categoryId"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Category
                                    </FormLabel>

                                    <Select disabled={isLoading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="bg-background">
                                                <SelectValue defaultValue={field.value} placeholder="Select a category" />
                                            </SelectTrigger>
                                        </FormControl>

                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category.id} value={category.id}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <FormDescription>
                                        Select a category for your AI.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="space-y-2 w-full">
                        <div>
                            <h3 className="text-lg font-medium">
                                Configuration
                            </h3>

                            <p className="text-sm text-muted-foreground">
                                Detailed instructions for AI behaviour
                            </p>
                        </div>

                        <Separator className="bg-primary/10" />
                    </div>

                    <FormField
                        name="instructions"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem className="col-span-2 md:col-span-1">
                                <FormLabel>
                                    Instructions
                                </FormLabel>

                                <FormControl>
                                    <Textarea disabled={isLoading} placeholder={PREAMBLE} {...field} className="bg-background resize-none" rows={7} />
                                </FormControl>

                                <FormDescription>
                                    Describe in detail your companion&apos;s back story and relevant details.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="seed"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem className="col-span-2 md:col-span-1">
                                <FormLabel>
                                    Examaple Conversation
                                </FormLabel>

                                <FormControl>
                                    <Textarea disabled={isLoading} placeholder={SEED_CHAT} {...field} className="bg-background resize-none" rows={7} />
                                </FormControl>

                                <FormDescription>
                                    Example conversation between you and your companion.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="w-full flex justify-center">
                        <Button size="lg" disabled={isLoading} variant="premium">
                            {initialData ? "Update your companion" : "Create your companion"}
                            <Wand2 className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};