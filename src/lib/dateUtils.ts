// ##################################################################### //
// date utils //
// ##################################################################### //

export function tomorrow(): Date {
	const today = new Date();
	const tomorrow = new Date(today);
	tomorrow.setDate(today.getDate() + 1);

	return tomorrow;
}

export function generateTimes() {
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

// export function insertTimeToGeneratedTimes(newTime: TimeType, timesArray: TimeType[]) {
// 	// Find the correct position to insert the new time
// 	let insertIndex = 0;
// 	for (let i = 0; i < timesArray.length; i++) {
// 		if (newTime.value < timesArray[i].value) {
// 			insertIndex = i;
// 			break;
// 		}
// 	}
// 	// Insert the new time at the correct position
// 	timesArray.splice(insertIndex, 0, newTime);
// 	return timesArray;
// }

export function isValidTime(input: string) {
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

export function formatTimeIntoTwoDigits(input: string) {
	const [hours, minutes] = input.split(":");

	const formattedHours = hours.padStart(2, "0");
	const formattedMinutes = minutes.padStart(2, "0");

	return `${formattedHours}:${formattedMinutes}`;
}

export function isNotQuarterTime(input: string) {
	// List of minute endings to check against
	const endingsToAvoid = ["00", "15", "30", "45"];

	// Extract the last two characters (minutes) from the input
	const minutes = input.slice(-2);

	// Check if the minutes do not end with any of the endings to avoid
	return !endingsToAvoid.includes(minutes);
}

export const generatedTimes = generateTimes();
//  type TimeType = {
// 	value: string;
// 	label: string;
// };

// export function getTimes(cmdInput: string): TimeType[] {
// 	if (cmdInput && isValidTime(cmdInput) && isNotQuarterTime(formatTimeIntoTwoDigits(cmdInput))) {
// 		return insertTimeToGeneratedTimes(
// 			{ value: formatTimeIntoTwoDigits(cmdInput), label: formatTimeIntoTwoDigits(cmdInput) },
// 			generateTimes()
// 		);
// 	} else {
// 		return generateTimes();
// 	}
// }

export function stringifyDate(date: Date) {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() returns 0-11, so we add 1
	const day = String(date.getDate()).padStart(2, "0"); // getDate() returns the day of the month

	return `${year}-${month}-${day}`;
}

export function isToday(date: Date) {
	const today = new Date();
	return (
		date.getDate() === today.getDate() &&
		date.getMonth() === today.getMonth() &&
		date.getFullYear() === today.getFullYear()
	);
}
