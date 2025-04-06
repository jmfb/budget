import { Link } from "react-router-dom";
import { MdExitToApp } from "react-icons/md";
import styles from "./About.module.css";

export function About() {
	return (
		<div>
			<h1 className={styles.heading}>
				Jake and Sarah's Budget App
				<Link to="/sign-out" className={styles["sign-out"]}>
					Sign Out
					<MdExitToApp className={styles.exit} />
				</Link>
			</h1>
		</div>
	);
}
