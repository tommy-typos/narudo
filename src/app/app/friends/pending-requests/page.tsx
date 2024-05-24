"use client";

import { cancelFriendRequest } from "@/app/_serverActions/friendshipActions";
import { getFriendRequestsPending } from "@/app/_serverActions/queries";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function Home() {
	const requestsQuery = useQuery({
		queryKey: ["friendRequestsPending"],
		queryFn: () => getFriendRequestsPending(),
	});

	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: (value: string) => cancelFriendRequest(value),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["friendRequestsPending"] });
		},
	});

	return (
		<>
			<div className="flex flex-col items-center gap-2">
				{requestsQuery.data &&
					requestsQuery.data.map((request) => (
						<div key={request.userId}>
							<div className="flex w-80 items-center justify-between p-2">
								<p>@ {request.userName}</p>
								<Button variant="destructive" onClick={() => mutation.mutate(request.userId)}>
									Cancel
								</Button>
							</div>
							<Separator className="my-2" />
						</div>
					))}
				{requestsQuery.data && requestsQuery.data.length === 0 && <p>No pending request</p>}
			</div>
		</>
	);
}
