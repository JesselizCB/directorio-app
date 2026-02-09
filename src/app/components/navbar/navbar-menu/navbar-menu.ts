import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDropdownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';

export interface DropdownMenuItem {
  label: string;
  route: string;
}

export interface NavMenuItem {
  label: string;
  route?: string;
  hasDropdown?: boolean;
  dropdownItems?: DropdownMenuItem[];
}

@Component({
  selector: 'app-navbar-menu',
  imports: [
    NzMenuModule,
    RouterLink,
    RouterLinkActive,
    NzDividerModule,
    NzDropdownModule,
    NzIconModule,
  ],
  templateUrl: './navbar-menu.html',
  styleUrl: './navbar-menu.scss',
})
export class NavbarMenuComponent {
  private readonly openDropdowns = signal<Set<string>>(new Set());

  protected readonly menuItems = signal<NavMenuItem[]>([
    { label: 'Dashboard', route: '/' },
    { label: 'Organizacion', route: '/organizations' },
    {
      label: 'Modulos',
      hasDropdown: true,
      dropdownItems: [
        { label: 'Mis Módulos', route: '/modulos/mis-modulos' },
        { label: 'Crear Módulo', route: '/modulos/crear' },
        { label: 'Plantillas', route: '/modulos/plantillas' },
      ],
    },
    {
      label: 'Seguimiento',
      hasDropdown: true,
      dropdownItems: [
        { label: 'Resumen General', route: '/seguimiento/resumen' },
        { label: 'Reportes', route: '/seguimiento/reportes' },
        { label: 'Análisis', route: '/seguimiento/analisis' },
      ],
    },
  ]);

  onDropdownVisibleChange(dropdown: string, visible: boolean): void {
    const dropdowns = new Set(this.openDropdowns());
    if (visible) {
      dropdowns.add(dropdown);
    } else {
      dropdowns.delete(dropdown);
    }
    this.openDropdowns.set(dropdowns);
  }

  isDropdownOpen(dropdown: string): boolean {
    return this.openDropdowns().has(dropdown);
  }
}
