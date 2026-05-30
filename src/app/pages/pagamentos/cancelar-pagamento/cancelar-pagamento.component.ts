import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PrimengImports } from '../../../shared/primengImports.module';
import { ServicePagamentos } from '../../../services/service_pagamentos';
import { Pagamento } from '../../../interfaces/pagamentos';
import { ServiceMensagemGlobal } from '../../../services/mensagens_global';
import { MoedaPipe } from '../../../shared/mascaras.pipe';

@Component({
  selector: 'app-cancelar-pagamento',
  imports: [PrimengImports, MoedaPipe],
  templateUrl: './cancelar-pagamento.component.html',
  styleUrl: './cancelar-pagamento.component.css'
})
export class CancelarPagamentoComponent {
  motivoCancelamento: string;
  idPagamento: number = 0;
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

  cancelarPagamento(){
    this.servicePagamento.cancelarPagamento(this.idPagamento, this.motivoCancelamento).subscribe({
      next: () => {
        this.msgGlobal.showMessage('success', 'Sucesso', 'Pagamento cancelado com sucesso.');
          this.visible = false;
          this.atualizarLista.emit()
      },
      error: (err) => this.msgGlobal.showMessage('danger','Erro ao cancelar pagamento', 
        'Não foi possível realizaro cancelamento do pagamento. Erro: ' + err)
    })
}
}