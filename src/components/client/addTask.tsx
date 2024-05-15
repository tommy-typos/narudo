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
import { CalendarHeart, CircleSlash, Clock, Plus, Sun } from "lucide-react";
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

export function AddTask() {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="ghost">
					<Plus className="mr-2 h-4 w-4" />
					Add Task
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<div className="flex flex-col gap-2">
					<Input placeholder="Task name" className="border-0 text-xl !ring-0 !ring-offset-0" />
					<Textarea placeholder="Description" className="min-h-[120px] resize-none !ring-0 !ring-offset-0" />
					<div className="flex justify-between">
						<DatePickerWithPresets />
						<TimePickerWithPresets />
					</div>
				</div>
				<DialogFooter>
					<Button variant="secondary">Cancel</Button>
					<Button>Add task</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export function DatePickerWithPresets() {
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
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant={"outline"}
					className={cn("w-[240px] justify-start text-left font-normal", !date && "text-muted-foreground")}
				>
					<CalendarIcon className="mr-2 h-4 w-4" />
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
						}}
					>
						<CircleSlash className="mr-2 h-4 w-4" /> No Date
					</Button>
				</div>
				<Separator />
				<Calendar
					mode="single"
					selected={date}
					onSelect={setDate}
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

export function TimePickerWithPresets() {
	const [open, setOpen] = React.useState(false);
	const [value, setValue] = React.useState("");
	const [cmdInput, setCmdInput] = React.useState("");

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className={cn(
						"w-[120px] justify-start",
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

// ##################################################################### //
// date utils //
// ##################################################################### //

function tomorrow(): Date {
	const today = new Date();
	const tomorrow = new Date(today);
	tomorrow.setDate(today.getDate() + 1);

	return tomorrow;
}

function generateTimes() {
	const times = [];
	for (let hour = 0; hour < 24; hour++) {
		for (let minute = 0; minute < 60; minute += 15) {
			const formattedHour = hour.toString().padStart(2, "0");
			const formattedMinute = minute.toString().padStart(2, "0");
			times.push({
				value: `${formattedHour}:${formattedMinute}`,
				label: `${formattedHour}:${formattedMinute}`,
			});
		}
	}
	return times;
}

function insertTimeToGeneratedTimes(newTime: TimeType, timesArray: TimeType[]) {
	// Find the correct position to insert the new time
	let insertIndex = 0;
	for (let i = 0; i < timesArray.length; i++) {
		if (newTime.value < timesArray[i].value) {
			insertIndex = i;
			break;
		}
	}
	// Insert the new time at the correct position
	timesArray.splice(insertIndex, 0, newTime);
	return timesArray;
}

function isValidTime(input: string) {
	// Check if the input matches the format HH:MM
	const timeRegex = /^(0?[0-9]|1[0-9]|2[0-3]):([0-5]?[0-9])$/;
	if (!timeRegex.test(input)) {
		return false; // Invalid format
	}

	// Split the input into hours and minutes
	const [hours, minutes] = input.split(":");

	// Convert hours and minutes to integers
	const hoursInt = parseInt(hours, 10);
	const minutesInt = parseInt(minutes, 10);

	// Check if hours and minutes are within the valid range
	if (hoursInt < 0 || hoursInt > 23 || minutesInt < 0 || minutesInt > 59) {
		return false; // Invalid range
	}

	return true; // Input is valid
}

function formatTimeIntoTwoDigits(input: string) {
	const [hours, minutes] = input.split(":");

	const formattedHours = hours.padStart(2, "0");
	const formattedMinutes = minutes.padStart(2, "0");

	return `${formattedHours}:${formattedMinutes}`;
}

function isNotQuarterTime(input: string) {
	// List of minute endings to check against
	const endingsToAvoid = ["00", "15", "30", "45"];

	// Extract the last two characters (minutes) from the input
	const minutes = input.slice(-2);

	// Check if the minutes do not end with any of the endings to avoid
	return !endingsToAvoid.includes(minutes);
}

const generatedTimes = generateTimes();

type TimeType = {
	value: string;
	label: string;
};

function getTimes(cmdInput: string): TimeType[] {
	if (cmdInput && isValidTime(cmdInput) && isNotQuarterTime(formatTimeIntoTwoDigits(cmdInput))) {
		return insertTimeToGeneratedTimes(
			{ value: formatTimeIntoTwoDigits(cmdInput), label: formatTimeIntoTwoDigits(cmdInput) },
			generateTimes()
		);
	} else {
		return generateTimes();
	}
}
