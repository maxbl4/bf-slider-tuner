import { Component } from '@angular/core';

const sliderStepPercent = 10;
@Component({
  selector: 'app-root',
  template: `
    <div class="container-fluid d-flex flex-column h-100">
      Starting PIDS
      <mat-select [(value)]="initialPids">
        <mat-option value="BF42">
          BF 4.2
        </mat-option>
        <mat-option value="BF43">
          BF 4.3
        </mat-option>
      </mat-select>
      <table class="table table-bordered">
        <thead>
        <tr>
          <th></th>
          <th>P</th>
          <th>I</th>
          <th>D</th>
          <th>F</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>Roll</td>
          <td>{{currentPids.PRoll}}</td>
          <td>{{currentPids.IRoll}}</td>
          <td>{{currentPids.DRoll}}</td>
          <td>{{currentPids.FRoll}}</td>
        </tr>
        <tr>
          <td>Pitch</td>
          <td>{{currentPids.PPitch}}</td>
          <td>{{currentPids.IPitch}}</td>
          <td>{{currentPids.DPitch}}</td>
          <td>{{currentPids.FPitch}}</td>
        </tr>
        <tr>
          <td>Yaw</td>
          <td>{{currentPids.PYaw}}</td>
          <td>{{currentPids.IYaw}}</td>
          <td>{{currentPids.DYaw}}</td>
          <td>{{currentPids.FYaw}}</td>
        </tr>
        </tbody>
      </table>
      <button mat-raised-button color="primary" [cdkCopyToClipboard]="pidsCli">Copy CLI commands</button>
      D slider {{dSlider}}
      <mat-slider [(value)]="dSlider" min="-20" max="20" thumbLabel="true" (change)="updatePids()"></mat-slider>
      P slider {{pSlider}}
      <mat-slider [(value)]="pSlider" min="-20" max="20" thumbLabel="true"
                  (change)="updatePids()"></mat-slider>
      I slider {{iSlider}}
      <mat-slider [(value)]="iSlider" min="-20" max="20" thumbLabel="true"
                  (change)="updatePids()"></mat-slider>
      F slider {{fSlider}}
      <mat-slider [(value)]="fSlider" min="-20" max="20" thumbLabel="true"
                  (change)="updatePids()"></mat-slider>
      PD balance {{pdBalanceSlider}}
      <mat-slider [(value)]="pdBalanceSlider" min="-20" max="20" thumbLabel="true"
                  (change)="updatePids()"></mat-slider>

      <!--      <router-outlet></router-outlet>-->
    </div>
  `,
  styles: []
})
export class AppComponent {
  defaultPids = {'BF42': DefaultPids42, 'BF43': DefaultPids43};
  _initialPids: string = "BF42";
  pidsCli = "";
  get initialPids(): string {
    return this._initialPids;
  }
  set initialPids(value: string) {
    this._initialPids = value;
    this.updatePids();
  }
  currentPids = Object.assign({}, DefaultPids42);
  dSlider:number|null = 0;
  pSlider:number|null = 0;
  iSlider:number|null = 0;
  fSlider:number|null = 0;
  pdBalanceSlider:number|null = 0;

  constructor() {
    this.loadConfig();
    this.updatePids();
  }

