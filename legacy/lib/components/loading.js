import {LitElement, html} from 'lit'; 
import {customElement, queryAll, property} from 'lit/decorators.js';

@customElement('river-loading')
class RiverLoading extends LitElement {
  @property({attribute: false}) modal; 
  @property() loadedUSGS;
  @property() loadedElkhart;
  @property() failures;

  @queryAll('.modal') modalEls;


  createRenderRoot() {
    return this;
  }

  firstUpdated() {
    this.modal = M.Modal.init(this.modalEls, {})[0];
    this.modal.open();
  }

  failure(e) {
    this.failures += (e.message + "\n");
    console.error(e);
  }

  constructor() {
    super();
    this.failures = '';
    this.loadedUSGS = false;
    this.loadedElkhart = false;
    window.ld = this;
  }

  render() {
    let usgs;
    let elkhart;

    if (this.loadedUSGS) {
      usgs = html`
        <h5>USGS Data Loaded</h5>
        <div class="progress">
          <div style="width: 100%" class="determinate"></div>
        </div>
      `;
    } else {
      usgs = html`
      <h5>USGS Data</h5>
      <div class="progress">
        <div class="indeterminate"></div>
      </div>
    `;
    }


    if (this.loadedElkhart) {
      elkhart = html`
        <h5>Elkhart Monitoring Data Loaded</h5>
        <div class="progress">
          <div style="width: 100%" class="determinate"></div>
        </div>
      `;
    } else {
      elkhart = html`
      <h5>Elkhart Monitoring Data</h5>
      <div class="progress">
        <div class="indeterminate"></div>
      </div>
    `;
    }


    return html`
      <div id="modal-loading" class="modal">
        <div class="modal-content">
          <h4>Loading...</h4>
          <div id="datalist">
            ${usgs}
            ${elkhart}
            <pre style="overflow: auto" class="error-text pink-text text-darken-2">${this.failures}</pre>
          </div>
        </div>
        <div class="modal-footer">
          <a class="modal-close waves-effect waves-green btn-flat">Close</a>
        </div>
      </div>
    `;
  }

  updated() {
    if(this.loadedElkhart == true && this.loadedUSGS == true) {
      this.modal.close();
    }
  }
}