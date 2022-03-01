import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMenuService, NbSidebarService } from '@nebular/theme';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  user: any;

  userMenu = [{ title: 'Salir', link: '/auth/logout' }];

  public constructor(
    private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
  ) {
  }

  ngOnInit() {}

  ngOnDestroy() {}

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }
}
