import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
import { ServiceAulas } from '../../../services/service-aulas.service';
import { Aula } from '../../../interfaces/aula';





@Component({
  selector: 'app-cadatrar-aula',
  imports: [ButtonModule, Dialog, InputTextModule, SelectModule, FormsModule, DatePickerModule, FloatLabel, CommonModule],
  templateUrl: './cadatrar-aula.component.html',
  styleUrl: './cadatrar-aula.component.css'
})
export class CadatrarAulaComponent implements OnInit {

  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();


  listaAlunos: Aluno[] = [];
  tiposAula = [
    {tipo: "Normal", valor: false},
    {tipo: "Reposição", valor: true}
  ]

  alunoSelecionado: Aluno = undefined;
  data: Date;
  reposicao: boolean = false;

  aula: Aula = {
  aluno: null,
  data: null,
  reposicao: false,
  situacao: 1
};


  constructor(
    private alunoService: ServiceAlunos,
    private mensagemService: ServiceMensagemGlobal,
    private aulaService: ServiceAulas
  ) {

  }

  ngOnInit() {
    this.carregarAlunos()

  }

  carregarAlunos() {
    this.alunoService.obterAlunosAtivos().subscribe({
      next: (data) => {
        this.listaAlunos = data
      },
      error: (err) => {
        console.log(err),
          this.mensagemService.showMessage('error', 'Erro', 'Erro ao consultar a lista de alunos.')
      }
    })
  }

  onSubmit() {
    this.aulaService.cadastrarAula(this.aula).subscribe({
      next: (data) => {
        this.mensagemService.showMessage('success', 'Sucesso!', 'A aula foi cadastrada com sucesso.')
        this.fecharJanela()
      },
      error: (err) => {
        console.log(err)
        this.mensagemService.showMessage('error', 'Erro!', 'Não foi possível cadastrar a aula.')
      }
    })
  }

  fecharJanela() {
    this.aula.aluno = null;
    this.aula.data = null;
    this.reposicao = false;
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }
}
