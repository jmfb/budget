import { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
import { NumberField } from "./NumberField";
import { fn } from "@storybook/test";

const meta = {
	component: NumberField,
	render(props) {
		const [value, setValue] = useState(props.value);
		return (
			<NumberField {...props} value={value} onValueChange={setValue} />
		);
	},
	args: {
		label: "Interval",
		value: 0,
		onValueChange: fn(),
	},
} satisfies Meta<typeof NumberField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const standard: Story = {};

export const withValue: Story = { args: { value: 12 } };

export const disabled: Story = { args: { disabled: true } };
