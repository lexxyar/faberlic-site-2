export class Slider {
  private _slideIndex = 1;
  private _el: HTMLElement;
  private _slides: NodeListOf<HTMLElement>;
  private _navLeft: HTMLElement;
  private _navRight: HTMLElement;
  public constructor(selector: string) {
    this._el = document.querySelector(selector) as HTMLElement;
    this._slides = this._el.querySelectorAll(".slide");
    this._navLeft = this._el.querySelector(
      ".slider-nav.slider-nav-left"
    ) as HTMLElement;
    this._navRight = this._el.querySelector(
      ".slider-nav.slider-nav-right"
    ) as HTMLElement;
    this.navigate(-1);

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
  }
  private navigate(n: number) {
    this._slideIndex += n;
    if (n > this._slides.length) {
      this._slideIndex = 1;
    }
    if (n < 1) {
      this._slideIndex = this._slides.length;
    }
    for (let i = 0; i < this._slides.length; i++) {
      (this._slides[i] as HTMLElement).style.display = "none";
    }
    (this._slides[this._slideIndex - 1] as HTMLElement).style.display = "block";
  }
}
