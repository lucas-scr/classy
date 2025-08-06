import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Atividade } from '../../../interfaces/atividades';
import { PrimengImports } from '../../../shared/primengImports.module';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { Materia } from '../../../interfaces/materias';
import { ServiceMateria } from '../../../services/service_materias';
import { ServiceMensagemGlobal } from '../../../services/mensagens_global';
import { FileUploadEvent } from 'primeng/fileupload';
import { ServiceAtividades } from '../../../services/service_atividades';

@Component({
  selector: 'app-cadastrar-atividades',
  imports: [PrimengImports, RouterModule, RouterLink],
  templateUrl: './cadastrar-atividades.component.html',
  styleUrl: './cadastrar-atividades.component.css',
})
export class CadastrarAtividadesComponent implements OnInit, OnDestroy {

  @ViewChild('fileUpload') fileUpload!: any;

  materiaSelecaoPadrao: Materia = { nome: 'Selecione', id: null };
  codigo: string;
  descricao: string;
  url: string | null = null;;

  listaMaterias: Materia[] | undefined;
  materiaSelecionada: Materia | undefined;
  isImage: boolean = false;
  tipoArquivo: string;
  arquivoBlob: Blob = null;
  nomeArquivo: string;

  constructor(
    private serviceMaterias: ServiceMateria,
    private serviceMensagemGlobal: ServiceMensagemGlobal,
    private serviceAtividade: ServiceAtividades,
    private router: Router
  ) { }

  ngOnInit() {
    this.materiaSelecionada = this.materiaSelecaoPadrao;

    this.serviceMaterias.getMaterias().subscribe({
      next: (materias) => {
        this.listaMaterias = materias;
        console.log(materias)
      },
      error: (erro) => console.log(erro),
    });
  }

  onSubmit() {
    if (this.arquivoBlob == null && this.url == null) {
      this.serviceMensagemGlobal.showMessage(
        'error',
        'Erro',
        'Informe uma URL ou o arquivo para a atividade.'
      );
    } else {
      let atividadeCadastrada: Atividade = {
        codigo: this.codigo,
        materia: this.materiaSelecionada,
        descricao: this.descricao,
        url: this.url
      };
      if(this.arquivoBlob != null || undefined) {
        atividadeCadastrada.arquivo = this.arquivoBlob
      }
      this.cadastrarAtividade(atividadeCadastrada);
    }
  }

  onFileSelect(event: any) {

    if (event.files && event.files.length > 0) {
      const file = event.files[0];

      this.isImage = file.type.startsWith('image/');
      this.nomeArquivo = file.name


      if (file.type === 'application/pdf') {
        this.tipoArquivo = 'application/pdf';
        const reader = new FileReader();
        reader.onload = () => {
          const pdfBytes = new Uint8Array(reader.result as ArrayBuffer);
          this.arquivoBlob = new Blob([pdfBytes], { type: 'application/pdf' });
        };
        reader.readAsArrayBuffer(file);
      } else {
        const reader = new FileReader();
        this.tipoArquivo = file.type;
        reader.onload = () => {
          this.arquivoBlob = new Blob([reader.result as ArrayBuffer], {
            type: file.type,
          });
        };
        reader.readAsArrayBuffer(file);
      }
    }
  }

  cadastrarAtividade(atividade: Atividade) {
    this.serviceAtividade.cadastrarAtividade(atividade).subscribe({
      next: () => {
        this.serviceMensagemGlobal.showMessage(
          'success',
          'Sucesso!',
          'A atividade foi salva com sucesso.'
        );
        this.router.navigate(['/atividades']);
      },
      error: (erro) => {
        this.serviceMensagemGlobal.showMessage(
          'error',
          'Erro',
          `Não foi possível realizar o cadastro. ${erro.error.erro}`
        );
      },
    });
  }
  ngOnDestroy() {
  }

  limparArquivos() {
    this.arquivoBlob = null;
    this.nomeArquivo = null;
    this.isImage =false;
    this.fileUpload.clear(); 
  }
}
