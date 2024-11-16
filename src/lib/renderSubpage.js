import { el } from "./elements.js";

function createList(data)
{
	const list = el("ul", {});
	for(const item of data)
	{
		const list_item = el("li", {});
		const item_text = el("p", {}, item);
		list_item.appendChild(item_text);
		list.appendChild(list_item);
	}
	return list;
}

export function renderLecture(json)
{
	const lecture = el("div", {});
	const heading = el("heading", {});
	const main = el("main", {});

	const title = el("h1", {}, json.title);
	heading.appendChild(title);
	for(const item of json.content)
	{
		switch(item.type)
		{
			case 'heading':
				const heading = el("h2", {}, item.data);
				main.append(heading);
				break;
			case 'text':
				const text = el("p", {}, item.data);
				main.appendChild(text);
				break;
			case 'quote':
				const quote = el("blockquote", {cite: item.attribute}, item.data);
				main.appendChild(quote);
				if("attribute" in item)
				{
					const citation = el("cite", {}, `-${item.attribute}`);
					main.appendChild(citation);
				}
				break;
			case 'image':
				const image = el("img", {src: `../${item.data}`})
				const caption = el("p", {}, item.caption);
				main.appendChild(image);
				main.appendChild(caption);
				break;
			case 'list':
				const list = createList(item.data);
				main.appendChild(list);
				break;
		}
	}
	lecture.appendChild(heading);
	lecture.appendChild(main);
	return lecture;
}

export function renderQuestions(json)
{
	const form = el("form", {});

	for(const question of json.questions)
	{
		const set = el("fieldset", {});
		const question_el = el("legend", {}, question.question);
		set.appendChild(question_el);
		for(const answer of question.answers)
		{
			const inline_el = el("div", {});
			const label = el("label", {}, answer.answer);
			const input = el("input", {type: "checkbox"});
			inline_el.appendChild(label);
			inline_el.appendChild(input);
			set.appendChild(inline_el);
		}
		form.appendChild(set);
	}
	
	return form;
}

export function renderLectures(json)
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

export function renderKeywords(json)
{
	const div = el("div", {id: "flashcards"});

	let current = null;
	for(const item of json.keywords)
	{
		const section = el("section", {});

		if(current === null)
		{
			section.setAttribute("class", "current");
			current = section;
		}
		else
			section.setAttribute("class", "hidden");

		const title = el("h2", {class: "title"}, item.title);
		const content = el("p", {class: "content hidden"}, item.content);

		section.appendChild(title);
		section.appendChild(content);
		div.appendChild(section);
	}
	return div;
}
