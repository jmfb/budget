import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
	server: {
		host: "localbudget.buysse.link",
		port: 6001,
		https: {
			cert: "c:/save/keys/LocalBudgetPublic.pem",
			key: "c:/save/keys/LocalBudgetPrivate.pem",
		},
		strictPort: true,
	},
	build: {
		outDir: "build",
		rollupOptions: {
			output: {
				manualChunks: {
					react: ["react", "react-dom", "react-router-dom"],
					redux: [
						"@reduxjs/toolkit",
						"react-redux",
						"redux",
						"redux-thunk",
					],
					mui: [
						"@mui/material",
						"@mui/lab",
						"@mui/icons-material",
						"@emotion/react",
						"@emotion/styled",
						"@fontsource/roboto",
					],
					addons: [
						"react-icons",
						"react-modal",
						"react-select",
						"react-switch",
						"react-tabs",
					],
					utility: ["clsx", "csv-parse", "file-saver"],
				},
			},
		},
	},
	plugins: [react(), tsconfigPaths(), nodePolyfills()],
});
