import React from 'react';
import cx from 'classnames';
import styles from './SignInButton.module.css';

export interface ISignInButtonProps {
	isDisabled: boolean;
	type: 'dark' | 'light';
	className?: string;
	onClick(): void;
}

export function SignInButton({
	isDisabled,
	type,
	className,
	onClick
}: ISignInButtonProps) {
	const handleClicked = () => {
		if (!isDisabled) {
			onClick();
		}
	};

	return (
		<div
			className={cx(
				styles.root,
				styles[type],
				isDisabled && styles.disabled,
				className
			)}
			onClick={handleClicked}
		/>
	);
}
