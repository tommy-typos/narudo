import { Protest_Revolution } from "next/font/google";
import Link from "next/link";
import { ThemeToggle } from "../components/client/themeToggle";
import { LanguageToggle } from "../components/client/languageToggle";
import { MoveRight } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { GoToApp } from "@/components/client/goToTheAppButton";

const protestRevolution = Protest_Revolution({ weight: "400", subsets: ["latin"] });

export default function Home() {
	return (
		<>
			<div className="mb-12 flex w-screen justify-center">
				<div className="m-10 flex w-2/3 max-w-[900px] items-center justify-between">
					<div className="flex text-xl">
						<p className={protestRevolution.className}>naru</p>
						<div className="text-narudorange">
							<p className={protestRevolution.className}>do</p>
						</div>
					</div>
					<div className="flex items-center gap-6">
						{/* <Link href="/guides" className="px-3">
							Guides
						</Link>
						<LanguageToggle /> */}
						<ThemeToggle />
					</div>
				</div>
			</div>
			<div className="flex w-screen justify-center">
				<div className="flex w-2/3 max-w-[900px] justify-between">
					<div className="flex flex-col gap-6 pt-12">
						<div className="flex text-8xl">
							<p className={protestRevolution.className}>naru</p>
							<div className="text-narudorange">
								<p className={protestRevolution.className}>do</p>
							</div>
						</div>
						<div>
							<h1 className={cn("shad-h1", protestRevolution.className)}>- [ ] drink water</h1>
						</div>
						<GoToApp />
					</div>
					<Image src="/naruto.png" width={300} height={300} alt="Naruto" priority />
				</div>
			</div>
		</>
	);
}
