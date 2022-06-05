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

  public create(model: T, isMultipart: boolean = false): Observable<T> {
    let data: any = isMultipart ? this.processMultipart(model) : model;

    return this.http.post<T>(`${this.baseUrl}/${this.endpoint}`, data);
  }

  public list(): Observable<T[]> {
    return this.http.get<T[]>(`${this.baseUrl}/${this.endpoint}`);
  }

  public get(model_id: string, params?: HttpParams): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${this.endpoint}/${model_id}`, { params: params });
  }

  public update(model: T, isMultipart: boolean = false): Observable<T> {
    let data: any = isMultipart ? this.processMultipart(model) : model;

    return this.http.put<T>(`${this.baseUrl}/${this.endpoint}/${model._id}`, data);
  }

  public delete(model_id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${this.endpoint}/${model_id}`);
  }

  /**
   * Process data to build a multipart/form-data form
   *
   * @param data any
   * @returns FormData
   */
   protected processMultipart(data: any): FormData {
    let form = new FormData();

    Object.keys(data).forEach((key)=>{
      if(data[key] && data[key].name) {
        form.set(key, data[key], data[key].name);
      } else if (data[key] !== undefined) {
        // let toSet: any = data[key];

        // if (typeof(toSet) === 'object')
        //   toSet = JSON.stringify(toSet);

        if (this.validProcessableObject(data[key]) && typeof(data[key]) === 'object') {
          console.log(data[key] instanceof Blob)
          this.recursiveMultipart(key, data[key], form);
        } else {
          form.set(key, data[key]);
        }
      }
    });

    return form;
  }

  // Dot formatted
  protected recursiveMultipart(fieldname: string, data: Object, formData: FormData) {
    for (let [key, value] of Object.entries(data)) {
      if (this.validProcessableObject(value) && typeof(value) === 'object') {
        this.recursiveMultipart(fieldname + '.' + key, value, formData);
      } else {
        formData.set(fieldname + '.' + key, value);
      }
    }
  }

  private validProcessableObject(value: Object) {
    return !(value === null || value instanceof Date || value instanceof Blob || value instanceof File || value instanceof Image);
  }

  // Bracket formatted
  // protected recursiveMultipart(fieldname: string, data: Object, formData: FormData, array: boolean = false) {
  //   for (let [key, value] of Object.entries(data)) {
  //     if (!(value instanceof Date) && (typeof(value) === 'object' || Array.isArray(value))) {
  //       this.recursiveMultipart((array ? fieldname + '[]' : fieldname + '[' + key + ']'), value, formData, Array.isArray(value));
  //     } else {
  //       formData.set(fieldname + '[' + key + ']', value);
  //     }
  //   }
  // }
}
