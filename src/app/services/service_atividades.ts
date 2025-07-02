import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Atividade } from '../interfaces/atividades';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

@Injectable({
  providedIn: 'root',
})

export class ServiceAtividades {
  private URL = 'http://localhost:8080/api/atividades';

  constructor(private http: HttpClient) {

  }

  getAtividades(): Observable<Atividade[]> {
    return this.http.get<Atividade[]>(this.URL);
  }

  cadastrarAtividade(atividade: Atividade): Observable<string> {
    const formData = new FormData();
    const dados = {
      codigo: atividade.codigo,
      materia: atividade.materia,
      descricao: atividade.descricao,
      url: atividade.url === "" ? null : atividade.url
    }

    formData.append('dados', new Blob([JSON.stringify(dados)], { type: 'application/json' }));
    if (atividade.arquivo) {
      formData.append('arquivo', atividade.arquivo);
    }

    return this.http.post<string>(this.URL, formData)
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
    const formData = new FormData();
    const dados = {
      id: atividade.id,
      codigo: atividade.codigo,
      materia: atividade.materia,
      descricao: atividade.descricao,
      url: atividade.url
    }


    formData.append('dados', new Blob([JSON.stringify(dados)], { type: 'application/json' }));
    if (atividade.arquivo) {
      formData.append('arquivo', atividade.arquivo);
    }
    return this.http.put<Atividade>(`${this.URL}/${id}`, formData)
  }

  findById(id: Number): Observable<Atividade> {
    return this.http.get<Atividade>(`${this.URL}/${id}`)
  }

  findArquivoByAtividade(id: number): Observable<Blob> {
    return this.http.get(`${this.URL}/${id}/arquivo`, { responseType: 'blob' })

  }
  removerAtividadeById(id: number): Observable<string> {
    return this.http.delete<string>(`${this.URL}/${id}`)
  }

  
}