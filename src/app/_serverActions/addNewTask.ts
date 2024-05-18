"use server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/drizzle/db";
import { InferInsertModel, eq } from "drizzle-orm";
import { assignees_x_tasks, projectSubCategories, projects, tasks, users } from "@/drizzle/schema";
import { genId } from "@/lib/generateId";
import { Prettify } from "@/lib/someTypes";

type InferInsertAssigneesXTasks = Prettify<InferInsertModel<typeof assignees_x_tasks>>;
type InferInsertTask = Prettify<Omit<InferInsertModel<typeof tasks>, "ownerId" | "isCompleted" | "commentsAndLogs">>;

export type InsertTaskType = Prettify<{
	task: InferInsertTask;
	assignees: string[];
	project: {
		projectId: string;
		subCatId: string;
	};
}>;

export async function addNewTask(data: InsertTaskType) {
	const clerkUser = auth();
	if (!clerkUser.userId) throw new Error("Unauthorized");

	await db.insert(tasks).values({
		ownerId: clerkUser.userId,
		...data.task,
	});

	if (data.assignees.length) {
		const assigneeArray: InferInsertAssigneesXTasks[] = [];

		data.assignees.forEach((assigneeId) => {
			assigneeArray.push({
				assigneeId: assigneeId,
				taskOwnerId: clerkUser.userId,
				taskId: data.task.id,
			});
		});

		await db.insert(assignees_x_tasks).values(assigneeArray);
	}
}
