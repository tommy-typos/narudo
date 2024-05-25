"use client";

import {
	ArrowDownNarrowWide,
	ArrowUpNarrowWide,
	CheckCheck,
	Ellipsis,
	Inbox,
	Slash,
	SlidersHorizontal,
	Tag,
	ToggleLeft,
	ToggleRight,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getProjects } from "@/app/_serverActions/queries";
import { useRouter } from "next/navigation";

export default function Home() {
	const projectsQuery = useQuery({
		queryKey: ["projects"],
		queryFn: () => getProjects(),
	});

	const router = useRouter();
	React.useEffect(() => {
		if (projectsQuery.data) {
			router.push(`/app/projects/${projectsQuery.data[0].id}/$${projectsQuery.data[0].subCategories[0].id}`);
		}
	}, [projectsQuery.data]);

	return <></>;
}
