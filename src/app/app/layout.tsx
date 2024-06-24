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
	PanelRightClose,
	PanelRightOpen,
	Plus,
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
import { redirect, useParams, usePathname, useRouter } from "next/navigation";
import { SettingsDialog } from "@/components/client/settingsDialog";
import { Badge } from "@/components/ui/badge";
import { AddTask } from "@/components/client/addTask";
import { Welcomer } from "@/components/client/welcomer";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	getFriends,
	getNotificationCount,
	getNotifications,
	getOverdueTasksCount,
	getProjects,
} from "../_serverActions/queries";
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
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { stringifyDate } from "@/lib/dateUtils";
import { useProjectsQuery } from "@/lib/queries";

const protestRevolution = Protest_Revolution({ weight: "400", subsets: ["latin"] });

function formatDateTime(dateObj: Date) {
	const year = dateObj.getFullYear();
	const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // Month is zero-based, so add 1
	const day = String(dateObj.getDate()).padStart(2, "0");

	const currdate = `${year}-${month}-${day}`;

	const hours = String(dateObj.getHours()).padStart(2, "0");
	const minutes = String(dateObj.getMinutes()).padStart(2, "0");
	const seconds = String(dateObj.getSeconds()).padStart(2, "0");

	const currtime = `${hours}:${minutes}:${seconds}`;

	return { currdate, currtime };
}

