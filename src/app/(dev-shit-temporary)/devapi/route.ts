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

export async function GET(request: Request) {
	if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "test") {
		throw new Error("Only for development");
	} else {
		// ======================================================================== //
		// ======================================================================== //
		// ======================================================================== //

		const data = {
			message: "hi",
		};

		return Response.json({ data });
	}
}
