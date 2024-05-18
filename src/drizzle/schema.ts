import {
	integer,
	pgTableCreator,
	primaryKey,
	text,
	boolean,
	timestamp,
	date,
	uuid,
	varchar,
	time,
	json,
	pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

const createTable = pgTableCreator((name) => `narudo_${name}`);

//  ||--------------------------------------------------------------------------------||
//  ||                                schemas below...                                ||
//  ||--------------------------------------------------------------------------------||
/*
TODO :::
tasks > isTogether can be true only if (assignedToSomeone is true && there is row in assignee_x_task table).
tasks > time can be have value only if date has value too.
tasks > if all assigness opts out && assignee_x_task is empty for the task, then set assignedToSomeone and isTogether for the task to be false.
for a table > learn how to create index for just "name", also for "name" & "date" as combination.
*/
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
export const users = createTable("users", {
	id: uuid("id").primaryKey(),
	ninjaScore: integer("ninja_score").default(0),
});

export const tasks = createTable("tasks", {
	id: uuid("id").primaryKey(),
	createdAt: timestamp("created_at").notNull(),
	title: varchar("title", { length: 256 }).notNull(),
	description: text("description"),
	date: date("date"),
	time: time("time"),
	isCompleted: boolean("is_completed").default(false),
	ownerId: uuid("owner_id")
		.references(() => users.id)
		.notNull(),
	isTogether: boolean("is_together").default(false),
	isAssignedToSb: boolean("is_assigned_to_sb").default(false),
	commentsAndLogs: json("comments_and_logs"),
});

export const friendships = createTable(
	"friendships",
	{
		userId_1: uuid("user_id_1").references(() => users.id),
		userId_2: uuid("user_id_2").references(() => users.id),
	},
	(table) => ({
		pk: primaryKey({ columns: [table.userId_1, table.userId_2] }),
	})
);

export const notes = createTable(
	"notes",
	{
		ownerId: uuid("owner_id").references(() => users.id),
		date: date("date").notNull(),
		lastModifiedTimestamp: timestamp("last_modified_timestamp").notNull(),
		content: json("content"),
	},
	(table) => ({
		pk: primaryKey({ columns: [table.ownerId, table.date] }),
	})
);

export const assignees_x_tasks = createTable(
	"assignees_x_tasks",
	{
		assigneeId: uuid("assignee_id").references(() => users.id),
		taskOwnerId: uuid("task_owner_id").references(() => users.id),
		taskId: uuid("task_id").references(() => tasks.id),
	},
	(table) => ({
		pk: primaryKey({ columns: [table.assigneeId, table.taskOwnerId, table.taskId] }),
	})
);

export const friendRequests = createTable(
	"friend_requests",
	{
		senderId: uuid("sender_id").references(() => users.id),
		receiverId: uuid("receiver_id").references(() => users.id),
	},
	(table) => ({
		pk: primaryKey({ columns: [table.senderId, table.receiverId] }),
	})
);

export const projects = createTable("projects", {
	id: uuid("id").primaryKey(),
	ownerId: uuid("owner_id").references(() => users.id),
	isInbox: boolean("is_inbox").notNull(),
});

export const projectSubCategories = createTable("project_sub_categories", {
	id: uuid("id").primaryKey(),
	projectId: uuid("project_id").references(() => projects.id),
	ownerId: uuid("owner_id").references(() => users.id),
	isDefault: boolean("is_default").notNull(),
});

export const taskLocations = createTable(
	"task_locations",
	{
		taskId: uuid("task_id").references(() => tasks.id),
		userId: uuid("user_id").references(() => users.id),
		projectId: uuid("project_id").references(() => projects.id),
		projectSubCatId: uuid("project_sub_cat_id").references(() => projectSubCategories.id),
	},
	(table) => ({
		pk: primaryKey({ columns: [table.taskId, table.userId, table.projectId, table.projectSubCatId] }),
	})
);

export const dailyChallenges = createTable("daily_challenges", {
	id: uuid("id").primaryKey(),
	ownerId: uuid("owner_id")
		.references(() => users.id)
		.notNull(),
	title: varchar("title", { length: 256 }).notNull(),
	description: text("description"),
	finishersCount: integer("finishers_count"),
	joinersCount: integer("joiners_count"),
	reactions: json("reactions"),
	createdAt: date("created_at"),
});

export const challengeParticipants = createTable(
	"challenge_participants",
	{
		challengeId: uuid("challenge_id").references(() => dailyChallenges.id),
		userId: uuid("user_id").references(() => users.id),
		isCompleted: boolean("is_completed"),
	},
	(table) => ({
		pk: primaryKey({ columns: [table.challengeId, table.userId] }),
	})
);

export const notificationActionTypeEnum = pgEnum("notification_action_type", [
	"no_action",
	"open_friend_request",
	"open_task",
	"open_challenge",
]);

export const notifications = createTable("notifications", {
	userId: uuid("user_id").references(() => users.id),
	dateTime: timestamp("date_time").notNull(),
	title: text("title"),
	content: text("content"),
	isRead: boolean("is_read"),
	actionType: notificationActionTypeEnum("action_type").notNull(),
});
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
