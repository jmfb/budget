import { Link } from "react-router-dom";
import { MdExitToApp, MdFavorite } from "react-icons/md";
import { HorizontalLayout, VerticalLayout } from "~/components";

export function About() {
	return (
		<VerticalLayout>
			<HorizontalLayout
				horizontalAlign="justified"
				verticalAlign="center"
				width="100%"
			>
				<strong>Jake and Sarah's Budget App</strong>
				<Link to="/sign-out">
					<HorizontalLayout gap="narrow" verticalAlign="center">
						<span>Sign Out</span>
						<MdExitToApp />
					</HorizontalLayout>
				</Link>
			</HorizontalLayout>
			<div>Version 2</div>
			<HorizontalLayout verticalAlign="center" gap="small">
				<span>For the wife I love</span>
				<MdFavorite />
			</HorizontalLayout>
		</VerticalLayout>
	);
}
