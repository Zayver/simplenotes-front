import { environment } from '@/environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable, tap, of, finalize } from 'rxjs';
import { jwtDecode } from "jwt-decode";
import { User } from '@/app/model/userDetails';
import { LoginRequest } from  '@/app/model/request/loginRequest';
import { LoginResponse } from '@/app/model/response/loginResponse';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly LOCAL_STORAGE_KEY = "SN_USER"
  private UserSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null)

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) platformId: string) {
    if (!isPlatformBrowser(platformId)){
      return
    }
    let user = localStorage.getItem(this.LOCAL_STORAGE_KEY)
    if (user !== null){
      this.UserSubject.next(JSON.parse(user))
    }
  }

  login(request: LoginRequest): Observable<any>{
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, request).pipe(
      tap((res: LoginResponse)=>{
        this.decodeJWT(res.token)
      })
    )
  }

  get user(): User{
    return this.UserSubject.value as User
  }

  get isLogged (){
    return this.UserSubject.value !== null
  }

  private decodeJWT(token: string){
    const decoded = jwtDecode(token)
    const User: User = {
      token: token,
      username: decoded.sub as string
    }
    this.storeUser(User)
    this.UserSubject.next(User)
  }

  logout(): Observable<any>{
    return of({}).pipe(finalize(()=>{
      this.removeToken()
      this.UserSubject.next(null)
    }))
  }

  private removeToken(){
    localStorage.removeItem(this.LOCAL_STORAGE_KEY)
  }
  private storeUser(userD: User){
    localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(userD))
  }
}
