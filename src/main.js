import { el } from "./lib/elements.js";
import { renderErrorPage, fetchJSON } from "./lib/util.js";
import { renderContentPage, renderTypePage, renderIndexPage } from "./lib/renderPage.js";
import { renderLecture } from "./lib/renderSubpage.js";



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
			console.log(e.message);
		}	
	}
	else if(searchParams.size === 3 && searchParams.get("content") === "lectures")
	{
		if(searchParams.get("type") === "javascript")
			path = `../data/js/${searchParams.get("content")}.json`;
		else
			path = `../data/${searchParams.get("type")}/${searchParams.get("content")}.json`;

		const lectureJson = await fetchJSON(path);
		for(const lecture of lectureJson.lectures)
		{
			if(lecture.slug === searchParams.get("lecture"))
			{
				const lecture_el = renderLecture(lecture);
				body.appendChild(lecture_el);
				break;
			}
		}
	}
}

await render();
