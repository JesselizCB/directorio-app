import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { ApiService, ApiResponse, EapiMethod } from '../modules/api';

export interface Division {
  id: number;
  division: string;
  divisionUp: string | null;
  collaborators: number;
  nivel: number;
  subdivisions: number;
  ambassadors: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {
  private apiService = inject(ApiService);
  private cache: Division[] | null = null;
  private readonly endpoint = 'divisions';

  /**
   * Obtiene todas las divisiones
   */
  getDivisions(): Observable<Division[]> {
    // Si ya hay datos en caché, devolverlos inmediatamente
    if (this.cache) {
      return of(this.cache);
    }
    
    // Llamada HTTP real a la API
    return this.apiService.request(this.endpoint, EapiMethod.GET).pipe(
      map((response: any) => response.data as Division[]),
      tap((divisions: Division[]) => {
        this.cache = divisions;
        console.log('✅ Divisiones cargadas desde la API:', divisions.length);
      }),
      catchError(error => {
        console.error('❌ Error al cargar divisiones:', error);
        return of([]);
      })
    );
  }

  
  // Busca divisiones por nombre
  searchDivisions(name: string): Observable<Division[]> {
    return this.apiService.request(`${this.endpoint}/search/${name}`, EapiMethod.GET).pipe(
      map((response: any) => response.data as Division[]),
      catchError(error => {
        return of([]);
      })
    );
  }

  /**
   * Limpia el caché de divisiones
   */
  clearCache(): void {
    this.cache = null;
  }

  /**
   * Fuerza recarga de divisiones desde la API
   */
  reloadDivisions(): Observable<Division[]> {
    this.clearCache();
    return this.getDivisions();
  }
}
