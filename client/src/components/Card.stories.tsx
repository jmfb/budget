import React from 'react';
import { Card, ICardProps } from './Card';
import { Button } from './Button';
import '~/index.module.css';

export default {
	title: 'Components/Card',
	component: Card
};

function Template(props: ICardProps) {
	return (
		<Card {...props}>
			<h2>Example</h2>
			<div>This is a card</div>
			<Button
				variant='primary'
				onClick={() => console.log('click')}>
				OK
			</Button>
		</Card>
	);
}

export const Default = Template.bind({});
