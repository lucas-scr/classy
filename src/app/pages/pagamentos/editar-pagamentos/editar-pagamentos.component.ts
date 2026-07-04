import { Component } from '@angular/core';
import { ServiceMensagemGlobal } from '../../../services/mensagens_global';
import { ActivatedRoute } from '@angular/router';
import { ServicePagamentos } from '../../../services/service_pagamentos';
import { Pagamento } from '../../../interfaces/pagamentos';
import { PrimengImports } from '../../../shared/primengImports.module';
import { enumnSituacoesPagamentos } from '../../../shared/Enums/enumSituacoes';
import { MoedaPipe } from "../../../shared/mascaras.pipe";


@Component({
  selector: 'app-editar-pagamentos',
  imports: [PrimengImports],
  templateUrl: './editar-pagamentos.component.html',
  styleUrl: './editar-pagamentos.component.css'
})
export class EditarPagamentosComponent {
  id: number = 0;
  pagamento = { } as Pagamento
  dataMinima: Date = new Date();

  constructor(
    private pagamentoService: ServicePagamentos,
        private msgService: ServiceMensagemGlobal,
        private route: ActivatedRoute
  ){  }

    ngOnInit(): void{
    this.capturarId();
    this.carregarDadosPagamento();
  }


  carregarDadosPagamento(){
        this.pagamentoService.getPagamento(this.id).subscribe({
      next: (data) => {
        this.pagamento = data;
        this.pagamento.data_pagamento = new Date(data.data_pagamento),
        this.pagamento.vencimento = new Date(data.vencimento)

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

  onSubmit(){
    this.pagamentoService.editarPagamento(this.id, this.pagamento).subscribe({
      next: () => {
        this.msgService.showMessage('success', 'Sucesso', 'Os dados do pagamento foram alterados com sucesso.')},
      error: (err) => {
        this.msgService.showMessage('danger', 'Erro', 'Algo deu errado ao salvar os dados do pagamento.')
      console.log(err)
      }
    })
  }

}
