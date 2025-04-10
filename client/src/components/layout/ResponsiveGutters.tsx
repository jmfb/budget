import { ReactNode } from "react";
import styles from "./ResponsiveGutters.module.css";

export interface ResponsiveGuttersProps {
	children: ReactNode;
}

export function ResponsiveGutters({ children }: ResponsiveGuttersProps) {
	return (
		<div className={styles["root"]}>
			<div className={styles["child-container"]}>{children}</div>
		</div>
	);
}