export default function Layout({ children }: { children: React.ReactNode }) {
	const pathName = usePathname();
	const params = useParams();
	const [date, setDate] = React.useState<Date | undefined>(undefined);
	const [month, setMonth] = React.useState<Date | undefined>(new Date());
	const router = useRouter();

	const notifQuery = useQuery({
		queryKey: ["notificationCount"],
		queryFn: () => getNotificationCount(),
		refetchInterval: 5000,
	});
	const projectsQuery = useProjectsQuery();

	const overdueCount = useQuery({
		queryKey: ["overdueCount"],
		queryFn: () => getOverdueTasksCount(formatDateTime(new Date())),
		refetchInterval: 60 * 1000,
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
					router.push(`/app/date/${stringifyDate(new Date())}`);
				}
			}
		}
	}, [pathName]);

	const unReadNotifCount: number = notifQuery.data || 0;
	const [openTab, setOpenTab] = React.useState<"tips" | "theme" | "customization">("theme");
	const [settingsOpen, setSettingsOpen] = React.useState<boolean>(false);

	const [customization, setCustomization] = React.useState<{ friends: boolean; challenges: boolean }>({
		friends: true,
		challenges: true,
	});

	React.useEffect(() => {
		setCustomization(() => {
			return (
				JSON.parse(window.localStorage.getItem("uiCustomization")!) || {
					friends: true,
					challenges: true,
				}
			);
		});
	}, []);

	const queryClient = useQueryClient();

	React.useEffect(() => {
		// TODO::: DELETE THIS
		const focusChangeHandler = () => {
			queryClient.invalidateQueries({ queryKey: ["projects"] });
			queryClient.invalidateQueries({ queryKey: ["friends"] });
			queryClient.invalidateQueries({ queryKey: ["notificationCount"] });
			queryClient.invalidateQueries({ queryKey: ["overdueCount"] });
			queryClient.invalidateQueries({ queryKey: [pathName] });
			queryClient.invalidateQueries({ queryKey: [`${pathName}+++notes`] });
		};

		window.addEventListener("focus", focusChangeHandler);

		return () => {
			window.removeEventListener("focus", focusChangeHandler);
		};
	}, []);

	const [sidebar, setSidebar] = React.useState(true);

	return (
		<>
			<Welcomer />
			<div className="flex min-h-full w-full">
				<div
					className={cn("flex min-h-full w-80 flex-col border-r bg-muted/50 px-4 py-2", !sidebar && "hidden")}
				>
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
							className="p-0"
							classNames={{
								row: "flex w-full mt-1",
								caption: "flex pt-1 relative items-center justify-between px-4",
								nav: "flex items-center gap-4",
								nav_button_previous: "",
								nav_button_next: "",
								month: "space-y-3",
							}}
						/>
						<Button
							onClick={() => {
								setDate(new Date());
								setMonth(new Date());
								router.push(`/app/date/${stringifyDate(new Date())}`);
							}}
							size="sm"
							className="mb-2 mt-2"
						>
							Go to Today
						</Button>

						<RouteLink
							path={"/app/task-inbox"}
							highlightPath={
								projectsQuery.data
									? `/app/projects/${projectsQuery.data[0].id}/${projectsQuery.data[0].subCategories[0].id}`
									: "/app/task-inbox"
							}
						>
							<Inbox className="mr-2 h-4 w-4" />
							Task Inbox
						</RouteLink>
						{overdueCount.data && overdueCount.data >= 1 ? (
							<RouteLink path="/app/overdue" highlightPath="/app/overdue">
								<Clock10 className="mr-2 h-4 w-4 stroke-destructive" />
								<div className="flex w-full items-center justify-between">
									<p className="text-destructive">Overdue</p>
									<Badge variant="destructive">{overdueCount.data}</Badge>
								</div>
							</RouteLink>
						) : (
							<></>
						)}

						{customization.friends && (
							<RouteLink path="/app/friends" highlightPath="/app/friends">
								<Users className="mr-2 h-4 w-4" />
								Friends
							</RouteLink>
						)}
						{customization.challenges && (
							<RouteLink path="/app/challenges" highlightPath="/app/challenges">
								<Swords className="mr-2 h-4 w-4" />
								Daily Challenges
							</RouteLink>
						)}
						{(customization.friends || customization.challenges) && <Separator className="my-2" />}

						<ProjectsList />
					</div>
					<div className="mt-auto flex justify-center text-xl">
						<p className={protestRevolution.className}>naru</p>
						<div className="text-narudorange">
							<p className={protestRevolution.className}>do</p>
						</div>
					</div>
				</div>
				<div className="flex w-full flex-col">
					<div className="h-13 flex w-full items-center justify-between border-b bg-muted/50 p-2">
						<div className="flex items-center">
							<Button variant="ghost" size="sm" onClick={() => setSidebar((prev) => !prev)}>
								{sidebar ? (
									<PanelRightOpen className="size-5 text-muted-foreground" />
								) : (
									<PanelRightClose className="size-5 text-muted-foreground" />
								)}
							</Button>
							<AddTask />
						</div>
						<div className="flex items-center ">
							<Link
								className={cn(
									buttonVariants({ variant: "ghost", size: "sm" }),
									unReadNotifCount > 0 && "text-destructive"
								)}
								href="/app/notifications"
							>
								<BellRing
									className={cn("h-4 w-4", unReadNotifCount > 0 && "mr-2 stroke-destructive")}
								/>
								{notifQuery.data && unReadNotifCount > 0 ? (
									<Badge variant="destructive" className="hover:bg-destructive">
										{notifQuery.data && unReadNotifCount}
									</Badge>
								) : (
									<></>
								)}
							</Link>
							{/* <Button variant="ghost" className="text-narudorange hover:text-narudorange">
								<NarutoBeltSvg className={cn("*:fill-narudorange", "mr-2 h-4 w-4")} />
								23
							</Button> */}
							<Popover>
								<PopoverTrigger asChild>
									<Button variant="ghost" size="sm">
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
									<SettingsDialog
										customization={customization}
										setCustomization={setCustomization}
										openTab={openTab}
										setOpenTab={setOpenTab}
										setSettingsOpen={setSettingsOpen}
										settingsOpen={settingsOpen}
									/>
									<Button
										variant="ghost"
										className="justify-start"
										onClick={() => {
											setOpenTab("tips");
											setSettingsOpen(true);
										}}
									>
										<GraduationCap className="mr-2 h-4 w-4" />
										Tips
									</Button>
								</PopoverContent>
							</Popover>
						</div>
					</div>
					<div className="flex flex-1 flex-col p-5">{children}</div>
				</div>
			</div>
		</>
	);
}

/*
TODO :::
Any click on the dialog that is defined inside of accordion, will trigger accordion item to collapse/expance. Fix this.
*/

const MyAccordionTrigger = React.forwardRef<
	React.ElementRef<typeof AccordionPrimitive.Trigger>,
	React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
	<AccordionPrimitive.Header className="flex">
		<AccordionPrimitive.Trigger
			ref={ref}
			className={cn(
				"flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
				className
			)}
			{...props}
		>
			{children}
		</AccordionPrimitive.Trigger>
	</AccordionPrimitive.Header>
));
MyAccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

function ProjectsList() {
	const projectsQuery = useProjectsQuery();
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
		<Accordion type="single" collapsible className="w-full" value="item-1">
			<AccordionItem value="item-1" className="border-b-0">
				<MyAccordionTrigger className="py-2 hover:no-underline">
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
				</MyAccordionTrigger>

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
			className={cn(
				buttonVariants({ variant: "ghost", size: "sm" }),
				"justify-start",
				isPath(highlightPath) && "bg-accent",
				"font-normal"
			)}
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
				className={cn(
					buttonVariants({ variant: "ghost", size: "sm" }),
					"w-full justify-start font-normal hover:bg-transparent"
				)}
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
