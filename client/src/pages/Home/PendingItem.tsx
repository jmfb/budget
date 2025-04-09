import React from 'react';
import { Pill } from '~/components';
import { IPendingItem } from '~/models';
import { budgetService } from '~/services';
import styles from './PendingItem.module.css';

export interface IPendingItemProps {
	pendingItem: IPendingItem;
	onEdit(): void;
}

export function PendingItem({ pendingItem, onEdit }: IPendingItemProps) {
	const { name, amount, category, incomeName, expenseName } = pendingItem;
	return (
		<div
			className={styles.root}
			onClick={onEdit}>
			<div className={styles.row}>
				<span className={styles.amount}>
					{budgetService.format(amount)}
				</span>
				<span className={styles.name}>{name}</span>
				{!incomeName && !expenseName && !category && (
					<Pill
						className={styles.pill}
						type='new'>
						New!
					</Pill>
				)}
				{!incomeName && !expenseName && category && (
					<Pill
						className={styles.pill}
						type='info'>
						{category}
					</Pill>
				)}
				{incomeName && (
					<Pill
						className={styles.pill}
						type='success'>
						{incomeName}
					</Pill>
				)}
				{expenseName && (
					<Pill
						className={styles.pill}
						type='danger'>
						{expenseName}
					</Pill>
				)}
			</div>
		</div>
	);
}
