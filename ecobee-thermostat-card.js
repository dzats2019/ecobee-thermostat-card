/* Ecobee-style Thermostat Card v1.0.1
 * Standalone Home Assistant Lovelace custom card. No third-party dependencies.
 * Ecobee is a trademark of its respective owner; this is an unofficial project.
 */
(() => {
  'use strict';
  const TAG = 'ecobee-thermostat-card';
  if (customElements.get(TAG)) return;

  const STYLES = `
    :host { display:block; min-width:0; }
    ha-card { overflow:hidden; background:#071324; border:1px solid #293548; border-radius:22px; color:#c2ecff; font-family:Arial,Helvetica,sans-serif; }
    .shell { background:radial-gradient(ellipse at 52% 50%,#152e4b 0%,#091b31 55%,#060d19 100%); padding:18px 23px 9px; min-height:325px; box-sizing:border-box; }
    .top { display:grid; grid-template-columns:1fr 1.45fr 1fr; gap:5px; align-items:start; min-height:58px; }
    .clock { font-size:clamp(18px,2.7vw,25px); font-weight:600; white-space:nowrap; }
    .date { font-size:12px; margin-top:5px; white-space:nowrap; }
    .room { text-align:center; font-size:clamp(16px,2.4vw,22px); font-weight:600; letter-spacing:.3px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; padding-top:2px; }
    button { font:inherit; color:inherit; cursor:pointer; }
    button:focus-visible { outline:2px solid #76dcff; outline-offset:3px; }
    .menu-button { justify-self:end; border:0; background:transparent; padding:2px 0; width:33px; height:35px; display:grid; grid-template-columns:repeat(3,7px); grid-template-rows:repeat(3,7px); gap:4px; justify-content:center; align-content:center; }
    .menu-button span { display:block; background:#71d9ff; box-shadow:0 0 3px #71d9ff80; }
    .body { display:grid; grid-template-columns:minmax(75px,1fr) minmax(200px,2.45fr) minmax(76px,1fr); align-items:center; gap:7px; }
    .side { min-width:0; padding-bottom:0; font-size:15px; }
    .left { text-align:left; }.right { text-align:right; }
    .side .small { font-size:15px; font-style:italic; color:#b1d7ea; }.side .big { font-size:clamp(24px,4vw,37px); color:#55caff; line-height:1.15; font-weight:400; }
    .outside-value { color:#def5ff !important; }
    .presence { border:0; padding:0; background:none; font-size:15px; text-align:left; }
    .presence svg { display:block; width:39px; height:39px; margin-bottom:4px; }
    .center { display:flex; flex-direction:column; align-items:center; min-width:0; }
    .dial { width:min(100%,290px); position:relative; aspect-ratio:1.07; flex:none; }
    .dial svg { width:100%; height:100%; overflow:visible; }
    .dial.off svg { opacity:.60; }
    .side .big.muted { color:#93afbf !important; }
    .dial-content { position:absolute; inset:0; pointer-events:none; text-align:center; }
    /* Keep each label in its own non-overlapping band inside the circular arc. */
    .humidity { position:absolute; top:25%; left:0; width:100%; line-height:1.2; }
    .current { position:absolute; top:37%; left:0; width:100%; line-height:1; }
    .mode { position:absolute; bottom:9%; left:0; width:100%; line-height:1.2; }
    .humidity { font-size:clamp(12px,1.8vw,16px); white-space:nowrap; }
    .droplet { color:#32cafa; font-size:17px; margin:0 5px; }
    .current { font-size:clamp(67px,11vw,105px); font-weight:300; letter-spacing:-5px; color:#b8ecff; font-variant-numeric:tabular-nums; }
    .degree { font-size:.36em; vertical-align:top; padding-left:4px; line-height:1.4; letter-spacing:0; }
    .mode { font-size:clamp(13px,2vw,19px); font-weight:600; white-space:nowrap; }
    .mode-icon { padding-right:6px; }.action-row { display:flex; justify-content:center; margin-top:-4px; }
    .schedule { border:1px solid #285f91; border-radius:12px; background:linear-gradient(#2766a2,#184672); padding:7px 15px; color:#d8efff; font-weight:600; font-size:clamp(13px,1.9vw,17px); }
    .brand { text-align:center; font-size:clamp(23px,4vw,35px); color:#f5f9fd; font-weight:300; letter-spacing:-2px; padding:9px 0 2px; line-height:1; }
    .panel { margin-top:12px; background:#102943; border:1px solid #32587b; border-radius:13px; padding:12px; }
    .panel-title { font-size:15px; font-weight:600; padding-bottom:9px; }
    .controls { display:flex; align-items:center; justify-content:center; gap:15px; }
    .control-btn { border:1px solid #4e83a6; background:#1b4d78; border-radius:12px; min-height:43px; min-width:48px; font-size:26px; }
    .target { font-size:25px; font-variant-numeric:tabular-nums; text-align:center; min-width:80px; }
    .mode-buttons { display:flex; flex-wrap:wrap; justify-content:center; gap:7px; padding-top:11px; }
    .chip { border:1px solid #406482; background:#122c46; border-radius:10px; padding:8px 12px; font-size:13px; text-transform:capitalize; }
    .chip.selected { background:#1268a8; border-color:#53c3ff; color:#fff; }
    .info { font-size:12px; text-align:center; opacity:.88; margin-top:10px; line-height:1.4; }
    .error { color:#ffd0d0; font-size:13px; padding:10px; text-align:center; }
    .unavailable { opacity:.55; } button:disabled { cursor:not-allowed; opacity:.35; }
    @media(max-width:480px) {
      .shell { padding:14px 12px 8px; min-height:0; }
      .top { grid-template-columns:1fr 1.4fr 30px; min-height:53px; }
      .clock { font-size:17px; }.date { font-size:10px; }.room { font-size:15px; }
      .body { grid-template-columns:minmax(51px,1fr) minmax(154px,2.7fr) minmax(60px,1fr); gap:1px; }
      .side { font-size:12px; padding-bottom:0; }.side .small { font-size:12px; }.side .big { font-size:23px; }
      .dial { width:100%; }.humidity { font-size:11px; }.current { font-size:clamp(49px,16vw,79px); letter-spacing:-3px; }
      .mode { font-size:12px; }.presence svg { width:29px; height:29px; }.presence { font-size:12px; }
      .schedule { font-size:12px; padding:6px 11px; }
    }
  `;
  const escapes = {'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'};
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => escapes[c]);
  const numeric = v => { const n = Number(v); return Number.isFinite(n) ? n : null; };
  const round = (v, digits=0) => v == null ? '—' : Number(v).toFixed(digits);
  const TEMP_MODES = ['heat','cool','heat_cool'];
  const ICONS = {heat:'☀',cool:'❄',heat_cool:'◉',off:'⏻',dry:'◌',fan_only:'≋',auto:'◉'};
  class EcobeeThermostatCard extends HTMLElement {
    constructor() { super(); this.attachShadow({mode:'open'}); this._open=false; this._busy=false; this._message=''; this._ticker=null; this._boundClick = this._onClick.bind(this); this.shadowRoot.addEventListener('click',this._boundClick); }
    setConfig(config) {
      if (!config || typeof config.entity !== 'string' || !config.entity.startsWith('climate.')) throw new Error('Set entity to a climate entity (climate.xxx).');
      this._config = {...config, name:config.name || 'ECOBEE', min_temp:config.min_temp, max_temp:config.max_temp, step:config.step};
      this._render();
    }
    set hass(hass) { this._hass=hass; this._render(); }
    connectedCallback() { if (!this._ticker) this._ticker=setInterval(()=>this._render(),30000); this._render(); }
    disconnectedCallback() { if(this._ticker) clearInterval(this._ticker); this._ticker=null; }
    getCardSize() { return this._open ? 8 : 6; }
    getGridOptions() { return {columns:12, min_columns:6, rows:this._open?8:6, min_rows:5}; }
    static getStubConfig() { return {entity:'climate.living_room',name:'LIVING ROOM'}; }
    _get(id) { return id ? this._hass?.states?.[id] : null; }
    _tempUnit() { return this._hass?.config?.unit_system?.temperature || '°F'; }
    _externalTemp() {
      const state=this._get(this._config?.outside_entity);
      if (state && !['unknown','unavailable'].includes(state.state)) return numeric(state.state);
      return null;
    }
    _occupancy() {
      const state=this._get(this._config?.presence_entity);
      if(!state) return null;
      if(['unknown','unavailable'].includes(state.state)) return null;
      if(state.entity_id.startsWith('person.') || state.entity_id.startsWith('device_tracker.')) return state.state==='home';
      return ['on','home','true'].includes(state.state.toLowerCase());
    }
    _levels(climate) {
      const attrs=climate.attributes || {};
      const min=numeric(this._config.min_temp) ?? numeric(attrs.min_temp) ?? 45;
      const max=numeric(this._config.max_temp) ?? numeric(attrs.max_temp) ?? 95;
      const step=numeric(this._config.step) ?? numeric(attrs.target_temp_step) ?? 1;
      return {min,max,step:step>0?step:1};
    }
    _isRange(climate) { return climate.state==='heat_cool' && numeric(climate.attributes.target_temp_low)!==null && numeric(climate.attributes.target_temp_high)!==null; }
    _targetInfo(climate) {
      const a=climate.attributes;
      if(this._isRange(climate)) return {label:`${round(numeric(a.target_temp_low))}–${round(numeric(a.target_temp_high))}`, value:null};
      const t=numeric(a.temperature); return {label:round(t),value:t};
    }
    _render() {
      if(!this._hass || !this._config) return;
      const climate=this._get(this._config.entity);
      if(!climate) { this.shadowRoot.innerHTML=`<style>${STYLES}</style><ha-card><div class="error">Climate entity not found: ${esc(this._config.entity)}</div></ha-card>`; return; }
      const unavailable=['unavailable','unknown'].includes(climate.state);
      const a=climate.attributes || {};
      const current=numeric(a.current_temperature);
      const humidityEntity=this._get(this._config.humidity_entity);
      const humidity=humidityEntity ? numeric(humidityEntity.state) : numeric(a.current_humidity);
      const outside=this._externalTemp();
      const presence=this._occupancy();
      const action=a.hvac_action || climate.state;
      const off=climate.state==='off';
      const modeColor=(action==='heating'||climate.state==='heat') ? '#ffab45' : (climate.state==='off' ? '#8294a5':'#0c78ff');
      const ringColor=(action==='heating'||climate.state==='heat') ? '#ffcf79' : (climate.state==='off' ? '#8799ae':'#78e8ff');
      const label=off?'system off':action==='cooling'?'cooling':action==='heating'?'heating':({heat:'heat only',cool:'cool only',heat_cool:'auto'}[climate.state]||climate.state);
      const target=this._targetInfo(climate);
      const {min,max,step}=this._levels(climate);
      // Restrict the *UI and commands* for heating-only zones, independently
      // of any cooling modes a thermostat happens to advertise.
      const exposedModes=(a.hvac_modes || []).filter(x=>typeof x==='string');
      const modes=this._config.heating_only ? exposedModes.filter(x=>x==='heat'||x==='off') : exposedModes;
      const time=new Date();
      const clock=time.toLocaleTimeString(undefined,{hour:'numeric',minute:'2-digit'});
      const date=time.toLocaleDateString(undefined,{weekday:'short',month:'short',day:'numeric',year:'numeric'});
      const availability=unavailable?'unavailable':'';
      const options=modes.map(mode=>`<button class="chip ${climate.state===mode?'selected':''}" data-action="mode" data-value="${esc(mode)}" ${unavailable||this._busy?'disabled':''}>${esc(ICONS[mode]||'')} ${esc(mode.replace('_',' / '))}</button>`).join('');
      const targetControls=this._isRange(climate) ? `
        <div class="panel-title">Auto mode temperature range (${esc(this._tempUnit())})</div>
        <div class="controls"><button class="control-btn" data-action="lower-low" ${unavailable||this._busy?'disabled':''} aria-label="Decrease heat target">−</button><div class="target">Heat ${round(numeric(a.target_temp_low))}</div><button class="control-btn" data-action="raise-low" ${unavailable||this._busy?'disabled':''} aria-label="Increase heat target">+</button></div>
        <div class="controls" style="margin-top:8px"><button class="control-btn" data-action="lower-high" ${unavailable||this._busy?'disabled':''} aria-label="Decrease cool target">−</button><div class="target">Cool ${round(numeric(a.target_temp_high))}</div><button class="control-btn" data-action="raise-high" ${unavailable||this._busy?'disabled':''} aria-label="Increase cool target">+</button></div>` : `
        <div class="panel-title">Target temperature (${esc(this._tempUnit())})</div>
        <div class="controls"><button class="control-btn" data-action="decrease" ${unavailable||this._busy||target.value==null||climate.state==='off'?'disabled':''} aria-label="Lower target temperature">−</button><div class="target">${esc(target.label)}${esc(this._tempUnit())}</div><button class="control-btn" data-action="increase" ${unavailable||this._busy||target.value==null||climate.state==='off'?'disabled':''} aria-label="Raise target temperature">+</button></div>`;
      this.shadowRoot.innerHTML = `<style>${STYLES}</style><ha-card><div class="shell ${availability}">
        <header class="top"><div><div class="clock">${esc(clock)}</div><div class="date">${esc(date)}</div></div><div class="room">${esc(this._config.name)}</div><button class="menu-button" data-action="toggle" aria-label="Open thermostat controls" aria-expanded="${this._open}">${'<span></span>'.repeat(9)}</button></header>
        <div class="body"><div class="side left"><button class="presence" data-action="info" aria-label="Occupancy information"><svg viewBox="0 0 44 44" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 21L22 5l17 16v18H5Z"/><circle cx="22" cy="23" r="5"/><path d="M13 37c0-6 4-9 9-9s9 3 9 9"/></svg>${presence===null?'status':presence?'home':'away'}</button></div>
        <div class="center"><div class="dial ${off?'off':''}"><svg viewBox="0 0 300 280" role="img" aria-label="Temperature dial">
          <defs><linearGradient id="arc" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${ringColor}"/><stop offset="1" stop-color="${modeColor}"/></linearGradient></defs>
          <path d="M 54 244 A 125 125 0 1 1 246 244" fill="none" stroke="#23455d" stroke-width="24" stroke-linecap="round"/>
          ${off?'':`<path d="M 54 244 A 125 125 0 1 1 246 244" fill="none" stroke="url(#arc)" stroke-width="24" stroke-linecap="round"/>
          <circle cx="219" cy="40" r="23" fill="${modeColor}" stroke="${ringColor}" stroke-width="5"/><circle cx="219" cy="40" r="11" fill="${ringColor}"/>`}
        </svg><div class="dial-content"><div class="humidity">${humidity===null?'Indoor humidity unavailable':`Humidity <span class="droplet">♦</span> ${round(humidity)}%`}</div><div class="current">${round(current)}<span class="degree">°</span></div><div class="mode"><span class="mode-icon" style="color:${modeColor}">${esc(ICONS[climate.state]||'◉')}</span>${esc(label)}</div></div></div>
        <div class="action-row"><button class="schedule" data-action="toggle" aria-expanded="${this._open}">modes / controls</button></div></div>
        <div class="side right"><div class="small">${off?'last setpoint':this._config.heating_only?'heat-to':climate.state==='heat'?'heat-to':climate.state==='heat_cool'?'range':'cool-to'}</div><div class="big ${off?'muted':''}">${esc(target.label)}°</div><div class="small">outside</div><div class="big outside-value">${round(outside)}°</div></div></div>
        ${this._open?`<div class="panel">${targetControls}<div class="mode-buttons">${options}</div><div class="info">Changes are sent to Home Assistant. Ecobee schedules or holds may override or modify them.</div>${this._message?`<div class="error" role="alert">${esc(this._message)}</div>`:''}</div>`:''}
        <div class="brand">ecobee</div></div></ha-card>`;
    }
    async _onClick(event) {
      const btn=event.target.closest('button[data-action]');
      if(!btn || !this._hass || !this._config || this._busy) return;
      const act=btn.dataset.action;
      if(act==='toggle'){this._open=!this._open;this._message='';this._render();return;}
      if(act==='info'){this._open=true;this._render();return;}
      const climate=this._get(this._config.entity);
      if(!climate || ['unknown','unavailable'].includes(climate.state)) return;
      const {min,max,step}=this._levels(climate);
      let service, data;
      if(act==='mode') {
        const mode=btn.dataset.value;
        if(!(climate.attributes.hvac_modes || []).includes(mode)) return;
        if(this._config.heating_only && !['heat','off'].includes(mode)) return;
        service='set_hvac_mode';data={entity_id:this._config.entity,hvac_mode:mode};
      } else {
        service='set_temperature';data={entity_id:this._config.entity};
        if(['increase','decrease'].includes(act)) {
          const current=numeric(climate.attributes.temperature);
          if(current===null) return;
          data.temperature=Math.min(max,Math.max(min,Math.round((current+(act==='increase'?step:-step))/step)*step));
          if(Math.abs(data.temperature-current)<0.0001) return;
        } else {
          let low=numeric(climate.attributes.target_temp_low), high=numeric(climate.attributes.target_temp_high);
          if(low===null||high===null) return;
          if(act==='lower-low') low=Math.max(min,low-step);
          else if(act==='raise-low') low=Math.min(high-step,low+step);
          else if(act==='lower-high') high=Math.max(low+step,high-step);
          else if(act==='raise-high') high=Math.min(max,high+step);
          else return;
          if(low>high-step || low<min || high>max) return;
          data.target_temp_low=low;data.target_temp_high=high;
        }
      }
      this._busy=true;this._message='';this._render();
      try { await this._hass.callService('climate',service,data); }
      catch(e) { this._message=e?.message || 'The thermostat command failed.'; }
      finally { this._busy=false;this._render(); }
    }
  }
  customElements.define(TAG,EcobeeThermostatCard);
  window.customCards=window.customCards||[];
  if(!window.customCards.some(c=>c.type===TAG)) window.customCards.push({type:TAG,name:'Ecobee Thermostat Card',description:'Lennox-inspired visual thermostat dashboard with Ecobee branding'});
})();
