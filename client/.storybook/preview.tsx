import React from "react";
import { Preview } from "@storybook/react";
import { MuiProvider } from "../src/MuiProvider";
import "@csstools/normalize.css";
import "../src/index.css";

const preview: Preview = {
	parameters: {
		actions: { argTypesRegex: "^on[A-Z].*" },
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/,
			},
		},
	},
	decorators: [
		(Story) => (
			<MuiProvider>
				<Story />
			</MuiProvider>
		),
	],
};

export default preview;
