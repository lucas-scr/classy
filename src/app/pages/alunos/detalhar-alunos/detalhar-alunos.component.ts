import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ServiceAlunos } from '../../../services/service_alunos';
import { ToastModule } from 'primeng/toast';


import { DiasDaSemana, DiasDaSemanaDescricao } from '../../../shared/Enums/enumDiasDaSemana';
import { PrimengImports } from '../../../shared/primengImports.module';
import { Aluno } from '../../../interfaces/aluno';
import { Contrato } from '../../../interfaces/contrato';
import { ServiceContratos } from '../../../services/service_contratos';
import { HistoricoAtividade } from '../../../interfaces/historico-atividade';
import { TimelineModule } from 'primeng/timeline';
import { LancarAtividadeComponent } from "../../home/lancar-atividade/lancar-atividade.component";
import { ServiceAulas } from '../../../services/service-aulas.service';
import { ConfirmDialog } from 'primeng/confirmdialog';


@Component({
  selector: 'app-detalhar-alunos',
  imports: [
    PrimengImports,
    TimelineModule,
    LancarAtividadeComponent,
    ToastModule,
    ConfirmDialog
],
providers: [
],
  templateUrl: './detalhar-alunos.component.html',
  styleUrl: './detalhar-alunos.component.css',
})
export class DetalharAlunosComponent implements OnInit, OnChanges  {
  @Input() visible: boolean = false
  @Input() id_aluno: number;
  @Input() data_aula: Date;
  @Input() id_aula: number;
  
  apresentarLancarAtividade = false

  @Output() visibleChange = new EventEmitter<boolean>();

  
  aluno: Aluno; 
  contrato: Contrato = undefined;
  descricaoAmigavelDias = DiasDaSemanaDescricao;

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
    private serviceAulas: ServiceAulas
  ) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id_aluno'] && this.id_aluno && this.visible) {
      this.carregarDadosAluno()
      this.carregarDadosContratoAluno()
    }

  }

  carregarDadosAluno() {
    this.serviceAluno.findById(this.id_aluno).subscribe((res) => {
      this.aluno = res;
      this.aluno.dataNascimento = new Date(this.aluno.dataNascimento);
      this.carregarHistoricoAtividades()
    });
  }

  carregarDadosContratoAluno(){
    this.serviceContrato.findByAluno(this.id_aluno).subscribe(res => {
      this.contrato = res;
      this.diasSelecionados = (this.contrato.diasDasAulas || []).map(d => d.diaSemana ),
      this.id_aluno =  res.aluno.id;
      console.log(this.contrato)
  });
  }

  carregarHistoricoAtividades(){
    this.serviceAluno.obterUltimaAtividadeDoAluno(this.id_aluno).subscribe({
      next: (data) => this.historicoAtividade = data,
      error: (err) => console.log(err)
    })

  }

  fecharJanela() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  abrirLancarAtividade(){
    this.apresentarLancarAtividade = true;
  }

  cancelarAula(){
    console.log('id da aula', this.id_aula)
    this.serviceAulas.cancelarAulaComConfirmacao(this.id_aula)
    this.fecharJanela()
  }

}
