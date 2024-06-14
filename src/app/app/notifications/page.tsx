"use client";
import { getNotifications } from "@/app/_serverActions/queries";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BellRing } from "lucide-react";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { toggleNotification } from "@/app/_serverActions/toggleTaskNotification";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

export default function Home() {
	const notifQuery = useQuery({
		queryKey: ["notifications"],
		queryFn: () => getNotifications(),
	});

	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: (notifId: number) => toggleNotification(notifId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
			queryClient.invalidateQueries({ queryKey: ["notificationCount"] });
		},
	});

	/**
	 * TODO :::
	 * as an optimistic ui update, should I just mutate the notifQuery.data to change the toggled notification immediately or what approach I should use?
	 */

	const [onlyUnread, setOnlyRead] = useState(true);
	return (
		<>
			<div className="mb-5 flex items-center justify-between">
				<div className={cn("flex items-center")}>
					<BellRing className="mr-2" />
					<h3 className="shad-h3 mr-4">Notifications</h3>
				</div>
				<Tabs
					defaultValue="unread"
					className=""
					onValueChange={(value) => {
						setOnlyRead(() => (value === "unread" ? true : false));
					}}
				>
					<TabsList className="grid grid-cols-2">
						<TabsTrigger value="all">All</TabsTrigger>
						<TabsTrigger value="unread">Unread</TabsTrigger>
					</TabsList>
				</Tabs>
			</div>
			<div className="flex w-full flex-col justify-center">
				{notifQuery.data &&
					notifQuery.data
						.filter((notif) => (onlyUnread ? notif.isRead === false : true))
						.map((notif) => (
							<div key={notif.id}>
								<div
									className={cn(
										"flex items-center  p-2 hover:cursor-pointer",
										notif.isRead && "opacity-50",
										"hover:bg-muted/40"
									)}
								>
									<div className="w-full">
										<div className="flex items-baseline justify-between">
											<p className={cn("shad-p mb-1")}>{notif.title}</p>

											<p className="text-xs">{format(notif.dateTime, "MMMM dd, yyyy HH:mm")}</p>
										</div>
										<div className="flex items-start justify-between">
											<p className="text-sm text-muted-foreground">{notif.content}</p>
											<Button
												variant="outline"
												size="sm"
												onClick={() => mutation.mutate(notif.id)}
											>
												Mark as {notif.isRead ? "Unread" : "Read"}
											</Button>
										</div>
									</div>
								</div>
								<Separator className="my-2" />
							</div>
						))}
			</div>
		</>
	);
}
