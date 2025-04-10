import { createElement } from "react";
import { RouterProvider, createMemoryRouter } from "react-router-dom";

export function makeRouterDecorator(
	path = "/",
	initialEntry: string | undefined = undefined,
) {
	return (Story: any, context: any) => (
		<RouterProvider
			router={createMemoryRouter(
				[{ path, element: createElement(Story, context) }],
				{
					initialEntries: [initialEntry ?? path],
				},
			)}
		/>
	);
}
