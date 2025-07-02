declare var google: any;
import { Component, OnInit } from '@angular/core';
import { environments } from '../../environments/environments';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { trigger, style, transition, animate } from '@angular/animations';
import { Route, Router } from '@angular/router';




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
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  user: any = null;
  clientId = environments.googleClientId;
  tokenGoogle: string = '';
  email: string;
  password: string;

  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private authService:  AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    google.accounts.id.initialize({
      client_id: this.clientId,
      callback: this.handleCredentialResponse.bind(this),
      use_fedcm_for_button: false
    });

    google.accounts.id.renderButton(
      document.getElementById("buttonDiv"),
      { theme: "filled-blue", size: "large", width: "100%" }
    );
  }

  handleCredentialResponse(response: any) {
    this.tokenGoogle = response.credential;
    console.log(this.tokenGoogle);
    this.auth.loginWithGoogle(this.tokenGoogle).subscribe({
      next: (res) => {
        this.router.navigate(['']);
      },
      error: (err) => {
        console.error('Erro ao logar:', err)
      }
    })
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.normalLoginWithSupabase(this.email, this.password).subscribe({
        next: (result) => {
          console.log(result)
        },
        error: (err) => {
          console.log(err)
        }
      })
    }
  }

}
