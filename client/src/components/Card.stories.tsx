import React from 'react';
import { Story, Meta } from '@storybook/react';
import Card, { ICardProps } from './Card';
import Button from './Button';
import '~/index.css';

export default {
	title: 'Components/Card',
	component: Card
} as Meta;

const Template: Story<ICardProps> = props => (
	<Card {...props}>
		<h2>Example</h2>
		<div>This is a card</div>
		<Button onClick={() => console.log('click')}>OK</Button>
	</Card>
);

export const Default = Template.bind({});
