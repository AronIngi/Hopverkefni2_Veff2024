import { el } from "./lib/elements.js";

async function fetchJSON(path)
{
	const response = await fetch(path);
	const json = await response.json();

	return json;
}

function renderContent(json)
{
	const div = el("div", {});

	for(const item of json.content)
	{
		const url = new URL(window.location);
		const search_params = new URLSearchParams(url.search);
		search_params.append("content", item.slug);
		url.search = search_params;

		const section = el("section", {});
		const title = el("h1", {}, item.title);
		const link = el("a", {href: url.href}, item.text);

		section.appendChild(title);
		section.appendChild(link);
		div.append(section);
	}

	return div;
}

function renderNav(json)
{
	const nav = el("nav", {});
	const list = el("ul", {});

	for(const item of json.navigation)
	{
		const search_params = new URLSearchParams({
			type: item.slug
		});
		const url = new URL(window.location);
		url.search = search_params.toString();
		const list_item = el("li", {});
		const link = el("a", {href: url.href}, item.title);
		list_item.appendChild(link);
		list.appendChild(list_item);
	}
	nav.appendChild(list);
	return nav;
}

function renderTypePage(json)
{
	const main = el("main", {});
	const header = el("header", {});
	const title = el("h1", {}, json.title);
	const text = el("p", {}, json.text);

	header.appendChild(title);
	header.appendChild(text);

	const content = renderContent(json);

	main.appendChild(header);
	main.appendChild(content);

	return main
}

function renderIndexPage(json)
{
	const main = el("main", {});
	const header = el("header", {});
	const title = el("h1", {});
	title.textContent = json.title;
	const description = el("p", {});
	description.textContent = json.description;

	header.appendChild(title);
	header.appendChild(description);

	const nav = renderNav(json);

	const footer = el("footer", {}, el("p", {}, "Áfram vefforritun"));

	main.appendChild(header);
	main.appendChild(nav);
	main.appendChild(footer);
	return main;
}

async function render()
{
	const body = document.body;
	const searchParams = new URLSearchParams(window.location.search);
	let path;

	if(searchParams.size === 0)
	{
		const indexJson = await fetchJSON("../data/index.json");
		const indexPage = renderIndexPage(indexJson);
		body.appendChild(indexPage);
	}
	else if(searchParams.size === 1)
	{
		if(searchParams.get("type") === "javascript")
			path = `../data/js/index.json`;
		else
			path = `../data/${searchParams.get("type")}/index.json`;

		const typeJson = await fetchJSON(path);
		const typePage = renderTypePage(typeJson);
		body.appendChild(typePage);
	}
	else if(searchParams.size === 2)
	{
		if(searchParams.get("type") === "javascript")
			path = `../data/js/${searchParams.get("content")}.json`;
		else
			path = `../data/${searchParams.get("type")}/${searchParams.get("content")}.json`;

		const contentJson = await fetchJSON(path);
		console.log(contentJson);
	}
}

await render();
