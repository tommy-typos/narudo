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
import { eq, sql } from "drizzle-orm";

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
			const taskId = "a7badf68-7a03-4c2a-b858-82fd2267f0b7";

			data = await db
				.update(users)
				.set({
					ninjaScore: sql`${users.ninjaScore} + 10`,
				})
				.where(eq(users.id, user.id))
				.returning();

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
