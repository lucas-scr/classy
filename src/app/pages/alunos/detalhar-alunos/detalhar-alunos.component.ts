import { Component } from '@angular/core';
import { ServiceAlunos } from '../../../services/service_alunos';

import { ActivatedRoute, Route, Router, RouterLink } from '@angular/router';

import { Aluno } from '../../../model/Alunos';

import { DiasDaSemana } from '../../../shared/Enums/enumDiasDaSemana';
import { PrimengImports } from '../../../shared/primengImports.module';

@Component({
  selector: 'app-detalhar-alunos',
  imports: [
    PrimengImports,
    RouterLink,
  ],
  templateUrl: './detalhar-alunos.component.html',
  styleUrl: './detalhar-alunos.component.css',
})
export class DetalharAlunosComponent {
  alunoId: Number;

  aluno: Aluno = {} as Aluno;

    dias: string [] = [
      DiasDaSemana.SEGUNDA,
      DiasDaSemana.TERCA,
      DiasDaSemana.QUARTA,
      DiasDaSemana.QUINTA,
      DiasDaSemana.SEXTA,
    ];
  
    diasSelecionados: [] = [];

  constructor(
    private serviceAluno: ServiceAlunos,
    private route: ActivatedRoute
  ) {
    this.capturarId();
  }

  capturarId() {
    this.route.params.subscribe((params) => {
      if (params != undefined) {
        this.alunoId = params['id'];
        this.carregarDadosAluno();
      } else {
        throw console.error('Aluno não identificado');
      }
    });
  }

  carregarDadosAluno() {
    this.serviceAluno.findById(this.alunoId).subscribe((res) => {
      this.aluno = res;
      this.aluno.dataNascimento = new Date(this.aluno.dataNascimento);
    });
  }
}
