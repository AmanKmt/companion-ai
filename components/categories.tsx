"use client"

import qs from "query-string";
import { Category } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";

interface CategoriesProps {
    data: Category[];
};

export const Categories = ({ data }: CategoriesProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const categoryId = searchParams.get("categoryId");

    const onClick = (id: string | undefined) => {
        const query = { categoryId: id };

        const url = qs.stringifyUrl({
            url: window.location.href,
            query,
        }, { skipEmptyString: true, skipNull: true });

        router.push(url);
    };

    return (
        <div className="w-full overflow-x-auto space-x-2 flex p-1">
            <button onClick={() => onClick(undefined)} className={cn(`flex items-center text-center text-xs md:text-sm px-4 md:px-5 py-1.5 md:py-3 rounded-md bg-primary/10 hover:opacity-75 transition-all`, !categoryId ? "bg-primary/25" : "bg-primary/10")}>
                Newest
            </button>

            {data.map((item) => (
                <button key={item.id} onClick={() => onClick(item.id)} className={cn(`flex items-center text-center text-xs md:text-sm px-4 md:px-5 py-1.5 md:py-3 rounded-md bg-primary/10 hover:opacity-75 transition-all`, item.id === categoryId ? "bg-primary/25" : "bg-primary/10")}>
                    {item.name}
                </button>
            ))}
        </div>
    );
};