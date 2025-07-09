document.addEventListener("DOMContentLoaded", () => {
  const timeBlocks = document.querySelectorAll(".activate_clock");

  timeBlocks.forEach((block) => {
    block.addEventListener("click", () => {
      timeBlocks.forEach((b) => b.classList.remove("selected_clock"));
      block.classList.add("selected_clock");
    });
  });
});
