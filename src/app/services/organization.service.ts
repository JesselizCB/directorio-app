import { Injectable } from '@angular/core';
import { Observable, of, delay, tap } from 'rxjs';

export interface Division {
  id: number;
  division: string;
  divisionUp: string;
  collaborators: number;
  nivel: number;
  subdivisions: number;
  ambassadors: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {
  private mockDivisions: Division[] = this.generateMockDivisions();
  private cache: Division[] | null = null;

  constructor() {}

  private generateMockDivisions(): Division[] {
    const divisions = ['CEO', 'Strategy', 'Growth', 'Producto', 'Operaciones'];
    const superiores = ['Dirección general', 'Producto', 'Operaciones'];
    const embajadores = ['Jordyn Herwitz', 'Carla Siphron', 'Terry Press', 'Kierra Rosser', ''];
    
    return Array.from({ length: 135 }, (_, index) => ({
      id: index + 1,
      division: divisions[index % divisions.length],
      divisionUp: superiores[index % superiores.length],
      collaborators: (index % 10) + 1,
      nivel: (index % 5) + 1,
      subdivisions: (index % 6) + 1,
      ambassadors: embajadores[index % embajadores.length]
    }));
  }

  getDivisions(): Observable<Division[]> {
    // Si ya hay datos en caché, devolverlos inmediatamente
    if (this.cache) {
      return of(this.cache);
    }
    
    // Simula una llamada HTTP con un delay de 500ms solo la primera vez
    return of(this.mockDivisions).pipe(
      delay(500),
      // Guardar en caché después de la primera carga
      tap(divisions => this.cache = divisions)
    );
  }

  getDivisionById(id: number): Observable<Division | undefined> {
    const division = this.mockDivisions.find(d => d.id === id);
    return of(division).pipe(delay(300));
  }

  // Método para limpiar el caché (útil si necesitas refrescar los datos)
  clearCache(): void {
    this.cache = null;
  }
}
