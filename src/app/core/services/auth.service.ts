import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, from, map, Observable, of, switchMap, tap } from 'rxjs';
import { SupabaseService } from './SupaBaseService';
import { User } from '@supabase/supabase-js';
import { Route, Router } from '@angular/router';


@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user$ = new BehaviorSubject<User | null>(null);
  user$ = this._user$.asObservable();

  private _token$ = new BehaviorSubject<string | null>(null);
  token$ = this._token$.asObservable();

  constructor(
    private supabase: SupabaseService,
    private router: Router
  ) {
    this.restoreSession();
  }

  private restoreSession() {
    from(this.supabase.getSession()).subscribe(({ data }) => {
      const session = data?.session;
      if (session) {
        this._user$.next(session.user);
        this._token$.next(session.access_token);
        //localStorage.setItem('app_token', session.access_token);
      }
    });
  }


  loginWithEmail(email: string, password: string): Observable<User | null> {
    return from(this.supabase.signInWithEmailPassword(email, password)).pipe(
      tap(({ data, error }) => {
        if (error) throw error;
        if (data?.session) {
          this._user$.next(data.session.user);
          this._token$.next(data.session.access_token);
          //localStorage.setItem('app_token', data.session.access_token);
        }
      }),
      switchMap(({ data }) => of(data?.session?.user ?? null))
    );
  }





  loginWithGoogleIdToken(idToken: string): Observable<User | null> {
    return from(this.supabase.signInWithGoogleIdToken(idToken)).pipe(
      tap(({ data, error }) => {
        if (error) throw error;
        if (data?.session) {
          this._user$.next(data.session.user);
          this._token$.next(data.session.access_token);
          //localStorage.setItem('app_token', data.session.access_token);
        }
      }),
      switchMap(({ data }) => of(data?.session?.user ?? null))
    );
  }


  loadCurrentUser(): Observable<User | null> {
    return from(this.supabase.getUser()).pipe(
      tap(({ data, error }) => {
        if (error) {
          console.error(error);
          return;
        }
        this._user$.next(data?.user ?? null);
      }),
      switchMap(({ data }) => of(data?.user ?? null))
    );
  }

  logout(): Observable<void> {
    return from(this.supabase.signOut()).pipe(
      tap(() => {
        this._user$.next(null);
        this._token$.next(null);
        localStorage.removeItem('sb-cknedrdeyzjseckxspqx-auth-token');
        this.router.navigate(['auth/login']);
      }),
      switchMap(() => of(void 0))
    );
  }

  get user(): User | null {
    return this._user$.value;
  }

  get token(): string | null {
    return this._token$.value ?? localStorage.getItem('sb-cknedrdeyzjseckxspqx-auth-token');
  }

  isLoggedIn(): boolean {
    return !!this.user;
  }

}