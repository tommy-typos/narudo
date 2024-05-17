import {
	integer,
	pgTable,
	pgTableCreator,
	primaryKey,
	serial,
	text,
	boolean,
	timestamp,
	date,
	foreignKey,
	uuid,
	varchar,
	time,
	json,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

const createTable = pgTableCreator((name) => `narudo___${name}`);

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
export const users_table = createTable("users", {
	id: uuid("id").primaryKey(),
	ninjaScore: integer("ninjaScore").default(0),
});

export const tasks_table = createTable("tasks", {
	id: uuid("id").primaryKey(),
	createdAt: timestamp("createdAt").notNull(),
	title: varchar("title", { length: 256 }).notNull(),
	description: text("description"),
	date: date("date"),
	time: time("time"),
	isCompleted: boolean("isCompleted").default(false),
	ownerId: uuid("ownerId")
		.references(() => users_table.id)
		.notNull(),
	isTogether: boolean("isTogether").default(false),
	assignedToSomeone: boolean("assignedToSomeone").default(false),
	commentsAndLogs: json("commentsAndLogs"),
});

export const friendships_table = createTable(
	"friendships",
	{
		userId_1: uuid("userId_1").references(() => users_table.id),
		userId_2: uuid("userId_2").references(() => users_table.id),
	},
	(table) => ({
		pk: primaryKey({ columns: [table.userId_1, table.userId_2] }),
	})
);

export const notes_table = createTable(
	"notes",
	{
		ownerId: uuid("ownerId").references(() => users_table.id),
		date: date("date").notNull(),
		lastModifiedTimestamp: timestamp("lastModifiedTimestamp").notNull(),
		content: json("content"),
	},
	(table) => ({
		pk: primaryKey({ columns: [table.ownerId, table.date] }),
	})
);

export const assignee_X_task_table = createTable(
	"assignee_X_task",
	{
		assigneeId: uuid("assigneeId").references(() => users_table.id),
		taskOwnerId: uuid("taskOwnerId").references(() => users_table.id),
		taskId: uuid("taskId").references(() => tasks_table.id),
	},
	(table) => ({
		pk: primaryKey({ columns: [table.assigneeId, table.taskOwnerId, table.taskId] }),
	})
);

export const friendRequests_table = createTable(
	"friendRequests",
	{
		senderId: uuid("senderId").references(() => users_table.id),
		receiverId: uuid("receiverId").references(() => users_table.id),
	},
	(table) => ({
		pk: primaryKey({ columns: [table.senderId, table.receiverId] }),
	})
);

export const projects_table = createTable("projects", {
	id: uuid("id").primaryKey(),
	ownerId: uuid("ownerId").references(() => users_table.id),
	isInbox: boolean("isInbox").notNull(),
});

export const projectSubCategories_table = createTable("projectSubCategories", {
	id: uuid("id").primaryKey(),
	projectId: uuid("projectId").references(() => projects_table.id),
	ownerId: uuid("ownerId").references(() => users_table.id),
	isDefault: boolean("isDefault").notNull(),
});

export const taskLocations = createTable(
	"taskLocations",
	{
		taskId: uuid("taskId").references(() => tasks_table.id),
		userId: uuid("userId").references(() => users_table.id),
		projectId: uuid("projectId").references(() => projects_table.id),
		projectSubCategoryId: uuid("projectSubCategoryId").references(() => projectSubCategories_table.id),
	},
	(table) => ({
		pk: primaryKey({ columns: [table.taskId, table.userId, table.projectId, table.projectSubCategoryId] }),
	})
);

export const dailyChallenges = createTable("dailyChallenges", {
	id: uuid("id").primaryKey(),
	ownerId: uuid("ownerId")
		.references(() => users_table.id)
		.notNull(),
	title: varchar("title", { length: 256 }).notNull(),
	description: text("description"),
	finishersCount: integer("finishersCount"),
	joinersCount: integer("joinersCount"),
	reactionsJson: json("reactionsJson"),
	createdAt: date("createdAt"),
});

export const challengeParticipants = createTable(
	"challengeParticipants",
	{
		challengeId: uuid("challengeId").references(() => dailyChallenges.id),
		userId: uuid("userId").references(() => users_table.id),
		isCompleted: boolean("isCompleted"),
	},
	(table) => ({
		pk: primaryKey({ columns: [table.challengeId, table.userId] }),
	})
);

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
