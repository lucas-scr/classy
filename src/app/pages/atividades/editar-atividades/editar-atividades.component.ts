import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Atividade } from '../../../interfaces/atividades';
import { ServiceMensagemGlobal } from '../../../services/mensagens_global';
import { ServiceAtividades } from '../../../services/service_atividades';
import { ServiceMateria } from '../../../services/service_materias';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterModule,
} from '@angular/router';
import { Materia } from '../../../interfaces/materias';
import { PrimengImports } from '../../../shared/primengImports.module';

@Component({
  selector: 'app-editar-atividades',
  imports: [PrimengImports, RouterModule, RouterLink],
  templateUrl: './editar-atividades.component.html',
  styleUrl: './editar-atividades.component.css',
})
export class EditarAtividadesComponent implements OnInit, OnDestroy {


  @ViewChild('fileUpload') fileUpload!: any;

  idAtividade: number;
  codigo: string;
  descricao: string;
  url: string = null;

  listaMaterias: Materia[] | undefined;
  materiaSelecionada: Materia | undefined;

  nomeArquivo: string;
  isImage: boolean = false;
  arquivoUrl: string | null = null;
  tipoArquivo: string;
  arquivoBlob: Blob;

  constructor(
    private serviceMaterias: ServiceMateria,
    private serviceMensagemGlobal: ServiceMensagemGlobal,
    private serviceAtividade: ServiceAtividades,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.capturarId();
    this.carregarMaterias();
  }

  onSubmit() {
    if (this.arquivoBlob == null && this.url == null) {
      this.serviceMensagemGlobal.showMessage(
        'error',
        'Erro',
        'Informe uma URL ou o arquivo para a atividade.'
      );
    } else {
      let atividadeAtualizada: Atividade = {
        codigo: this.codigo,
        materia_id: this.materiaSelecionada.id,
        nome_materia: this.materiaSelecionada.nome,
        arquivo: this.arquivoBlob,
        descricao: this.descricao,
        url: this.url,
        id: this.idAtividade,
      };
      if (this.arquivoBlob != null || undefined) {
        atividadeAtualizada.arquivo = this.arquivoBlob;
      }
      this.atualizarDados(this.idAtividade, atividadeAtualizada);
    }
  }

  onFileSelect(event: any) {

    if (event.files && event.files.length > 0) {
      const file = event.files[0];

      this.isImage = file.type.startsWith('image/');

      this.nomeArquivo = file.name;
      this.tipoArquivo = file.type;

      if (file.type === 'application/pdf') {
        if (this.arquivoUrl) {
          URL.revokeObjectURL(this.arquivoUrl);
        }
        const reader = new FileReader();
        reader.onload = () => {
          const pdfBytes = new Uint8Array(reader.result as ArrayBuffer);
          this.arquivoBlob = new Blob([pdfBytes], { type: 'application/pdf' });
          this.arquivoUrl = URL.createObjectURL(this.arquivoBlob);
        };
        reader.readAsArrayBuffer(file);
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          this.arquivoBlob = new Blob([reader.result as ArrayBuffer], {
            type: file.type,
          });
          this.arquivoUrl = URL.createObjectURL(this.arquivoBlob);
        };
        reader.readAsArrayBuffer(file);
      }

    }
  }

  carregarDadosAtividade(id: number) {
    this.serviceAtividade.findById(id).subscribe({
      next: (atividade) => {
        this.idAtividade = atividade.id;
        this.codigo = atividade.codigo;
    //    this.materiaSelecionada = atividade.materia;
        this.descricao = atividade.descricao;
        this.url = atividade.url;
        if (atividade.arquivo) {
       //   this.carregarArquivoBlob(this.idAtividade)
          this.nomeArquivo = atividade.codigo + atividade.extensao;
          this.tipoArquivo = atividade.extensao;
        }
      },
      error: () => {
        this.serviceMensagemGlobal.showMessage(
          'error',
          'Erro',
          'Não conseguimos identificar a atividade'
        );
        this.router.navigate(['/atividades']);
      },
    });
  }

  capturarId() {
    this.route.params.subscribe((params) => {
      if (params != undefined) {
        this.idAtividade = params['id'];
        this.carregarDadosAtividade(this.idAtividade);
      } else {
        throw console.error('Atividade não identificada');
      }
    });
  }

  carregarMaterias() {
    this.serviceMaterias.getMaterias().subscribe({
      next: (materias) => {
        this.listaMaterias = materias;
      },
      error: (erro) => console.log(erro),
    });
  }

  atualizarDados(id: number, atividade: Atividade) {
    this.serviceAtividade.atualizarAtividade(id, atividade).subscribe({
      next: () => {
        this.serviceMensagemGlobal.showMessage(
          'success',
          'Sucesso!',
          'Atividade atualizada com sucesso.'
        );
        this.router.navigate(['/atividades']);
      },
      error: (error) => {
        this.serviceMensagemGlobal.showMessage(
          'error',
          'Erro!',
          `Ocorreu um erro ao atualizar os dados da atividade. ${error.erro}`
        );
        console.log(error);
      },
    });
  }
  ngOnDestroy() {
    if (this.arquivoUrl) {
      URL.revokeObjectURL(this.arquivoUrl);
    }
  }

  limparArquivo() {
    this.arquivoBlob = null;
    this.nomeArquivo = null;
    this.isImage = false;
    this.arquivoUrl = null;
    this.tipoArquivo = null;
  }


  limparSelecaoArquivo(){
    this.fileUpload.clear();
    this.limparArquivo();
  }

//  carregarArquivoBlob(id: number) {
//    this.serviceAtividade.findArquivoByAtividade(id).subscribe({
//      next: (blob) => {
//        this.arquivoBlob = blob;
//        this.arquivoUrl = URL.createObjectURL(blob);
//      },
//      error: (err) => {
//        console.log(err);
 //       this.serviceMensagemGlobal.showMessage(
//          'error',
//          'Erro',
//          'Não conseguimos identificar o arquivo'
//        );
//      },
//    });
//  }
  abrirArquivo() {
    if (this.arquivoUrl) {
      window.open(this.arquivoUrl, '_blank');
    }
  }

  capturarTipoArquivo(tipo: string) {
    switch (tipo) {
      case '.pdf':
        return 'pi pi-file-pdf';
      case '.png':
        return 'pi pi-image';
      case '.jpeg':
        return 'pi pi-image';
      default:
        return 'pi pi-file';
    }
  }
}
