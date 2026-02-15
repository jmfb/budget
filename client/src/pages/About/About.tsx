import { Link as RouterLink } from "react-router-dom";
import { Grid, Typography, Link } from "@mui/material";
import { ExitToApp, Favorite } from "@mui/icons-material";

export function About() {
	return (
		<Grid container direction="column" spacing={2}>
			<Grid
				container
				direction="row"
				justifyContent="space-between"
				alignItems="center"
				width="100%"
			>
				<Typography variant="h5">
					Jake and Sarah's Budget App
				</Typography>
				<Link component={RouterLink} to="/sign-out">
					<Grid
						container
						direction="row"
						spacing={0.5}
						alignItems="center"
					>
						<span>Sign Out</span>
						<ExitToApp />
					</Grid>
				</Link>
			</Grid>
			<Typography variant="body1">Version 2</Typography>
			<Grid container direction="row" alignItems="center" spacing={1}>
				<span>For the wife I love</span>
				<Favorite color="error" />
			</Grid>
		</Grid>
	);
}
