import { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
import { CurrencyInput } from "./CurrencyInput";
import { fn } from "@storybook/test";

const meta = {
	component: CurrencyInput,
	render(props) {
		const [value, setValue] = useState(props.value);
		return <CurrencyInput {...props} value={value} onChange={setValue} />;
	},
	args: {
		name: "Amount",
		value: 0,
		onChange: fn(),
	},
} satisfies Meta<typeof CurrencyInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const standard: Story = {};

export const withValue: Story = { args: { value: 1234.56 } };

export const autoFocus: Story = { args: { autoFocus: true } };

export const autoFocusWithValue: Story = {
	args: { autoFocus: true, value: 50 },
};

export const disabled: Story = { args: { isDisabled: true } };
