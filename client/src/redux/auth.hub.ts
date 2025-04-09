import { get } from './hub';
import { ISignedInModel } from '~/models';

const redirectUrl = `${location.origin}/authenticate`;

export async function getAuthenticationUrl() {
	return await get<string>({
		endpoint: '/api/authentication/url',
		query: {
			redirectUrl
		}
	});
}

export async function signIn(authorizationCode: string) {
	return await get<ISignedInModel>({
		endpoint: '/api/authentication/sign-in',
		query: {
			redirectUrl,
			authorizationCode
		}
	});
}
