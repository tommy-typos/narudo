import { SignIn } from "@clerk/nextjs";
import { Protest_Revolution } from "next/font/google";

const protestRevolution = Protest_Revolution({ weight: "400", subsets: ["latin"] });

export default function Page() {
	return (
		<div className="flex h-screen w-screen flex-col items-center justify-center" suppressHydrationWarning={true}>
			<div className="mb-4 flex text-4xl">
				<p className={protestRevolution.className}>naru</p>
				<div className="text-primary">
					<p className={protestRevolution.className}>do</p>
				</div>
			</div>
			<SignIn path="/sign-in" />
		</div>
	);
}
