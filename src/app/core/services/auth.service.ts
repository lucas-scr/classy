import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { ServiceLoading } from '../../services/service-loading.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
    readonly API = 'http://localhost:8080/api/auth/google'
    private _token = new BehaviorSubject<string | null>(null);
    token$ = this._token.asObservable();


    constructor(private http: HttpClient) {
        const token = localStorage.getItem('app_token');
        if (token) {
            this._token.next(token);
        }
    }


    loginWithGoogle(tokenGoogle: string) {
        const headers = {
            'Content-Type': 'application/json'
        };
        let body = { token: tokenGoogle }
        return this.http.post<{ token: string }>(this.API, body, { headers })
        .pipe(
            tap(response => {
                const token = response.token;
                this._token.next(token);
                sessionStorage.setItem('app_token', token);
            }))
    }

    get token() {
        return this._token.value || sessionStorage.getItem('app_token')
    }

    logout() {
        this._token.next(null);
        sessionStorage.removeItem('app_token');
    }

    isLoggedIn(): boolean {
        return !!this.token
    }
}