import { Chip } from "@mui/material";

export interface IPillProps {
	type: "info" | "danger" | "success" | "new";
	className?: string;
	children?: React.ReactNode;
}

export function Pill({ type, className, children }: IPillProps) {
	return (
		<Chip
			className={className}
			variant="filled"
			size="small"
			color={
				type === "info"
					? "warning"
					: type === "danger"
						? "error"
						: type === "success"
							? "success"
							: "primary"
			}
			label={children}
		/>
	);
}
