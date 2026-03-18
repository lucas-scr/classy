import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Atividade } from '../../../interfaces/atividades';
import { PrimengImports } from '../../../shared/primengImports.module';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { Materia } from '../../../interfaces/materias';
import { ServiceMateria } from '../../../services/service_materias';
import { ServiceMensagemGlobal } from '../../../services/mensagens_global';
import { ServiceAtividades } from '../../../services/service_atividades';
import { EditorAtividadesComponent } from '../../editor-atividades/editor-atividades/editor-atividades.component';

@Component({
  selector: 'app-cadastrar-atividades',
  imports: [PrimengImports, RouterModule, RouterLink, EditorAtividadesComponent],
  templateUrl: './cadastrar-atividades.component.html',
  styleUrl: './cadastrar-atividades.component.css',
})
export class CadastrarAtividadesComponent implements OnInit, OnDestroy {

  @ViewChild('fileUpload') fileUpload!: any;
  elementosChange = new EventEmitter<any[]>();

  materiaSelecaoPadrao: Materia = { nome: 'Selecione', id: null, dataCriacao: null, ativo: null };
  codigo: string;
  descricao: string;
  url: string | null = null;
  user_id: string;
  elementos: any[] = [];

  listaMaterias: Materia[] | undefined;
  materiaSelecionada: Materia | undefined;
  isImage: boolean = false;
  tipoArquivo: string;
  arquivoBlob: Blob = null;
  nomeArquivo: string;
  previewImagem: string | null = null;

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
        materia_id: this.materiaSelecionada.id,
        nome_materia: this.materiaSelecionada.nome,
        descricao: this.descricao,
        url: this.url,
      };
      if (this.arquivoBlob != null || undefined) {
        atividadeCadastrada.arquivo = this.arquivoBlob
        atividadeCadastrada.arquivo_anexado = true;
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
          //gera o preview do arquivo
          this.previewImagem = URL.createObjectURL(this.arquivoBlob);
        };
        reader.readAsArrayBuffer(file);
      } else {
        const reader = new FileReader();
        this.tipoArquivo = file.type;
        reader.onload = () => {
          this.arquivoBlob = new Blob([reader.result as ArrayBuffer], {
            type: file.type,
          });
          //gera o preview do arquivo
          this.previewImagem = reader.result as string;
        };
        reader.readAsDataURL(file);
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
        console.log(erro)
        this.serviceMensagemGlobal.showMessage(
          'error',
          'Erro',
          `Não foi possível realizar o cadastro. ${erro}`
        );
      },
    });
  }
  ngOnDestroy() {
  }

  limparArquivos() {
    this.arquivoBlob = null;
    this.nomeArquivo = null;
    this.isImage = false;
    this.fileUpload.clear();
  }

  // adicionarNoEditor(src: string) {

  //   const novoElemento = {
  //     id: Date.now(),
  //     tipo: 'imagem',
  //     src: src,
  //     x: 50,
  //     y: 50,
  //     width: 150,
  //     height: 150,
  //     rotate: 0
  //   };

  //   this.elementos.push(novoElemento);
  // }
}
