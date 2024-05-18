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

export async function GET(request: Request) {
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
			const user = { id: "8d91fdab-203a-4252-8590-dc4894426d8f" };

			const task = await db
				.insert(tasks)
				.values({
					createdAt: new Date(),
					title: "first note",
					id: genId(),
					ownerId: user.id,
					date: "2000-03-19",
					time: "21:42",
				})
				.returning();

			data = task;

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
