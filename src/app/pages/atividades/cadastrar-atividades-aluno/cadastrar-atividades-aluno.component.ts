import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PrimengImports } from '../../../shared/primengImports.module';

@Component({
  selector: 'app-cadastrar-atividades-aluno',
  imports: [PrimengImports],
  templateUrl: './cadastrar-atividades-aluno.component.html',
  styleUrl: './cadastrar-atividades-aluno.component.css'
})
export class CadastrarAtividadesAlunoComponent {

   @Input() visible: boolean = false;
 
   @Output() fechar = new EventEmitter<void>();


}
