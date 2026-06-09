const body = document.body;
const views = [...document.querySelectorAll("[data-view]")];
const menu = document.querySelector("[data-menu]");
const toast = document.querySelector("[data-toast]");
let toastTimer;

document.querySelectorAll("[data-reel]").forEach((track) => {
  const group = track.querySelector(".reel-group");
  const duplicate = group.cloneNode(true);

  duplicate.setAttribute("aria-hidden", "true");
  duplicate.querySelectorAll("article").forEach((card) => card.removeAttribute("aria-label"));
  track.appendChild(duplicate);
});

function closeMenu() {
  menu.classList.remove("is-open");
  menu.setAttribute("aria-hidden", "true");
}

function showView(name) {
  closeMenu();
  views.forEach((view) => {
    const isTarget = view.dataset.view === name;
    view.classList.toggle("is-open", isTarget);
    view.setAttribute("aria-hidden", String(!isTarget));
  });
  body.classList.toggle("view-is-open", Boolean(name));
  history.replaceState(null, "", name ? `#${name}` : location.pathname);
  if (name) document.querySelector(`[data-view="${name}"]`).scrollTop = 0;
}

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("is-visible");
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 3000);
}

document.querySelectorAll("[data-open-view]").forEach((button) => {
  button.addEventListener("click", () => showView(button.dataset.openView));
});

document.querySelectorAll("[data-close-view], [data-home]").forEach((button) => {
  button.addEventListener("click", () => showView(""));
});

document.querySelector("[data-open-menu]").addEventListener("click", () => {
  menu.classList.add("is-open");
  menu.setAttribute("aria-hidden", "false");
});

document.querySelector("[data-close-menu]").addEventListener("click", closeMenu);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (menu.classList.contains("is-open")) closeMenu();
    else showView("");
  }
});

document.querySelectorAll("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    document.querySelectorAll("[data-filter]").forEach((item) => item.classList.toggle("is-active", item === button));
    document.querySelectorAll("[data-category]").forEach((card) => {
      card.hidden = filter !== "all" && !card.dataset.category.split(" ").includes(filter);
    });
  });
});

document.querySelectorAll("[data-gift]").forEach((button) => {
  button.addEventListener("click", () => showToast(`${button.dataset.gift} added to your Celtra bag.`));
});

document.querySelector("[data-seller-form]").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const studio = new FormData(form).get("studio");
  form.innerHTML = `<div class="form-success"><span>Request received</span><h3>Welcome to the beginning, ${studio}.</h3><p>We'll review your work and send next steps to your inbox. In the meantime, keep making.</p><button type="button" data-success-home>Return home</button></div>`;
  form.querySelector("[data-success-home]").addEventListener("click", () => showView(""));
});

const initialView = location.hash.slice(1);
if (views.some((view) => view.dataset.view === initialView)) showView(initialView);
