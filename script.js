let selectedDate = null;
let selectedTime = null;
let bookedSlots = [];

// Получаем список занятых слотов с сервера
function fetchBookings() {
  return fetch("bookings.php")
    .then((res) => res.json())
    .then((data) => {
      bookedSlots = data;
    });
}

// Получаем массив дат текущей недели (Пн - Вс)
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

// Проверка: слот уже занят
function isSlotBooked(dateStr, timeStr) {
  return bookedSlots.some((b) => b.date === dateStr && b.time === timeStr);
}

// Рендер дней недели
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
      btn.disabled = true;
    } else {
      btn.addEventListener("click", () => {
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

// Рендер времени с 9:00 до 20:00
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
      btn.disabled = true;
    } else {
      btn.addEventListener("click", () => {
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

// Проверка перед отправкой формы
document.querySelector("form").addEventListener("submit", function (e) {
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const date = document.getElementById("selected_date").value.trim();
  const time = document.getElementById("selected_time").value.trim();

  const phonePattern = /^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/;

  if (!name || !phone || !date || !time) {
    alert(
      "Пожалуйста, заполните все обязательные поля: имя, телефон, дату и время."
    );
    e.preventDefault();
    return;
  }

  if (!phonePattern.test(phone)) {
    alert("Введите корректный номер телефона в формате +7(XXX)XXX-XX-XX.");
    document.getElementById("phone").focus();
    e.preventDefault();
    return;
  }
});

// Инициализация
fetchBookings().then(() => {
  renderWeekPicker();
});
// Подключение маски для телефона
document.addEventListener("DOMContentLoaded", function () {
  const phoneInput = document.getElementById("phone");
  Inputmask("+7(999)999-99-99").mask(phoneInput);
});
let selectedDate = null;

// Получаем текущую неделю от Пн до Вс
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
