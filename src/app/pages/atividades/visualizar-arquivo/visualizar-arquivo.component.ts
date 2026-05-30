import { Component,  ElementRef,  Input,  OnChanges,  ViewChild} from '@angular/core';
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
import { ServiceAtividades } from '../../../services/service_atividades';

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

  @ViewChild('previewImage') previewImage!: ElementRef<HTMLImageElement>;
  @ViewChild('previewContainer')previewContainer!: ElementRef<HTMLDivElement>;

  @Input() arquivoUrl: string = '';
  @Input()  tipoArquivo: 'pdf' | 'imagem' | null = null;
  @Input() nomeArquivo: string | undefined ;

  safePdfUrl!: SafeResourceUrl;
  safeImageUrl: string = '';
  isPDF = false;
  isImage = false;

  orientacoes = [
    { label: 'Retrato', value: 'p' },
    { label: 'Paisagem', value: 'l' }
  ];

  orientacaoSelecionada:
    'p' | 'l' | 'portrait' | 'landscape' = 'p';

  constructor(
    private sanitizer: DomSanitizer,
    private atividadeService: ServiceAtividades
  ) { }

  async ngOnChanges(): Promise<void> {

    this.definirTipoArquivo();

    if (!this.arquivoUrl) {
      this.safePdfUrl = '';
      this.safeImageUrl = '';
      this.isPDF = false;
      this.isImage = false;
      return;
    }
    if (this.isPDF) {
      await this.carregarPdf();
    } else if (this.isImage) {
      await this.carregarImagem();
    }
  }

  definirTipoArquivo(): void {
    this.isPDF =
      this.tipoArquivo === 'pdf';
    this.isImage =
      this.tipoArquivo === 'imagem';
  }

  async carregarPdf(): Promise<void> {

    try {

      const response =
        await fetch(this.arquivoUrl);

      const blob =
        await response.blob();

      const blobUrl =
        URL.createObjectURL(blob);

      this.safePdfUrl =
        this.sanitizer
          .bypassSecurityTrustResourceUrl(
            blobUrl
          );

    } catch (error) {

      console.error(
        'Erro ao carregar PDF',
        error
      );
    }
  }

  async carregarImagem(): Promise<void> {
    try {
      const response =  await fetch(this.arquivoUrl);

      const blob =  await response.blob();

      this.safeImageUrl =  URL.createObjectURL(blob);

    } catch (error) {
      console.error(
        'Erro ao carregar imagem',
        error
      );
    }
  }

  gerarArquivoComImagem(){
    this.atividadeService.gerarPdfComImagem(
      this.arquivoUrl,
      this.nomeArquivo,
      this.previewImage.nativeElement.clientWidth,
      this.previewImage.nativeElement.clientHeight,
      this.previewContainer.nativeElement.clientWidth,
      this.previewContainer.nativeElement.clientHeight
    ).then()
  }
}