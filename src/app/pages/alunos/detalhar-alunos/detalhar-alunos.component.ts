import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ServiceAlunos } from '../../../services/service_alunos';

import { ActivatedRoute, Route, Router, RouterLink } from '@angular/router';

import { DiasDaSemana, DiasDaSemanaDescricao } from '../../../shared/Enums/enumDiasDaSemana';
import { PrimengImports } from '../../../shared/primengImports.module';
import { Aluno } from '../../../interfaces/aluno';
import { Contrato } from '../../../interfaces/contrato';
import { ServiceContratos } from '../../../services/service_contratos';
import { HistoricoAtividade } from '../../../interfaces/historico-atividade';

@Component({
  selector: 'app-detalhar-alunos',
  imports: [
    PrimengImports
  ],
  templateUrl: './detalhar-alunos.component.html',
  styleUrl: './detalhar-alunos.component.css',
})
export class DetalharAlunosComponent implements OnInit, OnChanges  {
  @Input() visible: boolean = false
  @Input() alunoId: number;

  @Output() visibleChange = new EventEmitter<boolean>();

  
  aluno: Aluno;
  contrato: Contrato;
  historicoAtividade: HistoricoAtividade [] = []

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
  }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['alunoId'] && this.alunoId && this.visible) {
      console.log('Carregar dados do aluno', this.alunoId);
    }
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
      this.carregarHistoricoAtividades()
    });
  }

  carregarDadosContratoAluno(){
    this.serviceContrato.findByAluno(this.alunoId).subscribe(res => {
      this.contrato = res;
      this.diasSelecionados = (this.contrato.diasDasAulas || []).map(d => d.diaSemana ),
      console.log(this.contrato)
  });
  }

  carregarHistoricoAtividades(){
    this.serviceAluno.obterHistoricoAtividadesPorAluno(this.alunoId).subscribe({
      next: (data) => this.historicoAtividade = data,
      error: (err) => console.log(err)
    })

  }

  fecharJanela() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }
}
