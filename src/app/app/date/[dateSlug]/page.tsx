"use client";
import { useParams, usePathname } from "next/navigation";
import { CalendarDays, CheckCheck, CircleOff, Group, SlidersHorizontal, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TaskType, getProjects, getTasksByDate, retrieveNote, saveOrUpdateNote } from "@/app/_serverActions/queries";
import { isToday, stringifyDate } from "@/components/client/addTask";
import { Skeleton } from "@/components/ui/skeleton";
import { TaskCardMiniView } from "@/components/client/taskCardMini";
import { Textarea } from "@/components/ui/textarea";
import { addDays, format } from "date-fns";

export default function Home() {
	const params = useParams<{ dateSlug: string }>();

	const dateCreatedFromRoute = new Date(params.dateSlug);
	if (isNaN(dateCreatedFromRoute.getTime())) {
		return;
	} else {
		return <DateWrapper />;
	}
}

function DateWrapper() {
	const params = useParams<{ dateSlug: string }>();
	const dateFromRoute = new Date(params.dateSlug);

	const pathName = usePathname();

	const { data: projectsList } = useQuery({
		queryKey: ["projects"],
		queryFn: () => getProjects(),
	});

	const taskQuery = useQuery({
		queryKey: [pathName],
		queryFn: () => getTasksByDate(pathName.split("/").at(-1) as string),
	});
	return (
		<>
			<div className="mb-4 flex items-center justify-between">
				<div className={cn("flex items-center", isToday(dateFromRoute) && "text-primary")}>
					<CalendarDays className="mr-2" />
					{isToday(dateFromRoute) && (
						<>
							<h3 className="shad-h3">Today</h3>
							<div
								className={cn(
									"mx-3 h-1 w-1 rounded-full bg-foreground",
									isToday(dateFromRoute) && "bg-primary"
								)}
							></div>
						</>
					)}
					<h3 className="shad-h3">{format(dateFromRoute, "MMMM d, yyyy")}</h3>
				</div>

				<Popover>
					<PopoverTrigger asChild>
						{/* <Button variant="ghost">
							<SlidersHorizontal className="mr-2 h-4 w-4" /> View
							<span className="sr-only">Settings and Stuff</span>
						</Button> */}
					</PopoverTrigger>
					<PopoverContent className="flex w-72 flex-col" align="end">
						<ViewOption>
							<CheckCheck className="mr-2 h-4 w-4" /> Show Completed
						</ViewOption>
						<ViewOption>
							<Group className="mr-2 h-4 w-4" />
							Group by project
						</ViewOption>
						<ViewOption className="ml-6">
							<CircleOff className="mr-2 h-4 w-4" />
							Hide empty projects
						</ViewOption>
					</PopoverContent>
				</Popover>
			</div>
			<div className="flex justify-between gap-4">
				<div className="flex-1">
					<h3 className="shad-h3 mb-4">Tasks</h3>
					<div className="flex flex-col gap-2">
						{taskQuery.isLoading && (
							<>
								<div className={cn("flex items-center rounded p-2 hover:cursor-pointer")}>
									<Skeleton className="ml-2 mr-4 h-6 min-w-6" />
									<div className="flex w-full flex-col gap-2">
										<Skeleton className="mb-1 h-4 w-[80px] leading-7" />
										<Skeleton className="mb-1 h-4 w-[130px] leading-7" />
									</div>
								</div>
								<div className={cn("flex items-center rounded p-2 hover:cursor-pointer")}>
									<Skeleton className="ml-2 mr-4 h-6 min-w-6" />
									<div className="flex w-full flex-col gap-2">
										<Skeleton className="mb-1 h-4 w-[70px] leading-7" />
										<Skeleton className="mb-1 h-4 w-[120px] leading-7" />
									</div>
								</div>
								<div className={cn("flex items-center rounded p-2 hover:cursor-pointer")}>
									<Skeleton className="ml-2 mr-4 h-6 min-w-6" />
									<div className="flex w-full flex-col gap-2">
										<Skeleton className="mb-1 h-4 w-[80px] leading-7" />
										<Skeleton className="mb-1 h-4 w-[130px] leading-7" />
									</div>
								</div>
							</>
						)}
						{taskQuery.data && projectsList && (
							<>
								{taskQuery.data.map((task) => (
									<TaskCardMiniView key={task.task.id} task={task} projectsList={projectsList} />
								))}
							</>
						)}
						{taskQuery.data?.length === 0 && (
							<>
								<div className="flex w-full items-center">
									<p className="text-muted-foreground">No task found for this date.</p>
								</div>
							</>
						)}
						{/* <div className="flex items-center text-sm">
							<Plus className="mr-2 h-4 w-4 text-primary" /> Add Task
						</div>
						<Accordion type="single" collapsible>
							<AccordionItem value="delegated-to-friends">
								<AccordionTrigger className="py-2 text-sm hover:no-underline">
									Delegated to friends (15)
								</AccordionTrigger>
								<AccordionContent className="flex flex-col gap-2 pt-2">
									<TaskCardOnTodayView />
									<TaskCardOnTodayView />
								</AccordionContent>
							</AccordionItem>
							<AccordionItem value="challenges">
								<AccordionTrigger className="py-2 text-sm hover:no-underline">
									Challenges (15)
								</AccordionTrigger>
								<AccordionContent className="flex flex-col gap-2 pt-2">
									<TaskCardOnTodayView />
									<TaskCardOnTodayView />
								</AccordionContent>
							</AccordionItem>
							<AccordionItem value="completed">
								<AccordionTrigger className="py-2 text-sm hover:no-underline">
									Completed (15)
								</AccordionTrigger>
								<AccordionContent className="flex flex-col gap-2 pt-2">
									<TaskCardOnTodayView />
									<TaskCardOnTodayView />
								</AccordionContent>
							</AccordionItem>
						</Accordion> */}
					</div>
				</div>
				<div className="flex-1">
					<h3 className="shad-h3 mb-4">Notes</h3>
					<TemporaryNote />
				</div>
			</div>
		</>
	);
}

