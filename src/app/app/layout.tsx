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
import { NarutoBeltSvg } from "@/lib/svgs/svgExporter";
import { redirect, useParams, usePathname, useRouter } from "next/navigation";
import { SettingsDialog } from "@/components/client/settingsDialog";
import { Badge } from "@/components/ui/badge";
import { AddTask } from "@/components/client/addTask";
import { Welcomer } from "@/components/client/welcomer";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getFriends, getNotifications, getProjects } from "../_serverActions/queries";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createNewProject } from "../_serverActions/addNewProjectSubCat";
import { Skeleton } from "@/components/ui/skeleton";

const protestRevolution = Protest_Revolution({ weight: "400", subsets: ["latin"] });

export default function Layout({ children }: { children: React.ReactNode }) {
	const pathName = usePathname();
	const params = useParams();
	const [date, setDate] = React.useState<Date | undefined>(undefined);
	const [month, setMonth] = React.useState<Date | undefined>(new Date());
	const router = useRouter();

	const notifQuery = useQuery({
		queryKey: ["notifications"],
		queryFn: () => getNotifications(),
		refetchInterval: 5000,
	});

	const friendsQuery = useQuery({
		queryKey: ["friends"],
		queryFn: () => getFriends(),
	});

	const projectsQuery = useQuery({
		queryKey: ["projects"],
		queryFn: () => getProjects(),
	});

	React.useEffect(() => {
		if (!(pathName.includes("/app/today") || pathName.includes("/app/date/"))) {
			setDate(undefined);
			setMonth(undefined);
		} else {
			if (pathName.includes("/app/today")) {
				setDate(new Date());
				setMonth(new Date());
			} else {
				const dateStringInRoute = params.dateSlug as string;
				const dateCreatedFromRoute = new Date(dateStringInRoute);
				if (!isNaN(dateCreatedFromRoute.getTime())) {
					setDate(new Date(dateCreatedFromRoute));
					setMonth(new Date(dateCreatedFromRoute));
				} else {
					router.push("/app/today");
				}
			}
		}
	}, [pathName]);

	const queryClient = useQueryClient();

	React.useEffect(() => {
		// TODO ::: delete this temporary solution for 'queries keep hanging on loading state when redirected from '/sign-in' page.
		setTimeout(() => {
			queryClient.cancelQueries();
			queryClient.refetchQueries();
		}, 1);
	}, []);

	const unReadNotifCount: number = notifQuery.data?.filter((notif) => notif.isRead !== true).length || 0;

	return (
		<>
			<Welcomer />
			<div className="flex min-h-full w-full">
				<div className="flex min-h-full w-80 flex-col border-r bg-muted/40 px-4 py-2">
					<div className="flex flex-col justify-between">
						<Calendar
							mode="single"
							selected={date}
							onSelect={(calendarSelectedDate) => {
								if (calendarSelectedDate) {
									setDate(calendarSelectedDate);
									router.push(
										`/app/date/${calendarSelectedDate?.getFullYear()}-${calendarSelectedDate?.getMonth()! + 1}-${calendarSelectedDate?.getDate()}`
									);
								}
							}}
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
						<RouteLink
							path={"/app/task-inbox"}
							highlightPath={
								projectsQuery.data
									? `/app/projects/${projectsQuery.data[0].id}/$${projectsQuery.data[0].subCategories[0].id}`
									: "/app/task-inbox"
							}
						>
							<Inbox className="mr-2 h-4 w-4" />
							Task Inbox
						</RouteLink>
						{/* <RouteLink path="/app/all-tasks">
							<Rows4 className="mr-2 h-4 w-4" />
							All Tasks
						</RouteLink> */}
						<RouteLink path="/app/overdue" highlightPath="/app/overdue">
							<Clock10 className="mr-2 h-4 w-4 stroke-destructive" />
							<div className="flex w-full items-center justify-between">
								<p className="text-destructive">Overdue</p>
								<Badge variant="destructive">15</Badge>
							</div>
						</RouteLink>

						<Separator className="my-2" />

						<RouteLink path="/app/friends" highlightPath="/app/friends">
							<Users className="mr-2 h-4 w-4" />
							Friends
						</RouteLink>
						<RouteLink path="/app/challenges" highlightPath="/app/challenges">
							<Swords className="mr-2 h-4 w-4" />
							Daily Challenges
						</RouteLink>
						{/* <RouteLink path="/app/ai">
							<Atom className="mr-2 h-4 w-4" />
							Ai
						</RouteLink> */}

						<Separator className="my-2" />

						<ProjectsList />
					</div>
					<div className="mt-auto flex justify-center text-xl">
						<p className={protestRevolution.className}>naru</p>
						<div className="text-narudorange">
							<p className={protestRevolution.className}>do</p>
						</div>
					</div>
				</div>
				<div className="w-full">
					<div className="h-13 flex w-full items-center justify-between border-b bg-muted/40 p-2">
						<AddTask />
						{/* <Button variant="outline" className="w-52 justify-between">
							<div className="flex items-center">
								<Search className="mr-2 h-4 w-4" />
								Search
							</div>
							<div className="ml-6 flex w-fit items-center rounded-md bg-muted p-0.5 px-2">
								<Command className=" mr-1 h-3 w-3 opacity-50" />
								<p className="text-xs opacity-50">K</p>
							</div>
						</Button> */}
						<div className="flex items-center ">
							<Link
								className={cn(
									buttonVariants({ variant: "ghost" }),
									unReadNotifCount > 0 && "text-destructive"
								)}
								href="/app/notifications"
							>
								<BellRing
									className={cn("h-4 w-4", unReadNotifCount > 0 && "mr-2 stroke-destructive")}
								/>
								{notifQuery.data && unReadNotifCount > 0 && (
									<Badge variant="destructive" className="hover:bg-destructive">
										{notifQuery.data && unReadNotifCount}
									</Badge>
								)}
							</Link>
							{/* <Button variant="ghost" className="text-narudorange hover:text-narudorange">
								<NarutoBeltSvg className={cn("*:fill-narudorange", "mr-2 h-4 w-4")} />
								23
							</Button> */}
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
									<SettingsDialog />
									{/* <Button variant="ghost" className="justify-start">
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
									</a> */}
								</PopoverContent>
							</Popover>
						</div>
					</div>
					<div className="p-5">{children}</div>
				</div>
			</div>
		</>
	);
}

