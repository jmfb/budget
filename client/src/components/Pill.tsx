import React from 'react';
import cx from 'classnames';
import styles from './Pill.css';

export interface IPillProps {
	type: 'info' | 'danger' | 'success' | 'new';
	className?: string;
	children?: React.ReactNode;
}

export function Pill({ type, className, children }: IPillProps) {
	return (
		<div className={cx(styles.root, styles[type], className)}>
			{children}
		</div>
	);
}
