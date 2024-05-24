"use client";

import { handleNewUser } from "@/app/_serverActions/handleNewUser";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useQueryClient } from "@tanstack/react-query";
import { Protest_Revolution } from "next/font/google";
import { useEffect, useState } from "react";

const protestRevolution = Protest_Revolution({ weight: "400", subsets: ["latin"] });

export function Welcomer() {
	const [isNewUser, setIsNewUser] = useState(false);
	const [welcome, setWelcome] = useState(false);
	useEffect(() => {
		async function checkIfNewUser() {
			const result = await handleNewUser();
			setIsNewUser(result.isNewUser);
		}
		checkIfNewUser();
	}, []);

	const queryClient = useQueryClient();

	useEffect(() => {
		if (isNewUser) {
			setWelcome(true);
			queryClient.invalidateQueries({ queryKey: ["projects"] });
		}
	}, [isNewUser]);
	return (
		<Dialog open={welcome} onOpenChange={setWelcome}>
			<DialogContent className="w-[350px]">
				<div className="my-8">
					<p className="mb-6 text-center text-8xl">🥳</p>
					<div className="mt-auto flex justify-center text-xl">
						<p className={protestRevolution.className}>welcome to naru</p>
						<div className="text-narudorange">
							<p className={protestRevolution.className}>do</p>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
