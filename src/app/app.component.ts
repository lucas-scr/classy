import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importe o CommonModule
import { RouterOutlet } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { ServiceMensagemGlobal } from './services/mensagens_global';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { OAuthModule } from 'angular-oauth2-oidc';
import { LoadingComponent } from './components/loading/loading.component';
import { SupabaseService } from './core/services/serviceSupabase';



@Component({
  selector: 'app-root',
  imports: [
    AvatarModule,
    OverlayBadgeModule,
    CardModule,
    RouterOutlet,
    CommonModule,
    ToastModule,
    ToastModule,
    InMemoryWebApiModule,
    OAuthModule,
    LoadingComponent
  

  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers:[
    ServiceMensagemGlobal,
    SupabaseService
  ]
})
export class AppComponent {
  title = 'projeto_escolinha';
}
