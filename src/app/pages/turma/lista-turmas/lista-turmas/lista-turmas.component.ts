import { Component, ViewChild } from '@angular/core';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { Turma } from '../../../../interfaces/turma';
import { Menu } from 'primeng/menu';
import { ServiceTurma } from '../../../../services/service-turma';
import { Router } from '@angular/router';
import { ServiceMensagemGlobal } from '../../../../services/mensagens_global';
import { Table } from 'primeng/table';
import { PrimengImports } from '../../../../shared/primengImports.module';
import { SituacoesTurmaPorId } from '../../../../shared/Enums/enumSituacoes';

@Component({
  selector: 'app-lista-turmas',
  imports: [PrimengImports],
  templateUrl: './lista-turmas.component.html',
  styleUrl: './lista-turmas.component.css',
  providers: [ServiceTurma, ConfirmationService]
})
export class ListaTurmasComponent {

  descricaoAmigavelSituacao = SituacoesTurmaPorId;

  opcoesDeAcoes: MenuItem[] | undefined;
    listaTurmas: Turma[] = [];
    status: any[];
    searchValue: String;
    loading: boolean = true;
    itemId: number;
    @ViewChild('menu') menu!: Menu;
  
    constructor(
      private turmaService: ServiceTurma,
      private router: Router,
      private messageService: ServiceMensagemGlobal,
      private confirmationService: ConfirmationService
    ) {
  
    }
  
    ngOnInit() {
  
      this.carregarTurmas();
  
      this.loading = false;
  
      this.status = [
        { label: 'Iniciado', value: 'iniciado' },
        { label: 'Finalizado', value: 'finalizado' },
      ];
  
      this.opcoesDeAcoes = [
        {
          label: 'Opções',
          items: [
            {
              label: 'Detalhar',
              icon: 'pi pi-eye',
              command: () => this.router.navigate(['/detalhar-contrato', this.itemId]),
            },
            {
              label: 'Editar',
              icon: 'pi pi-pencil',
              command: () => this.router.navigate(['/editar-contrato', this.itemId]),
  
            },
            {
              label: 'Remover',
              icon: 'pi pi-trash',
              command: () => this.confirmarRemover(),
            },
          ],
        },
      ];
    }
  
    clear(table: Table) {
      table.clear();
    }
  
    carregarTurmas(){
      this.turmaService.listarTurmas().subscribe({
        next: (dados) => {
          this.listaTurmas = dados;
        },
        error: (erro) => console.log(erro)
      })
    }
  
    abrirMenu(event: Event, id: any) {
      this.itemId = id;
      this.menu.toggle(event); // Exibe o menu no local correto
    }
  
    removerTurmaLista(id: number) {
      this.turmaService.removerTurma(id).subscribe({
        next: () =>  {this.messageService.showMessage('success', 'Removido!', 'Turma removido com sucesso.'),
          this.carregarTurmas();
        },
        error: () => this.messageService.showMessage('danger', 'Erro', 'Não foi possível remover a turma.'),
      });
    
    }
  
  
    confirmarRemover() {
      this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: 'Tem certeza que deseja remover a turma?',
        header: 'Remover turma',
        closable: true,
        closeOnEscape: true,
        icon: 'pi pi-exclamation-triangle',
        rejectButtonProps: {
          label: 'Não',
          severity: 'secondary',
          outlined: true,
        },
        acceptButtonProps: {
          label: 'Sim',
          severity: 'danger',
        },
        accept: () => {
          this.removerTurmaLista(this.itemId);
        },
        reject: () => {},
      });
    }
  
    getSituacaoClass(situacao: number): string {
      switch (situacao) {
        case 1:
          return 'situacao-ativo';
        case 0:
          return 'situacao-inativo';
        default:
          return 'situacao-inativo'; // Classe vazia caso não encontre a situação
      }
    }
}
