import "../app.scss";
// import { Slider } from "./slider";
import { Modal } from "./modal";
import { SvgImg } from "./svgImg";

var modal: Modal;
var svgCache = new Map<string, SVGSVGElement>();
document.addEventListener("DOMContentLoaded", () => {
  // new Slider(".slider");
  // modal = new Modal("#myModal");

  let withModal = document.querySelectorAll(".showModal");
  withModal.forEach((v, k) => {
    v.addEventListener("click", e => {
      e.preventDefault();
      let img:HTMLImageElement = e.target as HTMLImageElement;
      let num = img.src.split('.png')[0].split('-')[1];
      // getCatalogInfo(1);
      modal.show();
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

// function getCatalogInfo(catalogNum: number) {
//   var xhr = new XMLHttpRequest();
//   xhr.open("GET", "images/catalog/" + catalogNum.toString() + "/info.json");
//   xhr.onload = function() {
//     if (xhr.status === 200) {
//       // modal.setContent(xhr.responseText);
//       modal.setContent(renderCatalog(xhr.responseText));
//     } else {
//       console.error("Request failed.  Returned status of " + xhr.status);
//     }
//   };
//   xhr.send();
// }

// function renderCatalog(sInfo: string): HTMLElement {
//   let oInfo = JSON.parse(sInfo);
//   let catalog = oInfo.catalog;
//   let count = oInfo.count;
//   let prefix = oInfo.prefix;
//   let concat = oInfo.concatenate;
//   let ext = oInfo.ext;
//   let div: HTMLElement = document.createElement("div");
//   div.classList.add("catalog-content");
//   // +длина числа 6 символов с ведущими '0'
//   for (let i = 1; i <= count; i++) {
//     let s =
//       "images/catalog/" +
//       catalog.toString() +
//       "/" +
//       prefix +
//       concat +
//       i.toString() +
//       "." +
//       ext;
//     let img = document.createElement("img");
//     // Добавить click
//     img.src = s;
//     div.appendChild(img);
//   }
//   return div;
// }

let ais = document.querySelectorAll("#action-items img");
ais.forEach(element => {
  element.addEventListener("click", e => {
    e.preventDefault();
    let img = e.target as HTMLImageElement;
    let src = img.src;
    let detail: HTMLElement | null = document.querySelector("#action-detail");
    if (detail) {
      let currentImg = detail.querySelector("img");
      if (currentImg) {
        currentImg.style.opacity = "0";

        setTimeout(() => {
          let newImg = document.createElement("img");
          newImg.src = src;
          newImg.style.opacity = "0";
          if (detail) {
            detail.innerHTML = "";
            detail.appendChild(newImg);
            setTimeout(() => {
            newImg.style.opacity = "1";
            }, 100);
          }
        }, 400);
      }
    }
  });
});
