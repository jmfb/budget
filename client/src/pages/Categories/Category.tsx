import { Card, CardActionArea, CardContent, Typography } from "@mui/material";
import { ICategory } from "~/models";

export interface CategoryProps {
	category: ICategory;
	onClick(): void;
}

export function Category({ category, onClick }: CategoryProps) {
	return (
		<Card>
			<CardActionArea onClick={onClick}>
				<CardContent>
					<Typography variant="body1">{category.name}</Typography>
				</CardContent>
			</CardActionArea>
		</Card>
	);
}
