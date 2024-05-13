"use client";

import { Protest_Revolution } from "next/font/google";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import {
	Atom,
	BellRing,
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
import { NarutoBeltSvg } from "@/svgs/svgExporter";
import { useRouter } from "next/navigation";
import { SettingsDialog } from "@/components/client/settingsDialog";
import { Badge } from "@/components/ui/badge";

const protestRevolution = Protest_Revolution({ weight: "400", subsets: ["latin"] });

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	const [date, setDate] = React.useState<Date | undefined>(new Date());
	const [month, setMonth] = React.useState<Date | undefined>(new Date());
	const router = useRouter();

	return (
		<>
			<div className="flex h-screen w-full">
				<div className="flex h-screen w-80 flex-col border-r px-4 py-2">
					{/* sidebar */}
					<div className="flex h-screen flex-col">
						<Calendar
							mode="single"
							selected={date}
							onSelect={setDate}
							month={month}
							onMonthChange={setMonth}
							className="p-2"
							classNames={{
								row: "flex w-full mt-1",
								caption: "flex pt-1 relative items-center justify-between px-4",
								nav: "flex items-center gap-4",
								nav_button_previous: "",
								nav_button_next: "",
							}}
						/>
						<Button
							onClick={() => {
								setDate(new Date());
								setMonth(new Date());
								router.push("/app/today");
							}}
						>
							Go to Today
						</Button>
						<Separator className="my-2" />
						<Link
							className={cn(buttonVariants({ variant: "ghost" }), "justify-start")}
							href="/app/task-inbox"
						>
							<Inbox className="mr-2 h-4 w-4" />
							Task Inbox
						</Link>
						<Link className={cn(buttonVariants({ variant: "ghost" }), "justify-start")} href="/app">
							<Rows4 className="mr-2 h-4 w-4" />
							All Tasks
						</Link>
						<Link className={cn(buttonVariants({ variant: "ghost" }), "justify-start")} href="/app">
							<Clock10 className="mr-2 h-4 w-4 stroke-destructive" />
							<div className="flex w-full items-center justify-between">
								<p className="text-destructive">Overdue</p>
								<Badge variant="destructive">15</Badge>
							</div>
						</Link>
						<Separator className="my-2" />
						<Link className={cn(buttonVariants({ variant: "ghost" }), "justify-start")} href="/app/friends">
							<Users className="mr-2 h-4 w-4" />
							Friends
						</Link>
						<Link
							className={cn(buttonVariants({ variant: "ghost" }), "justify-start")}
							href="/app/challenges"
						>
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
								<AccordionTrigger className="py-2 hover:no-underline">
									<>
										<div className="flex w-full items-center justify-between pr-2">
											<p>Projects</p>
											<div
												className={cn(
													buttonVariants({ variant: "ghost", size: "icon" }),
													"h-6 w-6 border-0 group-hover:bg-background"
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
						<Button variant="outline" className="w-52 justify-between">
							<div className="flex items-center">
								<Search className="mr-2 h-4 w-4" />
								Search
							</div>
							<div className="ml-6 flex w-fit items-center rounded-md bg-muted p-0.5 px-2">
								<Command className=" mr-1 h-3 w-3 opacity-50" />
								<p className="text-xs opacity-50">K</p>
							</div>
						</Button>
						<div className="flex items-center ">
							<Button variant="ghost" className="text-destructive ">
								<BellRing className={cn("mr-2 h-4 w-4 stroke-destructive")} />
								<Badge variant="destructive" className="hover:bg-destructive">
									14
								</Badge>
							</Button>
							<Button variant="ghost" className="text-primary hover:text-primary">
								<NarutoBeltSvg className={cn("*:fill-primary", "mr-2 h-4 w-4")} />
								23
							</Button>
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
									{/* <Button variant="ghost" className="justify-start">
										<Settings className="mr-2 h-4 w-4" />
										Settings
									</Button> */}
									<SettingsDialog />
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
					{children}
				</div>
			</div>
		</>
	);
}
