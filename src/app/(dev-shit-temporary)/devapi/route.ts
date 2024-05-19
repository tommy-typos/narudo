export const dynamic = "force-dynamic";

import { addNewTask } from "@/app/_serverActions/addNewTask";
import { getFriends, getProjects, getTasksByDate } from "@/app/_serverActions/queries";
import { toggleTask } from "@/app/_serverActions/toggleTask";
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
			// const user = (await db.insert(users).values({ id: randomUUID() }).returning())[0];
			// console.log(user.id);
			// const user = { id: "user_2gFWJI9NSwt4RRvn98W6gsVGofP" };
			// data = await db
			// 	.update(users)
			// 	.set({
			// 		ninjaScore: sql`${users.ninjaScore} + 10`,
			// 	}).where(eq(users.id, clerkUser.userId))
			// data = await db
			// 	.select({
			// 		id: users.id,
			// 	})
			// 	.from(users)
			// 	.where(ne(users.id, clerkUser.userId))
			// 	.innerJoin(
			// 		friendships,
			// 		or(eq(friendships.userId_1, clerkUser.userId), eq(friendships.userId_2, clerkUser.userId))
			// 	)
			// data = await getProjects();
			// const user = await clerkClient.users.getUser("user_2gFWJI9NSwt4RRvn98W6gsVGofP");
			// data = {
			// 	id: user.id,
			// 	userName: user.username,
			// 	firstName: user.firstName,
			// 	lastName: user.lastName,
			// 	imageUrl: user.imageUrl,
			/**
			 * gmail 2
			user_2gFWJI9NSwt4RRvn98W6gsVGofP

			gmail 1
			user_2geNcwNuJb3gMrUW2YePEvdybXf

			iqaqpg micro
			user_2geT4BCtRGPRSqwabjAzQ9vahGp
			 */
			// }
			// data = await clerkClient.users.getUserList({
			// 	userId: ['user_2geT4BCtRGPRSqwabjAzQ9vahGp', 'user_2geNcwNuJb3gMrUW2YePEvdybXf']
			// })
			// data = await getTasksByDate("2024-05-19");
			// data = await toggleTask("27e19e20-c9f5-4ef0-a4bd-5b06ba26a99b")
			// {id: users.id, countProject: sql`array_agg(${projects.id})`}
			// data = await db
			// 	.select({userId: users.id, projectId: projects.id, subCatId: projectSubCategories.id})
			// 	.from(users)
			// 	.where(
			// 		and(
			// 			inArray(users.id, ["user_2gFWJI9NSwt4RRvn98W6gsVGofP", "user_2geNcwNuJb3gMrUW2YePEvdybXf"]),
			// 			eq(projects.isInbox, true),
			// 			eq(projectSubCategories.isDefault, true)
			// 		)
			// 	)
			// 	.leftJoin(projects, eq(projects.ownerId, users.id))
			// 	.leftJoin(projectSubCategories, eq(projects.id, projectSubCategories.projectId));
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
			// 	  "user_2geNcwNuJb3gMrUW2YePEvdybXf"
			// 	],
			// 	"project": {
			// 	  "projectId": "a9d699e3-e113-4d04-8cfe-aef9d47ca14b",
			// 	  "subCatId": "5284a9b7-4f09-451c-8395-7f0f598d907f"
			// 	}
			//   })
			// data = await getTasksByDate('2024-05-19')
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
