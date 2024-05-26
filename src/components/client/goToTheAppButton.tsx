"use client";

import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import { MoveRight } from "lucide-react";

export function GoToApp() {
	return (
		<Link className={cn(buttonVariants(), "mt-10 w-40")} href={`/sign-in`}>
			Go to the app <MoveRight className="ml-2 h-4 w-4" />
		</Link>
	);
}

function stringifyDate(date: Date) {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() returns 0-11, so we add 1
	const day = String(date.getDate()).padStart(2, "0"); // getDate() returns the day of the month

	return `${year}-${month}-${day}`;
}
