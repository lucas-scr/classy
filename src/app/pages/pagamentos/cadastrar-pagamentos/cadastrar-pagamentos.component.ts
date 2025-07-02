import { Component } from '@angular/core';
import { PrimengImports } from '../../../shared/primengImports.module';import { ServicePagamentos } from '../../../services/service_pagamentos';

@Component({
  selector: 'app-cadastrar-pagamentos',
  imports: [PrimengImports],
  templateUrl: './cadastrar-pagamentos.component.html',
  styleUrl: './cadastrar-pagamentos.component.css'
})
export class CadastrarPagamentosComponent {
     valor: number;
     dataPagamento: Date;
     dataVencimento: Date;
     
     constructor(private servicePagamento: ServicePagamentos){
     }
    
}
