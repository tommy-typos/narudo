"use server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/drizzle/db";
import { eq, sql } from "drizzle-orm";
import { notifications, projectSubCategories, projects, tasks, users } from "@/drizzle/schema";
import { genId } from "@/lib/generateId";

export async function toggleTask(taskId: string) {
	const clerkUser = auth();
	if (!clerkUser.userId) throw new Error("Unauthorized");

	await db
		.update(tasks)
		.set({
			isCompleted: sql`not ${tasks.isCompleted}`,
		})
		.where(eq(tasks.id, taskId));
}

export async function toggleNotification(notifId: number) {
	const clerkUser = auth();
	if (!clerkUser.userId) throw new Error("Unauthorized");

	await db
		.update(notifications)
		.set({
			isRead: sql`not ${notifications.isRead}`,
		})
		.where(eq(notifications.id, notifId));
}
