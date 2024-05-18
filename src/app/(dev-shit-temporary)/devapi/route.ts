export const dynamic = "force-dynamic";

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
import { auth } from "@clerk/nextjs/server";
import { eq, sql } from "drizzle-orm";

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
			// 	.where(eq(users.id, user.id))
			// 	.returning();
			// db.insert(tasks).values({
			// 	createdAt: new Date(),
			// 	id: genId(),
			// 	ownerId: user.id,
			// 	title: 'task 1',
			// 	date: '2024-05-18',
			// 	time: '17:47',
			// 	description: 'very first task',
			// }).prepare("statement_name")
			// data = await db.query.projects.findMany({
			// 	where: eq(projects.ownerId, clerkUser.userId),
			// 	with: {
			// 		subCategories: {
			// 			columns: {
			// 				ownerId: false
			// 			}
			// 		}
			// 	},
			// 	columns: {
			// 		ownerId: false
			// 	}
			// })
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
