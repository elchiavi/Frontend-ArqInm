import { Component, OnDestroy, OnInit, AfterContentInit } from '@angular/core';
import { NbMenuService, NbSidebarService } from '@nebular/theme';
import { Observable } from 'rxjs';
import { RoleService } from '../../../@core/services';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy, AfterContentInit {

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

  ngAfterContentInit(): void {
    this.sidebarService.toggle(true, 'menu-sidebar');
  }

  ngOnDestroy() { }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }
}
