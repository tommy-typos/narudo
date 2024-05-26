"use server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "@/drizzle/db";
import { InferInsertModel, and, eq, inArray } from "drizzle-orm";
import {
	assignees_x_tasks,
	dailyChallenges,
	notifications,
	projectSubCategories,
	projects,
	taskLocations,
	tasks,
	users,
} from "@/drizzle/schema";
import { genId } from "@/lib/generateId";
import { Prettify } from "@/lib/someTypes";

export async function createNewChallenge(title: string, createdAt: string) {
	const clerkUser = auth();
	if (!clerkUser.userId) throw new Error("Unauthorized");

	await db.insert(dailyChallenges).values({
		id: genId(),
		ownerId: clerkUser.userId,
		title: title,
		createdAt: createdAt,
	});
}
