import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private baseUrl = 'https://localhost:7185/api/Profile';
  constructor(private http: HttpClient) { }
  addResume(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/profile`, data)
  }
  getResumeById(id: any) {
    return this.http.get(`${this.baseUrl}/${id}`);
  }
  updateResume(id: any, resume: any) {
    console.log('tes---')
    return this.http.put(`${this.baseUrl}/${id}`, resume);
  }
}
