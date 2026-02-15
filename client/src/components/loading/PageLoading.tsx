import { Grid, Backdrop, CircularProgress, Typography } from "@mui/material";

export interface IPageLoadingProps {
	message?: string;
}

export function PageLoading({ message }: IPageLoadingProps) {
	return (
		<Backdrop open>
			<Grid container direction="column" spacing={2} alignItems="center">
				{message && <Typography variant="h5">{message}</Typography>}
				<CircularProgress />
			</Grid>
		</Backdrop>
	);
}
