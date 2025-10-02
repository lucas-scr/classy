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
        console.log("carregando");
        this.loading.show();

        const token = this.auth.token;

        // Se não for requisição para API ou se for login, não adiciona token
        if (req.url.includes('/auth/login')) {
            console.log("requisição para API ou se for login");
            return next.handle(req).pipe(finalize(() => {
                setTimeout(() => this.loading.hide(), 1500)
            }));
        }

        let clone = req;
        if (token) {
            clone = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log("interceptor adicionando Authorization");

        }
        return next.handle(clone).pipe(
            catchError((error: HttpErrorResponse) => {

                console.log(clone)

                const supabaseExpired =
                    typeof error.error === 'object' &&
                    error.error?.message === 'JWT expired';
                if (error.status === 401 || error.status === 403 || supabaseExpired) {
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