import "../app.scss";
import { Slider } from "./slider";
import { Modal } from "./modal";

var modal: Modal;
document.addEventListener("DOMContentLoaded", () => {
  new Slider(".slider");
  modal = new Modal("#myModal");

  let withModal = document.querySelectorAll(".showModal");
  withModal.forEach((v, k) => {
    v.addEventListener("click", e => {
      e.preventDefault();
      let num = e.target as HTMLElement;
      console.log(num.dataset.number);
      modal.show();
    });
  }, false);
});

window.onclick = function(event: Event) {
  if (event.target == document.querySelector("#myModal")) {
    modal.hide();
    // modal.style.display = "none";
  }
};
