import { clsx } from "clsx";
import styles from './Pill.module.css';

export interface IPillProps {
	type: 'info' | 'danger' | 'success' | 'new';
	className?: string;
	children?: React.ReactNode;
}

export function Pill({ type, className, children }: IPillProps) {
	return (
		<div className={clsx(styles.root, styles[type], className)}>
			{children}
		</div>
	);
}
