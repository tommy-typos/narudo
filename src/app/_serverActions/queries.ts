"use server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "@/drizzle/db";
import { InferInsertModel, and, eq, ne, or, sql } from "drizzle-orm";
import {
	assignees_x_tasks,
	friendships,
	projectSubCategories,
	projects,
	taskLocations,
	tasks,
	users,
} from "@/drizzle/schema";
import { genId } from "@/lib/generateId";
import { Prettify } from "@/lib/someTypes";

export async function getProjects() {
	const clerkUser = auth();
	if (!clerkUser.userId) throw new Error("Unauthorized");

	const data = await db.query.projects.findMany({
		where: eq(projects.ownerId, clerkUser.userId),
		with: {
			subCategories: {
				columns: {
					ownerId: false,
				},
				orderBy: (subCat, { desc }) => [desc(subCat.isDefault)],
			},
		},
		columns: {
			ownerId: false,
		},
		orderBy: (projects, { desc }) => [desc(projects.isInbox)],
	});

	return data;
}

export async function getFriends() {
	const clerkUser = auth();
	if (!clerkUser.userId) throw new Error("Unauthorized");

	const friendshipsList = await db
		.select()
		.from(friendships)
		.where(or(eq(friendships.userId_1, clerkUser.userId), eq(friendships.userId_2, clerkUser.userId)));

	const friends = await clerkClient.users.getUserList({
		userId: friendshipsList.map((item) => (item.userId_1 !== clerkUser.userId ? item.userId_1 : item.userId_2)),
	});

	const data = friends.data.map((friend) => ({
		id: friend.id,
		userName: friend.username,
		firstName: friend.firstName,
		lastName: friend.lastName,
		imageUrl: friend.imageUrl,
		hasImage: friend.hasImage,
	}));

	return data;
}

export async function getTasksByDate(date: string) {
	const clerkUser = auth();
	if (!clerkUser.userId) throw new Error("Unauthorized");

	/** Get all tasks by date that user is owner or assignee. */

	const sq = db
		.select({ id: assignees_x_tasks.taskId, assigneeId: assignees_x_tasks.assigneeId })
		.from(assignees_x_tasks)
		.where(eq(assignees_x_tasks.assigneeId, clerkUser.userId))
		.as("sq");

	const data = await db
		.select()
		.from(tasks)
		.leftJoin(sq, eq(tasks.id, sq.id))
		.leftJoin(taskLocations, eq(tasks.id, taskLocations.taskId))
		.where(and(eq(tasks.date, date), or(eq(tasks.ownerId, clerkUser.userId), eq(sq.assigneeId, clerkUser.userId))));

	return data;
}
