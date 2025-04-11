import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import { VerticalLayout } from "~/components";
import { ExpensesContainer } from "~/pages";
import { IncomesContainer } from "~/pages";

export function Configure() {
	return (
		<VerticalLayout>
			<Tabs>
				<TabList>
					<Tab>Expenses</Tab>
					<Tab>Incomes</Tab>
					<Tab>Categories</Tab>
				</TabList>
				<TabPanel>
					<ExpensesContainer />
				</TabPanel>
				<TabPanel>
					<IncomesContainer />
				</TabPanel>
				<TabPanel>
					<div>TODO: Categories</div>
				</TabPanel>
			</Tabs>
		</VerticalLayout>
	);
}
