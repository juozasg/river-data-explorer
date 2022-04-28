import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';

import AirDatepicker from 'air-datepicker';
import localeEn from 'air-datepicker/locale/en';
import 'air-datepicker/air-datepicker.css';

@customElement('river-data-select-temporal')
class RiverDataSelectTemporal extends LitElement {
  @property({type: Object}) fromDate; // Date object
  @property({type: Object}) toDate;

  createRenderRoot() {
    return this;
  }

  firstUpdated() {
    this.initDatepickers();
  }

  initDatepickers() {
    let options = {
      locale: localeEn,
      dateFormat: "yyyy-MM-dd",
      position: "top left",
      timepicker: "true",
      timeFormat: "HH:mm",
      keyboardNav: false,
      onSelect: (e) => {
        this.dateSelected(e.date, e.datepicker);
      }
    };

    this.fromDatePicker = new AirDatepicker('#fromdate', options);
    
    this.fromDatePicker.selectDate('2007-01-01 00:00');

    // TODAY
    this.toDatePicker = new AirDatepicker('#todate', options);
    this.toDatePicker.selectDate(Date.now());
  }

  // this is the final callback when the datepicker is settled
  dateSelected(date, datepicker) {
    if(datepicker === this.fromDatePicker) {
      this.fromDate = date;
    } else {
      this.toDate = date
    }

    this._notifyDataSelectChange();
  }

  async _notifyDataSelectChange() {
    await this.updateComplete;
    this.dispatchEvent(new CustomEvent('river:temporalExtent.change', {bubbles: true}));
  }

  dateInputChange(newDate, datePicker) {
    newDate = Date.parse(newDate) ? Date.parse(newDate) : datePicker.selectedDates[0]    
    datePicker.selectDate(newDate, {updateTime: true});
    datePicker.setViewDate(newDate);
  }

  fromDateChange(e) {
    this.dateInputChange(e.target.value, this.fromDatePicker);
  }

  toDateChange(e) {
    this.dateInputChange(e.target.value, this.toDatePicker);
  }

  render() {
    return html`

      <span class="hint">From</span> 
      <div class="input-field inline">
        <input class="datepicker" id="fromdate" @change=${this.fromDateChange}>
        <i class="material-icons datepicker-icon">date_range</i>
      </div>

      <span class="hint">To</span> 
      <div class="input-field inline">
        <input class="datepicker" id="todate" @change=${this.toDateChange}>
        <i class="material-icons datepicker-icon">date_range</i>
      </div>
      
    `;
  }
}
