import { Component, signal, inject, OnInit, effect } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { filter } from 'rxjs';

interface OrganizationTabs {
  id: string;
  label: string;
  route: string;
}

@Component({
  selector: 'app-organization',
  imports: [RouterOutlet, NzTabsModule, NzIconModule, NzButtonModule],
  templateUrl: './organization.html',
  styleUrl: './organization.scss',
})
export class Organization implements OnInit {
  private router = inject(Router);
  tabs = signal<OrganizationTabs[]>([
    { id: '1', label: 'Divisiones', route: 'divisions' },
    { id: '2', label: 'Colaboradores', route: 'collaborators' },
  ]);
  selectedTab = signal(0);

  ngOnInit(): void {
    // Sincronizar el tab con la ruta actual
    this.updateSelectedTabFromRoute();
    
    // Escuchar cambios de navegación
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateSelectedTabFromRoute();
      });
  }

  private updateSelectedTabFromRoute(): void {
    const url = this.router.url;
    const tabIndex = this.tabs().findIndex(tab => 
      url.includes(tab.route)
    );
    if (tabIndex !== -1) {
      this.selectedTab.set(tabIndex);
    }
  }

  onTabChange(index: number): void {
    this.selectedTab.set(index);
    const selectedTab = this.tabs()[index];
    if (selectedTab) {
      this.router.navigate(['/organizations', selectedTab.route]);
    }
  }
}
