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
	const back = el("a", {href: ""}, "back");
	back.addEventListener("click", () => {history.back()});

	heading.appendChild(title);
	heading.appendChild(back);
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

function submitHandler(e)
{
	e.preventDefault();
	for(const checkbox of document.querySelectorAll("input[type='checkbox']"))
	{
		const checkbox_fieldset = checkbox.parentElement.parentElement
		if(checkbox.checked && checkbox.value === "true")
		{
			checkbox_fieldset.querySelector(".correct").classList.remove("hidden");
			checkbox_fieldset.querySelector(".incorrect").classList.add("hidden");
		}
		else if(checkbox.checked && checkbox.value === "false")
		{
			checkbox_fieldset.querySelector(".correct").classList.add("hidden");
			checkbox_fieldset.querySelector(".incorrect").classList.remove("hidden");
		}
	}
}

export function renderQuestions(json)
{
	const form = el("form", {action: `${window.location}`,method: "POST"});

	for(const question of json.questions)
	{
		const set = el("fieldset", {});
		const question_el = el("legend", {}, question.question);
		const incorrect_text = el("p", {class: "incorrect hidden"}, "incorrect");
		const correct_text = el("p", {class: "correct hidden"}, "correct");
		set.appendChild(question_el);
		for(const answer of question.answers)
		{
			const inline_el = el("div", {});
			const label = el("label", {}, answer.answer);
			const input = el("input", {type: "checkbox", value: answer.correct});
			inline_el.appendChild(label);
			inline_el.appendChild(input);
			set.appendChild(inline_el);
		}
		set.appendChild(correct_text);
		set.appendChild(incorrect_text);
		form.appendChild(set);
	}
	
	const submit_button = el("input", {type:"submit"});
	form.appendChild(submit_button);
	form.addEventListener("submit", submitHandler);
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
