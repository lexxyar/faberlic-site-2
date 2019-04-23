import "../app.scss";
// import "../study.html";
// import { Slider } from "./slider";
import { Modal } from "./modal";
import { SvgImg } from "./svgImg";

var modal: Modal;
// var promoFlade: HTMLElement;
var svgCache = new Map<string, SVGSVGElement>();
// var checkTimer: number;
document.addEventListener("DOMContentLoaded", () => {
  // smoothScroll();
  // new Slider(".slider");
  modal = new Modal("#myModal");

  let withModal = document.querySelectorAll(".showModal");
  withModal.forEach((v, k) => {
    v.addEventListener("click", e => {
      e.preventDefault();
      let img: HTMLImageElement = e.target as HTMLImageElement;
      let num: number = parseInt(img.src.split(".png")[0].split("-")[1]);
      // console.log(num);
      getCatalogInfo(num);
      modal.show();
    });
  }, false);

  let studyBtn: HTMLElement = document.querySelector(
    "#study-btn"
  ) as HTMLElement;
  studyBtn.addEventListener("click", e => {
    e.preventDefault();
    let sesValue: string = checkSession();
    if (sesValue) {
      loadStudyContent(sesValue);
    } else {
      getStudyDialog();
    }
    modal.show();
  });

  let sesValue: string = checkSession();
  if (sesValue) {
    lockOpen();
  }

  let aPromo = document.querySelectorAll(".promo-item") as NodeListOf<
    HTMLElement
  >;
  let promoFlade = document.querySelector(".promo-flade") as HTMLElement;
  if (aPromo && promoFlade) {
    let promoFladeLarge = promoFlade.querySelector(
      ".promo-flade-large"
    ) as HTMLElement;
    let promoFladeShort = promoFlade.querySelector(
      ".promo-flade-short"
    ) as HTMLElement;
    let promoFladeShortTitle = promoFladeShort.querySelector(
      ".title"
    ) as HTMLElement;
    let promoFladeShortIcon = promoFladeShort.querySelector(
      ".icon"
    ) as HTMLElement;

    promoFlade.addEventListener("mouseenter", e => {
      if (!promoFlade.classList.contains("hovered")) {
        promoFlade.classList.add("hovered");
      }
    });
    promoFlade.addEventListener("mouseleave", e => {
      if (promoFlade.classList.contains("hovered")) {
        promoFlade.classList.remove("hovered");
      }
    });

    if (
      promoFladeLarge &&
      promoFladeShort &&
      promoFladeShortTitle &&
      promoFladeShortIcon
    ) {
      aPromo.forEach(v => {
        v.addEventListener("mouseenter", e => {
          let el = e.target as HTMLElement;
          let elFlade = el.querySelector(".promo-flade-content") as HTMLElement;
          let elTitle = el.querySelector(".promo-text") as HTMLElement;
          let elIcon = el.querySelector(".promo-icon") as HTMLElement;
          if (el && elFlade && elTitle && elIcon) {
            for (let i = 1; i <= aPromo.length; i++) {
              if (promoFlade.classList.contains("position-" + i)) {
                promoFlade.classList.remove("position-" + i);
              }
            }
            if (promoFlade.classList.contains("hidden")) {
              promoFlade.classList.remove("hidden");
            }
            promoFlade.classList.add("position-" + el.dataset.number);

            promoFladeLarge.innerHTML = elFlade.innerHTML;
            promoFladeShortTitle.innerText = elTitle.innerText;
            promoFladeShortIcon.innerHTML = elIcon.innerHTML;
          }
        });
        v.addEventListener("mouseleave", e => {
          if (!promoFlade.classList.contains("hovered")) {
            let el = e.target as HTMLElement;
            if (el) {
              if (!promoFlade.classList.contains("hidden")) {
                promoFlade.classList.add("hidden");
              }
            }
          }
        });
      });
    }
  }

  let topNav = document.querySelectorAll(
    "#top .nav .nav-item:not(.drop-down) > a"
  ) as NodeListOf<HTMLElement>;
  if (topNav && topNav.length > 0) {
    topNav.forEach((el: HTMLElement) => {
      el.addEventListener(
        "click",
        e => {
          e.preventDefault();
          let a = e.target as HTMLLinkElement;
          if (a) {
            let matches = a.href.match(/#(\w+)/);
            if (matches && matches[1]) {
              smoothScroll(matches[1]);
            }
          }
        },
        false
      );
    });
  }

  let imgs = document.querySelectorAll("img");
  let oSvg = new SvgImg();
  imgs.forEach(img => {
    oSvg.replace(img);
  });

  // Patents
  let aPatents: string[] = [
    "https://faberlic.com/images/stories/News/Patent2290169.jpg",
    "https://faberlic.com/images/stories/News/Patent-2033163.jpg",
    "https://faberlic.com/images/stories/News/Patent-2371170.jpg",
    "https://faberlic.com/images/stories/News/Patent_2114627.jpg",
    "https://faberlic.com/images/stories/News/Patent_2119790-1.jpg",
    "https://faberlic.com/images/stories/News/Patent_2197225.jpg",
    "https://faberlic.com/images/stories/News/Patent_2221545.jpg",
    "https://faberlic.com/images/stories/News/Patent_2221547.jpg",
    "https://faberlic.com/images/stories/News/Patent_2229886.jpg",
    "https://faberlic.com/images/stories/News/Patent_2253440.jpg",
    "https://faberlic.com/images/stories/News/Patent_2262919.jpg",
    "https://faberlic.com/images/stories/News/Patent_2262920.jpg",
    "https://faberlic.com/images/stories/News/Patent_2275897.jpg",
    "https://faberlic.com/images/stories/News/Patent_2299724.jpg",
    "https://faberlic.com/images/stories/News/Patent_2352322.jpg",
    "https://faberlic.com/images/stories/News/Patent_2357722.jpg",
    "https://faberlic.com/images/stories/News/Patent_2436559.jpg",
    "https://faberlic.com/images/stories/News/Patent_2099050.jpg",
    "https://faberlic.com/images/stories/News/Patent_2096031.jpg",
    "https://faberlic.com/images/stories/News/Tovary/Patent_2082388.jpg",
    "https://faberlic.com/images/stories/News/Tovary/Patent_2082389.jpg"
  ];

  let oPatents = document.querySelector("#patents .container") as HTMLElement;
  let oDivWrapper: HTMLElement = document.createElement("div") as HTMLElement;
  oDivWrapper.classList.add("patent-wrapper");

  oPatents.appendChild(oDivWrapper);

  aPatents.forEach((value: string) => {
    let oDivHolder: HTMLElement = document.createElement("div") as HTMLElement;
    oDivHolder.classList.add("patent-holder");

    let oImg = document.createElement("img") as HTMLImageElement;
    oImg.src = value;

    oImg.addEventListener("click", (e: Event) => {
      e.preventDefault();
      let img = e.target as HTMLImageElement;
      console.log(img.src);
      showPatentInModal(img.src);
    });

    oDivHolder.appendChild(oImg);
    oDivWrapper.appendChild(oDivHolder);
  });

  // Marketing
  let marketingConsultRateTable = document.querySelector("#consult-rate");
  if (marketingConsultRateTable) {
    marketingConsultRateTable.appendChild(ceateConsultRateTableContent());
  }
});

function showPatentInModal(sImageSrc: string) {
  let div: HTMLElement = document.createElement("div");
  div.classList.add("patent-modal-content");
  let img = document.createElement("img");
  img.src = sImageSrc;
  div.appendChild(img);
  // console.log('Modal Patent');
  modal.setContent(div);
  modal.show();
}

window.onclick = function(event: Event) {
  if (event.target == document.querySelector("#myModal")) {
    modal.hide();
  }
};

function getStudyDialog() {
  let div: HTMLElement = document.createElement("div");
  div.classList.add("dialog-content");
  div.classList.add("study-password");

  let form: HTMLElement = createStudyPasswordRequestForm();
  div.appendChild(form);

  modal.setContent(div);
}

function createStudyPasswordRequestForm(): HTMLElement {
  let div: HTMLElement = document.createElement("div");
  div.classList.add("register-dialog-container");

  let registerContainer: HTMLElement = document.createElement("div");
  registerContainer.classList.add("register-container");

  let registerButton: HTMLAnchorElement = document.createElement("a");
  registerButton.classList.add("btn");
  registerButton.classList.add("btn-register");
  registerButton.href = "#";
  registerButton.appendChild(
    document.createTextNode("Зарегистрироваться бесплатно")
  );

  registerContainer.appendChild(registerButton);

  let passwordContainer: HTMLElement = document.createElement("div");
  passwordContainer.classList.add("password-container");

  let inputPassword: HTMLInputElement = document.createElement("input");
  inputPassword.type = "text";
  inputPassword.id = "study-password";
  inputPassword.placeholder = "Введите пароль";

  passwordContainer.appendChild(inputPassword);

  let submitButton: HTMLButtonElement = document.createElement("button");
  submitButton.appendChild(document.createTextNode("Вход"));

  submitButton.addEventListener(
    "click",
    e => {
      e.preventDefault();
      let password = inputPassword.value;

      loadStudyData(password);
    },
    false
  );

  passwordContainer.appendChild(submitButton);

  div.appendChild(registerContainer);
  div.appendChild(passwordContainer);

  return div;
}

function loadStudyData(sPassword: string) {
  let xhr = new XMLHttpRequest();
  let params = "password=" + sPassword;
  xhr.open("POST", "/server/studycontent/");
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.onload = function() {
    if (xhr.status === 200) {
      let resp = JSON.parse(xhr.responseText);
      // console.log(resp);
      // let link = "/server/study/";
      if (resp.type === "success") {
        loadStudyContent(resp.value);
        lockOpen();
        // checkTimer = setInterval(checkSession, 1000 * 3);
      } else {
      }
    } else {
      console.error("Request failed.  Returned status of " + xhr.status);
    }
  };
  xhr.send(params);
}

// function loadStudyDataHash(sHash: string) {
//   let xhr = new XMLHttpRequest();
//   let params = "hash=" + sHash;
//   xhr.open("POST", "/server/studycontent/");
//   xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
//   xhr.onload = function() {
//     if (xhr.status === 200) {
//       let resp = JSON.parse(xhr.responseText);
//       // console.log(resp);
//       // let link = "/server/study/";
//       if (resp.type === "success") {
//         loadStudyContent(resp.value);
//         lockOpen();
//         // checkTimer = setInterval(checkSession, 1000 * 3);
//       } else {
//       }
//     } else {
//       console.error("Request failed.  Returned status of " + xhr.status);
//     }
//   };
//   xhr.send(params);
// }

function loadStudyContent(sHash: string) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "/server/study/" + sHash);
  xhr.onload = function() {
    if (xhr.status === 200) {
      let oInfo = JSON.parse(xhr.responseText);

      let aImages = oInfo.data;
      let div: HTMLElement = document.createElement("div");
      div.classList.add("study-content");
      for (let i = 0; i < aImages.length; i++) {
        let img = document.createElement("img");
        img.src = aImages[i];
        div.appendChild(img);
      }

      modal.setContent(div);
      // modal.setContent(renderCatalog(xhr.responseText));
      // console.log(JSON.parse(xhr.responseText));
    } else {
      console.error("Request failed.  Returned status of " + xhr.status);
    }
  };
  xhr.send();
}

