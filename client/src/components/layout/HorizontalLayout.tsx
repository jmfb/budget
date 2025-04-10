import { ReactNode, Ref } from "react";
import { clsx } from "clsx";
import styles from "./HorizontalLayout.module.css";

export interface HorizontalLayoutProps {
	children: ReactNode;
	verticalAlign?: "top" | "center" | "bottom";
	horizontalAlign?: "left" | "center" | "right" | "justified";
	gap?: "none" | "narrow" | "small" | "default" | "wide";
	fullWidth?: boolean;
	wrap?: boolean;
	height?: string;
	width?: string;
	className?: string;
	tag?: string;
	ref?: Ref<HTMLDivElement>;
}

export function HorizontalLayout({
	children,
	verticalAlign,
	horizontalAlign,
	gap,
	fullWidth,
	wrap,
	height,
	width,
	className,
	tag,
	ref,
}: HorizontalLayoutProps) {
	return (
		<div
			className={clsx(
				styles["root"],
				verticalAlign && styles[`vertical-${verticalAlign}`],
				horizontalAlign && styles[`horizontal-${horizontalAlign}`],
				styles[`gap-${gap ?? "default"}`],
				fullWidth && styles["full-width"],
				wrap && styles["wrap"],
				className,
			)}
			style={{ height, width }}
			data-test-class={tag}
			ref={ref}
		>
			{children}
		</div>
	);
}