  updatePids() {
    const dSliderCoeff = this.calcSliderChange(this.dSlider!);
    const pSliderCoeff = this.calcSliderChange(this.pSlider!);
    const iSliderCoeff = this.calcSliderChange(this.iSlider!);
    const fSliderCoeff = this.calcSliderChange(this.fSlider!);
    const pdBalanceSlider = this.calcSliderChange(this.pdBalanceSlider!);
    const basePids = (<any>this.defaultPids)[this._initialPids];
    this.currentPids.PRoll = Math.round(basePids.PRoll * dSliderCoeff * pSliderCoeff);
    this.currentPids.IRoll = Math.round(basePids.IRoll * dSliderCoeff * pSliderCoeff * iSliderCoeff);
    this.currentPids.DRoll = Math.round(basePids.DRoll * dSliderCoeff * pdBalanceSlider);
    this.currentPids.FRoll = Math.round(basePids.FRoll * dSliderCoeff * fSliderCoeff);
    this.currentPids.PPitch = Math.round(basePids.PPitch * dSliderCoeff * pSliderCoeff);
    this.currentPids.IPitch = Math.round(basePids.IPitch * dSliderCoeff * pSliderCoeff * iSliderCoeff);
    this.currentPids.DPitch = Math.round(basePids.DPitch * dSliderCoeff * pdBalanceSlider);
    this.currentPids.FPitch = Math.round(basePids.FPitch * dSliderCoeff * fSliderCoeff);
    this.currentPids.PYaw = Math.round(basePids.PYaw * dSliderCoeff * pSliderCoeff);
    this.currentPids.IYaw = Math.round(basePids.IYaw * dSliderCoeff * pSliderCoeff * iSliderCoeff);
    this.currentPids.DYaw = Math.round(basePids.DYaw * dSliderCoeff * pdBalanceSlider);
    this.currentPids.FYaw = Math.round(basePids.FYaw * dSliderCoeff * fSliderCoeff);
    this.pidsCli = `set p_roll = ${this.currentPids.PRoll}
set i_roll = ${this.currentPids.IRoll}
set d_roll = ${this.currentPids.DRoll}
set f_roll = ${this.currentPids.FRoll}
set p_pitch = ${this.currentPids.PPitch}
set i_pitch = ${this.currentPids.IPitch}
set d_pitch = ${this.currentPids.DPitch}
set f_pitch = ${this.currentPids.FPitch}
set p_yaw = ${this.currentPids.PYaw}
set i_yaw = ${this.currentPids.IYaw}
set d_yaw = ${this.currentPids.DYaw}
set f_yaw = ${this.currentPids.FYaw}
save
`;
    this.saveConfig();
}

  calcSliderChange(value:number){
    if (value === 0) return 1;
    const coeff = Math.pow((10 + sliderStepPercent)/10, Math.abs(value/10));
    if (value > 0)
      return coeff;
    return 1/coeff;
  }

  loadConfig() {
    this._initialPids = localStorage.getItem("initialPids") ?? "BF42";
    this.dSlider = parseInt(localStorage.getItem("dSlider") ?? "0");
    this.pSlider = parseInt(localStorage.getItem("pSlider") ?? "0");
    this.iSlider = parseInt(localStorage.getItem("iSlider") ?? "0");
    this.fSlider = parseInt(localStorage.getItem("fSlider") ?? "0");
    this.pdBalanceSlider = parseInt(localStorage.getItem("pdBalanceSlider") ?? "0");
  }

  saveConfig() {
    localStorage.setItem("initialPids", this.initialPids);
    localStorage.setItem("dSlider", this.dSlider!.toString());
    localStorage.setItem("pSlider", this.pSlider!.toString());
    localStorage.setItem("iSlider", this.iSlider!.toString());
    localStorage.setItem("fSlider", this.fSlider!.toString());
    localStorage.setItem("pdBalanceSlider", this.pdBalanceSlider!.toString());
  }
}

class PidValues {
  PRoll: number = 0;
  IRoll: number = 0;
  DRoll: number = 0;
  FRoll: number = 0;
  PPitch: number = 0;
  IPitch: number = 0;
  DPitch: number = 0;
  FPitch: number = 0;
  PYaw: number = 0;
  IYaw: number = 0;
  DYaw: number = 0;
  FYaw: number = 0;
}

const DefaultPids42: PidValues = {
  PRoll:42, IRoll: 85, DRoll: 30, FRoll: 90,
  PPitch: 46, IPitch: 90, DPitch:32, FPitch:95,
  PYaw: 45, IYaw: 90, DYaw: 0, FYaw: 90
};

const DefaultPids43: PidValues = {
  PRoll:42, IRoll: 85, DRoll: 35, FRoll: 90,
  PPitch: 46, IPitch: 90, DPitch:38, FPitch:95,
  PYaw: 45, IYaw: 90, DYaw: 0, FYaw: 90
};
