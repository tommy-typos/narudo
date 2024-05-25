"use client";

import { stringifyDate } from "@/components/client/addTask";
import { redirect } from "next/navigation";

export default function Home() {
	redirect(`/app/date/${stringifyDate(new Date())}`);
	return <></>;
}
