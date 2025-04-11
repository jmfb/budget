import { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
import { Input } from "./Input";
import { fn } from "@storybook/test";

const meta = {
	component: Input,
	render(props) {
		const [value, setValue] = useState(props.value);
		return <Input {...props} value={value} onChange={setValue} />;
	},
	args: {
		name: "Name",
		value: "",
		onChange: fn(),
	},
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const standard: Story = {};

export const number: Story = { args: { type: "number" } };

export const placeholder: Story = {
	args: { placeholder: "Type something..." },
};

export const autoFocus: Story = { args: { autoFocus: true } };

export const disabled: Story = { args: { isDisabled: true } };
