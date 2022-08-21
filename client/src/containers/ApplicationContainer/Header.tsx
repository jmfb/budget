import React from 'react';
import { NavLink } from 'react-router-dom';
import cx from 'classnames';
import styles from './Header.css';

export interface IHeaderProps {}

export default function Header({}: IHeaderProps) {
	return (
		<header className={cx('responsive', styles.root)}>
			<nav className={styles.links}>
				<div className={styles.left}>
					<NavLink
						to='/'
						className={props =>
							props.isActive ? styles.active : ''
						}>
						Home
					</NavLink>
					<NavLink
						to='/statistics'
						className={props =>
							props.isActive ? styles.active : ''
						}>
						Stats
					</NavLink>
					<NavLink
						to='/incomes'
						className={props =>
							props.isActive ? styles.active : ''
						}>
						Income
					</NavLink>
					<NavLink
						to='/expenses'
						className={props =>
							props.isActive ? styles.active : ''
						}>
						Expense
					</NavLink>
					<NavLink
						to='/uploads'
						className={props =>
							props.isActive ? styles.active : ''
						}>
						Upload
					</NavLink>
				</div>
				<div className={styles.right}>
					<NavLink
						to='/sign-out'
						className={props =>
							props.isActive ? styles.active : ''
						}>
						Sign Out
					</NavLink>
				</div>
			</nav>
		</header>
	);
}
