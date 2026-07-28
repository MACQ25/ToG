import { HttpClient } from '@angular/common/http';
import { Inject, inject, Injectable, PLATFORM_ID, REQUEST } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  
  private currentUserSubject = new BehaviorSubject(null);

  public currentUser$ = this.currentUserSubject.asObservable();


  constructor(private router: Router, private http: HttpClient, private cookieServ: CookieService) {
    this.autoLogin()
  }

  register(username: string, email: string, password: string, is_temporary: boolean): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}/account/register`, 
      { username, email, password, is_temporary }
    );
  }


  login(email: string, password: string, rememberMe: boolean): Observable<any> {
    return this.http.post<any>(
       `${environment.apiUrl}/account/login`,
       { email, password, rememberMe },
       {withCredentials: true, observe: 'response'}
    ).pipe(
      tap(
        response => this.handleSessionCredentials(response)
      )
    )
  }


  autoLogin(): void {
    this.http.get<any>(
      `${environment.apiUrl}/account/remember`,
      {withCredentials: true, observe: 'response'}
    )
    .pipe(tap(response => this.handleSessionCredentials(response)))
    .subscribe({
      next: res => {},
      error: res => {
        if (res.status !== 400) { /* console.log("something has gone wrong!") */ }
      }
    }
    )
  }


  public handleSessionCredentials(res: any) {
    if(res.status == 200){
      this.currentUserSubject.next(res);
    }
  }


  logout(): void {

    this.http.get(`${environment.apiUrl}/account/logout`, {withCredentials: true}).subscribe(
      {
        next: res => {
          this.currentUserSubject.next(null);
          this.router.navigate(['/']);
        },
        error: res => console.error(res)
      }
    )

  }

}
