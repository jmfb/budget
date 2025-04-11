import { ReactNode } from "react";
import ReactModal from "react-modal";
import { HorizontalLayout } from "~/components";
import styles from "./Modal.module.css";

export interface IModalProps {
	title: ReactNode;
	children: ReactNode;
	deleteButton?: ReactNode;
	buttons: ReactNode;
	onClose(): void;
}

export function Modal({
	title,
	children,
	deleteButton,
	buttons,
	onClose,
}: IModalProps) {
	return (
		<ReactModal
			isOpen
			ariaHideApp={false}
			onRequestClose={onClose}
			className={styles.root}
			overlayClassName={styles.overlay}
		>
			{title && <div className={styles.title}>{title}</div>}
			<div className={styles.body}>{children}</div>
			<HorizontalLayout
				className={styles["footer"]}
				horizontalAlign={deleteButton ? "justified" : "right"}
			>
				{deleteButton}
				<HorizontalLayout>{buttons}</HorizontalLayout>
			</HorizontalLayout>
		</ReactModal>
	);
}
