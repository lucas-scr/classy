import { Injectable } from '@angular/core';
import { from, map, Observable } from 'rxjs';
import { Atividade } from '../interfaces/atividades';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { SupabaseService } from '../core/services/serviceSupabase';
import { adaptarAtividadeParaRequest, adaptarAtividadeParaResponse } from '../shared/adapters/atividade.adapter';

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
        .select(
          `*,
          materia (nome)`
        )
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return (data || []).map(adaptarAtividadeParaResponse);
      })
    )
  }

  cadastrarAtividade(atividade: Atividade): Observable<Atividade> {

    const bucket = 'atividades'
    return from(
      (async () => {
        if (atividade.arquivo) {
          const extensao = atividade.arquivo.type.split('/')[1];
          const fileName = `${atividade.codigo}-${crypto.randomUUID()}.${extensao}`;
          const filePath = `${fileName}`;

          const { error: uploadError } = await this.supabase.getClient()
            .storage
            .from(bucket)
            .upload(filePath, atividade.arquivo, {
              cacheControl: '1000',
              upsert: false
            });

          if (uploadError) throw uploadError;

          atividade.url = filePath;
          atividade.extensao = extensao;
          atividade.nomeArquivo = fileName;

        }

        const payload = adaptarAtividadeParaRequest(atividade);

        const { data, error } = await this.supabase.getClient()
          .from(this.tabela)
          .insert(payload)
          .select()
          .single();

        if (error) throw error;
        return adaptarAtividadeParaResponse(data);
      })()
    )
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
        .select(
          `*,
          materia (nome)`
        )
        .eq('id', id)
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data;
      })
    );
  }


  removerAtividadeById(id: number): Observable<Atividade> {
    return from(
      (async () => {
        const { data: atividade, error: getError } = await this.supabase.getClient()
          .from(this.tabela)
          .select('*')
          .eq('id', id)
          .single()

        if (getError) throw getError;

        if (atividade?.arquivo_anexado && atividade?.url) {
          const { error: storageError } = await this.supabase.getClient()
            .storage
            .from('atividades')
            .remove([atividade.url]);

          if (storageError) throw storageError;
        }

        const { data, error } = await this.supabase.getClient()
          .from(this.tabela)
          .delete()
          .eq('id', id)
          .select()
          .single();

        if (error) throw error

        return adaptarAtividadeParaResponse(data)
      })()
    );
  }

  tratarErro(error: any){
    this.supabase.handleError(error)
  }
}

