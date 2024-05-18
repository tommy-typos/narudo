"use client";

import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
/*
TODO :::
make this route visible only in dev env.
*/

export default function Home() {
	const { setTheme } = useTheme();
	const className = "border-blue-800 text-blue-800 rounded-3xl p-2 border text-sm size-32";
	return (
		<div className={cn("flex h-full flex-col", "bg-background")}>
			<div className="flex gap-4 border-b-8 border-blue-500 p-1 px-4">
				<button className=" font-bold text-blue-500 dark:font-normal" onClick={() => setTheme("light")}>
					light
				</button>
				<button className=" text-blue-500 dark:font-bold" onClick={() => setTheme("dark")}>
					dark
				</button>
				<div className="ml-6 flex gap-4">
					<p>1. good</p>
					<p>2. cursed</p>
					<p>3. all_colors</p>
				</div>
			</div>
			<div className="flex flex-wrap items-center gap-4 border-b-8 border-blue-500 p-4 *:w-72 ">
				<Component back="background" fore="foreground" />
				<Component back="card" fore="card-foreground" />
				<Component back="popover" fore="popover-foreground" />
				<Component back="primary" fore="primary-foreground" />
				<Component back="secondary" fore="secondary-foreground" />
				<Component back="muted" fore="muted-foreground" />
				<Component back="accent" fore="accent-foreground" />
				<Component back="destructive" fore="destructive-foreground" />
			</div>
			{/* <div className="flex flex-wrap items-center gap-4 border-b-8 border-blue-500 p-4 *:w-72 ">
				<h2>cursed</h2>
				<Component back="background" fore="muted-foreground" />
				<Component back="primary" fore="muted-foreground" />
				<Component back="secondary" fore="muted-foreground" />
			</div> */}
			<div className="flex flex-wrap gap-4 p-6">
				<div className={cn(className, "bg-background")}>--background</div>
				<div className={cn(className, "bg-foreground")}>--foreground</div>
				<div className={cn(className, "bg-card")}>--card</div>
				<div className={cn(className, "bg-card-foreground")}>--card-foreground</div>
				<div className={cn(className, "bg-popover")}>--popover</div>
				<div className={cn(className, "bg-popover-foreground")}>--popover-foreground</div>
				<div className={cn(className, "bg-primary")}>--primary</div>
				<div className={cn(className, "bg-primary-foreground")}>--primary-foreground</div>
				<div className={cn(className, "bg-secondary")}>--secondary</div>
				<div className={cn(className, "bg-secondary-foreground")}>--secondary-foreground</div>
				<div className={cn(className, "bg-muted")}>--muted</div>
				<div className={cn(className, "bg-muted-foreground")}>--muted-foreground</div>
				<div className={cn(className, "bg-accent")}>--accent</div>
				<div className={cn(className, "bg-accent-foreground")}>--accent-foreground</div>
				<div className={cn(className, "bg-destructive")}>--destructive</div>
				<div className={cn(className, "bg-destructive-foreground")}>--destructive-foreground</div>
				<div className={cn(className, "bg-border")}>--border</div>
				<div className={cn(className, "bg-input")}>--input</div>
				<div className={cn(className, "bg-ring")}>--ring</div>
			</div>
		</div>
	);
}

function Component({ back, fore }: { back: string; fore: string }) {
	return (
		<div className={`bg-${back} border p-4`}>
			<p className={`text-${fore} text-center`}>{`${back} .. ${fore}`}</p>
		</div>
	);
}
