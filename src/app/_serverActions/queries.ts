"use server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/drizzle/db";
import { InferInsertModel, eq } from "drizzle-orm";
import { assignees_x_tasks, projectSubCategories, projects, tasks, users } from "@/drizzle/schema";
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
			},
		},
		columns: {
			ownerId: false,
		},
	});

	return data;
}
