import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

export enum EapiMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH'
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private url = environment.apiUrl;
  private headers = {};
  
  constructor(public client: HttpClient) {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
  }

  request(url: string = '', method: EapiMethod, body = {}) {
    const apiUrl = `${this.url}/${url}`;
    
    // Para GET no enviamos body
    if (method === EapiMethod.GET) {
      return this.client.get(apiUrl, { headers: this.headers });
    }
    
    return this.client.request(method, apiUrl, { body, headers: this.headers });
  }
}