/*
TODO :::
Any click on the dialog that is defined inside of accordion, will trigger accordion item to collapse/expance. Fix this.
*/

function ProjectsList() {
	const projectsQuery = useQuery({
		queryKey: ["projects"],
		queryFn: () => getProjects(),
	});
	const [value, setValue] = React.useState("");
	const [open, setOpen] = React.useState(false);

	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: (value: string) => createNewProject(value),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["projects"] });
		},
	});
	return (
		<Accordion type="single" collapsible className="w-full" defaultValue="item-1">
			<AccordionItem value="item-1" className="border-b-0">
				<AccordionTrigger className="py-2 hover:no-underline">
					<>
						<div className="flex w-full items-center justify-between pr-2">
							<p>Projects</p>
							<Dialog open={open} onOpenChange={setOpen}>
								<DialogTrigger asChild>
									{/* <Button variant="outline">Edit Profile</Button> */}
									<div
										className={cn(
											buttonVariants({ variant: "ghost", size: "icon" }),
											"h-6 w-6 border-0 group-hover:bg-background"
										)}
										onClick={(e) => {
											e.preventDefault();
											setOpen(true);
										}}
									>
										<Plus className="h-4 w-4" />
									</div>
								</DialogTrigger>
								<DialogContent className="sm:max-w-[425px]">
									<DialogHeader>
										<DialogTitle>Create a new project</DialogTitle>
										<DialogDescription>Please enter name for the new project.</DialogDescription>
									</DialogHeader>
									<div className="grid gap-4 py-4">
										<div className="grid grid-cols-4 items-center gap-4">
											<Label htmlFor="name" className="text-right">
												Name
											</Label>
											<Input
												id="name"
												defaultValue="Pedro Duarte"
												className="col-span-3"
												value={value}
												onChange={(e) => setValue(e.target.value)}
											/>
										</div>
									</div>
									<DialogFooter>
										<Button
											type="submit"
											disabled={value === ""}
											onClick={() => {
												mutation.mutate(value);
												setOpen(false);
											}}
										>
											Create project
										</Button>
									</DialogFooter>
								</DialogContent>
							</Dialog>
						</div>
					</>
				</AccordionTrigger>

				<AccordionContent asChild>
					<div className="flex flex-col">
						{projectsQuery.data && projectsQuery.data.length > 1
							? projectsQuery.data.slice(1).map((project) => (
									<ProjectRouteLink
										key={project.id}
										projectId={project.id}
										defaultSubCatId={project.subCategories[0].id}
									>
										{project.name}
									</ProjectRouteLink>
								))
							: projectsQuery.data &&
								projectsQuery.data.length === 1 && (
									<p className="text-center text-muted-foreground">No project found</p>
								)}

						{projectsQuery.isLoading && (
							<div key="flkdsajlfdjslfjsdlafjsafldsjlfjs">
								<div className="my-2 ml-4 flex items-center space-x-4">
									<Skeleton className="h-6 w-6 rounded-full" />
									<div className="space-y-2">
										<Skeleton className="h-4 w-32" />
									</div>
								</div>
								<div className="my-2 ml-4 flex items-center space-x-4">
									<Skeleton className="h-6 w-6 rounded-full" />
									<div className="space-y-2">
										<Skeleton className="h-4 w-20" />
									</div>
								</div>
							</div>
						)}
					</div>
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
}

function RouteLink({
	path,
	children,
	highlightPath,
}: {
	path: string;
	children: React.ReactNode;
	highlightPath: string;
}) {
	const pathName = usePathname();

	function isPath(path: string) {
		return pathName.includes(path);
	}

	return (
		<Link
			className={cn(buttonVariants({ variant: "ghost" }), "justify-start", isPath(highlightPath) && "bg-accent")}
			href={path}
		>
			{children}
		</Link>
	);
}

function ProjectRouteLink({
	projectId,
	children,
	defaultSubCatId,
}: {
	projectId: string;
	children: string;
	defaultSubCatId: string;
}) {
	const pathName = usePathname();

	function isPath(path: string) {
		return pathName.includes(path);
	}

	return (
		<div
			className={cn(
				"group flex items-center justify-between rounded-md pr-2 hover:bg-accent ",
				isPath(`/app/projects/${projectId}`) && "bg-accent"
			)}
		>
			<Link
				className={cn(buttonVariants({ variant: "ghost" }), "w-full justify-start hover:bg-transparent")}
				href={`/app/projects/${projectId}/${defaultSubCatId}`}
			>
				<Hash className="mr-2 h-4 w-4" />
				{children}
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
