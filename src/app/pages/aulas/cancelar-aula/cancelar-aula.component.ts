import { Component } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { ServiceMensagemGlobal } from '../../../services/mensagens_global';

@Component({
  selector: 'app-cancelar-aula',
  imports: [ConfirmDialog, ToastModule, ButtonModule],
  providers: [ConfirmationService],
  templateUrl: './cancelar-aula.component.html',
  styleUrl: './cancelar-aula.component.css'
})
export class CancelarAulaComponent {
  constructor(private confirmationService: ConfirmationService, private mensagemService: ServiceMensagemGlobal){

  }

  cancelarAula(event: Event) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Você tem certeza que deseja cancelar a aula?',
            header: 'Confirmação',
            closable: true,
            closeOnEscape: true,
            icon: 'pi pi-exclamation-triangle',
            rejectButtonProps: {
                label: 'Fechar',
                severity: 'secondary',
                outlined: true,
            },
            acceptButtonProps: {
                label: 'Confirmar',
            },
            accept: () => {
                this.mensagemService.showMessage('success', 'Sucesso', 'Aula cancelada com sucesso.');
            },
            reject: () => {
            },
        });
    }
}
