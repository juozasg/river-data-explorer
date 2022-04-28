// Some elements without the Shadow DOM (materialize drowdown components)
// will reflow after they are added to the DOM which looks messy
// so hide with opacity=0 and 1000ms later (once they are fully laid out) set opacity = 1
// to prevent popping and resizing of boxesc
export class HideReflowsController {
  constructor(host, timeout=1000) {
    this.host = host;
    this.timeout = timeout;

    host.addController(this);
  }

  slideDown() {
    $(this.host).css('opacity', 0);
    setTimeout(() => {
      $(this.host).css('opacity', 1.0);
      $(this.host).children().hide().slideDown(200);
    }, this.timeout);
  }
}
  
