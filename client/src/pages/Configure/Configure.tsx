import { type SyntheticEvent, useState } from "react";
import { Grid, Tab } from "@mui/material";
import { TabContext, TabList } from "@mui/lab";
import { ExpensesContainer, IncomesContainer, Categories } from "~/pages";

export function Configure() {
	const [selectedIndex, setSelectedIndex] = useState("1");

	const handleChanged = (_: SyntheticEvent, newValue: string) => {
		setSelectedIndex(newValue);
	};

	return (
		<Grid container direction="column" spacing={2}>
			<TabContext value={selectedIndex}>
				<TabList onChange={handleChanged}>
					<Tab label="Expenses" value="1" />
					<Tab label="Incomes" value="2" />
					<Tab label="Categories" value="3" />
				</TabList>
				{selectedIndex === "1" && <ExpensesContainer />}
				{selectedIndex === "2" && <IncomesContainer />}
				{selectedIndex === "3" && <Categories />}
			</TabContext>
		</Grid>
	);
}
