import React from 'react';
import cx from 'classnames';
import styles from './Card.css';

export interface ICardProps {
	className?: string;
	children?: React.ReactNode;
}

export function Card({ className, children }: ICardProps) {
	return <div className={cx(styles.root, className)}>{children}</div>;
}
