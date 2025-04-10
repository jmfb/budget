import { ReactNode, Ref } from "react";
import { clsx } from "clsx";
import styles from "./VerticalLayout.module.css";

export interface VerticalLayoutProps {
	children: ReactNode;
	verticalAlign?: "top" | "center" | "bottom";
	horizontalAlign?: "left" | "center" | "right";
	gap?: "none" | "narrow" | "small" | "default" | "wide";
	width?: string;
	className?: string;
	tag?: string;
	ref?: Ref<HTMLDivElement>;
}

export function VerticalLayout({
	children,
	verticalAlign,
	horizontalAlign,
	gap,
	width,
	className,
	tag,
	ref,
}: VerticalLayoutProps) {
	return (
		<div
			className={clsx(
				styles["root"],
				verticalAlign && styles[`vertical-${verticalAlign}`],
				horizontalAlign && styles[`horizontal-${horizontalAlign}`],
				styles[`gap-${gap ?? "default"}`],
				className,
			)}
			style={{ width }}
			data-test-class={tag}
			ref={ref}
		>
			{children}
		</div>
	);
}
