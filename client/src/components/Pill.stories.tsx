import { Meta, StoryObj } from "@storybook/react";
import { Pill } from "./Pill";

const meta = {
	component: Pill,
	render(props) {
		return (
			<span style={{ display: "inline-block" }}>
				<Pill {...props}>Example</Pill>
			</span>
		);
	},
} satisfies Meta<typeof Pill>;

export default meta;
type Story = StoryObj<typeof meta>;

export const info: Story = { args: { type: "info" } };

export const danger: Story = { args: { type: "danger" } };

export const success: Story = { args: { type: "success" } };
