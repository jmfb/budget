import { Meta, StoryObj } from "@storybook/react";
import { Card } from "./Card";
import { Button } from "@mui/material";

const meta = {
	component: Card,
	render(props) {
		return (
			<Card {...props}>
				<h2>Example</h2>
				<div>This is a card</div>
				<Button variant="contained" color="primary" onClick={() => console.log("click")}>
					OK
				</Button>
			</Card>
		);
	},
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const standard: Story = {};

export const clickable: Story = { args: { onClick: () => undefined } };
