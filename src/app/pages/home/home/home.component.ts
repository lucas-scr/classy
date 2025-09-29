import { Component } from '@angular/core';
import { ListaAlunosHomeComponent } from "../lista-alunos-home/lista-alunos-home.component";
import { ListaPagamentosHomeComponent } from "../lista-pagamentos-home/lista-pagamentos-home.component";

@Component({
  selector: 'app-home',
  imports: [ListaAlunosHomeComponent, ListaPagamentosHomeComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
