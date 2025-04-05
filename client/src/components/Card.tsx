import { clsx } from "clsx";
import styles from './Card.module.css';

export interface ICardProps {
	className?: string;
	children?: React.ReactNode;
}

export function Card({ className, children }: ICardProps) {
	return <div className={clsx(styles.root, className)}>{children}</div>;
}
