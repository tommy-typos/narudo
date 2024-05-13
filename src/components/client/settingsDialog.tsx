import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { AppWindowMac, Atom, Moon, Palette, Rows4, Settings, Sun, Swords, Users } from "lucide-react";
import { useState } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { NarutoBeltSvg } from "@/svgs/svgExporter";

export function SettingsDialog() {
	const [openTab, setOpenTab] = useState<"general" | "theme" | "customization">("customization");
	return (
		<Dialog>
			<DialogTrigger asChild>
				{/* <Button variant="outline">Temporary MF</Button> */}
				<Button variant="ghost" className="justify-start">
					<Settings className="mr-2 h-4 w-4" />
					Settings
				</Button>
			</DialogTrigger>
			<DialogContent className="flex h-[600px] gap-0 rounded-md p-0">
				<div className="flex flex-col gap-2 bg-muted/50 p-2">
					<Button
						variant="ghost"
						className={cn("justify-start", openTab == "general" && "bg-muted")}
						onClick={() => setOpenTab("general")}
					>
						<Settings className="mr-2 h-4 w-4" />
						General
					</Button>
					<Button
						variant="ghost"
						className={cn("justify-start", openTab == "theme" && "bg-muted")}
						onClick={() => setOpenTab("theme")}
					>
						<Palette className="mr-2 h-4 w-4" />
						Theme
					</Button>
					<Button
						variant="ghost"
						className={cn("justify-start", openTab == "customization" && "bg-muted")}
						onClick={() => setOpenTab("customization")}
					>
						<AppWindowMac className="mr-2 h-4 w-4" />
						Customization
					</Button>
				</div>
				<div className="flex flex-col justify-between p-4">
					{openTab == "general" && (
						<>
							<div className="px-2">
								<h2 className="my-2 text-xl">Date & Time</h2>
								<h3 className="mb-1">Date format</h3>
								<Select defaultValue="df-1">
									<SelectTrigger className="w-32">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											<SelectItem value="df-1">format 1</SelectItem>
											<SelectItem value="df-2">format 2</SelectItem>
											<SelectItem value="df-3">format 3</SelectItem>
										</SelectGroup>
									</SelectContent>
								</Select>
								<h3 className="mb-1 mt-2">Time format</h3>
								<Select defaultValue="tf-1">
									<SelectTrigger className="w-32">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											<SelectItem value="tf-1">format 1</SelectItem>
											<SelectItem value="tf-2">format 2</SelectItem>
											<SelectItem value="tf-3">format 3</SelectItem>
										</SelectGroup>
									</SelectContent>
								</Select>

								<div className="my-2 flex flex-col gap-1">
									<div className="flex items-center gap-2">
										<h3 className="">Smart date recognition</h3>
										<Switch id="smart-date-recognition-switch" />
									</div>
									<p className="text-sm text-foreground/60">
										Automatically recognize due dates when typing a task
									</p>
								</div>

								<h2 className="my-2 mt-4 text-xl">Sound</h2>
								<div className="my-2 flex flex-col gap-1">
									<div className="flex items-center gap-2">
										<h3 className="">Task complete tone</h3>
										<Switch id="smart-date-recognition-switch" />
									</div>
									<p className="text-sm text-foreground/60">Play a sound when tasks are completed.</p>
								</div>
							</div>
							<div className="mt-8 flex justify-end gap-4">
								<Button variant="secondary">Cancel</Button>
								<Button>Save Changes</Button>
							</div>
						</>
					)}
					{openTab == "theme" && (
						<>
							<div className="flex flex-col gap-6 px-2">
								<div className="flex flex-col gap-2">
									<p>Mode</p>
									<div className="flex gap-4">
										<Button variant="outline">
											<Sun className="mr-2 h-4 w-4" />
											Light
										</Button>
										<Button variant="outline">
											<Moon className="mr-2 h-4 w-4" />
											Dark
										</Button>
									</div>
								</div>
								<div className="flex flex-col gap-2">
									<p>Color</p>
									<div className="flex flex-wrap justify-between gap-4">
										<Button variant="outline" className="flex-1 justify-start px-2 py-6">
											<div
												className="mr-2 h-6 w-6 rounded-full"
												style={{ backgroundColor: "hsl(24.6 95% 53.1%)" }}
											></div>
											Tokaji aszú 🥂
										</Button>
										<Button variant="outline" className="flex-1 justify-start px-2 py-6">
											<div
												className="mr-2 h-6 w-6 rounded-full"
												style={{ backgroundColor: "hsl(221.2 83.2% 53.3%)" }}
											></div>
											Balaton 💧
										</Button>
										<Button variant="outline" className="flex-1 justify-start px-2 py-6">
											<div
												className="mr-2 h-6 w-6 rounded-full"
												style={{ backgroundColor: "hsl(142.1 76.2% 36.3%)" }}
											></div>
											Soproni 🍾
										</Button>
										<Button variant="outline" className="flex-1 justify-start px-2 py-6">
											<div
												className="mr-2 h-6 w-6 rounded-full"
												style={{ backgroundColor: "hsl(47.9 95.8% 53.1%)" }}
											></div>
											Villamos 🚡
										</Button>
										<Button variant="outline" className="flex-1 justify-start px-2 py-6">
											<div
												className="mr-2 h-6 w-6 rounded-full"
												style={{ backgroundColor: "hsl(0 72.2% 50.6%)" }}
											></div>
											Paprika 🌶️
										</Button>
										<Button variant="outline" className="flex-1 justify-start px-2 py-6">
											<div
												className="mr-2 h-6 w-6 rounded-full"
												style={{ backgroundColor: "hsl(262.1 83.3% 57.8%)" }}
											></div>
											Köszönöm 🪻
										</Button>
									</div>
									<div className="flex gap-4"></div>
								</div>
							</div>
							<div className="mt-8 flex justify-end gap-4">
								<Button variant="secondary">Cancel</Button>
								<Button>Save Changes</Button>
							</div>
						</>
					)}
					{openTab == "customization" && (
						<>
							<div className="px-2">
								<h1 className="my-2 text-xl">Show in Sidebar</h1>
								<div className="my-2 flex flex-col gap-1">
									<div className="flex items-center gap-2">
										<Rows4 className=" h-4 w-4" />
										<h3 className="">All tasks</h3>
										<Switch id="smart-date-recognition-switch" />
									</div>
									<p className="text-sm text-foreground/60"></p>
								</div>
								<div className="my-2 flex flex-col gap-1">
									<div className="flex items-center gap-2">
										<Users className=" h-4 w-4" />
										<h3 className="">Friends</h3>
										<Switch id="smart-date-recognition-switch" />
									</div>
									<p className="text-sm text-foreground/60">
										By hiding this, you won&lsquo;t see the option to add your friends to your new
										tasks.
									</p>
								</div>
								<div className="my-2 flex flex-col gap-1">
									<div className="flex items-center gap-2">
										<Swords className=" h-4 w-4" />
										<h3 className="">Daily challenges</h3>
										<Switch id="smart-date-recognition-switch" />
									</div>
									<p className="text-sm text-foreground/60">
										By hiding this, your past daily challenges will be hidden in day view mode as
										well. Only the active ones will be visible if there is any for today.
									</p>
								</div>
								<div className="my-2 flex flex-col gap-1">
									<div className="flex items-center gap-2">
										<Atom className=" h-4 w-4" />
										<h3 className="">Ai</h3>
										<Switch id="smart-date-recognition-switch" />
									</div>
									<p className="text-sm text-foreground/60"></p>
								</div>
								<h1 className="my-2 mt-6 text-xl">Show in Topbar</h1>
								<div className="my-2 flex flex-col gap-1">
									<div className="flex items-center gap-2">
										<NarutoBeltSvg className={cn("*:fill-primary", "h-4 w-4")} />
										<h3 className="">Ninja Score</h3>
										<Switch id="smart-date-recognition-switch" />
									</div>
									<p className="text-sm text-foreground/60"></p>
								</div>
							</div>
							<div className="mt-8 flex justify-end gap-4">
								<Button variant="secondary">Cancel</Button>
								<Button>Save Changes</Button>
							</div>
						</>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
