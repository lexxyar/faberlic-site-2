export class Slider {
  private _slideIndex = 1;
  private _el: HTMLElement;
  private _slides: NodeListOf<HTMLElement> | null = null;
  private _container: HTMLElement;
  private _navLeft: HTMLElement;
  private _navRight: HTMLElement;
  private _timer: any;
  public constructor(selector: string) {
    this._el = document.querySelector(selector) as HTMLElement;
    this._container = this._el.querySelector("div") as HTMLElement;
    this._navLeft = this._el.querySelector(
      ".slider-nav.slider-nav-left"
    ) as HTMLElement;
    this._navRight = this._el.querySelector(
      ".slider-nav.slider-nav-right"
    ) as HTMLElement;
    let that = this;
    if (this._navLeft) {
      this._navLeft.addEventListener("click", (e: Event) => {
        e.preventDefault();
        that.navigate(-1);
      });
    }
    if (this._navRight) {
      this._navRight.addEventListener("click", (e: Event) => {
        e.preventDefault();
        that.navigate(1);
      });
    }

    this.load();
  }

  public start() {
    let that = this;
    this._timer = setInterval(() => {
      that.navigate(1);
    }, 1000);
  }

  public stop() {
    if (this._timer) {
      clearInterval(this._timer);
    }
  }

  private afterLoad() {
    this._slides = this._el.querySelectorAll(".slide");
    this._slideIndex = 1;
    this.navigate(0);
    this.start();
  }

  private load() {
    let xhr = new XMLHttpRequest();
    let that = this;
    xhr.open("GET", "/server/slider");
    xhr.onload = function() {
      if (xhr.status === 200) {
        that.render(xhr.responseText);
      } else {
        console.error("Request failed.  Returned status of " + xhr.status);
      }
    };
    xhr.send();
  }

  private render(response: string) {
    let oResp = JSON.parse(response);
    let aData = oResp.data;
    for (let i = 0; i < aData.length; i++) {
      let src = aData[i];
      let div = document.createElement("div") as HTMLDivElement;
      div.classList.add("slide", "slide-" + (i + 1).toString());
      let img = document.createElement("img") as HTMLImageElement;
      img.src = src;
      div.appendChild(img);
      this._container.appendChild(div);
    }

    this.afterLoad();
  }

  private navigate(n: number) {
    if (!this._slides) {
      return;
    }

    this._slideIndex += n;
    if (this._slideIndex > this._slides.length) {
      this._slideIndex = 1;
    }
    if (this._slideIndex < 1) {
      this._slideIndex = this._slides.length;
    }
    for (let i = 0; i < this._slides.length; i++) {
      (this._slides[i] as HTMLElement).style.display = "none";
    }
    (this._slides[this._slideIndex - 1] as HTMLElement).style.display = "block";
  }
}