function getCatalogInfo(catalogNum: number) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "/server/catalog/" + catalogNum.toString() + "/");
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
  let aImages = oInfo.data;
  let div: HTMLElement = document.createElement("div");
  div.classList.add("catalog-content");
  for (let i = 0; i < aImages.length; i++) {
    let a = document.createElement("a") as HTMLAnchorElement;
    a.target = "_blank";
    a.href = aImages[i];

    let img = document.createElement("img");
    img.src = aImages[i];
    a.appendChild(img);
    div.appendChild(a);
  }
  return div;
}

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

/**
 *
 *  Base64 encode / decode
 *  http://www.webtoolkit.info/
 *
 **/
const Base64 = {
  // private property

  _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

  // public method for encoding

  encode: function(input: string) {
    var output = "";

    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;

    var i = 0;

    input = Base64._utf8_encode(input);

    while (i < input.length) {
      chr1 = input.charCodeAt(i++);

      chr2 = input.charCodeAt(i++);

      chr3 = input.charCodeAt(i++);

      enc1 = chr1 >> 2;

      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);

      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);

      enc4 = chr3 & 63;

      if (isNaN(chr2)) {
        enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
        enc4 = 64;
      }

      output =
        output +
        this._keyStr.charAt(enc1) +
        this._keyStr.charAt(enc2) +
        this._keyStr.charAt(enc3) +
        this._keyStr.charAt(enc4);
    }

    return output;
  },

  // public method for decoding

  decode: function(input: string) {
    var output = "";

    var chr1, chr2, chr3;

    var enc1, enc2, enc3, enc4;

    var i = 0;

    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

    while (i < input.length) {
      enc1 = this._keyStr.indexOf(input.charAt(i++));

      enc2 = this._keyStr.indexOf(input.charAt(i++));

      enc3 = this._keyStr.indexOf(input.charAt(i++));

      enc4 = this._keyStr.indexOf(input.charAt(i++));

      chr1 = (enc1 << 2) | (enc2 >> 4);

      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);

      chr3 = ((enc3 & 3) << 6) | enc4;

      output = output + String.fromCharCode(chr1);

      if (enc3 != 64) {
        output = output + String.fromCharCode(chr2);
      }

      if (enc4 != 64) {
        output = output + String.fromCharCode(chr3);
      }
    }

    output = Base64._utf8_decode(output);

    return output;
  },

  // private method for UTF-8 encoding

  _utf8_encode: function(string: string) {
    string = string.replace(/\r\n/g, "\n");

    var utftext = "";

    for (var n = 0; n < string.length; n++) {
      var c = string.charCodeAt(n);

      if (c < 128) {
        utftext += String.fromCharCode(c);
      } else if (c > 127 && c < 2048) {
        utftext += String.fromCharCode((c >> 6) | 192);

        utftext += String.fromCharCode((c & 63) | 128);
      } else {
        utftext += String.fromCharCode((c >> 12) | 224);

        utftext += String.fromCharCode(((c >> 6) & 63) | 128);

        utftext += String.fromCharCode((c & 63) | 128);
      }
    }

    return utftext;
  },

  // private method for UTF-8 decoding

  _utf8_decode: function(utftext: string) {
    var string = "";

    var i = 0;

    // var c = (c1 = c2 = 0);
    var c1 = 0;
    var c2 = 0;
    var c3 = 0;
    var c = (c1 = c2 = 0);

    while (i < utftext.length) {
      c = utftext.charCodeAt(i);

      if (c < 128) {
        string += String.fromCharCode(c);

        i++;
      } else if (c > 191 && c < 224) {
        c2 = utftext.charCodeAt(i + 1);

        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));

        i += 2;
      } else {
        c2 = utftext.charCodeAt(i + 1);

        c3 = utftext.charCodeAt(i + 2);

        string += String.fromCharCode(
          ((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63)
        );

        i += 3;
      }
    }

    return string;
  }
};

