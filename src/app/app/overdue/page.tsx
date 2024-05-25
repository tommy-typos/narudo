"use client";

import {
	ArrowDownNarrowWide,
	ArrowUpNarrowWide,
	CheckCheck,
	Clock10,
	CornerDownRight,
	SlidersHorizontal,
	ToggleLeft,
	ToggleRight,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getProjects, getTasksByDate, getTasksBySubCategory } from "@/app/_serverActions/queries";
import { useParams } from "next/navigation";

import { Ellipsis, Inbox, Plus } from "lucide-react";
import { redirect, usePathname, useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { createNewProject, createNewSubCat } from "@/app/_serverActions/addNewProjectSubCat";
import { Skeleton } from "@/components/ui/skeleton";
import { TaskCardMiniView } from "@/components/client/taskCardMini";

export default function Home() {
	const projectsQuery = useQuery({
		queryKey: ["projects"],
		queryFn: () => getProjects(),
	});

	const pathname = usePathname();

	const taskQuery = useQuery({
		queryKey: [pathname],
		queryFn: () => getTasksByDate("2024-05-25"),
	});

	return (
		<>
			<div className="mb-6 flex items-center justify-between">
				<div className="flex flex-col">
					<div className="flex items-center">
						<Clock10 className="mr-2 stroke-destructive" />
						<h3 className="shad-h3 text-destructive">Overdue</h3>
					</div>
				</div>
			</div>
			<div className="flex justify-between gap-4">
				<div className="flex flex-1 flex-col gap-2">
					{taskQuery.isLoading && (
						<div className="m-auto">
							<div className="min-w-[300px] max-w-[450px]">
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
							</div>
						</div>
					)}
					{taskQuery.data && projectsQuery.data && (
						<div className="m-auto">
							<div className="min-w-[300px] max-w-[450px]">
								{taskQuery.data.map((task) => (
									<TaskCardMiniView
										key={task.task.id}
										task={task}
										projectsList={projectsQuery.data}
										showDate
										showLocation={false}
									/>
								))}
							</div>
						</div>
					)}
					{taskQuery.data?.length === 0 && (
						<div className="m-auto">
							<div className="min-w-[300px] max-w-[450px]">
								<div className="flex w-full items-center">
									<p className="text-muted-foreground">No unfinished old tasks 🙂</p>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</>
	);
}
