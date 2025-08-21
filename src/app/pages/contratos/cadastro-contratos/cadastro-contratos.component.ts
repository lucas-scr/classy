import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { PrimengImports } from '../../../shared/primengImports.module';
import { MessageService } from 'primeng/api';
import { ServiceContratos } from '../../../services/service_contratos';
import { ServiceMensagemGlobal } from '../../../services/mensagens_global';
import { Aula } from '../../../interfaces/aula';
import { DiasDaSemana, DiasDaSemanaDescricao } from '../../../shared/Enums/enumDiasDaSemana';
import { ModalAdicionarDiaComponent } from "../../../shared/modal-adicionar-dia/modal-adicionar-dia.component";
import { Contrato } from '../../../interfaces/contrato';
import { Turma } from '../../../interfaces/turma';
import { ServiceTurma } from '../../../services/service-turma';


@Component({
  selector: 'app-cadastro-contratos',
  imports: [RouterLink, PrimengImports, ModalAdicionarDiaComponent],
  templateUrl: './cadastro-contratos.component.html',
  styleUrl: './cadastro-contratos.component.css',
  providers: [MessageService],
})
export class CadastroContratosComponent implements OnInit {

  modalAdicionarDia: boolean = false;
  descricaoAmigavelDiasSemana = DiasDaSemanaDescricao;

  listaTurmas: Turma[] | undefined;
  turmaSelecionada: Turma;
  turmaSelecionadaPadrao: Turma = { nome: 'Selecione', id: null };
  

  nomeResponsavel: string;
  documentoResponsavel: string;
  telefone: string;
  nomeAluno: string;te
  dataNascimento: Date;
  sexo: string;
  isDiasAlternados: boolean = false;
  horarioAulasAlternadas: Date = new Date();
  dataInicio: Date = new Date();
  dataLimite: Date = new Date();
  diaPagamento: Number;
  valorContratado: Number;
  autorizacaoDeImagem: boolean = false;
  ressarcimentoEmFeriados: boolean = false;

  aulas: Aula[] = [];

  dias: string[] = [
    DiasDaSemana.SEGUNDA,
    DiasDaSemana.TERCA,
    DiasDaSemana.QUARTA,
    DiasDaSemana.QUINTA,
    DiasDaSemana.SEXTA,
  ];


  constructor(
    private messageService: ServiceMensagemGlobal,
    private contratoService: ServiceContratos,
    private router: Router,
    private turmaService: ServiceTurma
  ) { }

  ngOnInit() { 
    this.carregarTurmas()
  }

  onSubmit() {
    this.cadastrarContrato(this.atribuirDadosAoContrato());
    this.limparDiasSelecionados();
  }

  limparDiasSelecionados() {
    if (this.isDiasAlternados) {
      this.aulas = [];
    }
  }

  removerDiaDaSemana(index: number) {
    this.aulas.splice(index, 1);
  }


  cadastrarContrato(novoContrato: Contrato) {
    this.contratoService.cadastrarContrato(novoContrato)
      .subscribe({
        next: () =>
          this.messageService.showMessage(
            'success',
            'Cadastrado!',
            'Cadastro realizado com sucesso.'
          ),
        error: () =>
          this.messageService.showMessage(
            'error',
            'Algo deu errado!',
            'Não foi possível realizar o cadastro.'
          )
      });
    this.router.navigate(['/contratos']);
  }

  adicionarDiaDaSemana(event: { dia: DiasDaSemana, horario: string }) {
    const novaAula: Aula = {
      diaSemana: event.dia,
      horario: event.horario
    }
    this.aulas.push(novaAula)
    this.aulas.sort(
      (a, b) => this.dias.indexOf(DiasDaSemana[a.diaSemana]) - this.dias.indexOf(DiasDaSemana[b.diaSemana])
    );

    this.fecharModalAdicionarDia();
  }

  fecharModalAdicionarDia() {
    this.modalAdicionarDia = false;
    this.atualizarListaDiasAdicionados()
  }


  abrirModalAdicionarDia() {
    this.modalAdicionarDia = true;
  }

  atualizarListaDiasAdicionados() {
    this.aulas.sort(
      (a, b) => this.dias.indexOf(DiasDaSemana[a.diaSemana]) - this.dias.indexOf(DiasDaSemana[b.diaSemana])
    );
  }

  atribuirDadosAoContrato(): Contrato {
    let contrato: Contrato = {
      nomeResponsavel: this.nomeResponsavel,
      documentoResponsavel: this.documentoResponsavel,
      telefone: this.telefone,
      diasAlternados: this.isDiasAlternados,
      dataInicio: this.dataInicio,
      diaPagamento: this.diaPagamento,
      valorPagamento: this.valorContratado,
      autorizaUsoDeImagem: this.autorizacaoDeImagem,
      ressarcimentoEmFeriados: this.ressarcimentoEmFeriados,
      turma_id: this.turmaSelecionada.id,
      diasDasAulas: this.aulas,
      aluno: {
        nome: this.nomeAluno,
        dataNascimento: this.dataNascimento,
        sexo: this.sexo
      },
      turma: this.turmaSelecionada
    }

    if (this.isDiasAlternados) {
      contrato.horarioDiasAlternados = this.horarioAulasAlternadas.toString()
    }

    return contrato
  }


  carregarTurmas(){
    this.turmaService.listarTurmasAtivas().subscribe({
      next: (data) => {
       this.listaTurmas = data;
      },
    
      error: (err) => console.log(err)
    })
  
  }
}
