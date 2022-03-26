import { Component } from '@angular/core';
import { NbIconLibraries } from '@nebular/theme';

@Component({
  selector: 'ngx-app',
  template: `
  <ngx-spinner bdColor="rgba(0,0,0,0.8)" size="medium" color="#ec8e82"
  type="timer" [fullScreen]="true">
  </ngx-spinner>
  <router-outlet></router-outlet>`,
})
export class AppComponent {

  constructor(private iconLibraries: NbIconLibraries) {
    this.iconLibraries.registerFontPack('fab', { packClass: 'fab', iconClassPrefix: 'fa' });
    this.iconLibraries.registerFontPack('fas', { packClass: 'fas', iconClassPrefix: 'fa' });
  }

}
