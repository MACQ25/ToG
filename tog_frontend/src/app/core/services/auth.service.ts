import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { response } from 'express';

export interface User {
  id: string;
  email: string;
  userName: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  public currentUser$ = this.currentUserSubject.asObservable();

  private tokenKey = 'auth_token';

  private userKey = 'user';


  constructor(private http: HttpClient) {}

  register(username: string, email: string, password: string, is_temporary: boolean): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}/account/register`, 
      { username, email, password, is_temporary }
    );
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(
       `${environment.apiUrl}/account/login`,
       { email, password }
    ).pipe(
      tap(
        response => this.handleSessionCredentials(response.payload)
      )
    )
  }


  public handleSessionCredentials(res: any) {
    sessionStorage.setItem(this.tokenKey, res.token);
    sessionStorage.setItem(this.userKey, JSON.stringify(res.user));
    this.currentUserSubject.next(res.user);
  }

}
