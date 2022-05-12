import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseResource } from '../models/base-resource.model';

@Injectable({
  providedIn: 'root'
})
export class BaseResourceService<T extends BaseResource> {

  protected baseUrl: string;
  protected endpoint?: string;

  constructor(protected http: HttpClient) {
    this.baseUrl = environment.apiUrl;
  }

  public create(model: T): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${this.endpoint}`, model);
  }

  public list(): Observable<T[]> {
    return this.http.get<T[]>(`${this.baseUrl}/${this.endpoint}`);
  }

  public get(model_id: string, params: HttpParams): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${this.endpoint}/${model_id}`, { params: params });
  }

  public update(model: T): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${this.endpoint}/${model._id}`, model);
  }
}
