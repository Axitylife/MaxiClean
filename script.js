let selectedDate = null;
let selectedTime = null;
let bookedSlots = [];

// Получаем все брони с сервера
function fetchBookings() {
  return fetch("bookings.php")
    .then((res) => res.json())
    .then((data) => {
      bookedSlots = data;
    });
}

// Получаем даты текущей недели (Пн–Вс)
function getCurrentWeekDates() {
  const today = new Date();
  const dayOfWeek = today.getDay() === 0 ? 7 : today.getDay(); // 1 = Пн ... 7 = Вс
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dayOfWeek - 1));

  const week = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    week.push(new Date(d));
  }
  return week;
}

// Проверка: дата в прошлом
function isPastDate(date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  return date < today;
}

// Проверка: слот занят
function isSlotBooked(dateStr, timeStr) {
  return bookedSlots.some((b) => b.date === dateStr && b.time === timeStr);
}

// Рисуем дни недели
function renderWeekPicker() {
  const container = document.getElementById("week-picker");
  container.innerHTML = "";
  const week = getCurrentWeekDates();

  week.forEach((date, idx) => {
    const btn = document.createElement("button");
    btn.classList.add("day-button");
    btn.innerText = `${
      ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"][idx]
    }\n${date.getDate()}`;

    const isoDate = date.toISOString().split("T")[0];

    if (isPastDate(new Date(date))) {
      btn.classList.add("inactive");
    } else {
      btn.addEventListener("click", () => {
        if (btn.classList.contains("inactive")) return;
        document
          .querySelectorAll(".day-button")
          .forEach((b) => b.classList.remove("selected"));
        btn.classList.add("selected");
        selectedDate = isoDate;
        document.getElementById("selected_date").value = selectedDate;
        renderTimePicker();
      });
    }

    container.appendChild(btn);
  });
}

// Рисуем время
function renderTimePicker() {
  const container = document.getElementById("time-picker");
  container.innerHTML = "";

  if (!selectedDate) return;

  const today = new Date();
  const selected = new Date(selectedDate);

  for (let hour = 9; hour <= 20; hour++) {
    const timeStr = `${hour}:00`;
    const btn = document.createElement("button");
    btn.classList.add("time-button");
    btn.innerText = timeStr;

    const isToday = selected.toDateString() === today.toDateString();
    const timePassed = isToday && hour <= today.getHours();
    const slotTaken = isSlotBooked(selectedDate, timeStr);

    if (timePassed || slotTaken) {
      btn.classList.add("inactive");
    } else {
      btn.addEventListener("click", () => {
        if (btn.classList.contains("inactive")) return;
        document
          .querySelectorAll(".time-button")
          .forEach((b) => b.classList.remove("selected"));
        btn.classList.add("selected");
        selectedTime = timeStr;
        document.getElementById("selected_time").value = selectedTime;
      });
    }

    container.appendChild(btn);
  }
}

// Запуск при загрузке страницы
fetchBookings().then(() => {
  renderWeekPicker();
});
document.querySelector("form").addEventListener("submit", function (e) {
  if (!selectedDate || !selectedTime) {
    alert("Пожалуйста, выберите дату и время перед записью.");
    e.preventDefault(); // остановить отправку формы
  }
});
const submitBtn = document.querySelector(".btn");

function updateSubmitButtonState() {
  if (selectedDate && selectedTime) {
    submitBtn.disabled = false;
    submitBtn.style.opacity = "1";
    submitBtn.style.cursor = "pointer";
  } else {
    submitBtn.disabled = true;
    submitBtn.style.opacity = "0.6";
    submitBtn.style.cursor = "not-allowed";
  }
}
