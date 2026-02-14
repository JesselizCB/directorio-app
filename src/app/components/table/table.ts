import { Component, computed, signal, input, OnInit, inject } from '@angular/core';
import { NzTableModule, NzTableSortFn, NzTableFilterFn, NzTableFilterList } from 'ng-zorro-antd/table';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { FormsModule } from '@angular/forms';
import { OrganizationService, Division } from '../../services/rest/organization.service';

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
export class DivisionsTable implements OnInit {
  private organizationService = inject(OrganizationService);
  // Inputs para búsqueda
  searchColumn = input<string>('');
  searchTerm = input<string>('');

  pageIndex = signal(1);
  pageSize = signal(10);
  pageSizeOptions = [5, 10, 20, 50];

  listOfData = signal<Division[]>([]);
  setOfCheckedId = new Set<number>();
  checked = signal(false);

  // Filtro de división
  divisionFilterOpen = signal(false);
  divisionSearchTerm = signal('');
  selectedDivisions = signal(new Set<string>());
  selectedDivisionsApplied = signal(new Set<string>());
  allDivisionOptions = signal<string[]>([]);

  // Computed: opciones de división filtradas por búsqueda
  filteredDivisionOptions = computed(() => {
    const term = this.divisionSearchTerm().toLowerCase();
    if (!term) return this.allDivisionOptions();
    return this.allDivisionOptions().filter(opt => 
      opt.toLowerCase().includes(term)
    );
  });

  // Computed: divisiones filtradas
  filteredDivisions = computed(() => {
    let data = this.listOfData();
    
    // Filtro por columna División (personalizado)
    const appliedFilters = this.selectedDivisionsApplied();
    if (appliedFilters.size > 0) {
      data = data.filter(item => appliedFilters.has(item.division));
    }
    
    // Filtro por búsqueda global (desde el input superior)
    const column = this.searchColumn();
    const term = this.searchTerm().toLowerCase().trim();
    
    if (column && term) {
      data = data.filter(item => {
        switch (column) {
          case 'División':
            return item.division.toLowerCase().includes(term);
          case 'División Superior':
            return (item.divisionUp || '').toLowerCase().includes(term);
          case 'Colaboradores':
            // Búsqueda exacta por número
            const collabNumber = parseInt(term);
            return !isNaN(collabNumber) && item.collaborators === collabNumber;
          case 'Nivel':
            // Búsqueda exacta por número
            const nivelNumber = parseInt(term);
            return !isNaN(nivelNumber) && item.nivel === nivelNumber;
          case 'Subdivisiones':
            // Búsqueda exacta por número
            const subdivNumber = parseInt(term);
            return !isNaN(subdivNumber) && item.subdivisions === subdivNumber;
          case 'Embajadores':
            return (item.ambassadors || '').toLowerCase().includes(term);
          default:
            return true;
        }
      });
    }
    
    return data;
  });

  // Computed: total de colaboradores filtrados
  totalCollaboratorsFiltered = computed(() => {
    return this.filteredDivisions().reduce((sum, item) => sum + item.collaborators, 0);
  });

  // Computed: filtros para División Superior
  divisionUpFilters = computed((): NzTableFilterList => {
    const unique = [...new Set(this.listOfData().map(d => d.divisionUp || 'Sin división superior'))];
    return unique.map(value => ({ text: value, value }));
  });

  // Computed: filtros para Nivel
  nivelFilters = computed((): NzTableFilterList => {
    const unique = [...new Set(this.listOfData().map(d => d.nivel))].sort((a, b) => a - b);
    return unique.map(value => ({ text: `${value}`, value }));
  });

  // Funciones de ordenamiento
  sortByDivision: NzTableSortFn<Division> = (a, b) => 
    a.division.localeCompare(b.division);

  sortByDivisionUp: NzTableSortFn<Division> = (a, b) => 
    (a.divisionUp || '').localeCompare(b.divisionUp || '');

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
    list.some(value => (item.divisionUp || 'Sin división superior').indexOf(value) !== -1);

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
    // Cargar datos desde el servicio
    this.organizationService.getDivisions().subscribe({
      next: (divisions) => {
        this.listOfData.set(divisions);
        // Extraer opciones únicas de división
        this.allDivisionOptions.set([...new Set(divisions.map(d => d.division))].sort());
      },
      error: (error) => {
        console.error('Error al cargar divisiones:', error);
      }
    });
  }
}
