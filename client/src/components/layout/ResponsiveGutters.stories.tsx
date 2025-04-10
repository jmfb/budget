import { Meta, StoryObj } from "@storybook/react";
import { ResponsiveGutters } from "./ResponsiveGutters";

const meta = {
	component: ResponsiveGutters,
	args: {
		children: (
			<div style={{ flex: 1, backgroundColor: "lightgray" }}>
				Child Content
			</div>
		),
	},
} satisfies Meta<typeof ResponsiveGutters>;

export default meta;
type Story = StoryObj<typeof meta>;

export const standard: Story = {};
