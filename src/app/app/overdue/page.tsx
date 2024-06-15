"use client";

import { Clock10 } from "lucide-react";
import * as React from "react";

import { useQuery } from "@tanstack/react-query";
import { getOverdueTasks, getProjects } from "@/app/_serverActions/queries";

import { redirect, usePathname, useRouter } from "next/navigation";
import { MiniTasksSkeleton, TaskCardMiniView } from "@/components/client/taskCardMini";
import { useProjectsQuery } from "@/lib/queries";

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

export default function Home() {
	const projectsQuery = useProjectsQuery();

	const pathname = usePathname();

	const taskQuery = useQuery({
		queryKey: [pathname],
		queryFn: () => getOverdueTasks(formatDateTime(new Date())),
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
								<MiniTasksSkeleton />
							</div>
						</div>
					)}
					{taskQuery.data && projectsQuery.data && (
						<div className="m-auto">
							<div className="flex min-w-[300px] max-w-[450px] flex-col gap-2">
								{taskQuery.data.map((task) => (
									<TaskCardMiniView
										key={task.task.id}
										task={task}
										projectsList={projectsQuery.data}
										showDate
										showAsOverdue
									/>
								))}
							</div>
						</div>
					)}
					{taskQuery.data?.length === 0 && (
						<div className="m-auto">
							<div className="min-w-[300px] max-w-[450px]">
								<div className="flex w-full items-center justify-center">
									<p className="text-center text-muted-foreground">No unfinished old tasks 🙂</p>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</>
	);
}
