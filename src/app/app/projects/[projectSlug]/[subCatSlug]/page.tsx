"use client";

import {
	ArrowDownNarrowWide,
	ArrowUpNarrowWide,
	CheckCheck,
	CornerDownRight,
	SlidersHorizontal,
	ToggleLeft,
	ToggleRight,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getProjects, getTasksBySubCategory } from "@/app/_serverActions/queries";
import { useParams } from "next/navigation";

import { Ellipsis, Inbox, Plus } from "lucide-react";
import { redirect, usePathname, useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createNewProject, createNewSubCat } from "@/app/_serverActions/addNewProjectSubCat";
import { MiniTasksSkeleton, TaskCardMiniView } from "@/components/client/taskCardMini";
import { useProjectsQuery } from "@/lib/queries";

export default function Home() {
	const { projectSlug, subCatSlug } = useParams();
	const [showCompleted, setShowCompleted] = React.useState(false);

	const projectsQuery = useProjectsQuery();

	const [value, setValue] = React.useState("");
	const [open, setOpen] = React.useState(false);

	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: ({ value, projectId }: { value: string; projectId: string }) => createNewSubCat(value, projectId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["projects"] });
		},
	});

	const pathname = usePathname();

	const taskQuery = useQuery({
		queryKey: [pathname],
		queryFn: () => getTasksBySubCategory(pathname.split("/").at(-1) as string),
	});

	return (
		<>
			<div className="mb-6 flex items-center justify-between">
				<div className="flex flex-col">
					<div className="flex items-center">
						<Inbox className="mr-2" />
						<h3 className="shad-h3">
							{projectsQuery.data?.find((item) => item.id === projectSlug)!.name || ""}
						</h3>
					</div>
					{/* <p className="ml-8 mt-0.5 text-xs opacity-50">Tasks with no date or a project</p> */}
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
						{/* <ViewSortOption /> */}
					</PopoverContent>
				</Popover>
			</div>
			<div className="flex justify-between gap-4">
				<Card className="w-60">
					<CardContent className="flex w-full flex-col p-2">
						{projectsQuery.data &&
							projectsQuery.data
								.find((item) => item.id === projectSlug)
								?.subCategories.map((item) => (
									<SubCatComponent key={item.id} subCat={item} projectSlug={projectSlug as string} />
								))}

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
									className={cn(buttonVariants({ variant: "ghost" }), "mt-2 justify-start")}
									onClick={(e) => {
										e.preventDefault();
										setOpen(true);
									}}
								>
									<Plus className="mr-2 h-4 w-4 rotate-90" />
									Add Sub Category
								</div>
							</DialogTrigger>
							<DialogContent className="sm:max-w-[425px]">
								<DialogHeader>
									<DialogTitle>Add a new subcategory</DialogTitle>
									<DialogDescription>
										Please enter name for a new subcategory of{" "}
										{projectsQuery.data?.find((item) => item.id === projectSlug)!.name}
									</DialogDescription>
								</DialogHeader>
								<div className="grid gap-4 py-4">
									<div className="grid grid-cols-4 items-center gap-4">
										<Label htmlFor="name" className="text-right">
											Name
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
											mutation.mutate({ value, projectId: projectSlug as string });
											setOpen(false);
											setValue("");
										}}
									>
										Create a new sub category
									</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					</CardContent>
				</Card>
				<div className="flex flex-1 flex-col">
					{taskQuery.isLoading && <MiniTasksSkeleton />}
					{taskQuery.data && projectsQuery.data && (
						<>
							{taskQuery.data
								.filter((item) => {
									if (showCompleted) {
										return true;
									}
									return !item.task.isCompleted;
								})
								.map((task) => (
									<TaskCardMiniView
										key={task.task.id}
										task={task}
										projectsList={projectsQuery.data}
										showDate
										showLocation={false}
									/>
								))}
						</>
					)}
					{taskQuery.data?.length === 0 && (
						<>
							<div className="flex w-full items-center">
								<p className="text-muted-foreground">No shared task with this friend yet.</p>
							</div>
						</>
					)}
				</div>
			</div>
		</>
	);
}

type SubCatProps = {
	projectId: string;
	isDefault: boolean;
	name: string;
	id: string;
};

function SubCatComponent({ subCat, projectSlug }: { subCat: SubCatProps; projectSlug: string }) {
	const pathname = usePathname();
	return (
		<div
			className={cn(
				"group flex items-center justify-between rounded-md pr-2 hover:bg-accent",
				pathname.includes(subCat.id) && "bg-accent"
			)}
		>
			<Link
				className={cn(buttonVariants({ variant: "ghost" }), "w-full justify-start hover:bg-transparent")}
				href={`/app/projects/${projectSlug}/${subCat.id}`}
			>
				<CornerDownRight className="mr-2 h-4 w-4" />
				{subCat.name}
			</Link>
			<Button
				variant="ghost"
				size="icon"
				className="invisible h-7 w-7  border-0 group-hover:visible group-hover:bg-background"
				onClick={(e) => {
					e.preventDefault();
				}}
			>
				<Ellipsis className="h-4 w-4" />
			</Button>
		</div>
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
function ViewSortOption() {
	const [ascending, setAscending] = React.useState<boolean>(false);
	// ascending dates => old to new
	return (
		<Button
			variant="ghost"
			className={cn("items-center justify-between opacity-50")}
			onClick={() => setAscending((prev) => !prev)}
		>
			<div className="flex items-center">
				{ascending ? (
					<ArrowDownNarrowWide className="mr-2 h-4 w-4" />
				) : (
					<ArrowUpNarrowWide className="mr-2 h-4 w-4" />
				)}
				Sort by &quot;Date Added&quot;
			</div>
			<p>{ascending ? "ASC" : "DESC"}</p>
		</Button>
	);
}
