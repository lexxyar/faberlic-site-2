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
      getCatalogInfo(1);
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

function getCatalogInfo(catalogNum: number) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "images/catalog/" + catalogNum.toString() + "/info.json");
  xhr.onload = function() {
    if (xhr.status === 200) {
      // modal.setContent(xhr.responseText);
      modal.setContent(renderCatalog(xhr.responseText));
    } else {
      console.error("Request failed.  Returned status of " + xhr.status);
    }
  };
  xhr.send();
}

function renderCatalog(sInfo: string): HTMLElement {
  let oInfo = JSON.parse(sInfo);
  let catalog = oInfo.catalog;
  let count = oInfo.count;
  let prefix = oInfo.prefix;
  let concat = oInfo.concatenate;
  let ext = oInfo.ext;
  let div: HTMLElement = document.createElement("div");
  div.classList.add("catalog-content");
  for (let i = 1; i <= count; i++) {
    let s =
      "images/catalog/" +
      catalog.toString() +
      "/" +
      prefix +
      concat +
      i.toString() +
      "." +
      ext;
    let img = document.createElement("img");
    img.src = s;
    div.appendChild(img);
  }
  return div;
}
