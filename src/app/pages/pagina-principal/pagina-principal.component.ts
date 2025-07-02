import { Component } from '@angular/core';
import { MenuLateralComponent } from '../menu-lateral/menu-lateral.component';
import { PrimengImports } from '../../shared/primengImports.module';




@Component({
  selector: 'app-pagina-principal',
  imports: [MenuLateralComponent, PrimengImports],
  templateUrl: './pagina-principal.component.html',
  styleUrl: './pagina-principal.component.css'
})
export class PaginaPrincipalComponent {

  menuLateral: Boolean = true;

  menuToggle(){
    this.menuLateral = !this.menuLateral;
  }
}
