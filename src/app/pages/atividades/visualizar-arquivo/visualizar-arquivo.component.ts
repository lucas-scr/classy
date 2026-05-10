import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { jsPDF } from 'jspdf';
import {
  DomSanitizer,
  SafeResourceUrl
} from '@angular/platform-browser';

@Component({
  selector: 'app-visualizar-arquivo',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CheckboxModule,
    DropdownModule,
    FormsModule
  ],
  templateUrl: './visualizar-arquivo.component.html',
  styleUrl: './visualizar-arquivo.component.css'
})
export class VisualizarArquivoComponent implements OnChanges {

  @Input() fileUrl: string = '';
  @Input() imageUrls: string[] = [];
  @Input() tipoArquivo: 'pdf' | 'imagem' | null = null;

  safePdfUrl!: SafeResourceUrl;

  isPDF = false;

  isImage = false;

  orientacoes = [
    { label: 'Retrato', value: 'p' },
    { label: 'Paisagem', value: 'l' }
  ];

  orientacaoSelecionada:
    'p' | 'l' | 'portrait' | 'landscape' = 'p';

  constructor(
    private sanitizer: DomSanitizer
  ) { }

  async ngOnChanges() : Promise<void> {

    this.definirTipoArquivo();
    console.log('url acessada:', this.fileUrl)

    if (this.fileUrl) {
      await this.carregarPdf();
    }
  }

  definirTipoArquivo(): void {

    this.isPDF = this.tipoArquivo === 'pdf';

    this.isImage = this.tipoArquivo === 'imagem';
  }

  async gerarPdfComImagens(): Promise<void> {

    if (this.imageUrls.length === 0) {
      alert('Nenhuma imagem selecionada.');
      return;
    }

    const doc = new jsPDF({
      orientation: this.orientacaoSelecionada
    });

    for (let i = 0; i < this.imageUrls.length; i++) {

      const imgData =
        await this.carregarImagemComoBase64(
          this.imageUrls[i]
        );

      if (i > 0) {
        doc.addPage();
      }

      doc.addImage(
        imgData,
        'JPEG',
        10,
        10,
        180,
        260
      );
    }

    doc.save('imagens.pdf');
  }

  private async carregarImagemComoBase64(
    url: string
  ): Promise<string> {

    const response = await fetch(url);

    const blob = await response.blob();

    return new Promise((resolve, reject) => {

      const reader = new FileReader();

      reader.onload = () =>
        resolve(reader.result as string);

      reader.onerror = reject;

      reader.readAsDataURL(blob);
    });
  }

  async carregarPdf(): Promise<void> {

    try {

      const response = await fetch(this.fileUrl);

      const blob = await response.blob();

      const blobUrl = URL.createObjectURL(blob);

      this.safePdfUrl =
        this.sanitizer.bypassSecurityTrustResourceUrl(
          blobUrl
        );

    } catch (error) {

      console.error('Erro ao carregar PDF', error);
    }
  }
}