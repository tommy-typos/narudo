"use client";

import { Ellipsis, Pin, Sword, Swords, User, Users } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createNewChallenge } from "@/app/_serverActions/createNewChallenge";
import { getTodaysChallenges } from "@/app/_serverActions/queries";
import { stringifyDate } from "@/lib/dateUtils";

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
	const [value, setValue] = React.useState("");
	const [open, setOpen] = React.useState(false);

	const challengesQuery = useQuery({
		queryKey: ["challenges"],
		queryFn: () => getTodaysChallenges(stringifyDate(new Date())),
	});

	const queryClient = useQueryClient();

	const challengeMutation = useMutation({
		mutationFn: ({ title, createdAt }: { title: string; createdAt: string }) =>
			createNewChallenge(title, createdAt),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["challenges"] });
		},
	});

	return (
		<>
			<div className="mb-6 flex items-center justify-between">
				<div className="flex flex-col">
					<div className="flex items-center">
						<Swords className="mr-2" />
						<h3 className="shad-h3">Daily Challenges</h3>
					</div>
					<div className="flex items-center gap-12 py-4">
						<FriendsLink link="" text="Today's challenges" active />
						{/* <FriendsLink link="past-challenges" text="Your Past Challenges" /> */}

						<Dialog
							open={open}
							onOpenChange={(isOpen) => {
								setOpen(isOpen);
								if (!isOpen) {
									setValue("");
								}
							}}
						>
							<DialogTrigger asChild>
								<div
									className={cn(buttonVariants({ variant: "secondary" }))}
									onClick={(e) => {
										e.preventDefault();
										setOpen(true);
									}}
								>
									<Plus className="mr-2 h-4 w-4" /> Create a challenge
								</div>
							</DialogTrigger>
							<DialogContent className="sm:max-w-[425px]">
								<DialogHeader>
									<DialogTitle>Add a new challenge</DialogTitle>
									<DialogDescription>Please enter title for the challenge.</DialogDescription>
								</DialogHeader>
								<div className="grid gap-4 py-4">
									<div className="grid grid-cols-4 items-center gap-4">
										<Label htmlFor="name" className="text-right">
											Title
										</Label>
										<Input
											id="name"
											defaultValue="Pedro Duarte"
											className="col-span-3"
											value={value}
											onChange={(e) => setValue(e.target.value)}
										/>
									</div>
								</div>
								<DialogFooter>
									<Button
										type="submit"
										disabled={value === ""}
										onClick={() => {
											challengeMutation.mutate({
												title: value,
												createdAt: stringifyDate(new Date()),
											});
											setOpen(false);
											setValue("");
										}}
									>
										Create a new challenge
									</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					</div>
				</div>
			</div>
			<div className="flex justify-center">
				{challengesQuery.data && challengesQuery.data.length > 0 ? (
					<div className="flex flex-col gap-2">
						{challengesQuery.data.map((chal) => (
							<Challenge key={chal.id} challenge={chal} />
						))}
					</div>
				) : (
					<div>
						<p>No Challenge Yet. Create Today&apos;s first challenge</p>
					</div>
				)}
			</div>
		</>
	);
}

type ChallengeProps = {
	id: string;
	title: string;
	ownerFullName: string | undefined;
};

function Challenge({ challenge }: { challenge: ChallengeProps }) {
	return (
		<div className={cn("flex items-center rounded border p-2 hover:cursor-pointer")}>
			<div className="w-full">
				<p className={cn("shad-p mb-1")}>{challenge.title}</p>
				<div className="flex w-full items-center justify-between text-xs text-muted-foreground">
					<p className="text-muted-foreground">Created by: @ {challenge.ownerFullName}</p>
				</div>
			</div>
		</div>
	);
}
