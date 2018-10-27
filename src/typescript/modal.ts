export class Modal {
  private _modal: HTMLElement;
  private _isShow: boolean = false;
  private _content: HTMLElement;
  public constructor(selector: string) {
    this._modal = document.querySelector(selector) as HTMLElement;
    let span = this._modal.querySelector(".close") as HTMLElement;
    this._content = this._modal.querySelector(
      ".modal-contet-container"
    ) as HTMLElement;
    let that = this;
    span.addEventListener(
      "click",
      e => {
        e.preventDefault();
        this.hide();
      },
      false
    );
  }

  public setContent(content: HTMLElement) {
    this._content.innerHTML = "";
    this._content.appendChild(content);
  }

  public self(): HTMLElement {
    return this._modal;
  }

  public touggle() {
    if (this._isShow) {
      this.hide();
    } else {
      this.show();
    }
  }

  public show() {
    this._isShow = true;
    this._modal.style.display = "block";
  }
  public hide() {
    this._isShow = false;
    this._modal.style.display = "none";
  }
  public open() {
    this.show();
  }
  public close() {
    this.hide();
  }
}

// // Get the modal
// var modal = document.getElementById("myModal");

// // Get the button that opens the modal
// var btn = document.getElementById("myBtn");

// // Get the <span> element that closes the modal
// var span = document.getElementsByClassName("close")[0];

// // When the user clicks on the button, open the modal
// btn.onclick = function() {
//   modal.style.display = "block";
// };

// // When the user clicks on <span> (x), close the modal
// span.onclick = function() {
//   modal.style.display = "none";
// };

// When the user clicks anywhere outside of the modal, close it
// window.onclick = function(event) {
//   if (event.target == modal) {
//     modal.style.display = "none";
//   }
// };
