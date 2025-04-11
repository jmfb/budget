import { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
import { NumberInput } from "./NumberInput";
import { fn } from "@storybook/test";

const meta = {
	component: NumberInput,
	render(props) {
		const [value, setValue] = useState(props.value);
		return <NumberInput {...props} value={value} onChange={setValue} />;
	},
	args: {
		name: "Interval",
		value: 0,
		onChange: fn(),
	},
} satisfies Meta<typeof NumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const standard: Story = {};

export const withValue: Story = { args: { value: 12 } };

export const disabled: Story = { args: { isDisabled: true } };
