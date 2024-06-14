"use client";

import { ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { stringifyDate } from "./dateUtils";

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
