"use client";

import { stringifyDate } from "@/components/client/addTask";
import { redirect } from "next/navigation";

export default function Home() {
	redirect(`/app/date/${stringifyDate(new Date())}`);
	// TODO ::: learn if it is better to user router.push here (for the sake of useQuery issue)
	return <></>;
}
