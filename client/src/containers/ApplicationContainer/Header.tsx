import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Header.css';

export interface IHeaderProps {
}

export default function Header({
}: IHeaderProps) {
	return (
		<header className={styles.root}>
			<nav className={styles.links}>
				<div className={styles.left}>
					<NavLink exact to='/' activeClassName={styles.active}>Home</NavLink>
					<NavLink exact to='/incomes' activeClassName={styles.active}>Incomes</NavLink>
					<NavLink exact to='/expenses' activeClassName={styles.active}>Expenses</NavLink>
				</div>
				<div className={styles.right}>
					<NavLink to='/sign-out' activeClassName={styles.active}>Sign Out</NavLink>
				</div>
			</nav>
		</header>
	);
}
