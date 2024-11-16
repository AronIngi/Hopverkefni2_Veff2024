import { el } from "./elements.js";

export function renderErrorPage()
{
	const error_message = el("h1", {}, "404 Not Found");
	return error_message;
}

export async function fetchJSON(path)
{
	const response = await fetch(path);
	const json = await response.json();

	return json;
}
