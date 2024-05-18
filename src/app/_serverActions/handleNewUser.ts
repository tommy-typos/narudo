"use server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import { projectSubCategories, projects, users } from "@/drizzle/schema";
import { genId } from "@/lib/generateId";

export async function handleNewUser() {
	const clerkUser = auth();
	if (!clerkUser.userId) throw new Error("Unauthorized");

	const user = (
		await db
			.select()
			.from(users)
			.where(eq(users.id, clerkUser.userId as string))
	)[0];

	let isNewUser = false;

	if (!user) {
		isNewUser = true;
		const user = (
			await db
				.insert(users)
				.values({
					id: clerkUser.userId,
				})
				.returning({ id: users.id })
		)[0];

		const projectId = genId();

		await db.insert(projects).values({
			id: projectId,
			isInbox: true,
			name: "Task Inbox",
			ownerId: user.id,
		});

		await db.insert(projectSubCategories).values({
			id: genId(),
			isDefault: true,
			name: "Default",
			ownerId: user.id,
			projectId: projectId,
		});
	}

	return {
		isNewUser,
	};
}
