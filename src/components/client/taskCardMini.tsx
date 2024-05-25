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

export function TaskCardMiniView({ task, projectsList }: { task: TaskType; projectsList: projectListType }) {
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
