"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { getProjects } from "@/app/_serverActions/queries";
import { useRouter } from "next/navigation";
import { useProjectsQuery } from "@/lib/queries";

export default function Home() {
	const projectsQuery = useProjectsQuery();

	const router = useRouter();
	React.useEffect(() => {
		if (projectsQuery.data) {
			router.push(`/app/projects/${projectsQuery.data[0].id}/${projectsQuery.data[0].subCategories[0].id}`);
		}
	}, [projectsQuery.data]);

	return <></>;
}
