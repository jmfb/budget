import { ReactNode } from "react";
import styles from "./Buttons.module.css";

export interface IButtonsProps {
	children: ReactNode;
}

export function Buttons({ children }: IButtonsProps) {
	return <div className={styles.root}>{children}</div>;
}
