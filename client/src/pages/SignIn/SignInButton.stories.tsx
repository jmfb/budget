import { SignInButton, ISignInButtonProps } from './SignInButton';
import '~/index.module.css';

export default {
	title: 'Pages/SignIn/SignInButton',
	component: SignInButton
};

function Template(props: ISignInButtonProps) {
	return <SignInButton {...props} />;
}

export const Light = Template.bind({});
Light.args = {
	style: 'light'
};

export const LightDisabled = Template.bind({});
LightDisabled.args = {
	style: 'light',
	isDisabled: true
};

export const Dark = Template.bind({});
Dark.args = {
	style: 'dark'
};

export const DarkDisabled = Template.bind({});
DarkDisabled.args = {
	style: 'light',
	isDisabled: true
};
