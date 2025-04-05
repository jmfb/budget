import type { StorybookConfig } from "@storybook/react-vite";
import { join, dirname } from "path";

function getAbsolutePath(value: string) {
	return dirname(require.resolve(join(value, "package.json")));
}

const config: StorybookConfig = {
	stories: ["../src/**/*.stories.tsx"],
	addons: [
		getAbsolutePath("@storybook/addon-links"),
		getAbsolutePath("@storybook/addon-essentials"),
	],
	framework: getAbsolutePath("@storybook/react-vite"),
	core: {
		disableTelemetry: true,
	},
	docs: {
		autodocs: "tag",
	},
	typescript: {
		reactDocgen: false,
	},
};

export default config;
