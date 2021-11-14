import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpClient: HttpClient) { }

  get(path: string, params: HttpParams = new HttpParams()): Observable<any> {
    return this.httpClient.get(`${environment.api_url}${path}`, { params });
  }

  put(path: string, body: Object = {}, headers: HttpHeaders = new HttpHeaders()): Observable<any> {
    return this.httpClient.put(
      `${environment.api_url}${path}`,
      JSON.stringify(body),
      {headers});
  }

  post(path: string, body: Object = {}, headers: HttpHeaders = new HttpHeaders()): Observable<any> {
    return this.httpClient.post(
      `${environment.api_url}${path}`,
      body,
      {headers}
    );
  }

  // @ts-ignore
  postWithOptions(path: string, body: Object = {}, options): Observable<any> {
    return this.httpClient.post(
      `${environment.api_url}${path}`,
      body,
      options
    );
  }

  delete(path: string): Observable<any> {
    return this.httpClient.delete(
      `${environment.api_url}${path}`
    );
  }
}