function TemporaryNote() {
	const timeoutRef = React.useRef<React.MutableRefObject<NodeJS.Timeout>>(null);
	const [value, setValue] = React.useState("");

	const { dateSlug } = useParams();

	const noteQuery = useQuery({
		queryKey: ["notes", dateSlug],
		queryFn: () => retrieveNote(dateSlug as string),
	});

	// TODO ::: learn when dateSlug can be string[] rather than just string, we should be careful

	const noteMutation = useMutation({
		mutationFn: ({
			date,
			lastModifiedTimestamp,
			content,
		}: {
			date: string;
			lastModifiedTimestamp: Date;
			content: string;
		}) => saveOrUpdateNote(date, lastModifiedTimestamp, content),
	});

	React.useEffect(() => {
		if (noteQuery.data) {
			setValue(() => {
				return noteQuery.data[0]?.content || "";
			});
		}
	}, [noteQuery.data]);

	return (
		<>
			{noteQuery.isPending && (
				<div className="flex min-h-96 w-full resize-none flex-col gap-2 border p-4">
					<Skeleton className="h-8 w-4/5 rounded-sm" />
					<Skeleton className="h-4 w-3/5 rounded-sm" />
					<Skeleton className="h-4 w-3/4 rounded-sm" />
					<Skeleton className="h-6 w-2/4 rounded-sm" />
					<Skeleton className="h-4 w-11/12 rounded-sm" />
					<Skeleton className="h-4 w-8/12 rounded-sm" />
				</div>
			)}
			{noteQuery.data && (
				<Textarea
					placeholder="Start typing..."
					value={value}
					className="min-h-96 w-full resize-none border !ring-0 !ring-offset-0"
					onChange={(e) => {
						setValue(e.target.value);
						debounce(
							() => {
								noteMutation.mutate({
									date: dateSlug as string,
									lastModifiedTimestamp: new Date(),
									content: e.target.value,
								});
							},
							undefined,
							timeoutRef as any
						)();
					}}
				/>
			)}
		</>
	);
}

const debounce = (cb: Function, delay = 1000, timeoutRef: React.MutableRefObject<NodeJS.Timeout>) => {
	return (...args: any[]) => {
		clearTimeout(timeoutRef.current);
		timeoutRef.current = setTimeout(() => {
			cb(...args);
		}, delay);
	};
};

type ViewOptionProps = {
	className?: string;
	children: React.ReactNode;
};

function ViewOption({ children, className }: ViewOptionProps) {
	const [active, setActive] = React.useState<boolean>(false);
	return (
		<Button
			variant="ghost"
			className={cn("items-center justify-between", !active && "opacity-50", className)}
			onClick={() => setActive((prev) => !prev)}
		>
			<div className="flex items-center">{children}</div>
			{!active ? <ToggleLeft className="h-4 w-4" /> : <ToggleRight className="h-4 w-4" />}
		</Button>
	);
}

/***
 * TODO :::
 * go to overdues > finish a task > go to date of the finished task > it is still shown as not finished. Gotta fix this.
 */
