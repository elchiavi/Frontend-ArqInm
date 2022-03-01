import { Component } from '@angular/core';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <span class="created-by">
    Developer & Built by <b><a href="https://www.linkedin.com/in/david-fernandez-48a91287/" target="_blank">David Fernandez</a></b>
    </span>
  `,
})
export class FooterComponent {
}
