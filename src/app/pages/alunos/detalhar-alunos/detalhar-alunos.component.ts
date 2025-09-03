import { Component } from '@angular/core';
import { ServiceAlunos } from '../../../services/service_alunos';

import { ActivatedRoute, Route, Router, RouterLink } from '@angular/router';

import { DiasDaSemana, DiasDaSemanaDescricao } from '../../../shared/Enums/enumDiasDaSemana';
import { PrimengImports } from '../../../shared/primengImports.module';
import { Aluno } from '../../../interfaces/aluno';
import { Contrato } from '../../../interfaces/contrato';
import { ServiceContratos } from '../../../services/service_contratos';

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
  alunoId: number;

  aluno: Aluno;
  contrato: Contrato;

    dias: string [] = [
      DiasDaSemana.SEGUNDA,
      DiasDaSemana.TERCA,
      DiasDaSemana.QUARTA,
      DiasDaSemana.QUINTA,
      DiasDaSemana.SEXTA,
    ];
  
    diasSelecionados: string [] = [];

  constructor(
    private serviceAluno: ServiceAlunos,
    private serviceContrato: ServiceContratos,
    private route: ActivatedRoute
  ) {
    this.capturarId();
  }

  capturarId() {
    this.route.params.subscribe((params) => {
      if (params != undefined) {
        this.alunoId = params['id'];
        this.carregarDadosAluno();
        this.carregarDadosContratoAluno()

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

  carregarDadosContratoAluno(){
    this.serviceContrato.findByAluno(this.alunoId).subscribe(res => {
      this.contrato = res;
      this.diasSelecionados = (this.contrato.diasDasAulas || []).map(d => d.diaSemana ),
      console.log(this.contrato)
  });
  }
}
