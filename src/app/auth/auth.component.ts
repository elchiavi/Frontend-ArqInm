import { Component } from '@angular/core';

@Component({
  selector: 'ngx-auth',
  styleUrls: ['./auth.component.scss'],
  template: `
  <nb-layout>
      <nb-layout-column>
        <nb-card>
          <nb-card-body>
            <ngx-auth-block>
              <router-outlet></router-outlet>
            </ngx-auth-block>
          </nb-card-body>
        </nb-card>
      </nb-layout-column>
    </nb-layout>
  `,
})
export class AuthComponent {

  constructor() { }
}
