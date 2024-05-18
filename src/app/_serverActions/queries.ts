"use server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "@/drizzle/db";
import { InferInsertModel, eq, ne, or } from "drizzle-orm";
import { assignees_x_tasks, friendships, projectSubCategories, projects, tasks, users } from "@/drizzle/schema";
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

	const friendIds = await db
		.select({
			id: users.id,
		})
		.from(users)
		.where(ne(users.id, clerkUser.userId))
		.leftJoin(
			friendships,
			or(eq(friendships.userId_1, clerkUser.userId), eq(friendships.userId_2, clerkUser.userId))
		)
		.groupBy(users.id);

	const friends = await clerkClient.users.getUserList({
		userId: friendIds.map((item) => item.id),
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
