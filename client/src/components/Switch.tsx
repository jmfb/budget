import React, { ReactNode } from 'react';
import ReactSwitch from 'react-switch';
import styles from './Switch.module.css';

export interface ISwitchProps {
	children?: ReactNode;
	checked: boolean;
	onChange(value: boolean): void;
}

export function Switch({ children, checked, onChange }: ISwitchProps) {
	return (
		<label className={styles.label}>
			<ReactSwitch
				checked={checked}
				onChange={onChange}
				onColor='#2a6ce5'
				height={16}
				width={32}
				checkedIcon={false}
				uncheckedIcon={false}
			/>
			<span className={styles.text}>{children}</span>
		</label>
	);
}
