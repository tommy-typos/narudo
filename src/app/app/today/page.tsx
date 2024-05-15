"use client";

import {
	CalendarDays,
	CheckCheck,
	CircleOff,
	Group,
	Inbox,
	SlidersHorizontal,
	ToggleLeft,
	ToggleRight,
	Watch,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function Home() {
	return (
		<>
			<div className="mb-4 flex items-center justify-between">
				<div className="flex items-center">
					<CalendarDays className="mr-2" />

					<h3 className="shad-h3">Today</h3>
					<div className="mx-3 h-1 w-1 rounded-full bg-foreground"></div>
					<h3 className="shad-h3">May 12, 2024</h3>
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
						<ViewOption>
							<Group className="mr-2 h-4 w-4" />
							Group by project
						</ViewOption>
						<ViewOption className="ml-6">
							<CircleOff className="mr-2 h-4 w-4" />
							Hide empty projects
						</ViewOption>
					</PopoverContent>
				</Popover>
			</div>
			<div className="flex justify-between gap-4">
				<div className="flex-1">
					<h3 className="shad-h3 mb-4">Tasks</h3>
					<div className="flex flex-col gap-2">
						<TaskCardOnTodayView checked={true} />
						<TaskCardOnTodayView />
						<div className="flex items-center text-sm">
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
							<AccordionItem value="challenges">
								<AccordionTrigger className="py-2 text-sm hover:no-underline">
									Challenges (15)
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
				<div className="flex-1">
					<h3 className="shad-h3 mb-4">Notes</h3>
					<div className="min-h-80 w-full border"></div>
				</div>
			</div>
		</>
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

type TaskCardProps = {
	checked?: boolean;
};

function TaskCardOnTodayView({ checked: checkedProp }: TaskCardProps) {
	const [checked, setChecked] = React.useState<boolean | undefined>(checkedProp);
	return (
		<div className={cn("flex items-center rounded border p-2 hover:cursor-pointer")}>
			<Checkbox
				className="ml-2 mr-4 h-6 w-6"
				checked={checked}
				onCheckedChange={() => setChecked((prev) => !prev)}
			/>
			<div className="w-full">
				<p className={cn("shad-p mb-1")}>task name</p>
				<div className="flex w-full items-center justify-between text-xs">
					<div className="flex items-center text-primary">
						<Watch className="h-4 w-4" /> 17:00
					</div>
					<div className="flex items-center text-muted-foreground">
						<Inbox className="h-4 w-4" /> Task Inbox
					</div>
				</div>
			</div>
		</div>
	);
}
