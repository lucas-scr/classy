import { Injectable } from '@angular/core';
import { SupabaseService } from '../core/services/serviceSupabase';
import { from, map, Observable } from 'rxjs';
import { Aula } from '../interfaces/aula';
import { ConfirmationService } from 'primeng/api';
import { ServiceMensagemGlobal } from './mensagens_global';
import { error } from 'pdf-lib';

@Injectable({
  providedIn: 'root'
})
export class ServiceAulas {

  private tabela = 'aulas';


  constructor(
    private supabase: SupabaseService,
    private confirmationService: ConfirmationService,
    private mensagemService: ServiceMensagemGlobal
  ) {

  }

  cadastrarAula(aula: Aula): Observable<Aula> {
    return from(
      (async () => {

        const { data, error } = await this.supabase.getClient()
          .from(this.tabela)
          .insert({
            data: aula.data,
            contrato: aula.aluno.contrato.id,
            reposicao: aula.reposicao
          })
          .select()
          .single();

          if(error) throw error;
          return data as Aula;
      })()

    )
  }


  cancelarAulaComConfirmacao(aula_id: number){
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
              this.cancelarAula(aula_id).subscribe({
                next: () =>  this.mensagemService.showMessage('success', 'Sucesso', 'Aula cancelada com sucesso.'),
                error: (err) => {
                  this.mensagemService.showMessage('error', 'Erro', 'Não foi possível realizar o cancelamento da aula.')
                  console.log(err)
                }

              });
            },
            reject: () => {
            },
        });
  }




  cancelarAula(aula_id: number): Observable<Aula> {
    return from(
      this.supabase.getClient()
        .from(this.tabela)
        .update({situacao: 0})
        .eq('id', aula_id)
        .select()
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data as Aula;
      })
    );
  }
}
