import { Component, Input, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { Aluno } from '../../../interfaces/aluno';
import { ServiceAlunos } from '../../../services/service_alunos';
import { FormsModule } from '@angular/forms';
import { ServiceMensagemGlobal } from '../../../services/mensagens_global';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabel } from "primeng/floatlabel"
import { CommonModule } from '@angular/common';





@Component({
  selector: 'app-cadatrar-aula',
  imports: [ButtonModule, Dialog, InputTextModule, SelectModule, FormsModule, DatePickerModule, FloatLabel, CommonModule],
  templateUrl: './cadatrar-aula.component.html',
  styleUrl: './cadatrar-aula.component.css'
})
export class CadatrarAulaComponent implements OnInit {

  @Input() visible: boolean = false;

  listaAlunos: Aluno[] = [];
  alunoSelecionado: Aluno;
  diaEHorarioDaAula: Date;


  constructor(private alunoService: ServiceAlunos, private mensagemService: ServiceMensagemGlobal) {

  }

  ngOnInit() {
    this.carregarAlunos()

  }


  showDialog() {
    this.visible = true;
  }

  carregarAlunos() {
    this.alunoService.obterAlunos().subscribe({
      next: (data) => {
        this.listaAlunos = data
      },
      error: (err) => {
        console.log(err),
        this.mensagemService.showMessage('error', 'Erro', 'Erro ao consultar a lista de alunos.')
      }
    })
  }

  onSubmit(){

  }
}
