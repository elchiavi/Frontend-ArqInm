import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMenuService, NbSidebarService } from '@nebular/theme';
import { Observable } from 'rxjs';
import { RoleService } from '../../../@core/services';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  user: any;
  userName$: Observable<string>;

  userMenu = [{ title: 'Cerrar Sesión', link: '/auth/logout' }];

  public constructor(
    private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private roleService: RoleService,
  ) {
  }

  ngOnInit() {
    this.userName$ = this.roleService.getFirstName();
  }

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
