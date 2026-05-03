import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  private apiUrl = 'http://localhost:5000/api/tests';

  constructor(private http: HttpClient) {}

  createRequest(data: any) {
    return this.http.post(`${this.apiUrl}/create`, data);
  }

  getAllTests(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?userId=${userId}`);
  }
}

