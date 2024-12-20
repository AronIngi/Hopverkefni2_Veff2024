import { el } from "./elements.js";
import {
  renderLectures,
  renderKeywords,
  renderQuestions,
} from "./renderSubpage.js";

function renderContent(json) {
  const div = el("div", {});

  for (const item of json.content) {
    const url = new URL(window.location);
    const search_params = new URLSearchParams(url.search);
    search_params.append("content", item.slug);
    url.search = search_params;

    const section = el("section", {});
    const title = el("h2", {}, item.title);
    const link = el("a", { href: url.href }, item.text);

    section.appendChild(title);
    section.appendChild(link);
    div.append(section);
  }

  return div;
}

function renderNav(json) {
  const nav = el("nav", {});
  const list = el("ul", {});

  for (const item of json.navigation) {
    const search_params = new URLSearchParams({
      type: item.slug,
    });
    const url = new URL(window.location);
    url.search = search_params.toString();
    const list_item = el("li", {});
    const link = el("a", { href: url.href }, item.title);
    list_item.appendChild(link);
    list.appendChild(list_item);
  }
  nav.appendChild(list);
  return nav;
}

function flashcardNextHandler() {
  const current = document.querySelector(".current");
  let next;
  if (current.nextSibling != null) next = current.nextSibling;
  else next = document.querySelector("#flashcards").firstChild;
  current.setAttribute("class", "hidden");
  next.setAttribute("class", "current");
}

function flashcardPrevHandler() {
  const current = document.querySelector(".current");
  let prev;
  if (current.previousSibling != null) prev = current.previousSibling;
  else prev = document.querySelector("#flashcards").lastChild;
  current.setAttribute("class", "hidden");
  prev.setAttribute("class", "current");
}

function flashcardDefHandler() {
  const current = document.querySelector(".current");
  const title = current.querySelector(".title");
  const content = current.querySelector(".content");

  title.classList.toggle("hidden");
  content.classList.toggle("hidden");
}

export function renderContentPage(json, content_param) {
  const parent_el = el("div", {});
  const header = el("header", {});
  const main = el("main", {});
  const title = el("h1", {}, json.title);
  const back = el("a", { href: "" }, "back");
  back.addEventListener("click", () => {
    history.back();
  });

  header.appendChild(title);
  header.appendChild(back);
  parent_el.appendChild(header);

  if (content_param === "keywords") {
    const keywords = renderKeywords(json);
    main.appendChild(keywords);

    const next_button = el("button", {}, "next");
    const prev_button = el("button", {}, "prev");
    const def_button = el("button", {}, "definition");
    next_button.addEventListener("click", flashcardNextHandler);
    prev_button.addEventListener("click", flashcardPrevHandler);
    def_button.addEventListener("click", flashcardDefHandler);
    main.appendChild(prev_button);
    main.appendChild(next_button);
    main.appendChild(def_button);
  } else if (content_param === "lectures") {
    const lectures = renderLectures(json);
    main.appendChild(lectures);
  } else if (content_param === "questions") {
    const questions = renderQuestions(json);
    main.appendChild(questions);
  }

  parent_el.appendChild(main);
  return parent_el;
}

export function renderTypePage(json) {
  const main = el("main", {});
  const header = el("header", {});
  const title = el("h1", {}, json.title);
  const text = el("p", {}, json.text);
  const back = el("a", { href: "" }, "back");

  back.addEventListener("click", () => {
    history.back();
  });

  header.appendChild(title);
  header.appendChild(back);
  header.appendChild(text);

  const content = renderContent(json);

  main.appendChild(header);
  main.appendChild(content);

  return main;
}

export function renderIndexPage(json) {
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
