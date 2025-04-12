import { Card } from "~/components";
import { ICategory } from "~/models";

export interface CategoryProps {
	category: ICategory;
	onClick(): void;
}

export function Category({ category, onClick }: CategoryProps) {
	return <Card onClick={onClick}>{category.name}</Card>;
}
