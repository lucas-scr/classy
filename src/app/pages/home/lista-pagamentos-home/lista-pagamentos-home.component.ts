import { Component, OnInit, ViewChild } from '@angular/core';
import { PrimengImports } from '../../../shared/primengImports.module';
import { ServicePagamentos } from '../../../services/service_pagamentos';
import { ServiceMensagemGlobal } from '../../../services/mensagens_global';
import { Pagamento } from '../../../interfaces/pagamentos';
import { DataBrPipe, MoedaPipe } from '../../../shared/mascaras.pipe';
import { RegistrarLiquidacaoComponent } from '../../pagamentos/registrar-liquidacao/registrar-liquidacao/registrar-liquidacao.component';



@Component({
  selector: 'app-lista-pagamentos-home',
  imports: [PrimengImports, MoedaPipe, DataBrPipe, RegistrarLiquidacaoComponent],
  templateUrl: './lista-pagamentos-home.component.html',
  styleUrl: './lista-pagamentos-home.component.css'
})



export class ListaPagamentosHomeComponent implements OnInit{

  pagamentos: Pagamento[] = [];

    @ViewChild(RegistrarLiquidacaoComponent) 
    liquidarComponent: RegistrarLiquidacaoComponent;

  constructor(
    private servicePagamento: ServicePagamentos, 
    private serviceMensagem: ServiceMensagemGlobal){

  }
  ngOnInit(): void {
    this.carregarPagamentosDoMes()
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
        this.carregarPagamentosDoMes
    }
}
