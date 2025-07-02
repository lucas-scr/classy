import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { PrimengImports } from '../../../shared/primengImports.module';
import { ServiceContratos } from '../../../services/service_contratos';
import { TelefonePipe, MoedaPipe } from '../../../shared/mascaras.pipe';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Router, RouterLink } from '@angular/router';
import { Menu } from 'primeng/menu';
import { ServiceMensagemGlobal } from '../../../services/mensagens_global';
import { Contrato } from '../../../interfaces/contrato';

@Component({
  selector: 'app-lista-contratos',
  imports: [PrimengImports, TelefonePipe, MoedaPipe],
  templateUrl: './lista-contratos.component.html',
  styleUrl: './lista-contratos.component.css',
  providers: [ServiceContratos, MessageService, ConfirmationService],
})
export class ListaContratosComponent implements OnInit {
  opcoesDeAcoes: MenuItem[] | undefined;
  listaContratos: Contrato[] = [];
  status: any[];
  searchValue: String;
  loading: boolean = true;
  itemId: Number;
  @ViewChild('menu') menu!: Menu;

  constructor(
    private contratosService: ServiceContratos,
    private router: Router,
    private messageService: ServiceMensagemGlobal,
    private confirmationService: ConfirmationService
  ) {

  }

  ngOnInit() {

    this.carregarContratos();

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

  carregarContratos(){
    this.contratosService.listarContratos().subscribe({
      next: (dados) => {
        this.listaContratos = dados;
      },
      error: (erro) => console.log(erro)
    })
  }

  abrirMenu(event: Event, id: any) {
    this.itemId = id;
    this.menu.toggle(event); // Exibe o menu no local correto
  }

  removerContratoLista(id: Number) {
    this.contratosService.removerContrato(id).subscribe({
      next: () =>  {this.messageService.showMessage('success', 'Removido!', 'Contrato removido com sucesso.'),
        this.carregarContratos();
      },
      error: () => this.messageService.showMessage('danger', 'Erro', 'Não foi possível remover o contrato.'),
    });
  
  }


  confirmarRemover() {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Tem certeza que deseja remover o contrato?',
      header: 'Remover contrato',
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
        this.removerContratoLista(this.itemId);
      },
      reject: () => {},
    });
  }

  getSituacaoClass(situacao: string): string {
    switch (situacao) {
      case 'Iniciado':
        return 'situacao-ativo';
      case 'Finalizado':
        return 'situacao-inativo';
      default:
        return 'situacao-inativo'; // Classe vazia caso não encontre a situação
    }
  }
}
