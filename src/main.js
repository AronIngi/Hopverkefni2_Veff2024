import { el } from "./lib/elements.js";

async function fetchJSON(path)
{
	const response = await fetch(path);
	const json = await response.json();

	return json;
}

function renderErrorPage()
{
	const error_message = el("h1", {}, "404 Not Found");
	return error_message;
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
		const title = el("h2", {}, item.title);
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

function renderLectures(json)
{
	const lectures = el("div", {});

	for(const item of json.lectures)
	{
		const url = new URL(window.location);
		const search_params = new URLSearchParams(url.search);
		search_params.append("lecture", item.slug);
		url.search = search_params.toString();

		const section = el("section", {});
		const title = el("h2", {}, item.title);
		const link = el("a", {href: url.href});
		link.appendChild(title);
		section.appendChild(link);
		lectures.appendChild(section);
	}

	return lectures;
}

function renderKeywords(json)
{
	const div = el("div", {});

	for(const item of json.keywords)
	{
		const section = el("section", {});
		const title = el("h2", {}, item.title);
		const content = el("p", {}, item.content);

		section.appendChild(title);
		section.appendChild(content);
		div.appendChild(section);
	}

	return div;
}

function renderContentPage(json, content_param)
{

	const parent_el = el("div", {});
	const header = el("header", {});
	const main = el("main", {});
	const title = el("h1", {}, json.title);

	header.appendChild(title);
	parent_el.appendChild(header);

	if(content_param === "keywords")
	{
		const keywords = renderKeywords(json);
		main.appendChild(keywords);
	}
	else if(content_param === "lectures")
	{
		const lectures = renderLectures(json);
		main.appendChild(lectures);
	}
	else if(content_param === "questions")
	{
		const questions = renderQuestions(json);
		main.appendChild(questions);
	}

	parent_el.appendChild(main);
	return parent_el;
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

		try
		{
			const typeJson = await fetchJSON(path);
			const typePage = renderTypePage(typeJson);
			body.appendChild(typePage);
		}
		catch(e)
		{
			const error_message = renderErrorPage();
			body.append(error_message);
		}
	}
	else if(searchParams.size === 2)
	{
		if(searchParams.get("type") === "javascript")
			path = `../data/js/${searchParams.get("content")}.json`;
		else
			path = `../data/${searchParams.get("type")}/${searchParams.get("content")}.json`;
		
		try
		{
			const contentJson = await fetchJSON(path);
			if(searchParams.get("content") in contentJson)
			{
				console.log(contentJson[searchParams.get("content")]);
				const contentPage = renderContentPage(contentJson, searchParams.get("content"));
				body.appendChild(contentPage);
			}
		}
		catch(e)
		{
			const error_message = renderErrorPage();
			body.appendChild(error_message);
		}	
	}
}

await render();
