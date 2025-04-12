import { bindActionCreators } from "@reduxjs/toolkit";
import { categoriesHub } from "~/api";
import {
	ICreateCategoryRequest,
	IRetireCategoryRequest,
	IUpdateCategoryRequest,
} from "~/models";
import { IAsyncActionOptions } from "./IAsyncActionOptions";
import { categoriesSlice } from "./categories.slice";
import { expensesSlice } from "./expenses.slice";
import { transactionsSlice } from "./transactions.slice";

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

export async function updateCategory(
	parameters: { categoryId: number; request: IUpdateCategoryRequest },
	{ getState, dispatch }: IAsyncActionOptions,
) {
	const { categoryId, request } = parameters;
	const { accessToken } = getState().auth;
	const actions = bindActionCreators(categoriesSlice.actions, dispatch);
	await categoriesHub.updateCategory(accessToken, categoryId, request);
	const category = await categoriesHub.getCategory(accessToken, categoryId);
	if (category === null) {
		throw new Error(`Category ${categoryId} was not found after update`);
	}
	actions.updateCategory(category);
}

export async function deleteCategory(
	categoryId: number,
	{ getState, dispatch }: IAsyncActionOptions,
) {
	const { accessToken } = getState().auth;
	const actions = bindActionCreators(categoriesSlice.actions, dispatch);
	await categoriesHub.deleteCategory(accessToken, categoryId);
	actions.deleteCategory(categoryId);
}

export async function retireCategory(
	request: IRetireCategoryRequest,
	{ getState, dispatch }: IAsyncActionOptions,
) {
	const { accessToken } = getState().auth;
	const actions = bindActionCreators(categoriesSlice.actions, dispatch);
	await categoriesHub.retireCategory(accessToken, request);
	actions.deleteCategory(request.retireId);
	dispatch(expensesSlice.actions.retireCategory(request));
	dispatch(transactionsSlice.actions.retireCategory(request));
}
