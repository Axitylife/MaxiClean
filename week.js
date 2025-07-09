// После container.appendChild(div); — добавим:
div.addEventListener("click", () => {
  if (div.classList.contains("past")) return;

  document.querySelectorAll(".date-block").forEach((el) => {
    el.classList.remove("selected");
    if (!el.classList.contains("past")) el.classList.add("default");
  });

  div.classList.remove("default");
  div.classList.add("selected");

  const selectedDate = date.toLocaleDateString("ru-RU");
  fetchBusyTimes(selectedDate); // 👈 Подгружаем занятые часы
});
