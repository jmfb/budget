import { get, getOrDefault, send } from "./hub";
import {
	ICategory,
	ICreateCategoryRequest,
	IRetireCategoryRequest,
	IUpdateCategoryRequest,
} from "~/models";

const baseUrl = import.meta.env.VITE_API_URL;

export async function getCategories(accessToken: string) {
	return await get<ICategory[]>({
		baseUrl,
		accessToken,
		endpoint: "/api/categories",
	});
}

export async function getCategory(accessToken: string, id: number) {
	return await getOrDefault<ICategory>({
		baseUrl,
		accessToken,
		endpoint: `/api/categories/${id}`,
	});
}

export async function createCategory(
	accessToken: string,
	request: ICreateCategoryRequest,
) {
	return await get<number>({
		baseUrl,
		accessToken,
		endpoint: "/api/categories",
		method: "POST",
		body: request,
	});
}

export async function updateCategory(
	accessToken: string,
	id: number,
	request: IUpdateCategoryRequest,
) {
	await send({
		baseUrl,
		accessToken,
		endpoint: `/api/categories/${id}`,
		method: "PUT",
		body: request,
	});
}

export async function deleteCategory(accessToken: string, id: number) {
	await send({
		baseUrl,
		accessToken,
		endpoint: `/api/categories/${id}`,
		method: "DELETE",
	});
}

export async function retireCategory(
	accessToken: string,
	request: IRetireCategoryRequest,
) {
	await send({
		baseUrl,
		accessToken,
		endpoint: `/api/categories/commands/retire`,
		method: "POST",
		body: request,
	});
}
