declare var google: any;
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { environments } from '../../environments/environments';
import { AuthService } from '../../core/services/serviceAuth';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { trigger, style, transition, animate } from '@angular/animations';
import { Route, Router, RouterLinkActive } from '@angular/router';
import { SupabaseService } from '../../core/services/serviceSupabase';




@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  animations: [
    trigger('fadeSlideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class LoginComponent implements AfterViewInit {

  loginForm: FormGroup;
  user: any = null;
  clientId = environments.googleClientId;
  tokenGoogle: string = '';
  email: string;
  password: string;
  isLoadingGoogle: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService

  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }


  ngAfterViewInit() {
    google.accounts.id.initialize({
      client_id: this.clientId,
      callback: (response: any) => {
        this.handleCredentialResponse(response);
      }
    });
    google.accounts.id.renderButton(
      document.getElementById('google-button')!,
      { theme: 'outline', size: 'large' }
    );
  }


  handleCredentialResponse(response: any) {
    this.authService.loginWithGoogleIdToken(response.credential).subscribe({
      next: (user) => {
        this.isLoadingGoogle = false;
        if (user) {
          this.router.navigate(['/alunos']);
        } else {
          console.error('Falha no login: usuário indefinido');
        }
      },
      error: (err) => {
        console.error('Erro ao logar no Supabase:', err.message || err);
      }
    });
  }

carregar(){
  this.isLoadingGoogle = true;
  console.log("TEste")
}
}
