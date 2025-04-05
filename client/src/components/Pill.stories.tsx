import { Pill, IPillProps } from "./Pill";
import "~/index.module.css";

export default {
	title: "Components/Pill",
	component: Pill,
};

function Template(props: IPillProps) {
	return (
		<span style={{ display: "inline-block" }}>
			<Pill {...props}>Example</Pill>
		</span>
	);
}

export const Info = Template.bind({});
Info.args = {
	type: "info",
};

export const Danger = Template.bind({});
Danger.args = {
	type: "danger",
};

export const Success = Template.bind({});
Success.args = {
	type: "success",
};
