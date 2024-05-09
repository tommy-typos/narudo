import type { Metadata } from "next";
import "./globals.css";
import "@/styles/clerk-related.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { ClerkProvider } from "@clerk/nextjs";

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
		>
			<html lang="en">
				<body>
					<ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
						{children}
						<SpeedInsights />
						<Analytics />
					</ThemeProvider>
				</body>
			</html>
		</ClerkProvider>
	);
}
