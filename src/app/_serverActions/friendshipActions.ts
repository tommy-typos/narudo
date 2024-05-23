"use server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "@/drizzle/db";
import { and, eq, or, sql } from "drizzle-orm";
import {
	friendRequests,
	friendships,
	notifications,
	projectSubCategories,
	projects,
	tasks,
	users,
} from "@/drizzle/schema";
import { genId } from "@/lib/generateId";

export async function addNewFriend(userName: string, sentDate: Date) {
	const clerkUser = auth();
	if (!clerkUser.userId) throw new Error("Unauthorized");

	await new Promise((resolve) => setTimeout(resolve, 2000));

	const futureFriendData = await clerkClient.users.getUserList({ username: [userName] });

	if (futureFriendData.totalCount === 0) {
		throw new Error("No user found with the given username.");
	}

	const ifFriend = await db
		.select()
		.from(friendships)
		.where(
			or(
				and(eq(friendships.userId_1, clerkUser.userId), eq(friendships.userId_2, futureFriendData.data[0].id)),
				and(eq(friendships.userId_1, futureFriendData.data[0].id), eq(friendships.userId_2, clerkUser.userId))
			)
		);

	if (ifFriend.length > 0) {
		throw new Error("You are already friends with the user.");
	}

	await db.insert(friendRequests).values({
		senderId: clerkUser.userId,
		receiverId: futureFriendData.data[0].id,
	});

	const clerkUserDetails = await clerkClient.users.getUser(clerkUser.userId);

	await db.insert(notifications).values({
		actionType: "no_action",
		dateTime: sentDate,
		userId: futureFriendData.data[0].id,
		title: `${clerkUserDetails.fullName ? clerkUserDetails.fullName : "@ " + clerkUserDetails.username} sent you a friend request`,
		content: `Go to Incoming Requests Page to see all your requests.`,
		isRead: false,
	});
}
