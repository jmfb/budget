import { useState } from "react";
import { Button } from "~/components";
import styles from "./NewerVersionPrompt.module.css";

export interface INewerVersionPromptProps {
	bundleVersion: string;
	serverBundleVersion: string;
	onClickRefresh(): void;
}

export function NewerVersionPrompt({
	bundleVersion,
	serverBundleVersion,
	onClickRefresh,
}: INewerVersionPromptProps) {
	const [isRefreshing, setIsRefreshing] = useState(false);

	const handleRefreshClicked = () => {
		setIsRefreshing(true);
		onClickRefresh();
	};

	if (bundleVersion === serverBundleVersion) {
		return null;
	}

	return (
		<div className={styles.root}>
			<div>
				<div>There is a new version of the tool available.</div>
				<div className={styles.versions}>
					<div>Client Version: {bundleVersion}</div>
					<div>Server Version: {serverBundleVersion}</div>
				</div>
			</div>
			<Button
				variant="primary"
				isDisabled={isRefreshing}
				isProcessing={isRefreshing}
				className={styles.refresh}
				onClick={handleRefreshClicked}
			>
				Refresh
			</Button>
		</div>
	);
}
