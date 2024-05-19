"use client";
import { useParams, usePathname } from "next/navigation";
import { useEffect } from "react";
import {
	CalendarDays,
	CheckCheck,
	CircleOff,
	Group,
	Inbox,
	SlidersHorizontal,
	ToggleLeft,
	ToggleRight,
	Users,
	Watch,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TaskType, getProjects, getTasksByDate } from "@/app/_serverActions/queries";
import { isToday, stringifyDate } from "@/components/client/addTask";
import { Skeleton } from "@/components/ui/skeleton";
import { toggleTask } from "@/app/_serverActions/toggleTaskNotification";

export default function Home() {
	const params = useParams<{ dateSlug: string }>();

	const dateCreatedFromRoute = new Date(params.dateSlug);
	if (isNaN(dateCreatedFromRoute.getTime())) {
		return;
	} else {
		return <DateWrapper />;
	}
}

function DateWrapper() {
	const params = useParams<{ dateSlug: string }>();
	const dateFromRoute = new Date(params.dateSlug);

	const pathName = usePathname();

	const { data: projectsList } = useQuery({
		queryKey: ["projects"],
		queryFn: () => getProjects(),
	});

	const taskQuery = useQuery({
		queryKey: [pathName],
		queryFn: () => getTasksByDate(pathName.split("/").at(-1) as string),
	});
	return (
		<>
			<div className="mb-4 flex items-center justify-between">
				<div className={cn("flex items-center", isToday(dateFromRoute) && "text-primary")}>
					<CalendarDays className="mr-2" />
					{isToday(dateFromRoute) && (
						<>
							<h3 className="shad-h3">Today</h3>
							<div
								className={cn(
									"mx-3 h-1 w-1 rounded-full bg-foreground",
									isToday(dateFromRoute) && "bg-primary"
								)}
							></div>
						</>
					)}
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
						{taskQuery.isLoading && (
							<>
								<div className={cn("flex items-center rounded p-2 hover:cursor-pointer")}>
									<Skeleton className="ml-2 mr-4 h-6 min-w-6" />
									<div className="flex w-full flex-col gap-2">
										<Skeleton className="mb-1 h-4 w-[80px] leading-7" />
										<Skeleton className="mb-1 h-4 w-[130px] leading-7" />
									</div>
								</div>
								<div className={cn("flex items-center rounded p-2 hover:cursor-pointer")}>
									<Skeleton className="ml-2 mr-4 h-6 min-w-6" />
									<div className="flex w-full flex-col gap-2">
										<Skeleton className="mb-1 h-4 w-[70px] leading-7" />
										<Skeleton className="mb-1 h-4 w-[120px] leading-7" />
									</div>
								</div>
								<div className={cn("flex items-center rounded p-2 hover:cursor-pointer")}>
									<Skeleton className="ml-2 mr-4 h-6 min-w-6" />
									<div className="flex w-full flex-col gap-2">
										<Skeleton className="mb-1 h-4 w-[80px] leading-7" />
										<Skeleton className="mb-1 h-4 w-[130px] leading-7" />
									</div>
								</div>
							</>
						)}
						{taskQuery.data && projectsList && (
							<>
								{taskQuery.data.map((task) => (
									<TaskCardOnTodayView key={task.task.id} task={task} projectsList={projectsList} />
								))}
							</>
						)}
						{taskQuery.data?.length === 0 && (
							<>
								<div className="flex w-full items-center">
									<p className="text-muted-foreground">No task found for this date.</p>
								</div>
							</>
						)}
						{/* <div className="flex items-center text-sm">
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
						</Accordion> */}
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

type projectListType = {
	id: string;
	name: string;
	isInbox: boolean;
	subCategories: {
		id: string;
		name: string;
		projectId: string;
		isDefault: boolean;
	}[];
}[];

type locationDetailType = {
	projectName: string | undefined;
	isInbox: boolean | undefined;
	subCatName: string | undefined;
	isDefault: boolean | undefined;
};

function getLocationDetail(task: TaskType, projectsList: projectListType): locationDetailType {
	const project = projectsList.find((project) => project.id === task.taskLocation?.projectId);
	const location = {
		projectName: project?.name,
		isInbox: project?.isInbox,
		subCatName: project?.subCategories.find((subCat) => subCat.id === task.taskLocation?.subCatId)?.name,
		isDefault: project?.subCategories.find((subCat) => subCat.id === task.taskLocation?.subCatId)?.isDefault,
	};
	return location;
}

function TaskCardOnTodayView({ task, projectsList }: { task: TaskType; projectsList: projectListType }) {
	const locationDetails = getLocationDetail(task, projectsList);

	const pathName = usePathname();

	const queryClient = useQueryClient();

	const [checked, setChecked] = React.useState(task.task.isCompleted);

	const mutation = useMutation({
		mutationFn: () => toggleTask(task.task.id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [pathName] });
		},
	});

	React.useEffect(() => {
		if (mutation.isPending) {
			setChecked((prev) => !prev);
		}
	}, [mutation.isPending]);
	return (
		<div className={cn("flex items-center rounded border p-2 hover:cursor-pointer")}>
			<Checkbox
				className="ml-2 mr-4 h-6 w-6"
				checked={checked || false}
				onCheckedChange={() => mutation.mutate()}
			/>
			<div className="w-full">
				<div className="flex justify-between">
					<p className={cn("shad-p mb-1")}>{task.task.title}</p>

					{(task.assignees || []).length > 0 && <Users className="h-3 w-3 text-muted-foreground" />}
				</div>
				<div className="flex w-full items-center justify-between text-xs">
					<div className="flex items-center text-primary">
						{task.task.time && (
							<>
								<Watch className="h-4 w-4" /> {task.task.time.slice(0, 5)}{" "}
							</>
						)}
					</div>
					<div className="flex items-center text-muted-foreground">
						<Inbox className="mr-1 h-4 w-4" /> {locationDetails.projectName}
					</div>
				</div>
			</div>
		</div>
	);
}
