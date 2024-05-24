"use server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "@/drizzle/db";
import { InferInsertModel, and, asc, desc, eq, inArray, ne, or, sql } from "drizzle-orm";
import {
	assignees_x_tasks,
	friendRequests,
	friendships,
	notifications,
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

	if (friendshipsList.length === 0) {
		return [];
	}

	const friends = await clerkClient.users.getUserList({
		userId: friendshipsList.map((item) => (item.userId_1 !== clerkUser.userId ? item.userId_1 : item.userId_2)),
	});

	const data = friends.data.map((friend) => ({
		id: friend.id,
		userName: friend.username,
		fullName: friend.fullName,
		imageUrl: friend.imageUrl,
		hasImage: friend.hasImage,
	}));

	return data;
}

export type TaskType = {
	task: {
		date: string | null;
		id: string;
		createdAt: Date;
		title: string;
		description: string | null;
		time: string | null;
		isCompleted: boolean | null;
		ownerId: string;
		isTogether: boolean | null;
		isAssignedToSb: boolean | null;
		commentsAndLogs: unknown;
	};
	taskLocation: {
		projectId: string;
		subCatId: string;
	} | null;
	assignees?: string[];
};

export async function getTasksByDate(date: string) {
	const clerkUser = auth();
	if (!clerkUser.userId) throw new Error("Unauthorized");

	/** Get all tasks by date that user is owner or assignee. */

	const sq = db
		.select({ id: assignees_x_tasks.taskId, assigneeId: assignees_x_tasks.assigneeId })
		.from(assignees_x_tasks)
		.where(eq(assignees_x_tasks.assigneeId, clerkUser.userId))
		.as("sq");

	const taskList: TaskType[] = await db
		.select({
			task: tasks,
			taskLocation: { projectId: taskLocations.projectId, subCatId: taskLocations.projectSubCatId },
		})
		.from(tasks)
		.leftJoin(sq, eq(tasks.id, sq.id))
		.leftJoin(taskLocations, eq(tasks.id, taskLocations.taskId))
		.where(
			and(
				eq(tasks.date, date),
				and(
					or(eq(tasks.ownerId, clerkUser.userId), eq(sq.assigneeId, clerkUser.userId)),
					eq(taskLocations.userId, clerkUser.userId)
				)
			)
		)
		.orderBy(asc(tasks.time), asc(tasks.createdAt));

	if (taskList.length > 0) {
		const assignees = await db
			.select({ assigneeId: assignees_x_tasks.assigneeId, taskId: assignees_x_tasks.taskId })
			.from(assignees_x_tasks)
			.where(
				inArray(
					assignees_x_tasks.taskId,
					taskList.map((item) => item.task.id)
				)
			);

		taskList.forEach((task) => {
			task.assignees = assignees
				.filter((assignee) => assignee.taskId === task.task.id)
				.map((assignee) => assignee.assigneeId);
		});
	}

	return taskList;
}

export async function getNotifications() {
	const clerkUser = auth();
	if (!clerkUser.userId) throw new Error("Unauthorized");

	const data = await db
		.select()
		.from(notifications)
		.where(eq(notifications.userId, clerkUser.userId))
		.orderBy(desc(notifications.dateTime));

	return data;
}

export async function getFriendRequestsPending() {
	const clerkUser = auth();
	if (!clerkUser.userId) throw new Error("Unauthorized");

	const data = await db.select().from(friendRequests).where(eq(friendRequests.senderId, clerkUser.userId));

	if (data.length === 0) {
		return [];
	}

	const clerkUsers = await clerkClient.users.getUserList({
		userId: data.map((item) => item.receiverId),
	});

	return clerkUsers.data.map((item) => ({
		userId: item.id,
		userName: item.username,
	}));
}

export async function getFriendRequestsIncoming() {
	const clerkUser = auth();
	if (!clerkUser.userId) throw new Error("Unauthorized");

	const data = await db.select().from(friendRequests).where(eq(friendRequests.receiverId, clerkUser.userId));

	if (data.length === 0) {
		return [];
	}

	const clerkUsers = await clerkClient.users.getUserList({
		userId: data.map((item) => item.senderId),
	});

	return clerkUsers.data.map((item) => ({
		userId: item.id,
		userName: item.username,
		fullName: item.fullName,
		imageUrl: item.imageUrl,
		hasImage: item.hasImage,
	}));
}

// TODO ::: if user sent you a request before, now you send to them, then it should be automatically friendship.
// TODO ::: user can't send request to himself
// TODO ::: dont forget that passing empty array to clerk returns list of all users.
// TODO ::: input field should be reset after succesfull friend request sent.
