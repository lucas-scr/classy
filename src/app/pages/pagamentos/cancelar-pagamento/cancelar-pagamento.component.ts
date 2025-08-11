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
  @Input() pagamento!: Pagamento;
  @Output() atualizarLista = new EventEmitter<void>();
  visible: boolean = false;

  constructor(private servicePagamento: ServicePagamentos, private msgGlobal: ServiceMensagemGlobal){
  }

  abrirModal(id: number){
    this.visible = true;
    this.idPagamento = id;
    this.servicePagamento.getPagamento(this.idPagamento).subscribe(
      {next: (pag)=> {
        if(pag){
          this.pagamento = pag
        }
      },
        error: (err) => console.log(err)
      }
    );
  }

  cancelarPagamento(){
    if (!this.pagamento) {
      this.msgGlobal.showMessage('error', 'Erro!', 'Nenhum pagamento foi carregado.');
      return;
    }
    this.servicePagamento.cancelarPagamento(this.idPagamento,this.pagamento, this.motivoCancelamento).subscribe({
      next: () => {
        this.msgGlobal.showMessage('success', 'Sucesso!','Pagamento cancelado com sucesso.');
        this.atualizarLista.emit()
        this.visible = false;
      },
      error: (err) => {
        console.log(err)
        this.msgGlobal.showMessage('error', 'Erro!','Ocorreu um erro e o pagamento não foi cancelado.')
        this.visible = false;
      }
    })
  }
}
