"use client";

import { Protest_Revolution } from "next/font/google";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import {
	Atom,
	Clock10,
	Command,
	Ellipsis,
	EllipsisVertical,
	GraduationCap,
	Hash,
	Inbox,
	Keyboard,
	Newspaper,
	Plus,
	Rows4,
	Search,
	Settings,
	Swords,
	Trash2,
	Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import * as React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { UserButton } from "@clerk/nextjs";

const protestRevolution = Protest_Revolution({ weight: "400", subsets: ["latin"] });

export default function Home() {
	const [date, setDate] = React.useState<Date | undefined>(new Date());
	const [month, setMonth] = React.useState<Date | undefined>(new Date());
	return (
		<>
			<div className="flex h-screen w-full">
				<div className="flex h-screen w-80 flex-col border-r px-4 py-4">
					{/* sidebar */}
					<div className="flex h-screen flex-col">
						<Calendar
							mode="single"
							selected={date}
							onSelect={setDate}
							month={month}
							onMonthChange={setMonth}
							className="mb-2 rounded-md border"
							// showWeekNumber
						/>
						<Button
							onClick={() => {
								setDate(new Date());
								setMonth(new Date());
							}}
						>
							Go to Today
						</Button>
						<Separator className="my-2" />
						<Link className={cn(buttonVariants({ variant: "ghost" }), "justify-start")} href="/app">
							<Inbox className="mr-2 h-4 w-4" />
							Task Inbox
						</Link>
						<Link className={cn(buttonVariants({ variant: "ghost" }), "justify-start")} href="/app">
							<Rows4 className="mr-2 h-4 w-4" />
							All Tasks
						</Link>
						<Link className={cn(buttonVariants({ variant: "ghost" }), "justify-start")} href="/app">
							<Clock10 className="mr-2 h-4 w-4" />
							Overdue (15)
						</Link>
						<Separator className="my-2" />
						<Link className={cn(buttonVariants({ variant: "ghost" }), "justify-start")} href="/app">
							<Users className="mr-2 h-4 w-4" />
							Friends
						</Link>
						<Link className={cn(buttonVariants({ variant: "ghost" }), "justify-start")} href="/app">
							<Swords className="mr-2 h-4 w-4" />
							Daily Challenges
						</Link>
						<Link className={cn(buttonVariants({ variant: "ghost" }), "justify-start")} href="/app">
							<Atom className="mr-2 h-4 w-4" />
							Ai
						</Link>
						<Separator className="my-2" />
						<Accordion type="single" collapsible className="w-full" defaultValue="item-1">
							<AccordionItem value="item-1" className="border-b-0">
								<AccordionTrigger className="hover:no-underline">
									<>
										<div className="flex w-full items-center justify-between pr-2">
											<p>Projects</p>
											<div
												className={cn(
													buttonVariants({ variant: "ghost", size: "icon" }),
													"border-0 group-hover:bg-background"
												)}
												onClick={(e) => {
													e.preventDefault();
												}}
											>
												<Plus className="h-4 w-4" />
											</div>
										</div>
									</>
								</AccordionTrigger>

								<AccordionContent asChild>
									<div className="flex flex-col">
										<div className="group flex items-center justify-between rounded-md pr-2 hover:bg-accent ">
											<Link
												className={cn(
													buttonVariants({ variant: "ghost" }),
													"w-full justify-start hover:bg-transparent"
												)}
												href="/projects/projectId"
											>
												<Hash className="mr-2 h-4 w-4" />
												project 1
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
									</div>
								</AccordionContent>
							</AccordionItem>
						</Accordion>
					</div>
					<div className="flex justify-center text-xl">
						<p className={protestRevolution.className}>naru</p>
						<div className="text-primary">
							<p className={protestRevolution.className}>do</p>
						</div>
					</div>
				</div>
				<div className="w-full">
					<div className="h-13 flex w-full items-center justify-between border-b p-2">
						{/* topbar */}
						<Button variant="ghost">
							<Plus className="mr-2 h-4 w-4" />
							Add Task
						</Button>
						<Button variant="outline" className="">
							<Search className="mr-2 h-4 w-4" />
							Search
							<Command className="ml-6 mr-1 h-3 w-3" />
							<p className="text-xs">K</p>
						</Button>
						<div className="flex items-center gap-2">
							<Popover>
								<PopoverTrigger asChild>
									<Button variant="ghost" size="icon">
										<EllipsisVertical className="h-4 w-4" />
										<span className="sr-only">Settings and Stuff</span>
									</Button>
								</PopoverTrigger>
								<PopoverContent className="flex w-60 flex-col" align="end">
									<div
										className={cn(
											"clerk-user-button-wrapper",
											buttonVariants({ variant: "ghost" })
										)}
									>
										<UserButton showName />
									</div>
									<Separator className="my-2" />
									<Button variant="ghost" className="justify-start">
										<Settings className="mr-2 h-4 w-4" />
										Settings
									</Button>
									<Button variant="ghost" className="justify-start">
										<Keyboard className="mr-2 h-4 w-4" />
										Keyboard Shortcuts
									</Button>
									<Button variant="ghost" className="justify-start">
										<Trash2 className="mr-2 h-4 w-4" />
										Deleted Tasks
									</Button>
									<Button variant="ghost" className="justify-start">
										<Newspaper className="mr-2 h-4 w-4" />
										v1.2 <div className="m-2 h-0.5 w-0.5 rounded-full bg-foreground"></div>{" "}
										What&apos;s new
									</Button>
									<a
										href="/guides"
										target="_blank"
										className={cn(buttonVariants({ variant: "ghost" }), "justify-start")}
									>
										<GraduationCap className="mr-2 h-4 w-4" />
										Guides
									</a>
								</PopoverContent>
							</Popover>
						</div>
					</div>
					<div>{/* main content */}</div>
				</div>
			</div>
		</>
	);
}
