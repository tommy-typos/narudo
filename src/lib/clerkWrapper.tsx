"use client";

import { ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

function stringifyDate(date: Date) {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() returns 0-11, so we add 1
	const day = String(date.getDate()).padStart(2, "0"); // getDate() returns the day of the month

	return `${year}-${month}-${day}`;
}

export function MyClerkWrapper({ children }: { children: ReactNode }) {
	return (
		<ClerkProvider
			signInForceRedirectUrl={`/app/date/${stringifyDate(new Date())}`}
			signInFallbackRedirectUrl={`/app/date/${stringifyDate(new Date())}`}
			signUpForceRedirectUrl={`/app/date/${stringifyDate(new Date())}`}
			signUpFallbackRedirectUrl={`/app/date/${stringifyDate(new Date())}`}
			signInUrl={"/sign-in"}
			signUpUrl={"/sign-up"}
			appearance={{
				userButton: {
					baseTheme: dark,
				},
				userProfile: {
					baseTheme: dark,
				},
			}}
		>
			{children}
		</ClerkProvider>
	);
}
