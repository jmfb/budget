import { NavLink } from 'react-router-dom';
import { clsx } from 'clsx';
import styles from './Header.module.css';

export function Header() {
	return (
		<header className={clsx('responsive', styles.root)}>
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
						to='/about'
						className={props =>
							props.isActive ? styles.active : ''
						}>
						About
					</NavLink>
				</div>
			</nav>
		</header>
	);
}
