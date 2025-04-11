import { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
import { Switch } from "./Switch";
import { fn } from "@storybook/test";

const meta = {
	component: Switch,
	render(props) {
		const [value, setValue] = useState(props.checked);
		return <Switch {...props} checked={value} onChange={setValue} />;
	},
	args: {
		children: "Only show new items",
		checked: false,
		onChange: fn(),
	},
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const standard: Story = {};

export const checked: Story = { args: { checked: true } };
