import "@/drizzle/envConfig";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
	schema: "./src/drizzle/schema.ts",
	dialect: "postgresql",
	dbCredentials: {
		url: process.env.POSTGRES_URL!,
	},
	tablesFilter: ["narudo___*"],
	verbose: true,
	strict: true,
});
