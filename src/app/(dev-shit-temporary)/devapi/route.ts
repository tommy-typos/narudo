export const dynamic = "force-dynamic";

import { getFriends, getProjects } from "@/app/_serverActions/queries";
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
import { eq, ne, or, sql } from "drizzle-orm";

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
			// 	})
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
			// }
			// data = await clerkClient.users.getUserList({
			// 	userId: ['user_2geT4BCtRGPRSqwabjAzQ9vahGp', 'user_2geNcwNuJb3gMrUW2YePEvdybXf']
			// })
			// data = await getFriends()
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
