"use client";

import * as React from "react";
import { QueryKey, useQuery, useQueryClient } from "@tanstack/react-query";
import { getFriends } from "@/app/_serverActions/queries";
import { useRouter } from "next/navigation";
import { useFriendsQuery } from "@/lib/queries";
import { FriendsSvg } from "@/lib/svgs/svgExporter";

export default function Home() {
	const friendsQuery = useFriendsQuery();

	const router = useRouter();

	React.useEffect(() => {
		if (friendsQuery.data?.length! > 0) {
			router.push(`/app/friends/${friendsQuery.data?.[0].id}`);
		}
	}, [friendsQuery.data]);

	return (
		<>
			{friendsQuery.data && friendsQuery.data.length === 0 && (
				<div className="flex flex-col items-center justify-center py-4">
					<FriendsSvg className="max-h-72" />
					<p className="text-center">Your friend list is current empty.</p>
					<p className="text-center">Add your friends now to start collaborating 🙂</p>
				</div>
			)}
		</>
	);
}
