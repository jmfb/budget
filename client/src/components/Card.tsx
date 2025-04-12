import { clsx } from "clsx";
import styles from "./Card.module.css";

export interface ICardProps {
	className?: string;
	children?: React.ReactNode;
	onClick?(): void;
}

export function Card({ className, children, onClick }: ICardProps) {
	return (
		<div
			className={clsx(
				styles["root"],
				onClick && styles["clickable"],
				className,
			)}
			onClick={onClick}
		>
			{children}
		</div>
	);
}
