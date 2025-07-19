document.addEventListener("DOMContentLoaded", () => {
  const submitBtn = document.querySelector(".hero_button_blue");

  submitBtn.addEventListener("click", () => {
    const selectedDateEl = document.querySelector(".date-block.selected");
    const selectedTimeEl = document.querySelector(".selected_clock");

    const date = selectedDateEl
      ? selectedDateEl.querySelector(".date-text")?.textContent
      : null;
    const time = selectedTimeEl ? selectedTimeEl.textContent : null;

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const auto = document.getElementById("auto").value.trim();
    const comment = document.getElementById("comment").value.trim();

    const services = Array.from(
      document.querySelectorAll(".selecter_check_box_services input:checked")
    ).map((input) => input.name);

    if (!date || !time || !name || !phone) {
      alert(
        "Пожалуйста, заполните все обязательные поля и выберите дату/время"
      );
      return;
    }

    const data = {
      date,
      time,
      name,
      phone,
      auto,
      services,
      comment,
    };

    fetch("record.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then(async (res) => {
        if (res.ok) return res.json();
        const error = await res.json();
        throw new Error(error.error || "Ошибка");
      })
      .then((response) => {
        alert("Запись успешно отправлена!");
      })
      .catch((err) => {
        alert(err.message || "Произошла ошибка");
      });
  });
});
function fetchBusyTimes(dateString) {
  fetch(`get_busy_times.php?date=${encodeURIComponent(dateString)}`)
    .then((res) => res.json())
    .then((busyTimes) => {
      const timeBlocks = document.querySelectorAll(".activate_clock");
      timeBlocks.forEach((block) => {
        const time = block.textContent.trim();
        if (busyTimes.includes(time)) {
          block.classList.remove("selected_clock");
          block.classList.remove("activate_clock");
          block.classList.add("deactivate_clock");
          block.style.pointerEvents = "none";
        } else {
          block.classList.remove("deactivate_clock");
          block.classList.add("activate_clock");
          block.style.pointerEvents = "auto";
        }
      });
    });
}
