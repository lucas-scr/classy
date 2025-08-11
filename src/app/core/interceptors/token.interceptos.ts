import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { catchError, finalize, Observable, throwError } from 'rxjs';
import { AuthService } from '../services/serviceAuth';
import { Router } from '@angular/router';
import { ServiceLoading } from '../../services/service-loading.service';


@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(
        private auth: AuthService,
        private router: Router,
        private loading: ServiceLoading) {

    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.loading.show();

        const isApiRequest = req.url.startsWith('http://localhost:8080/api');
        const isLoginRequest = req.url.includes('/auth/login');

        if (!isApiRequest || isLoginRequest) {
            return next.handle(req).pipe(
                finalize(() => this.loading.hide())
            );
        }
        const excludedUrls = [
            '/auth/login',
        ];
        const token = this.auth.token;

        if (excludedUrls.some(url => req.url.includes(url))) {
            return next.handle(req).pipe(
                finalize(() => {
                    this.loading.hide();
                    console.log("Token inválido ou expirado, redirecionando para login.");

                }));
        }

        let clone = req;
        if (token) {
            console.log("interceptor adicionando Authorization");
            clone = req.clone({
      

            });
        }
        return next.handle(clone).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401 || error.status === 403) {
                    console.log("Token inválido ou expirado, redirecionando para login.");
                    this.auth.logout();
                    this.loading.hide();
                    this.router.navigate(['auth/login']);

                }
                return throwError(() => error)
            }), finalize(() => {
                this.loading.hide();
            })

        );
    }
}