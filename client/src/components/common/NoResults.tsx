import { ReactNode } from "react";
import styles from "./NoResults.module.css";

export interface NoResultsProps {
	children: ReactNode;
}

export function NoResults({ children }: NoResultsProps) {
	return <div className={styles["root"]}>{children}</div>;
}
