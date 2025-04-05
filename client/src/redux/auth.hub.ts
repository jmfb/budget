import { get } from "./hub";
import { ISignedInModel } from "~/models";

const baseUrl = import.meta.env.VITE_API_URL;
const redirectUrl = `${location.origin}/authenticate`;

export async function getAuthenticationUrl() {
	return await get<string>({
		baseUrl,
		endpoint: "/api/authentication/url",
		query: {
			redirectUrl,
		},
	});
}

export async function signIn(authorizationCode: string) {
	return await get<ISignedInModel>({
		baseUrl,
		endpoint: "/api/authentication/sign-in",
		query: {
			redirectUrl,
			authorizationCode,
		},
	});
}
