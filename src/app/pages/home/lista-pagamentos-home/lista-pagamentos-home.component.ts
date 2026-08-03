import { Component, OnInit } from '@angular/core';
import { PrimengImports } from '../../../shared/primengImports.module';
import { ServicePagamentos } from '../../../services/service_pagamentos';
import { ServiceMensagemGlobal } from '../../../services/mensagens_global';
import { Pagamento } from '../../../interfaces/pagamentos';



@Component({
  selector: 'app-lista-pagamentos-home',
  imports: [PrimengImports],
  templateUrl: './lista-pagamentos-home.component.html',
  styleUrl: './lista-pagamentos-home.component.css'
})



export class ListaPagamentosHomeComponent implements OnInit{

  pagamentos: Pagamento[] = [];

  constructor(
    private servicePagamento: ServicePagamentos, 
    private serviceMensagem: ServiceMensagemGlobal){

  }
  ngOnInit(): void {
  }

  carregarPagamentosDoMes(){
  }


  getSeverity(status: string) {
        switch (status) {
            case 'qualified':
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
}
