import React, { ReactNode } from 'react';
import styles from './Buttons.css';

export interface IButtonsProps {
	children: ReactNode;
}

export default function Buttons({ children }: IButtonsProps) {
	return <div className={styles.root}>{children}</div>;
}
