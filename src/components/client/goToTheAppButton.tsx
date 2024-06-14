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
