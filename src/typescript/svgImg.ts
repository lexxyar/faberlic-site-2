export class SvgImg {
  private static _cache = new Map<string, SVGSVGElement>();

  private checkCache(url: string): SVGSVGElement | false {
    let svgContent = SvgImg._cache.get(url);
    return svgContent != undefined ? svgContent : false;
  }

  public replace(img: HTMLImageElement) {
    let url = img.src;
    let parts = url.split(".");
    let ext = parts.pop() as String;
    if (ext.toLowerCase() !== "svg") {
      return;
    }
    let svg = this.checkCache(url);
    if (svg == false) {
      this.loadUrl(url, img, this.replaceImg);
    } else {
      this.replaceImg(img, svg);
    }
  }

  private replaceImg(img: HTMLImageElement, svg: SVGSVGElement) {
    let parent = img.parentNode as HTMLElement;
    parent.removeChild(img);
    parent.appendChild(svg);
  }

  private loadUrl(url: string, img: HTMLImageElement, callBack: Function) {
    let that = this;
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.onload = function() {
      if (xhr.status === 200) {
        let svg = new DOMParser()
          .parseFromString(xhr.responseText, "text/html")
          .querySelector("svg");
        if (svg) {
          let w = svg.getAttribute("width");
          let h = svg.getAttribute("height");
          // console.log(url, w, h, img.width, img.height);
          svg.setAttribute("viewBox", "0 0 " + w + " " + h);
          svg.removeAttribute("width");
          svg.removeAttribute("height");
          svg.setAttribute("width", img.width+"px");
          svg.setAttribute("height", img.height+"px");
          svg.setAttribute("preserveAspectRatio", "xMinYMin");

          let rect = svg.querySelector('rect');
          if(rect){
            svg.removeChild(rect);
          }
          SvgImg._cache.set(url, svg);
          callBack(img, svg);
        }
      } else {
        console.error("Request failed.  Returned status of " + xhr.status);
      }
    };
    xhr.send();
  }
}
