import { Component, OnInit, ViewChild } from '@angular/core';
import { PrimengImports } from '../../../shared/primengImports.module';
import { ServicePagamentos } from '../../../services/service_pagamentos';
import { ServiceMensagemGlobal } from '../../../services/mensagens_global';
import { Pagamento } from '../../../interfaces/pagamentos';
import { DataBrPipe, MoedaPipe } from '../../../shared/mascaras.pipe';
import { RegistrarLiquidacaoComponent } from '../../pagamentos/registrar-liquidacao/registrar-liquidacao/registrar-liquidacao.component';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { ConfirmDialogModule } from 'primeng/confirmdialog';



@Component({
  selector: 'app-lista-pagamentos-home',
  imports: [PrimengImports, MoedaPipe, DataBrPipe, RegistrarLiquidacaoComponent, ConfirmDialogModule, ConfirmDialogModule],
  templateUrl: './lista-pagamentos-home.component.html',
  styleUrl: './lista-pagamentos-home.component.css',
  providers:[ConfirmationService]
})



export class ListaPagamentosHomeComponent implements OnInit{

  pagamentos: Pagamento[] = [];

  opcoesDeAcoes: MenuItem[] | undefined;
@ViewChild('menu') menu!: Menu;
  
  
    @ViewChild(RegistrarLiquidacaoComponent) 
    liquidarComponent: RegistrarLiquidacaoComponent;

  constructor(
    private servicePagamento: ServicePagamentos, 
    private serviceConfirmation: ConfirmationService,
    private serviceMensagem: ServiceMensagemGlobal){

  }
  ngOnInit(): void {
    this.carregarPagamentosDoMes()


    
    this.opcoesDeAcoes = [
      {
        label: 'Opções',
        items: [
          {
            label: 'Gerar novos pagamentos',
            icon: 'pi pi-pencil',
            command: () =>  this.ConfirmarGerarPagamentos(),
          },

        ],
      },
    ];
  }

  carregarPagamentosDoMes(){
    this.servicePagamento.getPagamentosPorMes().subscribe({
        next: (data) => {
            this.pagamentos = data;
            console.log(this.pagamentos)
        },
        error: (err) => {
            this.serviceMensagem.showMessage('danger','Falha interna', 'Erro ao consultar os pagamentos mensais');
            console.log(err)
        }

    })
  }


  getSeverity(status: string) {
        switch (status) {
            case 'Em aberto':
                return 'success';
            case 'unqualified':
                return 'danger';
            case 'negotiation':
                return 'warn';
            case 'new':
                return 'info';
            case 'renewal':
                return 'secondary';
            case 'proposal':
                return 'info';
            default:
                return 'secondary';
        }
    }

    apresentarLiquidarPagamento(id: number){
            this.liquidarComponent.abrirModal(id)
    }

    carregarLista(){
        this.carregarPagamentosDoMes()
    }

    abrirMenu(event: Event) {
    this.menu.toggle(event); 
  }

  ConfirmarGerarPagamentos() {
        this.serviceConfirmation.confirm({
            target: event.target as EventTarget,
            message: 'O sistema irá gerar todos os pagamentos até o final do ano, de todos os contratos ativos.',
            header: 'Gerar pagamentos',
            closable: true,
            closeOnEscape: true,
            icon: 'pi pi-exclamation-triangle',
            rejectButtonProps: {
                label: 'Cancelar',
                severity: 'secondary',
                outlined: true
            },
            acceptButtonProps: {
                label: 'Confirmar'
            },
            accept: () => {
                this.serviceMensagem.showMessage('info', 'Confirmar', 'Os pagamentos estão sendo gerados');
            },
            reject: () => {
                this.serviceMensagem.showMessage('error', 'Cancelado', 'Ação cancelada.',

                );
            }
        });
    }

    
}
