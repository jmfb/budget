import { BrowserRouter } from "react-router-dom";
import { Header } from "./Header";
import "~/index.module.css";

export default {
	title: "Containers/Application/Header",
	component: Header,
};

function Template() {
	return (
		<BrowserRouter>
			<Header />
		</BrowserRouter>
	);
}

export const Default = Template.bind({});
Default.args = {};
