import { Button } from "@/components/ui/button";
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
import {
	CalendarHeart,
	CircleSlash,
	Clock,
	CornerDownRight,
	Hash,
	HeartHandshake,
	Inbox,
	Plus,
	Slash,
	Sun,
	Tag,
	Users,
	X,
} from "lucide-react";
import { Textarea } from "../ui/textarea";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "../ui/separator";
import * as RadixPopover from "@radix-ui/react-popover";
import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InsertTaskType, addNewTask } from "@/app/_serverActions/addNewTask";
import { produce } from "immer";
import { genId } from "@/lib/generateId";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TaskType, getFriends, getProjects } from "@/app/_serverActions/queries";
import { usePathname } from "next/navigation";
import { isToday, stringifyDate } from "@/lib/dateUtils";
import { formatTimeIntoTwoDigits, generatedTimes, isNotQuarterTime, isValidTime, tomorrow } from "@/lib/dateUtils";
import { useFriendsQuery, useProjectsQuery } from "@/lib/queries";

const emptyState: InsertTaskType = {
	task: {
		date: null,
		id: "",
		createdAt: new Date(),
		title: "",
		description: "",
		time: null,
		isTogether: true,
		isAssignedToSb: false,
	},
	assignees: [],
	project: {
		projectId: "",
		subCatId: "",
	},
};

