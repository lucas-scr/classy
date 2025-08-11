import { Component } from '@angular/core';
import { MenuLateralComponent } from '../menu-lateral/menu-lateral.component';
import { PrimengImports } from '../../shared/primengImports.module';
import { SupabaseService } from '../../core/services/supabaseService';
import { AuthService } from '../../core/services/auth.service';




@Component({
  selector: 'app-pagina-principal',
  imports: [MenuLateralComponent, PrimengImports],
  templateUrl: './pagina-principal.component.html',
  styleUrl: './pagina-principal.component.css'
})
export class PaginaPrincipalComponent {

  constructor(private authService: AuthService){

  }

  menuLateral: Boolean = true;

  menuToggle(){
    this.menuLateral = !this.menuLateral;
  }

  logout(){
    this.authService.logout().subscribe({
      next: ()=> console.log("sucess"),
      error: (err) => console.log(err)
    });
  }

}