function checkSession() {
  // console.log("checking...");
  let result: string = "";
  let xhr = new XMLHttpRequest();
  xhr.open("GET", "/server/check", false);
  xhr.onload = function() {
    if (xhr.status === 200) {
      let res = xhr.responseText;
      // console.log("response:");
      // console.log(res);
      // console.log("end-response");
      if (res) {
        let resJson = JSON.parse(res);
        // console.log("parse", resJson);
        if (resJson.type == "success") {
          result = resJson.value;
        }
      }
    } else {
      console.error("Request failed.  Returned status of " + xhr.status);
    }
  };
  xhr.send();
  return result;
  // checkTimer
}

function lockOpen() {
  // <i class="fas fa-lock-open"></i>
  let lock: HTMLElement | null = document.querySelector("#study-btn i");
  if (lock) {
    if (lock.classList.contains("fa-lock")) {
      lock.classList.remove("fa-lock");
    }
    if (!lock.classList.contains("fa-lock-open")) {
      lock.classList.add("fa-lock-open");
    }
  }
}
// function lockClose() {
//   let lock: HTMLElement | null = document.querySelector("#study-btn i");
//   if (lock) {
//     if (lock.classList.contains("fa-lock-open")) {
//       lock.classList.remove("fa-lock-open");
//     }
//     if (!lock.classList.contains("fa-lock")) {
//       lock.classList.add("fa-lock");
//     }
//   }
// }

