import "../app.scss";
import { Slider } from "./slider";
import { Modal } from "./modal";
import { SvgImg } from "./svgImg";

var modal: Modal;
var svgCache = new Map<string, SVGSVGElement>();
document.addEventListener("DOMContentLoaded", () => {
  new Slider(".slider");
  modal = new Modal("#myModal");

  let withModal = document.querySelectorAll(".showModal");
  withModal.forEach((v, k) => {
    v.addEventListener("click", e => {
      e.preventDefault();
      let number = (e.target as HTMLElement).dataset.number;
      if (number) {
        let num = parseInt(number.toString());
        getCatalogInfo(num);
        modal.show();
      }
    });
  }, false);

  let imgs = document.querySelectorAll("img");
  let oSvg = new SvgImg();
  imgs.forEach(img => {
    oSvg.replace(img);
  });
});

window.onclick = function(event: Event) {
  if (event.target == document.querySelector("#myModal")) {
    modal.hide();
    // modal.style.display = "none";
  }
};

function getCatalogInfo(catalogNum: number) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "/server/catalog/" + catalogNum.toString());
  xhr.onload = function() {
    if (xhr.status === 200) {
      modal.setContent(renderCatalog(xhr.responseText));
    } else {
      console.error("Request failed.  Returned status of " + xhr.status);
    }
  };
  xhr.send();
}

function renderCatalog(sInfo: string): HTMLElement {
  let oInfo = JSON.parse(sInfo);
  let div: HTMLElement = document.createElement("div");
  div.classList.add("catalog-content");
  for (let i = 0; i < oInfo.data.length; i++) {
    let img = document.createElement("img");
    img.src = oInfo.data[i];
    img.addEventListener("click", () => {
      window.open(oInfo.data[i]);
    });
    div.appendChild(img);
  }
  return div;
}
