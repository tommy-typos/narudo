"use client";
import { useParams, usePathname } from "next/navigation";
import { CalendarDays, CheckCheck, SlidersHorizontal, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import * as React from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getTasksByDate, retrieveNote, saveOrUpdateNote } from "@/app/_serverActions/queries";
import { Skeleton } from "@/components/ui/skeleton";
import { MiniTasksSkeleton, TaskCardMiniView } from "@/components/client/taskCardMini";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { isToday } from "@/lib/dateUtils";
import { useProjectsQuery } from "@/lib/queries";

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
	const [showCompleted, setShowCompleted] = React.useState(false);

	const pathName = usePathname();

	const { data: projectsList } = useProjectsQuery();

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
			<div className="flex flex-1 justify-between gap-4">
				<div className="flex-1">
					<h3 className="shad-h3 mb-4">Tasks</h3>
					<div className="flex flex-col gap-2">
						{taskQuery.isLoading && <MiniTasksSkeleton />}
						{taskQuery.data && projectsList && (
							<>
								{taskQuery.data
									.filter((item) => {
										if (showCompleted) {
											return true;
										}
										return !item.task.isCompleted;
									})
									.map((task) => (
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
					</div>
				</div>
				<div className="flex flex-1 flex-col">
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

	const pathName = usePathname();
	const { dateSlug } = useParams();

	const noteQuery = useQuery({
		queryKey: [`${pathName}+++notes`],
		queryFn: () => retrieveNote(pathName.split("/").at(-1) as string),
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
					className="min-h-96 w-full flex-1 resize-none rounded-md border bg-muted/40 !ring-0 !ring-offset-0"
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
