import React, { ReactNode } from 'react';
import ReactModal from 'react-modal';
import styles from './Modal.css';

export interface IModalProps {
	title: ReactNode;
	children: ReactNode;
	deleteButton?: ReactNode;
	buttons: ReactNode;
	onClose(): void;
}

export default function Modal({
	title,
	children,
	deleteButton,
	buttons,
	onClose
}: IModalProps) {
	return (
		<ReactModal
			isOpen
			ariaHideApp={false}
			onRequestClose={onClose}
			className={styles.root}
			overlayClassName={styles.overlay}>
			{title && <div className={styles.title}>{title}</div>}
			<div className={styles.body}>{children}</div>
			<div className={styles.buttons}>
				{deleteButton && (
					<div className={styles.deleteButton}>{deleteButton}</div>
				)}
				<div className={styles.primaryButtons}>{buttons}</div>
			</div>
		</ReactModal>
	);
}
