"use client";

import { Ellipsis, Pin, Sword, Swords, User, Users } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

type FriendsLinkProps = {
	link: string;
	text: string;
	active?: boolean;
};

function FriendsLink({ link, text, active }: FriendsLinkProps) {
	return (
		<Link href={`/app/challenges/${link}`} className={cn(!active && "text-muted-foreground hover:text-foreground")}>
			{text}
		</Link>
	);
}

export default function Home() {
	return (
		<div className="p-5">
			<div className="mb-6 flex items-center justify-between">
				<div className="flex flex-col">
					<div className="flex items-center">
						<Swords className="mr-2" />
						<h3 className="shad-h3">Daily Challenges</h3>
					</div>
					<div className="flex items-center gap-12 py-4">
						<FriendsLink link="" text="Today's challenges" active />
						<FriendsLink link="past-challenges" text="Your Past Challenges" />
						<Button variant="secondary">
							<Plus className="mr-2 h-4 w-4" /> Create a challenge
						</Button>
					</div>
				</div>
			</div>
			<div className="flex justify-center">
				<Challenge />
			</div>
		</div>
	);
}

type ChallengeProps = {
	checked?: boolean;
};

function Challenge({ checked: checkedProp }: ChallengeProps) {
	const [checked, setChecked] = React.useState<boolean | undefined>(checkedProp);
	return (
		<div className={cn("flex items-center rounded border p-2 hover:cursor-pointer")}>
			<Checkbox
				className="ml-2 mr-4 h-6 w-6"
				checked={checked}
				onCheckedChange={() => setChecked((prev) => !prev)}
			/>
			<div className="w-full">
				<p className={cn("shad-p mb-1")}>task name</p>
				<div className="flex w-full items-center justify-between text-xs text-muted-foreground">
					<p>Hi I am a task description and I describe myself as a task</p>
				</div>
			</div>
		</div>
	);
}
