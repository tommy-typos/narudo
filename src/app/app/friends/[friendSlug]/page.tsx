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
import { usePathname } from "next/navigation";

export default function Home() {
	const friendsQuery = useQuery({
		queryKey: ["friends"],
		queryFn: () => getFriends(),
	});

	return (
		<>
			<div className="flex justify-between">
				<Card className="w-60 border-0 pr-2 shadow-none">
					<CardContent className="flex w-full flex-col gap-1 p-0 ">
						{/* <div className="mb-2 ml-4 mt-2 flex items-center text-xs opacity-50">
							<Pin className="mr-2 h-3 w-3 rotate-45" /> Pinned
						</div>
						<Separator className="my-2" /> */}
						{friendsQuery.data?.map((friend) => <FriendLinkComponent key={friend.id} data={friend} />)}
					</CardContent>
				</Card>
				<div className="flex flex-1 flex-col gap-2 border-l pl-2">
					<TaskCardOnTodayView />
					<TaskCardOnTodayView />
					<div className="mt-1 flex items-center text-sm">
						<Plus className="mr-2 h-4 w-4 text-primary" /> Add Task
					</div>
					{/* <Accordion type="single" collapsible>
						<AccordionItem value="completed">
							<AccordionTrigger className="py-2 text-sm hover:no-underline">
								Completed (15)
							</AccordionTrigger>
							<AccordionContent className="flex flex-col gap-2 pt-2">
								<TaskCardOnTodayView />
								<TaskCardOnTodayView />
							</AccordionContent>
						</AccordionItem>
					</Accordion> */}
				</div>
			</div>
		</>
	);
}

type FriendType = {
	id: string;
	userName: string | null;
	fullName: string | null;
	imageUrl: string;
	hasImage: boolean;
};

function FriendLinkComponent({ data }: { data: FriendType }) {
	const pathname = usePathname();
	return (
		<div
			className={cn(
				"group relative flex items-center justify-between rounded-md pr-2 hover:bg-accent",
				pathname.includes(data.id) && "bg-accent"
			)}
		>
			<Link
				className={cn(buttonVariants({ variant: "ghost" }), "w-full justify-start hover:bg-transparent")}
				href={`/app/friends/${data.id}`}
			>
				<div className="mr-2 size-8">
					<img
						src={data.imageUrl}
						className="size-8 rounded-full border-0 object-cover"
						alt={data.fullName || "user image"}
					></img>
				</div>
				{data.fullName || `@ ${data.userName}`}
			</Link>
			<Button
				variant="ghost"
				size="icon"
				className="invisible absolute right-2  h-7 w-7 border-0 group-hover:visible group-hover:bg-background"
				onClick={(e) => {
					e.preventDefault();
				}}
			>
				<Ellipsis className="h-4 w-4" />
			</Button>
		</div>
	);
}

type TaskCardProps = {
	checked?: boolean;
};

function TaskCardOnTodayView({ checked }: TaskCardProps) {
	return (
		<div
			className={cn(
				"flex items-center rounded border p-2 hover:cursor-pointer hover:bg-secondary/30",
				checked && "opacity-70"
			)}
		>
			<Checkbox
				className="ml-2 mr-4 h-6 w-6 data-[state=checked]:border-muted data-[state=checked]:bg-muted data-[state=checked]:text-primary-foreground"
				checked={checked}
			/>
			<div className="w-full">
				<p className={cn("shad-p mb-1", checked && "line-through")}>task name</p>
				<div className="flex w-full items-center justify-between text-xs opacity-70">
					<p>Hi I am a task description and I describe myself as a task</p>
				</div>
			</div>
		</div>
	);
}
