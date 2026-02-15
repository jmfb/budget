import { type ReactNode } from "react";
import {
	ThemeProvider,
	CssBaseline,
	StyledEngineProvider,
	createTheme,
} from "@mui/material";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

export interface MuiProviderProps {
	children: ReactNode;
}

const theme = createTheme({
	palette: {
		mode: "light",
	},
});

export function MuiProvider({ children }: MuiProviderProps) {
	return (
		<StyledEngineProvider injectFirst>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				{children}
			</ThemeProvider>
		</StyledEngineProvider>
	);
}
