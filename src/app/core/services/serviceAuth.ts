import { Injectable } from '@angular/core';
import { BehaviorSubject, from, map, Observable, of, Subject, switchMap, tap } from 'rxjs';
import { SupabaseService } from './serviceSupabase';
import { User } from '@supabase/supabase-js';
import { Route, Router } from '@angular/router';


@Injectable({ providedIn: 'root' })
export class AuthService {

  TOKEN_KEY = 'sb-cknedrdeyzjseckxspqx-auth-token';

  private _user$ = new BehaviorSubject<User | null>(null);
  user$ = this._user$.asObservable();

  private _token$ = new BehaviorSubject<string | null>(null);
  token$ = this._token$.asObservable();




  constructor(
    private supabase: SupabaseService,
    private router: Router,
  ) {

    this.supabase.authExpired$.subscribe(() => {
      console.log('🔴 Sessão expirada. Forçando logout');
      this._user$.next(null);
      this._token$.next(null);
      localStorage.removeItem(this.TOKEN_KEY);
      this.router.navigate(['auth/login']);
    });

    this.supabase.getClient().auth.onAuthStateChange((event, session) => {
      if (session) {
        this._user$.next(session.user);
        this._token$.next(session.access_token);

      } else {
        this._user$.next(null);
        this._token$.next(null);
      }
    });
    this.restoreSession();
  }

  private restoreSession() {
    from(this.supabase.getSession()).subscribe(({ data }) => {
      const session = data?.session;
      if (session) {
        this._user$.next(session.user);
        this._token$.next(session.access_token);
      }
    });
  }




  loginWithGoogleIdToken(idToken: string): Observable<User | null> {
    return from(this.supabase.signInWithGoogleIdToken(idToken)).pipe(
      tap(({ data, error }) => {
        if (error) throw error;
        if (data?.session) {
          this._user$.next(data.session.user);
          this._token$.next(data.session.access_token);
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
        localStorage.removeItem(this.TOKEN_KEY);
        this.router.navigate(['auth/login']);

      }),
      switchMap(() => of(void 0))
    );
  }

  get user(): User | null {
    return this._user$.value;
  }

  get token(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.user || !!this.token;
  }

}