export function AddTask({ children }: { children?: React.ReactNode | null }) {
	const [open, setOpen] = React.useState(false);
	const [task, setTask] = React.useState<InsertTaskType>(emptyState);

	const queryClient = useQueryClient();
	const pathName = usePathname();

	const mutation = useMutation({
		mutationFn: (data: InsertTaskType) => addNewTask(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [pathName] });
			queryClient.invalidateQueries({ queryKey: ["overdueCount"] });
		},
	});

	async function handleClick() {
		mutation.mutate({
			task: {
				...task.task,
				createdAt: new Date(),
				id: genId(),
			},
			assignees: task.assignees,
			project: task.project,
		});
		setOpen(false);
		setTask(emptyState);
	}

	React.useEffect(() => {
		if (!task.task.date) {
			setTask(
				produce((draft) => {
					draft!.task.time = null;
				})
			);
		}
	}, [task.task.date]);

	return (
		<Dialog
			open={open}
			onOpenChange={(isOpen) => {
				setOpen(isOpen);
				if (!isOpen) {
					setTask(emptyState);
				}
			}}
		>
			<DialogTrigger asChild>
				{children || (
					<Button variant="ghost" size="sm">
						<Plus className="mr-2 h-4 w-4" />
						Add Task
					</Button>
				)}
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<div className="flex flex-col gap-2">
					<Input
						placeholder="Task name"
						className="border-0 text-xl !ring-0 !ring-offset-0"
						value={task.task.title}
						onChange={(e) => {
							setTask(
								produce((draft) => {
									draft!.task.title = e.target.value;
								})
							);
						}}
					/>
					<Textarea
						placeholder="Description"
						className="min-h-[120px] resize-none !ring-0 !ring-offset-0"
						value={task.task.description as string}
						onChange={(e) => {
							setTask(
								produce((draft) => {
									draft!.task.description = e.target.value;
								})
							);
						}}
					/>
					<div className="flex justify-between">
						<DatePickerWithPresets setTask={setTask} />
						<TimePickerWithPresets setTask={setTask} task={task} />
					</div>
					<DestinationPicker setTask={setTask} />
					<Separator className="my-1 bg-transparent" />
					<AssignToFriends task={task} setTask={setTask} />
				</div>
				<DialogFooter>
					<Button
						variant="secondary"
						onClick={() => {
							setOpen(false);
							setTask(emptyState);
						}}
					>
						Cancel
					</Button>
					<Button onClick={handleClick} disabled={task.task.title === ""}>
						Add task
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

function AssignToFriends({
	task,
	setTask,
}: {
	setTask: React.Dispatch<React.SetStateAction<InsertTaskType>>;
	task: InsertTaskType;
}) {
	const friendsQuery = useFriendsQuery();

	const [values, setValues] = React.useState<string[]>([]);

	React.useEffect(() => {
		setTask(
			produce((draft) => {
				draft.assignees = values;
			})
		);
	}, [values]);

	const tabValue = task.task.isTogether ? "together" : "by-themselves";

	return (
		<>
			<Accordion type="single" collapsible className="w-full rounded-md border">
				<AccordionItem value="item-1" className="border-b-0 text-muted-foreground">
					<AccordionTrigger className="py-2 pl-4 pr-4 hover:no-underline ">
						<div className="flex items-center">
							<Users className="mr-2 h-4 w-4" />
							<p className="text-sm">Assign to friends</p>
						</div>
					</AccordionTrigger>
					<AccordionContent className="pl-4 pr-4 pt-1">
						<div className="flex flex-col gap-2">
							<div>
								<p className="mb-1">They will do it:</p>
								<Tabs
									defaultValue={tabValue}
									className="w-full"
									onValueChange={(value) => {
										setTask(
											produce((draft) => {
												draft.task.isTogether = value === "together" ? true : false;
											})
										);
									}}
								>
									<TabsList className="grid w-full grid-cols-2">
										<TabsTrigger value="together">
											<HeartHandshake className="mr-2 h-4 w-4" />
											Together With You
										</TabsTrigger>
										<TabsTrigger value="by-themselves">By Themselves</TabsTrigger>
									</TabsList>
								</Tabs>
							</div>
							<div className="flex items-end justify-between border-b pb-2">
								<p>Assigned to:</p>
								<FriendPicker
									setTask={setTask}
									friends={friendsQuery.data}
									values={values}
									setValues={setValues}
								/>
							</div>
							<div className="flex flex-wrap gap-2">
								{friendsQuery.data &&
									friendsQuery.data
										.filter((item) => values.includes(item.id))
										.map((friend) => (
											<Button
												variant="outline"
												className="group text-foreground"
												key={friend.id}
												onClick={() => {
													setValues((prev) => {
														if (prev.includes(friend.id)) {
															return prev.filter((i: string) => i !== friend.id);
														} else {
															return [...prev, friend.id];
														}
													});
												}}
											>
												<div className="flex items-center">
													<img
														src={friend.imageUrl}
														className="mr-2 h-6 w-6 rounded-full"
														alt={friend.fullName || "user image"}
													></img>
													<p>{friend.fullName || `@ ${friend.userName}`}</p>
												</div>
												<X className="w-r ml-2 h-4 group-hover:text-destructive" />
											</Button>
										))}
							</div>
						</div>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</>
	);
}

type FriendType = {
	id: string;
	userName: string | null;
	fullName: string | null;
	imageUrl: string;
	hasImage: boolean;
};

type ProjectType = {
	id: string;
	name: string;
	isInbox: boolean;
	subCategories: {
		id: string;
		name: string;
		projectId: string;
		isDefault: boolean;
	}[];
};

type SubcatType = {
	id: string;
	name: string;
	projectId: string;
	isDefault: boolean;
	projectName: string;
	isProjectInbox: boolean;
};

function flattenProjectsToSubCats(projects: ProjectType[] | undefined): SubcatType[][] {
	const flattened: SubcatType[][] = [];
	if (projects) {
		projects.forEach((project) => {
			const temp: SubcatType[] = [];
			project.subCategories.forEach((subCat) => {
				temp.push({
					...subCat,
					projectName: project.name,
					isProjectInbox: project.isInbox,
				});
			});
			flattened.push(temp);
		});
	}
	return flattened;
}

export function DestinationPicker({ setTask }: { setTask: React.Dispatch<React.SetStateAction<InsertTaskType>> }) {
	const { data, isSuccess } = useProjectsQuery();

	const flattenedProjects = React.useMemo(() => flattenProjectsToSubCats(data), [data]);
	const [open, setOpen] = React.useState(false);
	const [value, setValue] = React.useState<string>("");

	const chosenSubCat: SubcatType = [].concat(...(flattenedProjects as any)).find((subCat: SubcatType) => {
		if (value) {
			return subCat.id === value;
		} else {
			return data ? subCat.id === data[0].subCategories[0].id : false;
		}
	}) as any;

	React.useEffect(() => {
		if (chosenSubCat) {
			setTask(
				produce((draft) => {
					draft.project = {
						projectId: chosenSubCat.projectId,
						subCatId: chosenSubCat.id,
					};
				})
			);
		}
	}, [chosenSubCat]);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button variant="outline" className="justify-start">
					{chosenSubCat ? (
						chosenSubCat.isProjectInbox ? (
							<Inbox className="mr-2 h-4 w-4" />
						) : (
							<Hash className="mr-2 h-4 w-4" />
						)
					) : (
						<Inbox className="mr-2 h-4 w-4" />
					)}
					{chosenSubCat ? <p>{chosenSubCat.projectName}</p> : <p>Task Inbox</p>}
					{chosenSubCat && !chosenSubCat.isDefault && (
						<>
							<Slash className="mx-2 h-3.5 w-3.5 rotate-[-20deg]" />
							{chosenSubCat.isProjectInbox ? (
								<Tag className="mr-2 h-4 w-4 rotate-90" />
							) : (
								<CornerDownRight className="mr-2 h-4 w-4" />
							)}
							<p>{chosenSubCat.name}</p>
						</>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
				<Command>
					<CommandInput placeholder="Type a project name" />
					<CommandList className="max-h-[220px]">
						<CommandEmpty className="py-6 text-center text-sm text-destructive">
							No project found
						</CommandEmpty>
						<CommandGroup>
							{data &&
								flattenedProjects.map((project) =>
									project.map((subCat: SubcatType) => (
										<CommandItem
											key={subCat.id}
											keywords={[subCat.name, subCat.projectName]}
											value={subCat.id}
											onSelect={(currentValue) => {
												setValue((prev) => {
													return currentValue;
												});
												setOpen(false);
											}}
											className={
												"!pointer-events-auto cursor-pointer justify-between px-2 !opacity-100"
											}
										>
											<div className="flex items-center">
												{subCat.isProjectInbox &&
													(subCat.isDefault ? (
														<Inbox className="mr-2 h-4 w-4" />
													) : (
														<Tag className="ml-6 mr-2 h-4 w-4 rotate-90" />
													))}
												{!subCat.isProjectInbox &&
													(subCat.isDefault ? (
														<Hash className="mr-2 h-4 w-4" />
													) : (
														<CornerDownRight className="ml-6 mr-2 h-4 w-4" />
													))}

												{subCat.isDefault ? subCat.projectName : subCat.name}
											</div>

											<Check
												className={cn(
													"mr-2 h-4 w-4",
													value == subCat.name ? "opacity-100" : "opacity-0"
												)}
											/>
										</CommandItem>
									))
								)}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}

export function FriendPicker({
	setTask,
	friends,
	values,
	setValues,
}: {
	setTask: React.Dispatch<React.SetStateAction<InsertTaskType>>;
	friends: FriendType[] | undefined;
	values: string[];
	setValues: React.Dispatch<React.SetStateAction<string[]>>;
}) {
	const [open, setOpen] = React.useState(false);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button variant="outline" className="">
					<Plus className="mr-2 h-4 w-4" /> Add friends
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[260px] p-0" side="top">
				<Command>
					<CommandList className="max-h-[220px] border-b pb-0.5">
						<CommandEmpty className="py-6 text-center text-sm text-destructive">
							No friend found
						</CommandEmpty>
						<CommandGroup>
							{friends &&
								friends.map((friend) => (
									<CommandItem
										key={friend.id}
										keywords={[friend.fullName || "", friend.userName || ""]}
										value={friend.id}
										onSelect={(currentValue) => {
											setValues((prev) => {
												if (prev.includes(currentValue)) {
													return prev.filter((i: string) => i !== currentValue);
												} else {
													return [...prev, currentValue];
												}
											});
										}}
										className={"!pointer-events-auto cursor-pointer !opacity-100"}
									>
										<Check
											className={cn(
												"mr-2 h-4 w-4",
												values.includes(friend.id) ? "opacity-100" : "opacity-0"
											)}
										/>
										<div className="flex items-center">
											<img
												src={friend.imageUrl}
												className="mr-2 h-6 w-6 rounded-full"
												alt={friend.fullName || "user image"}
											></img>
											<p>{friend.fullName || `@ ${friend.userName}`}</p>
										</div>
									</CommandItem>
								))}
						</CommandGroup>
					</CommandList>
					<CommandInput placeholder="Friend" />
				</Command>
			</PopoverContent>
		</Popover>
	);
}

export function DatePickerWithPresets({ setTask }: { setTask: React.Dispatch<React.SetStateAction<InsertTaskType>> }) {
	const [open, setOpen] = React.useState(false);
	const [date, setDate] = React.useState<Date>();
	const [month, setMonth] = React.useState<Date | undefined>();

	React.useEffect(() => {
		if (date) {
			setMonth(date);
		} else {
			setMonth(new Date());
		}
	}, [date]);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant={"outline"}
					className={cn("w-[240px] justify-start text-left font-normal", !date && "text-muted-foreground")}
				>
					{date && isToday(date) ? (
						<CalendarHeart className="mr-2 h-4 w-4" style={{ color: "var(--shad-green)" }} />
					) : (
						<CalendarIcon className="mr-2 h-4 w-4" />
					)}
					{date ? format(date, "PPP") : <span>Pick a date</span>}
				</Button>
			</PopoverTrigger>
			<RadixPopover.Anchor className="absolute left-[95px] w-[-65px]" />
			<PopoverContent className="flex w-auto flex-col space-y-2 p-2" side="right">
				<div className="flex flex-col">
					<Button
						variant="ghost"
						className="justify-between"
						onClick={() => {
							setDate(new Date());
							setTask(
								produce((draft) => {
									draft.task.date = stringifyDate(new Date());
								})
							);
							setOpen(false);
						}}
					>
						<div className="flex items-center">
							<CalendarHeart className="mr-2 h-4 w-4" style={{ color: "var(--shad-green)" }} /> Today
						</div>
						<p className="text-muted-foreground">
							{new Date().toLocaleDateString("en-US", { weekday: "short" })}
						</p>
					</Button>
					<Button
						variant="ghost"
						className="justify-between"
						onClick={() => {
							setDate(tomorrow());
							setTask(
								produce((draft) => {
									draft.task.date = stringifyDate(tomorrow());
								})
							);
							setOpen(false);
						}}
					>
						<div className="flex items-center">
							<Sun className="mr-2 h-4 w-4" style={{ color: "var(--shad-yellow)" }} /> Tomorrow
						</div>
						<p className="text-muted-foreground">
							{tomorrow().toLocaleDateString("en-US", { weekday: "short" })}
						</p>
					</Button>
					<Button
						variant="ghost"
						className="justify-start text-muted-foreground"
						onClick={() => {
							setDate(undefined);
							setTask(
								produce((draft) => {
									draft.task.date = null;
								})
							);
							setOpen(false);
						}}
					>
						<CircleSlash className="mr-2 h-4 w-4" /> No Date
					</Button>
				</div>
				<Separator />
				<Calendar
					mode="single"
					selected={date}
					onSelect={(calendarSelectedDate) => {
						if (calendarSelectedDate) {
							setDate(calendarSelectedDate);
							setTask(
								produce((draft) => {
									draft.task.date = stringifyDate(calendarSelectedDate);
								})
							);
						}
						setOpen(false);
					}}
					month={month}
					onMonthChange={setMonth}
					disabled={[{ before: new Date() }]}
					classNames={{
						row: "flex w-full mt-1",
					}}
				/>
			</PopoverContent>
		</Popover>
	);
}

export function TimePickerWithPresets({
	task,
	setTask,
}: {
	task: InsertTaskType;
	setTask: React.Dispatch<React.SetStateAction<InsertTaskType>>;
}) {
	const [open, setOpen] = React.useState(false);
	const [value, setValue] = React.useState("");
	const [cmdInput, setCmdInput] = React.useState("");

	React.useEffect(() => {
		if (!task.task.time) {
			setValue("");
		}
	}, [task.task.time]);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					disabled={!task.task.date}
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className={cn(
						"w-[125px] justify-start",
						(value === "" || value === "No Time") && "text-muted-foreground"
					)}
				>
					<Clock className="mr-2 h-4 w-4" />
					{value !== "" && value !== "No Time" ? value : "Time"}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[160px] p-0">
				<Command>
					<CommandInput placeholder="Time" onValueChange={setCmdInput} />
					<CommandList className="max-h-[220px]">
						<CommandEmpty className="py-6 text-center text-sm text-destructive">Invalid time</CommandEmpty>
						<CommandGroup>
							<CommandItem
								key={"notimekey"}
								value={"No Time"}
								onSelect={(currentValue) => {
									setValue(currentValue === value ? "" : currentValue);
									setTask(
										produce((draft) => {
											draft.task.time = null;
										})
									);
									setOpen(false);
								}}
								className={"!pointer-events-auto h-12 cursor-pointer !opacity-100"}
							>
								<Check
									className={cn("mr-2 h-4 w-4", value === "notimekey" ? "opacity-100" : "opacity-0")}
								/>
								No Time
								<CircleSlash className="ml-2 h-4 w-4" />
							</CommandItem>

							{cmdInput &&
								isValidTime(cmdInput) &&
								isNotQuarterTime(formatTimeIntoTwoDigits(cmdInput)) && (
									<CommandItem
										key={cmdInput}
										value={formatTimeIntoTwoDigits(cmdInput)}
										onSelect={(currentValue) => {
											setValue(currentValue === value ? "" : currentValue);
											setTask(
												produce((draft) => {
													draft.task.time = currentValue;
												})
											);
											setOpen(false);
										}}
										className={"!pointer-events-auto cursor-pointer !opacity-100"}
									>
										<Check
											className={cn(
												"mr-2 h-4 w-4",
												value === cmdInput ? "opacity-100" : "opacity-0"
											)}
										/>
										{formatTimeIntoTwoDigits(cmdInput)}
									</CommandItem>
								)}

							{generatedTimes.map((generatedTime) => (
								<CommandItem
									key={generatedTime.value}
									value={generatedTime.value}
									onSelect={(currentValue) => {
										setValue(currentValue === value ? "" : currentValue);
										setTask(
											produce((draft) => {
												draft.task.time = currentValue;
											})
										);
										setOpen(false);
									}}
									className={"!pointer-events-auto cursor-pointer !opacity-100"}
								>
									<Check
										className={cn(
											"mr-2 h-4 w-4",
											value === generatedTime.value ? "opacity-100" : "opacity-0"
										)}
									/>
									{generatedTime.label}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
