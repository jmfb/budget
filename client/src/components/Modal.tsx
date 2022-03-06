import React from 'react';
import ReactModal from 'react-modal';
import cx from 'classnames';
import styles from './Modal.css';

export interface IModalProps {
	children?: React.ReactNode;
	className?: string;
	onClose(): void;
}

export default function Modal({
	children,
	className,
	onClose
}: IModalProps) {
	return (
		<ReactModal
			isOpen
			ariaHideApp={false}
			onRequestClose={onClose}
			className={cx(className, styles.root)}
			overlayClassName={styles.overlay}>
			{children}
		</ReactModal>
	);
}
