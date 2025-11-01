import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { jsPDF } from 'jspdf';
import { PDFDocument } from 'pdf-lib';


@Component({
  selector: 'app-visualizar-arquivo',
  imports: [CommonModule, ButtonModule, CheckboxModule, DropdownModule, FormsModule],
  templateUrl: './visualizar-arquivo.component.html',
  styleUrl: './visualizar-arquivo.component.css'
})
export class VisualizarArquivoComponent implements OnChanges {

   @Input() fileUrl!: string; 
  @Input() imageUrls: string[] = []; 

  isPDF = false;
  isImage = false;

  pages: number[] = [];
  selectedPages: number[] = [];

    orientacoes = [
    { label: 'Retrato', value: 'p' },
    { label: 'Paisagem', value: 'l' }
  ];

orientacaoSelecionada: 'p' | 'l' | 'portrait' | 'landscape' = 'p';
P: any;


    async ngOnChanges(changes: SimpleChanges) {
    if (changes['fileUrl'] && this.fileUrl) {
      this.definirTipoArquivo();
      if (this.isPDF) await this.prepararPdf();
    }
  }


    definirTipoArquivo() {
    const extension = this.fileUrl.split('.').pop()?.toLowerCase();
    this.isPDF = extension === 'pdf';
    this.isImage = ['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(extension || '');
  }

    async prepararPdf() {
    const response = await fetch(this.fileUrl);
    const arrayBuffer = await response.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    this.pages = Array.from({ length: pdfDoc.getPageCount() }, (_, i) => i + 1);
  }

   async gerarPdfComPaginasSelecionadas() {
    if (this.selectedPages.length === 0) {
      alert('Selecione ao menos uma página.');
      return;
    }

    const response = await fetch(this.fileUrl);
    const arrayBuffer = await response.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const novoPdf = await PDFDocument.create();

    for (const pageIndex of this.selectedPages) {
      const [page] = await novoPdf.copyPages(pdfDoc, [pageIndex - 1]);
      novoPdf.addPage(page);
    }

    const pdfBytes = await novoPdf.save();
    this.downloadFile(pdfBytes, 'pdf-filtrado.pdf');
  }


   async gerarPdfComImagens() {
    if (this.imageUrls.length === 0) {
      alert('Nenhuma imagem selecionada.');
      return;
    }

    const doc = new jsPDF({ orientation: this.orientacaoSelecionada });
    for (let i = 0; i < this.imageUrls.length; i++) {
      const imgData = await this.carregarImagemComoBase64(this.imageUrls[i]);
      if (i > 0) doc.addPage();
      doc.addImage(imgData, 'JPEG', 10, 10, 180, 260);
    }
    doc.save('imagens.pdf');
  }

  private async carregarImagemComoBase64(url: string): Promise<string> {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  private downloadFile(data: Uint8Array, filename: string) {
    const blob = new Blob([new Uint8Array(data)], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }


}
