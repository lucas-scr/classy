import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ServiceMensagemGlobal } from '../../../services/mensagens_global';
import { ServiceContratos } from '../../../services/service_contratos';
import { DiasDaSemana, DiasDaSemanaDescricao } from '../../../shared/Enums/enumDiasDaSemana';
import { PrimengImports } from '../../../shared/primengImports.module';
import { Aula } from '../../../interfaces/aula';
import { ModalAdicionarDiaComponent } from '../../../shared/modal-adicionar-dia/modal-adicionar-dia.component';
import { Contrato } from '../../../interfaces/contrato';
import { Turma } from '../../../interfaces/turma';
import { ServiceTurma } from '../../../services/service-turma';

@Component({
  selector: 'app-editar-contratos',
  imports: [RouterLink, PrimengImports, ModalAdicionarDiaComponent],
  templateUrl: './editar-contratos.component.html',
  styleUrl: './editar-contratos.component.css',
})
export class EditarContratosComponent implements OnInit {
  modalAdicionarDia: boolean = false;
  descricaoAmigavelDias = DiasDaSemanaDescricao;

  contratoId: number;
  contratoCarregado: Contrato;
  dataLimite: Date = new Date();
  listaTurmas: Turma[];
  turmaSelecionada: Turma;

  diaSelecionado: string;
  horarioInicio_aula: Date = new Date();


  dias: string[] = [
    DiasDaSemana.SEGUNDA,
    DiasDaSemana.TERCA,
    DiasDaSemana.QUARTA,
    DiasDaSemana.QUINTA,
    DiasDaSemana.SEXTA,
  ];


  diasSelecionados: string[] = [];

  constructor(
    private messageService: ServiceMensagemGlobal,
    private contratoService: ServiceContratos,
    private router: Router,
    private route: ActivatedRoute,
    private serviceTurmas: ServiceTurma
  ) { }

  ngOnInit() {
    this.capturarId();
    this.carregarTurmas()
  }

  onSubmit() {
    if (this.contratoCarregado.diasAlternados) {
      this.limparDiasSelecionados()
    }
    this.alterarContrato(this.contratoCarregado);

  }

  carregarDadosContrato(id: number) {
    this.contratoService.findById(id).subscribe({
      next: (contrato) => {
        this.contratoCarregado = contrato;
        this.contratoCarregado.dataInicio = new Date(contrato.dataInicio);
        this.contratoCarregado.aluno.dataNascimento = new Date(contrato.aluno.dataNascimento);
        this.turmaSelecionada = contrato.turma
        this.atualizarListaDiasAdicionados()
      },
      error: (erro) => {
        this.messageService.showMessage(
          'danger',
          'Erro',
          'Não conseguimos recuperar os dados do contrato.'
        );
        console.log(erro);
      },
    });
  }
  capturarId() {
    this.route.params.subscribe((params) => {
      if (params != undefined) {
        this.contratoId = params['id'];
        this.carregarDadosContrato(this.contratoId);
      } else {
        throw console.error('Aluno não identificado');
      }
    });
  }

  abrirModalAdicionarAula() {
    this.modalAdicionarDia = true;
  }
  fecharModalAdicionarDia() {
    this.modalAdicionarDia = false;
    this.atualizarListaDiasAdicionados()
  }

  diasDisponiveis(): String[] {
    return this.dias.filter((dia) => {
      const ocupado = this.contratoCarregado.diasDasAulas?.some((aula) => aula.diaSemana === dia);
      return !ocupado;
    });
  }

  atualizarListaDiasAdicionados() {
    this.contratoCarregado.diasDasAulas.sort(
      (a, b) => this.dias.indexOf(DiasDaSemana[a.diaSemana]) - this.dias.indexOf(DiasDaSemana[b.diaSemana])
    );
  }

  removerDiaDaSemana(index: number) {
    this.contratoCarregado.diasDasAulas.splice(index, 1);
  }

  adicionarDiaDaSemana(event: { dia: DiasDaSemana, horario: string }) {
    const novaAula: Aula = {
      diaSemana: event.dia,
      horario: event.horario
    }
    this.contratoCarregado.diasDasAulas.push(novaAula)
    this.contratoCarregado.diasDasAulas.sort(
      (a, b) => this.dias.indexOf(DiasDaSemana[a.diaSemana]) - this.dias.indexOf(DiasDaSemana[b.diaSemana])
    );
    this.atualizarListaDiasAdicionados()
    this.fecharModalAdicionarDia();
  }

  alterarContrato(contratoAtualizado: Contrato) {
    this.contratoService
      .atualizarContrato(contratoAtualizado)
      .subscribe({
        next: () =>
          this.messageService.showMessage(
            'success',
            'Atualizado!',
            'Contrato atualizado com sucesso.'
          ),
        error: () =>
          this.messageService.showMessage(
            'error',
            'Algo deu errado!',
            'Não foi possível realizar a atualização.'
          ),
      });
    this.router.navigate(['/contratos']);
  }

  limparDiasSelecionados() {
    if (this.contratoCarregado.diasAlternados) {
      this.contratoCarregado.diasDasAulas = [];
    }
  }

  carregarTurmas(){
    this.serviceTurmas.listarTurmasAtivas().subscribe({
      next: (data) => this.listaTurmas = data,
      error: (err) => {
        this.messageService.showMessage('error', 'Algo deu errado', 'Não foi possível carregar as turmas.'),
        console.log(err)
      }
    })
  }

}
