import { Preview } from "@storybook/react";
import "@csstools/normalize.css";
import "react-tabs/style/react-tabs.css";
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
};

export default preview;
