"use client";

import { acceptFriendRequest, cancelFriendRequest } from "@/app/_serverActions/friendshipActions";
import { getFriendRequestsIncoming, getFriendRequestsPending } from "@/app/_serverActions/queries";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function Home() {
	const requestsQuery = useQuery({
		queryKey: ["friendRequestsIncoming"],
		queryFn: () => getFriendRequestsIncoming(),
	});

	const queryClient = useQueryClient();

	const mutationCancel = useMutation({
		mutationFn: (value: string) => cancelFriendRequest(value),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["friendRequestsIncoming"] });
		},
	});
	const mutationAccept = useMutation({
		mutationFn: ({ value, sentDate }: { value: string; sentDate: Date }) => acceptFriendRequest(value, sentDate),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["friendRequestsIncoming"] });
			queryClient.invalidateQueries({ queryKey: ["friends"] });
		},
	});

	return (
		<>
			<div className="flex flex-col items-center gap-2">
				{requestsQuery.data &&
					requestsQuery.data.map((request) => (
						<div key={request.userId}>
							<div className="flex w-[500px] items-center justify-between p-2">
								<div className="flex items-center">
									<img
										src={request.imageUrl}
										className="mr-2 h-8 w-8 rounded-full border"
										alt={request.fullName || "user image"}
									></img>
									<div>
										<p>{request.fullName || ""}</p>
										<p className="text-sm">@ {request.userName}</p>
									</div>
								</div>
								<div className="flex gap-2">
									<Button variant="destructive" onClick={() => mutationCancel.mutate(request.userId)}>
										Cancel
									</Button>
									<Button
										variant="default"
										onClick={() =>
											mutationAccept.mutate({
												value: request.userId,
												sentDate: new Date(),
											})
										}
									>
										Accept
									</Button>
								</div>
							</div>
							<Separator className="my-2" />
						</div>
					))}
				{requestsQuery.data && requestsQuery.data.length === 0 && <p>No incoming request</p>}
			</div>
		</>
	);
}
