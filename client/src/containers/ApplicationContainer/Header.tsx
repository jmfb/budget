import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Header.css';

export interface IHeaderProps {}

export default function Header({}: IHeaderProps) {
	return (
		<header className={styles.root}>
			<nav className={styles.links}>
				<div className={styles.left}>
					<NavLink
						exact
						to='/'
						activeClassName={styles.active}>
						Home
					</NavLink>
					<NavLink
						to='/statistics'
						activeClassName={styles.active}>
						Stats
					</NavLink>
					<NavLink
						to='/incomes'
						activeClassName={styles.active}>
						Income
					</NavLink>
					<NavLink
						to='/expenses'
						activeClassName={styles.active}>
						Expense
					</NavLink>
					<NavLink
						to='/uploads'
						activeClassName={styles.active}>
						Upload
					</NavLink>
				</div>
				<div className={styles.right}>
					<NavLink
						to='/sign-out'
						activeClassName={styles.active}>
						Sign Out
					</NavLink>
				</div>
			</nav>
		</header>
	);
}
