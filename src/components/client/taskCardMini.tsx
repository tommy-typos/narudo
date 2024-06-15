"use client";
import { useParams, usePathname } from "next/navigation";
import { Calendar, Clock, Inbox, Users, Watch } from "lucide-react";
import { cn } from "@/lib/utils";
import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TaskType, getProjects, getTasksByDate } from "@/app/_serverActions/queries";
import { toggleTask } from "@/app/_serverActions/toggleTaskNotification";
import { UpdateTask } from "./updateTask";
import { Skeleton } from "../ui/skeleton";
import { format } from "date-fns";

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

export function TaskCardMiniView({
	task,
	projectsList,
	showDate = false,
	showLocation = true,
	showAsOverdue = false,
}: {
	task: TaskType;
	projectsList: projectListType;
	showDate?: boolean;
	showLocation?: boolean;
	showAsOverdue?: boolean;
}) {
	const locationDetails = getLocationDetail(task, projectsList);

	const pathName = usePathname();

	const queryClient = useQueryClient();

	const [checked, setChecked] = React.useState(task.task.isCompleted);

	const mutation = useMutation({
		mutationFn: () => toggleTask(task.task.id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [pathName] });
			queryClient.invalidateQueries({ queryKey: ["overdueCount"] });
		},
	});

	React.useEffect(() => {
		setChecked(task.task.isCompleted);
	}, [task.task.isCompleted]);

	React.useEffect(() => {
		if (mutation.isPending) {
			setChecked((prev) => !prev);
		}
	}, [mutation.isPending]);
	return (
		<UpdateTask task={task}>
			<div
				className={cn(
					"flex flex-col items-center rounded-md border p-2 hover:cursor-pointer hover:bg-muted/50",
					!checked && "bg-background/70"
				)}
			>
				<div className="flex w-full items-start">
					<Checkbox
						className="mr-2 mt-0.5 size-6 rounded-full"
						checked={checked || false}
						onClick={(e) => {
							e.preventDefault();
							mutation.mutate();
						}}
					/>
					<div className="flex w-full items-start justify-between">
						<p className={cn("shad-p mb-1 text-sm", checked && "text-foreground/40 line-through")}>
							{task.task.title}
						</p>
					</div>
				</div>
				<div className="w-full pl-8">
					<div className="flex w-full items-center justify-between text-xs">
						<div
							className={cn(
								"flex items-center text-primary",
								checked && "text-primary/40",
								showAsOverdue && "text-destructive"
							)}
						>
							{showDate && task.task.date && (
								<div className="mr-1 flex items-center gap-0.5">
									<Calendar className="h-3 w-3" /> {format(task.task.date, "MMMM d, yyyy")}{" "}
								</div>
							)}
							{task.task.time && (
								<div className="flex items-center gap-0.5">
									<Clock className="h-3 w-3" /> {task.task.time.slice(0, 5)}{" "}
								</div>
							)}
						</div>
						{showLocation && (
							<div
								className={cn(
									"flex items-center text-muted-foreground",
									checked && "text-muted-foreground/40"
								)}
							>
								<Inbox className="mr-1 h-3 w-3" /> {locationDetails.projectName}
							</div>
						)}
					</div>
				</div>
			</div>
		</UpdateTask>
	);
}

export function MiniTasksSkeleton() {
	return (
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
	);
}
