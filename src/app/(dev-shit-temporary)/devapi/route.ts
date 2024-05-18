export const dynamic = "force-dynamic";

export async function GET(request: Request) {
	if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "test") {
		throw new Error("Only for development");
	} else {
		// ======================================================================== //
		// ======================================================================== //
		// ======================================================================== //

		const data = {
			message: "hi",
		};

		return Response.json({ data });
	}
}
