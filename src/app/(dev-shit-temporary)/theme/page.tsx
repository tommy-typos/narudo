"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

export default function Home() {
	const [light, setLight] = useState<boolean>(true);
	const borderShit = "border-blue-800 text-blue-800 rounded-3xl p-2 border";
	const sizes = "h-32 w-44";
	return (
		<div className={cn("flex h-screen flex-col gap-8", light && "bg-white", !light && "bg-black")}>
			<div className="flex gap-4 border-b-8 border-blue-500 p-1 px-4">
				<button className=" text-blue-500" onClick={() => setLight(true)}>
					light
				</button>
				<button className=" text-blue-500" onClick={() => setLight(false)}>
					dark
				</button>
			</div>
			<div className="flex flex-wrap gap-4 p-6">
				<div className={cn(sizes, borderShit, "bg-background")}>--background</div>
				<div className={cn(sizes, borderShit, "bg-foreground")}>--foreground</div>
				<div className={cn(sizes, borderShit, "bg-card")}>--card</div>
				<div className={cn(sizes, borderShit, "bg-card-foreground")}>--card-foreground</div>
				<div className={cn(sizes, borderShit, "bg-popover")}>--popover</div>
				<div className={cn(sizes, borderShit, "bg-popover-foreground")}>--popover-foreground</div>
				<div className={cn(sizes, borderShit, "bg-primary")}>--primary</div>
				<div className={cn(sizes, borderShit, "bg-primary-foreground")}>--primary-foreground</div>
				<div className={cn(sizes, borderShit, "bg-secondary")}>--secondary</div>
				<div className={cn(sizes, borderShit, "bg-secondary-foreground")}>--secondary-foreground</div>
				<div className={cn(sizes, borderShit, "bg-muted")}>--muted</div>
				<div className={cn(sizes, borderShit, "bg-muted-foreground")}>--muted-foreground</div>
				<div className={cn(sizes, borderShit, "bg-accent")}>--accent</div>
				<div className={cn(sizes, borderShit, "bg-accent-foreground")}>--accent-foreground</div>
				<div className={cn(sizes, borderShit, "bg-destructive")}>--destructive</div>
				<div className={cn(sizes, borderShit, "bg-destructive-foreground")}>--destructive-foreground</div>
				<div className={cn(sizes, borderShit, "bg-border")}>--border</div>
				<div className={cn(sizes, borderShit, "bg-input")}>--input</div>
				<div className={cn(sizes, borderShit, "bg-ring")}>--ring</div>
			</div>
		</div>
	);
}
