"use client";
import { useParams } from "next/navigation";

export default function Home() {
	const params = useParams<{ dateSlug: string }>(); // dateSlug format: 2024-02-04 year-month-day

	return (
		<>
			<p>date</p>
			<p>{params.dateSlug}</p>
		</>
	);
}
