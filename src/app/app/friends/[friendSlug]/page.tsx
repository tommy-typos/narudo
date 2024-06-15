"use client";

import { Ellipsis, LoaderCircle, Pin, Plus, User, Users } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getFriends, getProjects, getTasksByFriend } from "@/app/_serverActions/queries";
import { usePathname } from "next/navigation";
import { MiniTasksSkeleton, TaskCardMiniView } from "@/components/client/taskCardMini";
import { ShowCompletedContext } from "@/lib/friendsShowCompletedContext";
import { useFriendsQuery, useProjectsQuery } from "@/lib/queries";
import { TeamGoalsSvg } from "@/lib/svgs/svgExporter";
import { AddTask } from "@/components/client/addTask";

export default function Home() {
	const friendsQuery = useFriendsQuery();

	const showCompleted = React.useContext(ShowCompletedContext);

	const { data: projectsList } = useProjectsQuery();

	const pathname = usePathname();

	const taskQuery = useQuery({
		queryKey: [pathname],
		queryFn: () => getTasksByFriend(pathname.split("/").at(-1) as string),
	});

	return (
		<>
			<div className="flex h-full justify-between rounded-md border shadow-xl">
				<div className="flex min-w-64 flex-col gap-1 border-r p-2">
					{friendsQuery.data?.map((friend) => <FriendLinkComponent key={friend.id} data={friend} />)}
				</div>
				<div className="flex flex-1 flex-col gap-2 bg-muted/40 p-2">
					{taskQuery.isLoading && <MiniTasksSkeleton />}
					{taskQuery.data && projectsList && (
						<>
							{taskQuery.data
								.filter((item) => {
									if (showCompleted) {
										return true;
									}
									return !item.task.isCompleted;
								})
								.map((task) => (
									<TaskCardMiniView
										key={task.task.id}
										task={task}
										projectsList={projectsList}
										showDate
									/>
								))}
						</>
					)}
					{(taskQuery.data?.length === 0 ||
						(!showCompleted && taskQuery.data?.filter((item) => !item.task.isCompleted).length == 0)) && (
						<div className="flex flex-col items-center justify-center gap-4 p-4 pt-10">
							{/* <div className="flex w-full items-center">
								<p className="text-muted-foreground">No shared task with this friend yet.</p>
							</div> */}
							<TeamGoalsSvg className="max-w-[500px]" />
							<AddTask>
								<Button variant="ghost" className="w-full pl-3 text-primary hover:text-primary">
									<Plus className="mr-1 size-4 rounded-full bg-primary text-white" /> Add task
								</Button>
							</AddTask>
						</div>
					)}
				</div>
			</div>
		</>
	);
}

type FriendType = {
	id: string;
	userName: string | null;
	fullName: string | null;
	imageUrl: string;
	hasImage: boolean;
};

function FriendLinkComponent({ data }: { data: FriendType }) {
	const pathname = usePathname();
	return (
		<div
			className={cn(
				"group relative flex items-center justify-between rounded-md p-2 pl-0 hover:bg-accent",
				pathname.includes(data.id) && "bg-accent"
			)}
		>
			<Link
				className={cn(buttonVariants({ variant: "ghost" }), "w-full justify-start hover:bg-transparent")}
				href={`/app/friends/${data.id}`}
			>
				<div className="mr-2 size-10">
					<img
						src={data.imageUrl}
						className="size-10 rounded-full border-0 object-cover"
						alt={data.fullName || "user image"}
					></img>
				</div>
				<div>
					<p>{data.fullName || ``}</p>
					<p
						className={cn("text-muted-foreground", !data.fullName && "text-foreground")}
					>{`@ ${data.userName}`}</p>
				</div>
			</Link>
			<Button
				variant="ghost"
				size="icon"
				className="invisible absolute right-2  h-7 w-7 border-0 group-hover:visible group-hover:bg-background"
				onClick={(e) => {
					e.preventDefault();
				}}
			>
				<Ellipsis className="h-4 w-4" />
			</Button>
		</div>
	);
}
