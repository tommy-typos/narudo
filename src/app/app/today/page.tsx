"use client";
import { Protest_Revolution } from "next/font/google";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import {
	Atom,
	Clock10,
	Ellipsis,
	EllipsisVertical,
	GraduationCap,
	Hash,
	Inbox,
	Keyboard,
	Newspaper,
	Plus,
	Rows4,
	Settings,
	Swords,
	Trash2,
	Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const protestRevolution = Protest_Revolution({ weight: "400", subsets: ["latin"] });

import * as React from "react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

export default function Home() {
	return (
		<>
			<div className="h-screen w-screen">
				<div className="flex h-screen w-80 flex-col border-r p-4 px-5">
					{/* sidebar */}
					<div className="flex h-screen flex-col">
						<div className="flex items-center justify-between">
							{/* clerk shit here... */}
							<div className="p-1">delete</div>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="ghost" size="icon">
										<EllipsisVertical className="h-4 w-4" />
										<span className="sr-only">Settings and Stuff</span>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="start">
									<DropdownMenuItem>
										<Settings className="mr-2 h-4 w-4" />
										Settings
									</DropdownMenuItem>
									<DropdownMenuItem>
										<Keyboard className="mr-2 h-4 w-4" />
										Keyboard Shortcuts
									</DropdownMenuItem>
									<DropdownMenuItem>
										<Trash2 className="mr-2 h-4 w-4" />
										Deleted Tasks
									</DropdownMenuItem>
									<DropdownMenuItem>
										<Newspaper className="mr-2 h-4 w-4" />
										v1.2 <div className="m-2 h-0.5 w-0.5 rounded-full bg-foreground"></div>{" "}
										What&apos;s new
									</DropdownMenuItem>
									<DropdownMenuItem asChild>
										<a href="/guides" target="_blank">
											<GraduationCap className="mr-2 h-4 w-4" />
											Guides
										</a>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
						{/* react calendar shit here .... */}
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
						<Separator className="my-4" />
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
						<Separator className="my-4" />
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
				<div>
					<div>{/* topbar */}</div>
					<div>{/* main content */}</div>
				</div>
			</div>
		</>
	);
}
