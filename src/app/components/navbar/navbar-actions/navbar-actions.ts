import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDropdownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';

export interface UserMenuItem {
  label: string;
  route: string;
  icon?: string;
}

@Component({
  selector: 'app-navbar-actions',
  imports: [
    NzDividerModule,
    RouterLink,
    RouterLinkActive,
    NzDropdownModule,
    NzIconModule,
    NzAvatarModule,
    NzBadgeModule,
    NzMenuModule,
  ],
  templateUrl: './navbar-actions.html',
  styleUrl: './navbar-actions.scss',
})
export class NavbarActionsComponent {
  protected readonly isDropdownOpen = signal(false);
  protected readonly notificationCount = signal(3);
  protected readonly userName = signal('Administrador');
  protected readonly userInitial = signal('A');

  protected readonly userMenuItems = signal<UserMenuItem[]>([
    { label: 'Mi Perfil', route: '/perfil' },
    { label: 'Mi cuenta', route: '/cuenta' },
    { label: 'Cerrar sesión', route: '/logout' },
  ]);

  onDropdownVisibleChange(visible: boolean): void {
    this.isDropdownOpen.set(visible);
  }
}
