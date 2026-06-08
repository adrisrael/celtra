document.querySelectorAll("[data-reel]").forEach((track) => {
  const group = track.querySelector(".reel-group");
  const duplicate = group.cloneNode(true);

  duplicate.setAttribute("aria-hidden", "true");
  duplicate.querySelectorAll("article").forEach((card) => card.removeAttribute("aria-label"));
  track.appendChild(duplicate);
});
