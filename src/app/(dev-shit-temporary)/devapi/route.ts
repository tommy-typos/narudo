export const dynamic = "force-dynamic";

import { addNewTask } from "@/app/_serverActions/addNewTask";
import {
	getFriends,
	getNotificationCount,
	getNotifications,
	getOverdueTasks,
	getOverdueTasksCount,
	getProjects,
	getTasksByDate,
	getTasksByFriend,
	getTasksBySubCategory,
} from "@/app/_serverActions/queries";
import { toggleTask } from "@/app/_serverActions/toggleTaskNotification";
import { db } from "@/drizzle/db";
import {
	assignees_x_tasks,
	challengeParticipants,
	dailyChallenges,
	friendRequests,
	friendships,
	notes,
	notifications,
	projectSubCategories,
	projects,
	taskLocations,
	tasks,
	users,
} from "@/drizzle/schema";
import { genId } from "@/lib/generateId";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { and, eq, inArray, ne, or, sql } from "drizzle-orm";

export async function GET(request: Request) {
	const clerkUser = auth();
	if (!clerkUser.userId) throw new Error("Unauthorized");

	if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "test") {
		throw new Error("Only for development");
	} else {
		let data;

		try {
			// ======================================================================================================== //
			// ======================================================================================================== //
			// ======================================================================================================== //
			// ======================================================================================================== //
			// .
			// ======================================================================================================== //
			// ======================================================================================================== //
			// ======================================================================================================== //
			// ======================================================================================================== //
		} catch (e: any) {
			return Response.json({ error: e.message }, { status: 400 });
		}

		return Response.json({ data });
	}
}
