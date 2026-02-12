import { Component, computed, signal } from '@angular/core';
import { NzTableModule, NzTableSortFn, NzTableFilterFn, NzTableFilterList } from 'ng-zorro-antd/table';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { FormsModule } from '@angular/forms';

interface Division {
  id: number;
  division: string;
  divisionUp: string;
  collaborators: number;
  nivel: number;
  subdivisions: number;
  ambassadors: string;
}

@Component({
  selector: 'app-table',
  imports: [
    NzTableModule,
    NzPaginationModule,
    NzDropdownMenuComponent,
    NzButtonModule,
    NzIconModule,
    NzInputModule,
    NzCheckboxModule,
    FormsModule
  ],
  templateUrl: './table.html',
  styleUrl: './table.scss',
})
export class DivisionsTable {
  // Paginación
  pageIndex = signal(1);
  pageSize = signal(10);
  pageSizeOptions = [5, 10, 20, 50];

  // Datos
  listOfData: Division[] = [];
  setOfCheckedId = new Set<number>();
  checked = signal(false);

  // Filtro de división
  divisionFilterOpen = signal(false);
  divisionSearchTerm = signal('');
  selectedDivisions = signal(new Set<string>());
  selectedDivisionsApplied = signal(new Set<string>());
  allDivisionOptions: string[] = [];

  // Computed: opciones de división filtradas por búsqueda
  filteredDivisionOptions = computed(() => {
    const term = this.divisionSearchTerm().toLowerCase();
    if (!term) return this.allDivisionOptions;
    return this.allDivisionOptions.filter(opt => 
      opt.toLowerCase().includes(term)
    );
  });

  // Computed: divisiones filtradas
  filteredDivisions = computed(() => {
    const appliedFilters = this.selectedDivisionsApplied();
    if (appliedFilters.size === 0) return this.listOfData;
    return this.listOfData.filter(item => 
      appliedFilters.has(item.division)
    );
  });

  // Computed: total de colaboradores filtrados
  totalCollaboratorsFiltered = computed(() => {
    return this.filteredDivisions().reduce((sum, item) => sum + item.collaborators, 0);
  });

  // Computed: filtros para División Superior
  divisionUpFilters = computed((): NzTableFilterList => {
    const unique = [...new Set(this.listOfData.map(d => d.divisionUp))];
    return unique.map(value => ({ text: value, value }));
  });

  // Computed: filtros para Nivel
  nivelFilters = computed((): NzTableFilterList => {
    const unique = [...new Set(this.listOfData.map(d => d.nivel))].sort((a, b) => a - b);
    return unique.map(value => ({ text: `${value}`, value }));
  });

  // Funciones de ordenamiento
  sortByDivision: NzTableSortFn<Division> = (a, b) => 
    a.division.localeCompare(b.division);

  sortByDivisionUp: NzTableSortFn<Division> = (a, b) => 
    a.divisionUp.localeCompare(b.divisionUp);

  sortByCollaborators: NzTableSortFn<Division> = (a, b) => 
    a.collaborators - b.collaborators;

  sortByNivel: NzTableSortFn<Division> = (a, b) => 
    a.nivel - b.nivel;

  sortBySubdivisions: NzTableSortFn<Division> = (a, b) => 
    a.subdivisions - b.subdivisions;

  sortByAmbassadors: NzTableSortFn<Division> = (a, b) => 
    (a.ambassadors || '').localeCompare(b.ambassadors || '');

  // Funciones de filtrado
  filterByDivisionUp: NzTableFilterFn<Division> = (list: string[], item) => 
    list.some(value => item.divisionUp.indexOf(value) !== -1);

  filterByNivel: NzTableFilterFn<Division> = (list: number[], item) => 
    list.some(value => item.nivel === value);

  // Métodos de paginación
  onPageIndexChange(index: number): void {
    this.pageIndex.set(index);
  }

  onPageSizeChange(size: number): void {
    this.pageSize.set(size);
    this.pageIndex.set(1);
  }

  // Métodos del filtro de división
  onDivisionFilterVisibleChange(visible: boolean): void {
    this.divisionFilterOpen.set(visible);
    if (visible) {
      // Al abrir, sincronizar con las selecciones aplicadas
      this.selectedDivisions.set(new Set(this.selectedDivisionsApplied()));
    }
  }

  isDivisionChecked(option: string): boolean {
    return this.selectedDivisions().has(option);
  }

  toggleDivisionOption(option: string): void {
    const current = new Set(this.selectedDivisions());
    if (current.has(option)) {
      current.delete(option);
    } else {
      current.add(option);
    }
    this.selectedDivisions.set(current);
  }

  applyDivisionFilter(): void {
    this.selectedDivisionsApplied.set(new Set(this.selectedDivisions()));
    this.divisionFilterOpen.set(false);
    this.pageIndex.set(1); // Reset a primera página
  }

  clearDivisionFilter(): void {
    this.selectedDivisions.set(new Set());
    this.selectedDivisionsApplied.set(new Set());
    this.divisionSearchTerm.set('');
    this.divisionFilterOpen.set(false);
    this.pageIndex.set(1);
  }

  ngOnInit(): void {
    const divisions = ['CEO', 'Strategy', 'Growth', 'Producto', 'Operaciones'];
    const superiores = ['Dirección general', 'Producto', 'Operaciones'];
    const embajadores = ['Jordyn Herwitz', 'Carla Siphron', 'Terry Press', 'Kierra Rosser', ''];

    this.listOfData = new Array(135).fill(0).map((_, index) => ({
      id: index,
      division: divisions[Math.floor(Math.random() * divisions.length)],
      divisionUp: superiores[Math.floor(Math.random() * superiores.length)],
      collaborators: Math.floor(Math.random() * 10) + 1,
      nivel: Math.floor(Math.random() * 5) + 1,
      subdivisions: Math.floor(Math.random() * 5) + 1,
      ambassadors: embajadores[Math.floor(Math.random() * embajadores.length)]
    }));

    // Extraer opciones únicas de división
    this.allDivisionOptions = [...new Set(this.listOfData.map(d => d.division))].sort();
  }
}
