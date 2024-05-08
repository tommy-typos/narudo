"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";

import { cn } from "@/lib/utils";

import { Select, SelectContent, SelectGroup, SelectLabel, SelectValue } from "@/components/ui/select";
import { Check } from "lucide-react";

export function LanguageToggle() {
	return (
		<Select defaultValue="english">
			<SelectTrigger className="text-2xl">
				<SelectValue placeholder="🇺🇸" />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					<SelectLabel>Choose a Language</SelectLabel>
					<SelectItem_Language value="english" languageName="English">
						🇺🇸
					</SelectItem_Language>
					<SelectItem_Language value="hungarian" languageName="Hungarian">
						🇭🇺
					</SelectItem_Language>
				</SelectGroup>
			</SelectContent>
		</Select>
	);
}
const SelectItem_Language = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Item>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> & { languageName: string }
>(({ className, children, languageName, ...props }, ref) => (
	<SelectPrimitive.Item
		ref={ref}
		className={cn(
			"relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
			className
		)}
		{...props}
	>
		<span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
			<SelectPrimitive.ItemIndicator>
				<Check className="h-4 w-4" />
			</SelectPrimitive.ItemIndicator>
		</span>

		<SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
		<span className="m-2">{languageName}</span>
	</SelectPrimitive.Item>
));
SelectItem_Language.displayName = SelectPrimitive.Item.displayName;

const SelectTrigger = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Trigger>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
	<SelectPrimitive.Trigger
		ref={ref}
		className={cn(
			"inline-flex h-10 w-10 items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
			className
		)}
		{...props}
	>
		{children}
	</SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;
