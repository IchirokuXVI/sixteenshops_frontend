import { Injectable } from '@angular/core';
import { BaseResourceService } from './base-resource.service';
import { HttpClient } from '@angular/common/http';
import { Combination } from '../models/combination.model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CombinationService extends BaseResourceService<Combination> {

  constructor(http: HttpClient) {
    super(http);
    this.endpoint = 'combinations';
  }

  public getByOptions(options: string[]): Observable<Combination> {
    return this.http.get<Combination>(this.baseUrl + "/" + this.endpoint + "/byOptions", {
      params: { options: options }
    });
  }
}
