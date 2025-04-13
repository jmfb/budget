import { Meta, StoryObj } from "@storybook/react";
import { Uploads } from "./Uploads";
import { fn } from "@storybook/test";
import { makeStoreDecorator } from "~/decorators";

const meta = {
	component: Uploads,
	args: {
		isReadingFile: false,
		readingFileSuccess: false,
		fileText: "",
		isParsingCsv: false,
		parsingCsvSuccess: false,
		csvRecords: [],
		isMergingTransaction: false,
		mergingTransactionSuccess: false,
		logs: "",
		isLoading: false,
		getAllText: fn(),
		parseCsv: fn(),
		mergeTransaction: fn(),
		clearUpload: fn(),
		clearLogs: fn(),
	},
	decorators: [makeStoreDecorator()],
} satisfies Meta<typeof Uploads>;

export default meta;
type Story = StoryObj<typeof meta>;

export const standard: Story = {};

export const loading: Story = { args: { isLoading: true } };

export const isReadingFile: Story = { args: { isReadingFile: true } };

export const isParsingCsv: Story = { args: { isParsingCsv: true } };

export const mockParsedRecords: Story = {
	args: {
		readingFileSuccess: true,
		fileText:
			"2025-03-25,12345678,Some groceries,123,Shopping,Tues. stuff,0,200.00",
		parsingCsvSuccess: true,
		csvRecords: [
			[
				"2025-03-25",
				"12345678",
				"Some groceries",
				"123",
				"Shopping",
				"Tues. stuff",
				"0",
				"200.00",
			],
		],
	},
};
