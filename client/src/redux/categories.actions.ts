import { bindActionCreators } from "@reduxjs/toolkit";
import { categoriesHub } from "~/api";
import { ICreateCategoryRequest } from "~/models";
import { IAsyncActionOptions } from "./IAsyncActionOptions";
import { categoriesSlice } from "./categories.slice";

export async function createCategory(
	request: ICreateCategoryRequest,
	{ getState, dispatch }: IAsyncActionOptions,
) {
	const { accessToken } = getState().auth;
	const actions = bindActionCreators(categoriesSlice.actions, dispatch);
	const categoryId = await categoriesHub.createCategory(accessToken, request);
	const category = await categoriesHub.getCategory(accessToken, categoryId);
	if (category === null) {
		throw new Error(`Category ${categoryId} was not found after create`);
	}
	actions.createCategory(category);
	return category;
}
