import { saveAs } from "file-saver";
import { parse } from "content-disposition";

async function checkStatus(response: Response) {
	const { status, statusText } = response;
	if (status < 200 || status >= 300) {
		const error = await response.text();
		const errorMessage = `${status} - ${statusText}\n${error}`;
		throw new Error(errorMessage);
	}
}

function getHeaders(accept: string, accessToken?: string) {
	return {
		Accept: accept,
		"Content-Type": "application/json",
		...(accessToken === undefined
			? {}
			: { Authorization: `Bearer ${accessToken}` }),
	};
}

function getStandardHeaders(accessToken?: string) {
	return getHeaders("application/json", accessToken);
}

function formatUri(endpoint: string, query?: Record<string, string>) {
	return query ? `${endpoint}?${new URLSearchParams(query)}` : endpoint;
}

type HttpMethod = "GET" | "PUT" | "POST" | "PATCH" | "DELETE";

interface IFetchRequest {
	endpoint: string;
	query?: Record<string, string>;
	accessToken?: string;
	method?: HttpMethod;
	body?: object;
}

export async function get<T>(request: IFetchRequest) {
	const { endpoint, query, accessToken, method, body } = request;
	const response = await fetch(formatUri(endpoint, query), {
		method: method ?? "GET",
		headers: getStandardHeaders(accessToken),
		body: body ? JSON.stringify(body) : undefined,
	});
	await checkStatus(response);
	return (await response.json()) as T;
}

export async function getOrDefault<T>(request: IFetchRequest) {
	const { endpoint, query, accessToken, method, body } = request;
	const response = await fetch(formatUri(endpoint, query), {
		method: method ?? "GET",
		headers: getStandardHeaders(accessToken),
		body: body ? JSON.stringify(body) : undefined,
	});
	if (response.status === 404) {
		return null;
	}
	await checkStatus(response);
	return (await response.json()) as T;
}

export async function send(request: IFetchRequest) {
	const { endpoint, query, accessToken, method, body } = request;
	const response = await fetch(formatUri(endpoint, query), {
		method: method ?? "GET",
		headers: getStandardHeaders(accessToken),
		body: body ? JSON.stringify(body) : undefined,
	});
	await checkStatus(response);
}

export async function download(request: IFetchRequest) {
	const { endpoint, query, accessToken, method, body } = request;
	const response = await fetch(formatUri(endpoint, query), {
		method: method ?? "GET",
		headers: getHeaders("*/*", accessToken),
		body: body ? JSON.stringify(body) : undefined,
	});
	await checkStatus(response);
	const {
		parameters: { filename },
	} = parse(response.headers.get("content-disposition") ?? "");
	saveAs(await response.blob(), filename);
}
