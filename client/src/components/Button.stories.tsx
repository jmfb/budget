import { Button, IButtonProps } from './Button';
import '~/index.module.css';

export default {
	title: 'Components/Button',
	component: Button
};

function Template(props: IButtonProps) {
	return <Button {...props}>Example</Button>;
}

export const Default = Template.bind({});

export const Disabled = Template.bind({});
Disabled.args = {
	isDisabled: true
};

export const Processing = Template.bind({});
Processing.args = {
	isDisabled: true,
	isProcessing: true
};
