document.addEventListener("DOMContentLoaded", () => {
  const timeBlocks = document.querySelectorAll(".activate_clock");

  timeBlocks.forEach((block) => {
    block.addEventListener("click", () => {
      // Удалить класс selected_clock у всех блоков
      timeBlocks.forEach((el) => el.classList.remove("selected_clock"));

      // Добавить класс selected_clock выбранному элементу
      block.classList.add("selected_clock");
    });
  });
});
function getWeekDates() {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 (вс) - 6 (сб)
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  const weekDates = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + mondayOffset + i);
    weekDates.push(
      new Date(date.getFullYear(), date.getMonth(), date.getDate())
    ); // обрезаем время
  }

  return weekDates;
}

function getWeekDates() {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 (вс) - 6 (сб)
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  const weekDates = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + mondayOffset + i);
    weekDates.push(
      new Date(date.getFullYear(), date.getMonth(), date.getDate())
    ); // обрезаем время
  }

  return weekDates;
}
function getWeekDates() {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 (вс) - 6 (сб)
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  const weekDates = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + mondayOffset + i);
    weekDates.push(
      new Date(date.getFullYear(), date.getMonth(), date.getDate())
    ); // обрезаем время
  }

  return weekDates;
}

function renderWeekDates() {
  const container = document.getElementById("week-dates");
  const today = new Date();
  today.setHours(0, 0, 0, 0); // убираем время

  const dates = getWeekDates();
  container.innerHTML = "";

  dates.forEach((date) => {
    const div = document.createElement("div");
    div.classList.add("date-block");

    const dayNames = [
      "Воскресенье",
      "Понедельник",
      "Вторник",
      "Среда",
      "Четверг",
      "Пятница",
      "Суббота",
    ];
    const dayName = dayNames[date.getDay()];
    const formattedDate = date.toLocaleDateString("ru-RU");

    const dayDiv = document.createElement("div");
    dayDiv.classList.add("day-name");
    dayDiv.textContent = dayName;

    const dateDiv = document.createElement("div");
    dateDiv.classList.add("date-text");
    dateDiv.textContent = formattedDate;

    div.appendChild(dayDiv);
    div.appendChild(dateDiv);

    const isPast = date < today;
    const isToday = date.getTime() === today.getTime();

    if (isPast) {
      div.classList.add("past");
    } else if (isToday) {
      div.classList.add("selected");
    } else {
      div.classList.add("default");
    }

    // Клик: выбор даты
    div.addEventListener("click", () => {
      if (div.classList.contains("past")) return;

      document.querySelectorAll(".date-block").forEach((el) => {
        el.classList.remove("selected");
        if (!el.classList.contains("past")) {
          el.classList.add("default");
        }
      });

      div.classList.remove("default");
      div.classList.add("selected");
    });

    container.appendChild(div);
  });
}

document.addEventListener("DOMContentLoaded", renderWeekDates);
