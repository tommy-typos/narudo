"use server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "@/drizzle/db";
import { InferInsertModel, and, eq, inArray, or } from "drizzle-orm";
import {
	assignees_x_tasks,
	notifications,
	projectSubCategories,
	projects,
	taskLocations,
	tasks,
	users,
} from "@/drizzle/schema";
import { genId } from "@/lib/generateId";
import { Prettify } from "@/lib/someTypes";

type UpdateTaskType = {
	id: string;
	title: string;
	description: string;
	date: string;
	time: string;
	projectId: string;
	subCatId: string;
};

export async function updateTask(data: UpdateTaskType) {
	const clerkUser = auth();
	if (!clerkUser.userId) throw new Error("Unauthorized");

	// check if user is the owner or an assignee of the task
	const exists = await db
		.select()
		.from(tasks)
		.leftJoin(assignees_x_tasks, eq(tasks.id, assignees_x_tasks.taskId))
		.where(or(eq(tasks.ownerId, clerkUser.userId), eq(assignees_x_tasks.assigneeId, clerkUser.userId)));

	if (exists.length === 0) {
		throw new Error("Not a member of the task");
	}

	await db
		.update(tasks)
		.set({
			title: data.title,
			description: data.description,
			date: data.date,
			time: data.time,
		})
		.where(eq(tasks.id, data.id));

	await db
		.update(taskLocations)
		.set({
			projectId: data.projectId,
			projectSubCatId: data.subCatId,
		})
		.where(and(eq(taskLocations.taskId, data.id), eq(taskLocations.userId, clerkUser.userId)));
}

export async function deleteTask(id: string) {
	const clerkUser = auth();
	if (!clerkUser.userId) throw new Error("Unauthorized");

	// check if user is the owner or an assignee of the task
	const exists = await db
		.select()
		.from(tasks)
		.leftJoin(assignees_x_tasks, eq(tasks.id, assignees_x_tasks.taskId))
		.where(or(eq(tasks.ownerId, clerkUser.userId), eq(assignees_x_tasks.assigneeId, clerkUser.userId)));

	if (exists.length === 0) {
		throw new Error("Not a member of the task");
	}

	// delete assignees > task locations > task.
	// TODO ::: set proper cascade rules so u dont do these manually.
	await db.delete(assignees_x_tasks).where(eq(assignees_x_tasks.taskId, id));

	await db.delete(taskLocations).where(eq(taskLocations.taskId, id));

	await db.delete(tasks).where(eq(tasks.id, id));
}
