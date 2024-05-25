"use server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import { projectSubCategories, projects, users } from "@/drizzle/schema";
import { genId } from "@/lib/generateId";

export async function createNewProject(projectName: string) {
	const clerkUser = auth();
	if (!clerkUser.userId) throw new Error("Unauthorized");

	const projectId = genId();
	const defaultSubCatId = genId();

	await db.insert(projects).values({
		id: projectId,
		isInbox: false,
		name: projectName,
		ownerId: clerkUser.userId,
	});

	await db.insert(projectSubCategories).values({
		id: defaultSubCatId,
		isDefault: true,
		name: "Default",
		ownerId: clerkUser.userId,
		projectId: projectId,
	});
}

export async function createNewSubCat(subCatName: string, projectId: string) {
	const clerkUser = auth();
	if (!clerkUser.userId) throw new Error("Unauthorized");

	await db.insert(projectSubCategories).values({
		projectId: projectId,
		ownerId: clerkUser.userId,
		isDefault: false,
		name: subCatName,
		id: genId(),
	});
}
