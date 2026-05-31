import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Pagamento } from '../../../../interfaces/pagamentos';
import { ServicePagamentos } from '../../../../services/service_pagamentos';
import { ServiceMensagemGlobal } from '../../../../services/mensagens_global';
import { PrimengImports } from '../../../../shared/primengImports.module';
import { MoedaPipe } from '../../../../shared/mascaras.pipe';

@Component({
  selector: 'app-registrar-liquidacao',
  imports: [PrimengImports, MoedaPipe],
  templateUrl: './registrar-liquidacao.component.html',
  styleUrl: './registrar-liquidacao.component.css'
})
export class RegistrarLiquidacaoComponent {
  motivoCancelamento: string;
    idPagamento: number = 0;
    valorPago: number = null;
    dataPagamento: Date = new Date();
    pagamento: Pagamento = undefined;
    @Input() pagamentoId: number
    @Output() atualizarLista = new EventEmitter<void>();
    visible: boolean = false;
  
    constructor(private servicePagamento: ServicePagamentos, private msgGlobal: ServiceMensagemGlobal){
    }
  
    abrirModal(id: number){
      this.visible = true;
      this.idPagamento = id;
      this.servicePagamento.getPagamento(this.idPagamento).subscribe({
        next: (data) => this.pagamento = data,
        error: (err) => console.log('Erro', err)
      }) 
    }
  
    liquidarPagamento(){
      this.servicePagamento.liquidarPagamento(this.idPagamento, this.dataPagamento, this.valorPago).subscribe({
        next: () => {
          this.msgGlobal.showMessage('success', 'Sucesso', 'Pagamento liquidado com sucesso.');
            this.visible = false;
            this.atualizarLista.emit()
        },
        error: (err) => this.msgGlobal.showMessage('danger','Erro ao liquidar pagamento', 
          'Não foi possível realizar a liquidação do pagamento. Erro: ' + err)
      })
  }

}
