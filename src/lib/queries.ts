import { getFriends, getProjects } from "@/app/_serverActions/queries";
import { useQuery } from "@tanstack/react-query";

export function useFriendsQuery() {
	const data = useQuery({
		queryKey: ["friends"],
		queryFn: () => getFriends(),
	});

	return data;
}

export function useProjectsQuery() {
	const data = useQuery({
		queryKey: ["projects"],
		queryFn: () => getProjects(),
	});

	return data;
}
