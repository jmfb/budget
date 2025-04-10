import { Meta, StoryObj } from "@storybook/react";
import { BrowserRouter } from "react-router-dom";
import { Header } from "./Header";

const meta = {
	component: Header,
	render() {
		return (
			<BrowserRouter>
				<Header />
			</BrowserRouter>
		);
	},
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const standard: Story = {};
