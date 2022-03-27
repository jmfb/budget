import React from 'react';
import { IPendingItem } from '~/models';
import { budgetService } from '~/services';
import styles from './PendingItem.css';

export interface IPendingItemProps {
	pendingItem: IPendingItem;
	onEdit(): void;
}

export default function PendingItem({
	pendingItem,
	onEdit
}: IPendingItemProps) {
	const { name, amount } = pendingItem;
	return (
		<div className={styles.root} onClick={onEdit}>
			<div className={styles.row}>
				<span className={styles.amount}>{budgetService.format(amount)}</span>
				<span className={styles.name}>{name}</span>
			</div>
		</div>
	);
}