function currentYPosition() {
  // Firefox, Chrome, Opera, Safari
  if (self.pageYOffset) return self.pageYOffset;
  // Internet Explorer 6 - standards mode
  if (document.documentElement && document.documentElement.scrollTop)
    return document.documentElement.scrollTop;
  // Internet Explorer 6, 7 and 8
  if (document.body.scrollTop) return document.body.scrollTop;
  return 0;
}

function elmYPosition(eID: string) {
  let elm: HTMLElement = document.getElementById(eID) as HTMLElement;
  let y = elm.offsetTop;
  let node: HTMLElement = elm;
  while (node.offsetParent && node.offsetParent != document.body) {
    let pnode = node.offsetParent as HTMLElement;
    y += pnode.offsetTop;
  }
  return y;
}

function smoothScroll(eID: string) {
  var startY = currentYPosition();
  var stopY = elmYPosition(eID);
  var distance = stopY > startY ? stopY - startY : startY - stopY;
  if (distance < 100) {
    scrollTo(0, stopY);
    return;
  }
  var speed = Math.round(distance / 100);
  if (speed >= 20) speed = 20;
  var step = Math.round(distance / 25);
  var leapY = stopY > startY ? startY + step : startY - step;
  var timer = 0;
  if (stopY > startY) {
    for (var i = startY; i < stopY; i += step) {
      setTimeout("window.scrollTo(0, " + leapY + ")", timer * speed);
      leapY += step;
      if (leapY > stopY) leapY = stopY;
      timer++;
    }
    return;
  }
  for (var i = startY; i > stopY; i -= step) {
    setTimeout("window.scrollTo(0, " + leapY + ")", timer * speed);
    leapY -= step;
    if (leapY < stopY) leapY = stopY;
    timer++;
  }
}

