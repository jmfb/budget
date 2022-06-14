import queryString from 'query-string';

async function checkStatus(response: Response) {
	const { status, statusText } = response;
	if (status < 200 || status >= 300) {
		const error = await response.text();
		const errorMessage = `${status} - ${statusText}\n${error}`;
		throw new Error(errorMessage);
	}
}

function getStandardHeaders(accessToken?: string) {
	return {
		Accept: 'application/json',
		'Content-Type': 'application/json',
		...(accessToken === undefined
			? {}
			: { Authorization: `Bearer ${accessToken}` })
	};
}

function formatUri(endpoint: string, query?: any) {
	return query ? `${endpoint}?${queryString.stringify(query)}` : endpoint;
}

interface IGetRequest {
	endpoint: string;
	query?: any;
	accessToken?: string;
}

export async function get<T>(request: IGetRequest) {
	const { endpoint, query, accessToken } = request;
	const response = await fetch(formatUri(endpoint, query), {
		headers: getStandardHeaders(accessToken)
	});
	await checkStatus(response);
	return (await response.json()) as T;
}

interface ISendRequest extends IGetRequest {
	body?: any;
}

export async function put(request: ISendRequest) {
	const { endpoint, query, accessToken, body } = request;
	const response = await fetch(formatUri(endpoint, query), {
		method: 'PUT',
		headers: getStandardHeaders(accessToken),
		body: body ? JSON.stringify(body) : undefined
	});
	await checkStatus(response);
}

export async function del(request: ISendRequest) {
	const { endpoint, query, accessToken, body } = request;
	const response = await fetch(formatUri(endpoint, query), {
		method: 'DELETE',
		headers: getStandardHeaders(accessToken),
		body: body ? JSON.stringify(body) : undefined
	});
	await checkStatus(response);
}
