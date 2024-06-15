"use client";

import {
	CheckCheck,
	Ellipsis,
	LoaderCircle,
	Pin,
	SlidersHorizontal,
	ToggleLeft,
	ToggleRight,
	User,
	Users,
} from "lucide-react";
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
import { usePathname } from "next/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { createContext } from "react";
import { ShowCompletedContext } from "@/lib/friendsShowCompletedContext";
import { useFriendsQuery } from "@/lib/queries";

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

/**
 * TODO :::
 * IF YOU EXPORT SOMETHING HERE, E.G. A FUNCTION YOU GET THIS ERROR: <SOMETHING> is not a valid Next.js entry export value.
 */

export default function Layout({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const [showCompleted, setShowCompleted] = React.useState(false);

	return (
		<ShowCompletedContext.Provider value={showCompleted}>
			<div className="mb-2 flex items-center justify-between">
				<div className="flex w-full flex-col">
					<div className="flex items-center justify-between">
						<div className="flex items-center">
							<Users className="mr-2" />
							<h3 className="shad-h3">Friends</h3>
						</div>
						<Popover>
							<PopoverTrigger asChild>
								<Button variant="ghost">
									<SlidersHorizontal className="mr-2 h-4 w-4" /> View
									<span className="sr-only">Settings and Stuff</span>
								</Button>
							</PopoverTrigger>
							<PopoverContent className="flex w-72 flex-col" align="end">
								<ViewOption onClick={() => setShowCompleted((prev) => !prev)} isOn={showCompleted}>
									<CheckCheck className="mr-2 h-4 w-4" /> Show Completed
								</ViewOption>
							</PopoverContent>
						</Popover>
					</div>
					<div className="flex items-center gap-12 py-4">
						<FriendsLink
							link=""
							text="All"
							active={!(pathname.includes("pending-requests") || pathname.includes("incoming-requests"))}
						/>
						<FriendsLink
							link="pending-requests"
							text="Pending"
							active={pathname.includes("pending-requests")}
						/>
						<FriendsLink
							link="incoming-requests"
							text="Incoming Requests"
							active={pathname.includes("incoming-requests")}
						/>
						<AddFriendDialog />
					</div>
				</div>
			</div>
			{children}
		</ShowCompletedContext.Provider>
	);
}

type ViewOptionProps = {
	className?: string;
	children: React.ReactNode;
	onClick?: () => void;
	isOn?: boolean;
};

function ViewOption({ children, className, onClick, isOn }: ViewOptionProps) {
	const [active, setActive] = React.useState<boolean>(isOn !== undefined ? isOn : false);
	return (
		<Button
			variant="ghost"
			className={cn("items-center justify-between", !active && "opacity-50", className)}
			onClick={() => {
				setActive((prev) => !prev);
				if (onClick) {
					onClick();
				}
			}}
		>
			<div className="flex items-center">{children}</div>
			{!active ? <ToggleLeft className="h-4 w-4" /> : <ToggleRight className="h-4 w-4" />}
		</Button>
	);
}

function AddFriendDialog() {
	const [value, setValue] = React.useState("");
	const [open, setOpen] = React.useState(false);
	const { toast } = useToast();
	const [alreadyFriend, setAlreadyFriend] = React.useState(false);

	const friendsQuery = useFriendsQuery();

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
					<Button variant="secondary" size={"sm"}>
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
