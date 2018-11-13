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
      let num = e.target as HTMLElement;
      getCatalogInfo(1);
      modal.show();
    });
  }, false);

  let imgs = document.querySelectorAll("img");
  let oSvg = new SvgImg();
  imgs.forEach(img => {
    oSvg.replace(img);
    // let url = img.src;
    // let parts = url.split(".");
    // let ext = parts.pop() as String;
    // if (ext.toLowerCase() === "svg") {
    //   let svgContent = svgCache.get(url);
    //   if (svgContent != undefined) {
    //     // (img.parentNode as HTMLElement).innerHTML = svgContent;
    //     (img.parentNode as HTMLElement).removeChild(img).appendChild(svgContent);
    //   } else {
    //     let xhr = new XMLHttpRequest();
    //     xhr.open("GET", url);
    //     xhr.onload = function() {
    //       if (xhr.status === 200) {
    //         // modal.setContent(xhr.responseText);
    //         // modal.setContent(renderCatalog(xhr.responseText));
    //         let svg = new DOMParser()
    //           .parseFromString(xhr.responseText, "text/html")
    //           .querySelector("svg");
    //         // let svg = xhr.responseText as HTMLElement;
    //         if (svg) {
    //           svgCache.set(url, svg);
    //           let parent = (img.parentNode as HTMLElement);
    //           // (img.parentNode as HTMLElement).innerHTML = svg.toString();
    //           parent.removeChild(img);
    //           parent.appendChild(svg);
    //         }
    //       } else {
    //         console.error("Request failed.  Returned status of " + xhr.status);
    //       }
    //     };
    //     xhr.send();
    //   }
    // }
  });
  // $('img').each(function() {
  //   var $img = $(this);
  //   var imgURL = $img.attr('src');

  //   $.get(imgURL, function(data) {
  //     // Get the SVG tag, ignore the rest
  //     var $svg = $(data).find('svg');
  //     // Replace image with new SVG
  //     $img.replaceWith($svg);
  //   });
  // });
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
  // +длина числа 6 символов с ведущими '0'
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
    // Добавить click
    img.src = s;
    div.appendChild(img);
  }
  return div;
}
