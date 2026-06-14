import { Component, OnInit } from '@angular/core';
import { Pagamento } from '../../../interfaces/pagamentos';
import { ServicePagamentos } from '../../../services/service_pagamentos';
import { ServiceMensagemGlobal } from '../../../services/mensagens_global';
import { PrimengImports } from '../../../shared/primengImports.module';
import { FormsModule } from '@angular/forms';
import { DateUtils } from '../../../shared/utils/date-utils';
import { CardModule } from 'primeng/card';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'app-detalhar-pagamentos',
  imports: [PrimengImports, FormsModule, CardModule],
  templateUrl: './detalhar-pagamentos.component.html',
  styleUrl: './detalhar-pagamentos.component.css'
})
export class DetalharPagamentosComponent implements OnInit{

  id: number;
  pagamento: Pagamento = {} as Pagamento;


  constructor(private pagamentoService: ServicePagamentos,
    private msgService: ServiceMensagemGlobal,
    private route: ActivatedRoute
  ){
  }

  ngOnInit(): void{
    this.capturarId();
    this.carregarDadosPagamento();
  }


  carregarDadosPagamento(){
        this.pagamentoService.getPagamento(this.id).subscribe({
      next: (data) => {
        this.pagamento = data
      },
      error: (err) => {
        this.msgService.showMessage('danger', 'Erro', 'Não foi possível recuperar os dados do pagamentos');
        console.log(err)
      }
    })
  }

   capturarId() {
    this.route.params.subscribe((params) => {
      if (params != undefined) {
        this.id = params['id'];
      } else {
        throw console.error('Aluno não identificado');
      }
    });
  }

}
