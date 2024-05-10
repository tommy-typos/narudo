"use client";

import {
	ArrowDownNarrowWide,
	ArrowUpNarrowWide,
	CheckCheck,
	Ellipsis,
	Inbox,
	Slash,
	SlidersHorizontal,
	Tag,
	ToggleLeft,
	ToggleRight,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function Home() {
	return (
		<div className="p-5">
			<div className="mb-6 flex items-center justify-between">
				<div className="flex flex-col">
					<div className="flex items-center">
						<Inbox className="mr-2" />
						<h3 className="shad-h3">Task Inbox</h3>
					</div>
					<p className="ml-8 mt-0.5 text-xs opacity-50">Tasks with no date or a project</p>
				</div>

				<Popover>
					<PopoverTrigger asChild>
						<Button variant="ghost">
							<SlidersHorizontal className="mr-2 h-4 w-4" /> View
							<span className="sr-only">Settings and Stuff</span>
						</Button>
					</PopoverTrigger>
					<PopoverContent className="flex w-72 flex-col" align="end">
						<ViewOption>
							<CheckCheck className="mr-2 h-4 w-4" /> Show Completed
						</ViewOption>
						<ViewSortOption />
					</PopoverContent>
				</Popover>
			</div>
			<div className="flex justify-between gap-4">
				<Card className="w-60">
					<CardContent className="flex w-full flex-col p-2">
						<Button variant="ghost" className="justify-start pl-10">
							All
						</Button>
						<Button variant="ghost" className="justify-start">
							<div className="relative mr-6 flex items-center">
								<Tag className="absolute mr-2 h-4 w-4 rotate-90" />
								<Slash className="absolute mr-2 h-4 w-4 rotate-90" />
							</div>
							No Label
						</Button>

						<Separator className="my-2" />

						<LabelComponent labelName="label one" />
						<LabelComponent labelName="the second tag" />
						<LabelComponent labelName="another label" />
						<Button variant="ghost" className="mt-2 justify-start">
							<Plus className="mr-2 h-4 w-4 rotate-90" />
							Add Label
						</Button>
					</CardContent>
				</Card>
				<div className="flex flex-1 flex-col gap-2">
					<TaskCardOnTodayView />
					<TaskCardOnTodayView />
					<div className="mt-1 flex items-center text-sm">
						<Plus className="mr-2 h-4 w-4 text-primary" /> Add Task
					</div>
					<Accordion type="single" collapsible>
						<AccordionItem value="delegated-to-friends">
							<AccordionTrigger className="py-2 text-sm hover:no-underline">
								Delegated to friends (15)
							</AccordionTrigger>
							<AccordionContent className="flex flex-col gap-2 pt-2">
								<TaskCardOnTodayView />
								<TaskCardOnTodayView />
							</AccordionContent>
						</AccordionItem>
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
		</div>
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
				<Tag className="mr-2 h-4 w-4 rotate-90" />
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

type ViewOptionProps = {
	className?: string;
	children: React.ReactNode;
};

function ViewOption({ children, className }: ViewOptionProps) {
	const [active, setActive] = React.useState<boolean>(false);
	return (
		<Button
			variant="ghost"
			className={cn("items-center justify-between", !active && "opacity-50", className)}
			onClick={() => setActive((prev) => !prev)}
		>
			<div className="flex items-center">{children}</div>
			{!active ? <ToggleLeft className="h-4 w-4" /> : <ToggleRight className="h-4 w-4" />}
		</Button>
	);
}
function ViewSortOption() {
	const [ascending, setAscending] = React.useState<boolean>(false);
	// ascending dates => old to new
	return (
		<Button
			variant="ghost"
			className={cn("items-center justify-between opacity-50")}
			onClick={() => setAscending((prev) => !prev)}
		>
			<div className="flex items-center">
				{ascending ? (
					<ArrowDownNarrowWide className="mr-2 h-4 w-4" />
				) : (
					<ArrowUpNarrowWide className="mr-2 h-4 w-4" />
				)}
				Sort by &quot;Date Added&quot;
			</div>
			<p>{ascending ? "ASC" : "DESC"}</p>
		</Button>
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
