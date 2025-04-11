import { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "./Checkbox";
import { fn } from "@storybook/test";

const meta = {
	component: Checkbox,
	render(props) {
		const [value, setValue] = useState(props.value);
		return <Checkbox {...props} value={value} onChange={setValue} />;
	},
	args: {
		name: "Is distributed?",
		value: false,
		onChange: fn(),
	},
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const standard: Story = {};

export const selected: Story = { args: { value: true } };

export const disabled: Story = { args: { isDisabled: true } };
