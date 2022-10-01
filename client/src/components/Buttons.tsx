import React, { ReactNode } from 'react';
import styles from './Buttons.css';

export interface IButtonsProps {
	children: ReactNode;
}

export function Buttons({ children }: IButtonsProps) {
	return <div className={styles.root}>{children}</div>;
}