// Marketing
function ceateConsultRateTableContent(): HTMLElement {
  let aContent = [
    ["Консультант", 50, "100", "-", "-", "3%", "-"],
    ["Старший Консультант", 50, "200", "-", "-", "6%", "-"],
    ["Лидер", 50, "600", "-", "-", "9%", "-"],
    ["Старший Лидер", 50, "1000", "-", "-", "12%", "-"],
    ["Вице-директор", 50, "1500", "-", "-", "15%", "-"],
    ["Старший Вице-директор", 50, "2000", "-", "-", "19%", "-"],
    ["Кандидат в Директора", 50, "3000", "-", "-", "23%", "-"],
    ["Директор", 50, "3000", "0", "-", "23%", "55 000"],
    ["Старший Директор", 50, "5000/2000**", "0/1**", "-", "23%", "27 500"],
    ["Серебряный Директор", 50, "1500", "2", "-", "23%", "110 000"],
    ["Золотой Директор", 50, "1000", "3", "-", "23%", "165 000"],
    ["Рубиновый Директор", 50, "1000", "4", "-", "23%", "220 000"],
    ["Бриллиантовый Директор", 50, "1000", "6", "-", "23%", "330 000"],
    ["Элитный Директор", 50, "1000", "9", "-", "23%", "500 000"],
    ["Национальный Директор", 50, "1000", "12", "-", "23%", "1 000 000"],
    [
      "Старший Национальный Директор",
      50,
      "1000",
      "15",
      "-",
      "23%",
      "1 250 000"
    ],
    ["Международный Директор", 50, "1000", "18", "-", "23%", "1 500 000"],
    [
      "Старший Международный Директор",
      50,
      "1000",
      "21",
      "-",
      "23%",
      "1 750 000"
    ],
    ["Партнер", 50, "1000", "24", "-", "23%", "5 500 000"],
    ["Старший Партнер", 50, "1000", "24", "6", "23%", "8 000 000"],
    ["Управляющий Партнер", 50, "1000", "24", "12", "23%", "14 000 000"],
    ["Национальный Партнер", 50, "1000", "24", "18", "23%", "20 000 000"],
    ["Международный Партнер", 50, "1000", "24", "24", "23%", "40 000 000"],
    ["Генеральный Партнер", 50, "1000", "30", "30", "23%", "55 000 000"]
  ];

  let tbody = document.createElement("tbody");
  for (let nRow = 0; nRow < aContent.length; nRow++) {
    let tr = document.createElement("tr") as HTMLTableRowElement;
    let aRow = aContent[nRow];
    for (let nCol = 0; nCol < aRow.length; nCol++) {
      let td = document.createElement("td") as HTMLTableCellElement;
      let sCell = aRow[nCol] as string;
      let oCell = document.createTextNode(sCell);
      td.appendChild(oCell);
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
  return tbody;
}
