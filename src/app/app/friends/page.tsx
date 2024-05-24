"use client";

import { Ellipsis, LoaderCircle, Pin, User, Users } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getFriends } from "@/app/_serverActions/queries";
import { useRouter } from "next/navigation";

export default function Home() {
	const friendsQuery = useQuery({
		queryKey: ["friends"],
		queryFn: () => getFriends(),
	});

	const router = useRouter();

	React.useEffect(() => {
		if (friendsQuery.data?.length! > 0) {
			router.push(`/app/friends/${friendsQuery.data?.[0].id}`);
		}
	}, [friendsQuery.data]);

	return (
		<>
			{friendsQuery.data && friendsQuery.data.length === 0 && (
				<div className="py-4">
					<p className="text-center">Your friend list is current empty.</p>
					<p className="text-center">Add your friends now to start collaborating 🙂</p>
				</div>
			)}
		</>
	);
}
