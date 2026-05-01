import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  private apiUrl = 'http://localhost:5000/api/tests';

  constructor(private http: HttpClient) {}

  createRequest(data: any) {
    return this.http.post(`${this.apiUrl}/create`, data);
  }
}