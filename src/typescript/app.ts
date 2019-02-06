import "../app.scss";
// import "../study.html";
// import { Slider } from "./slider";
import { Modal } from "./modal";
import { SvgImg } from "./svgImg";

var modal: Modal;
var svgCache = new Map<string, SVGSVGElement>();
var checkTimer: number;
document.addEventListener("DOMContentLoaded", () => {
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
    getStudyDialog();
    modal.show();
  });

  let imgs = document.querySelectorAll("img");
  let oSvg = new SvgImg();
  imgs.forEach(img => {
    oSvg.replace(img);
  });
});

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
      console.log(resp);
      // let link = "/server/study/";
      if (resp.type === "success") {
        loadStudyContent(resp.value);
        lockOpen();
        checkTimer = setInterval(checkSession, 1000 * 10);
      } else {
      }
    } else {
      console.error("Request failed.  Returned status of " + xhr.status);
    }
  };
  xhr.send(params);
}

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
    let img = document.createElement("img");
    img.src = aImages[i];
    div.appendChild(img);
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
  console.log("checking...");

  var xhr = new XMLHttpRequest();
  xhr.open("GET", "/server/check");
  xhr.onload = function() {
    if (xhr.status === 200) {
      let res = xhr.responseText;

      if (!res) {
        clearTimeout(checkTimer);
        lockClose();
      }
    } else {
      console.error("Request failed.  Returned status of " + xhr.status);
    }
  };
  xhr.send();

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
function lockClose() {
  let lock: HTMLElement | null = document.querySelector("#study-btn i");
  if (lock) {
    if (lock.classList.contains("fa-lock-open")) {
      lock.classList.remove("fa-lock-open");
    }
    if (!lock.classList.contains("fa-lock")) {
      lock.classList.add("fa-lock");
    }
  }
}
