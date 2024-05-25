export const dynamic = "force-dynamic";

import { addNewTask } from "@/app/_serverActions/addNewTask";
import {
	getFriends,
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
			// 		ninjaScore: sql`${users.ninjaScore} + 10`,
			// data = await addNewTask({
			// 	task: {
			// 	  "date": "2024-05-19",
			// 	  "id": "a9d699e3-e113-4d04-8cfe-aef9d47ca14b",
			// 	  createdAt: new Date(),
			// 	  "title": "naemoftask",
			// 	  "description": "",
			// 	  "time": null,
			// 	  "isTogether": true,
			// 	  "isAssignedToSb": false
			// 	},
			// 	"assignees": [
			// 	  "user_2geNcwNuJb3gMrUW2YePEvdybXf",
			// 	  "user_2geT4BCtRGPRSqwabjAzQ9vahGp"
			// 	],
			// 	"project": {
			// 	  "projectId": "a9d699e3-e113-4d04-8cfe-aef9d47ca14b",
			// 	  "subCatId": "5284a9b7-4f09-451c-8395-7f0f598d907f"
			// 	}
			//   })
			// const clerkUsers = await clerkClient.users.getUserList();
			// data =  clerkUsers.data.map((item) => ({
			// 	userId: item.id,
			// 	userName: item.username,
			// 	firstName: item.firstName,
			// 	lastName: item.lastName,
			// 	fullName: item.fullName,
			// 	imageUrl: item.imageUrl,
			// 	hasImage: item.hasImage,
			// }));
			// data = await getTasksBySubCategory('5d8a9e54-a962-49ae-b145-a28d4662c58d');
			// data = await getTasksBySubCategory('a70e7615-27a3-43c0-a397-0788cc770088'); // task inbox > default
			// data = await getOverdueTasks(new Date());
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
