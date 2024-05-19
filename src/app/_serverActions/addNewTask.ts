"use server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "@/drizzle/db";
import { InferInsertModel, and, eq, inArray } from "drizzle-orm";
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

	if (data.assignees.length > 0) {
		const userProjectSubCat = await db
			.select({ userId: users.id, projectId: projects.id, subCatId: projectSubCategories.id })
			.from(users)
			.where(
				and(
					inArray(users.id, [...(data.assignees || [])]),
					eq(projects.isInbox, true),
					eq(projectSubCategories.isDefault, true)
				)
			)
			.leftJoin(projects, eq(projects.ownerId, users.id))
			.leftJoin(projectSubCategories, eq(projects.id, projectSubCategories.projectId));

		await db.insert(taskLocations).values([
			{
				projectId: data.project.projectId,
				projectSubCatId: data.project.subCatId,
				taskId: data.task.id,
				userId: clerkUser.userId,
			},
			...userProjectSubCat.map((item) => ({
				projectId: item.projectId as string,
				projectSubCatId: item.subCatId as string,
				taskId: data.task.id,
				userId: item.userId,
			})),
		]);

		const clerkUserDetails = await clerkClient.users.getUser(clerkUser.userId);

		const haha = data.assignees.map((assigneeId) => ({
			actionType: "no_action",
			dateTime: data.task.createdAt,
			userId: assigneeId,
			title: `${clerkUserDetails.fullName ? clerkUserDetails.fullName : "@ " + clerkUserDetails.username} added you on a task.`,
			content: `Task title: ${data.task.title}`,
			isRead: false,
		}));

		await db.insert(notifications).values(haha as any);
	} else {
		await db.insert(taskLocations).values([
			{
				projectId: data.project.projectId,
				projectSubCatId: data.project.subCatId,
				taskId: data.task.id,
				userId: clerkUser.userId,
			},
		]);
	}

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
