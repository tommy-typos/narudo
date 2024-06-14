"use client";

import { stringifyDate } from "@/lib/dateUtils";
import { redirect, useRouter } from "next/navigation";

export default function Home() {
	// redirect(`/app/date/${stringifyDate(new Date())}`);
	const router = useRouter();
	router.push(`/app/date/${stringifyDate(new Date())}`);
	// TODO ::: learn if it is better to user router.push here (for the sake of useQuery issue)
	return <></>;
}
/**
 * redirect caused queries to get stuck in loading/fetching mode.
 *
 */
