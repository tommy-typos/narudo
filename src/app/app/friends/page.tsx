"use client";

import { Ellipsis, Pin, User, Users } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

type FriendsLinkProps = {
	link: string;
	text: string;
	active?: boolean;
};

function FriendsLink({ link, text, active }: FriendsLinkProps) {
	return (
		<Link href={`/app/friends/${link}`} className={cn(!active && "opacity-50 hover:opacity-80")}>
			{text}
		</Link>
	);
}

export default function Home() {
	return (
		<>
			<div className="mb-6 flex items-center justify-between">
				<div className="flex flex-col">
					<div className="flex items-center">
						<Users className="mr-2" />
						<h3 className="shad-h3">Friends</h3>
					</div>
					<div className="flex items-center gap-12 py-4">
						<FriendsLink link="all" text="All" active />
						<FriendsLink link="pending" text="Pending" />
						<FriendsLink link="incoming-requests" text="Incoming Requests" />
						<Button variant="secondary">
							<Plus className="mr-2 h-4 w-4" /> Add Friend
						</Button>
					</div>
				</div>
			</div>
			<div className="flex justify-between gap-4">
				<Card className="w-60">
					<CardContent className="flex w-full flex-col p-2">
						<div className="mb-2 ml-4 mt-2 flex items-center text-xs opacity-50">
							<Pin className="mr-2 h-3 w-3 rotate-45" /> Pinned
						</div>

						<LabelComponent labelName="Asatillo" />
						<LabelComponent labelName="Rustam" />
						<Separator className="my-2" />
						<LabelComponent labelName="Javlonbek" />
						<LabelComponent labelName="Bakhtiyar" />
					</CardContent>
				</Card>
				<div className="flex flex-1 flex-col gap-2">
					<TaskCardOnTodayView />
					<TaskCardOnTodayView />
					<div className="mt-1 flex items-center text-sm">
						<Plus className="mr-2 h-4 w-4 text-primary" /> Add Task
					</div>
					<Accordion type="single" collapsible>
						<AccordionItem value="completed">
							<AccordionTrigger className="py-2 text-sm hover:no-underline">
								Completed (15)
							</AccordionTrigger>
							<AccordionContent className="flex flex-col gap-2 pt-2">
								<TaskCardOnTodayView />
								<TaskCardOnTodayView />
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				</div>
			</div>
		</>
	);
}

type LabelProps = {
	labelName: string;
	active?: boolean;
};

function LabelComponent({ labelName }: LabelProps) {
	return (
		<div className="group flex items-center justify-between rounded-md pr-2 hover:bg-accent">
			<Link
				className={cn(buttonVariants({ variant: "ghost" }), "w-full justify-start hover:bg-transparent")}
				href="/projects/projectId"
			>
				<User className="mr-2 h-4 w-4" />
				{labelName}
			</Link>
			<Button
				variant="ghost"
				size="icon"
				className="invisible h-7 w-7  border-0 group-hover:visible group-hover:bg-background"
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
