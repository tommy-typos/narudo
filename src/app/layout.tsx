import type { Metadata } from "next";
import "./globals.css";
import "@/styles/extra-themes.css";
import "@/styles/clerk-related.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { ReactQueryProvider } from "@/reactQuery/reactQueryProvider";

export const metadata: Metadata = {
	title: "NaruDo",
	description: "Black Belt Your Productivity",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ClerkProvider
			signInForceRedirectUrl={"/app/today"}
			signInFallbackRedirectUrl={"/app/today"}
			signUpForceRedirectUrl={"/app/today"}
			signUpFallbackRedirectUrl={"/app/today"}
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
			<html lang="en" className="h-full" suppressHydrationWarning>
				<body className="h-full">
					<ThemeProvider
						attribute="class"
						defaultTheme="dark"
						enableSystem
						disableTransitionOnChange
						themes={[
							"light",
							"dark",
							"system",
							"light-blue",
							"dark-blue",
							"light-green",
							"dark-green",
							"light-yellow",
							"dark-yellow",
							"light-red",
							"dark-red",
							"light-purple",
							"dark-purple",
						]}
					>
						<ReactQueryProvider>{children}</ReactQueryProvider>
						{/* <SpeedInsights />
						<Analytics /> */}
					</ThemeProvider>
				</body>
			</html>
		</ClerkProvider>
	);
}
