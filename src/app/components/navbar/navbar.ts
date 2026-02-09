import { Component } from '@angular/core';
import { NavbarMenuComponent } from './navbar-menu/navbar-menu';
import { NavbarActionsComponent } from './navbar-actions/navbar-actions';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';

@Component({
  selector: 'app-navbar',
  imports: [NzPageHeaderModule, NavbarMenuComponent, NavbarActionsComponent],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {

}
