"use client";

import { Ellipsis, LoaderCircle, Pin, User, Users } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import * as React from "react";
import Link from "next/link";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addNewFriend } from "@/app/_serverActions/friendshipActions";
import { useToast } from "@/components/ui/use-toast";
import { getFriends } from "@/app/_serverActions/queries";

type FriendsLinkProps = {
	link: string;
	text: string;
	active?: boolean;
};

function FriendsLink({ link, text, active }: FriendsLinkProps) {
	return (
		<Link href={`/app/friends/${link}`} className={cn(!active && "opacity-50 hover:opacity-80")}>
			{text}
		</Link>
	);
}

export default function Home({ children }: { children: React.ReactNode }) {
	return (
		<>
			<div className="mb-6 flex items-center justify-between">
				<div className="flex flex-col">
					<div className="flex items-center">
						<Users className="mr-2" />
						<h3 className="shad-h3">Friends</h3>
					</div>
					<div className="flex items-center gap-12 py-4">
						<FriendsLink link="" text="All" active />
						<FriendsLink link="pending-requests" text="Pending" />
						<FriendsLink link="incoming-requests" text="Incoming Requests" />
						<AddFriendDialog />
					</div>
				</div>
			</div>
			{children}
		</>
	);
}

function AddFriendDialog() {
	const [value, setValue] = React.useState("");
	const [open, setOpen] = React.useState(false);
	const { toast } = useToast();
	const [alreadyFriend, setAlreadyFriend] = React.useState(false);

	const friendsQuery = useQuery({
		queryKey: ["friends"],
		queryFn: () => getFriends(),
	});

	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: ({ value, sentDate }: { value: string; sentDate: Date }) => addNewFriend(value, sentDate),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["friendRequestsPending"] });
			setOpen(false);
			toast({
				description: "Friend request was successfully sent.",
			});
		},
	});

	console.log(mutation.isPending);

	return (
		<>
			<Dialog
				open={open}
				onOpenChange={(isOpen) => {
					if (!mutation.isPending && isOpen === false) {
						setOpen(isOpen);
						setValue("");
						mutation.reset();
					}

					if (isOpen) {
						setOpen(isOpen);
					}
				}}
			>
				<DialogTrigger asChild>
					<Button variant="secondary">
						<Plus className="mr-2 h-4 w-4" /> Add Friend
					</Button>
				</DialogTrigger>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Add a new friend</DialogTitle>
						<DialogDescription>Please enter username of your friend to send a request.</DialogDescription>
					</DialogHeader>
					<div className="grid py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="name" className="">
								Username
							</Label>
							<Input
								id="name"
								className="col-span-3"
								value={value}
								onChange={(e) => {
									setValue(e.target.value);
									setAlreadyFriend(() => {
										if (
											friendsQuery.data &&
											friendsQuery.data.map((item) => item.userName).includes(e.target.value)
										) {
											return true;
										}
										return false;
									});
								}}
							/>
						</div>
						{mutation.isError && (
							<p className="text-sm text-destructive">No user found with the given username.</p>
						)}
						{alreadyFriend && (
							<p className="text-sm text-destructive">You are already friends with this user</p>
						)}
					</div>
					<DialogFooter>
						<Button
							type="submit"
							disabled={value === "" || mutation.isPending || alreadyFriend}
							onClick={() => {
								mutation.mutate({
									value: value,
									sentDate: new Date(),
								});
							}}
						>
							{mutation.isPending && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
							Add friend
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
