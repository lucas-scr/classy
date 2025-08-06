import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, map, Observable } from 'rxjs';
import { Atividade } from '../interfaces/atividades';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { SupabaseService } from '../core/services/SupaBaseService';
import { adaptarAtividadeParaRequest, adaptarAtividadeParaResponse } from '../shared/adapters/ativdade.adapter';
import { adaptarTurmaParaRequest } from '../shared/adapters/turma.adapter';

@Injectable({
  providedIn: 'root',
})

export class ServiceAtividades {
  private tabela = 'atividade';

  constructor(private supabase: SupabaseService) {

  }

  getAtividades(): Observable<Atividade[]> {
    return from(
      this.supabase.getClient()
        .from(this.tabela)
        .select('*')
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return (data || []).map(adaptarAtividadeParaResponse);
      })
    )
  }

  cadastrarAtividade(atividade: Atividade): Observable<Atividade> {
    atividade.user_id = this.supabase.getUserId();

    const payload = adaptarAtividadeParaRequest(atividade);
    return from(
      this.supabase.getClient()
        .from(this.tabela)
        .insert(payload)
        .select()
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return adaptarAtividadeParaResponse(data);
      })
    );
  }

  async adicionarTextoRodapePDF(pdfBytes: Uint8Array): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.load(pdfBytes);

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    const { width, height } = firstPage.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    firstPage.drawText('Texto do Rodapé', {
      x: 50,
      y: 20,
      size: 12,
      font,
      color: rgb(0, 0, 0),
    });

    return pdfDoc.save();
  }

  atualizarAtividade(id: Number, atividade: Atividade): Observable<Atividade> {
    const payload = adaptarAtividadeParaRequest(atividade);
    return from(
      this.supabase.getClient()
        .from(this.tabela)
        .update(payload)
        .eq('id', id)
        .select()
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return adaptarAtividadeParaResponse(data);
      })
    );
  }

  findById(id: Number): Observable<Atividade> {
    return from(
      this.supabase.getClient()
        .from(this.tabela)
        .select('*')
        .eq('id', id)
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data;
      })
    );
  }

  //  findArquivoByAtividade(id: number): Observable<Blob> {
  //    return this.http.get(`${this.URL}/${id}/arquivo`, { responseType: 'blob' })
  //  }

  removerAtividadeById(id: number): Observable<Atividade> {
    return from(
      this.supabase.getClient()
        .from(this.tabela)
        .delete()
        .eq('id', id)
        .select()
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return adaptarAtividadeParaResponse(data);
      })
    );
  }
}

