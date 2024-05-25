"use server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "@/drizzle/db";
import { InferInsertModel, SQL, and, asc, desc, eq, inArray, ne, or, sql } from "drizzle-orm";
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

export async function getTasksByFriend(friendId: string): Promise<TaskType[]> {
	const clerkUser = auth();
	if (!clerkUser.userId) throw new Error("Unauthorized");

	// TODO ::: server side check if they are really friends.

	/** Get all tasks that both user and the friend are member of */
	/**
	 * Possibilities:
	 * 1. user is owner, friend is assignee.
	 * 2. user is assignee, friend is owner.
	 * 3. none is owner, both are assignees on the task.
	 */

	const rawSqlForTasks = sql`
		WITH user_tasks AS (
			SELECT DISTINCT ON(t.id)
				t.*
			FROM 
				${tasks} t
			INNER JOIN 
				${assignees_x_tasks} axt ON t.id = axt.task_id
			WHERE 
				(t.owner_id = ${clerkUser.userId} AND axt.assignee_id = ${friendId})
				OR (t.owner_id = ${friendId} AND axt.assignee_id = ${clerkUser.userId})
				OR (t.owner_id != ${clerkUser.userId} AND t.owner_id != ${friendId} 
					AND EXISTS (
						SELECT 1 
						FROM ${assignees_x_tasks} axt1 
						WHERE axt1.task_id = t.id 
						AND axt1.assignee_id = ${clerkUser.userId}
					) 
					AND EXISTS (
						SELECT 1 
						FROM ${assignees_x_tasks} axt2 
						WHERE axt2.task_id = t.id 
						AND axt2.assignee_id = ${friendId}
					)
				)
		)
		SELECT
			user_tasks.*,
			COALESCE((
				SELECT json_build_object('project_id', taskloc.project_id, 'project_sub_cat_id', taskloc.project_sub_cat_id)
				FROM ${taskLocations} taskloc
				WHERE taskloc.task_id = user_tasks.id and taskloc.user_id = ${clerkUser.userId}
			), '{}'::json) as task_location,
			COALESCE((
				SELECT array_agg(axt.assignee_id)
				FROM ${assignees_x_tasks} axt
				WHERE axt.task_id = user_tasks.id
			), '{}') AS assignees
		FROM 
			user_tasks
		ORDER BY
			user_tasks.date ASC,
			user_tasks.time ASC,
			user_tasks.created_at ASC;
	`;

	type ReturnedTaskType = {
		id: string;
		title: string;
		description: string | null;
		created_at: Date;
		date: string | null;
		time: string | null;
		is_completed: boolean | null;
		owner_id: string;
		is_together: boolean | null;
		is_assigned_to_sb: boolean | null;
		comments_and_logs: unknown;
		task_location: {
			project_id: string;
			project_sub_cat_Id: string;
		} | null;
		assignees?: string[];
	};

	const tasksData = await db.execute(rawSqlForTasks);
	return (tasksData.rows as ReturnedTaskType[]).map(
		(item) =>
			({
				task: {
					date: item.date,
					id: item.id,
					createdAt: item.created_at,
					title: item.title,
					description: item.description,
					time: item.time,
					isCompleted: item.is_completed,
					ownerId: item.owner_id,
					isTogether: item.is_together,
					isAssignedToSb: item.is_assigned_to_sb,
					commentsAndLogs: item.comments_and_logs,
				},
				taskLocation: {
					projectId: item.task_location?.project_id,
					subCatId: item.task_location?.project_sub_cat_Id,
				},
				assignees: item.assignees,
			}) as TaskType
	);

	/* alternative *
	...
	taskloc.project_id as project_id,
	taskloc.project_sub_cat_id as project_sub_cat_id,
	...
	LEFT JOIN
		${taskLocations} taskloc ON taskloc.task_id = user_tasks.id and taskloc.user_id = ${clerkUser.userId}
	...
	*/
}

// TODO ::: if user sent you a request before, now you send to them, then it should be automatically friendship.
// TODO ::: user can't send request to himself
// TODO ::: dont forget that passing empty array to clerk returns list of all users.
// TODO ::: input field should be reset after succesfull friend request sent.
// TODO ::: some users might be no longer friends, so better to return user data not just assignee ids or owner id

export async function getTasksBySubCategory(subCatId: string) {
	// TODO ::: check if the user is the owner of the subcat first. do this check in db query itself
	// TODO ::: should use left join or inner join, learn when which
	const clerkUser = auth();
	if (!clerkUser.userId) throw new Error("Unauthorized");

	const data = (await db
		.select({
			task: tasks,
			taskLocation: {
				projectId: taskLocations.projectId,
				subCatId: taskLocations.projectSubCatId,
			},
			assignees: sql`
				COALESCE((
					SELECT array_agg(${assignees_x_tasks.assigneeId})
					FROM ${assignees_x_tasks}
					WHERE ${assignees_x_tasks.taskId} = ${tasks.id}
				), '{}') AS assignees
			`,
		})
		.from(tasks)
		.leftJoin(assignees_x_tasks, eq(assignees_x_tasks.taskId, tasks.id))
		.leftJoin(taskLocations, and(eq(taskLocations.taskId, tasks.id), eq(taskLocations.userId, clerkUser.userId)))
		.where(
			and(
				or(eq(tasks.ownerId, clerkUser.userId), eq(assignees_x_tasks.assigneeId, clerkUser.userId)),
				eq(taskLocations.projectSubCatId, subCatId)
			)
		)) as TaskType[];

	return data;
}
