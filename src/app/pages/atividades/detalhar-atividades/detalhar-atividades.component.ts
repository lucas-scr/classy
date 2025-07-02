import { Component, OnInit } from '@angular/core';
import { PrimengImports } from '../../../shared/primengImports.module';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterModule,
} from '@angular/router';
import { Materia } from '../../../interfaces/materias';
import { ServiceMateria } from '../../../services/service_materias';
import { ServiceMensagemGlobal } from '../../../services/mensagens_global';
import { ServiceAtividades } from '../../../services/service_atividades';

@Component({
  selector: 'app-detalhar-atividades',
  imports: [PrimengImports, RouterModule, RouterLink],
  templateUrl: './detalhar-atividades.component.html',
  styleUrl: './detalhar-atividades.component.css',
})
export class DetalharAtividadesComponent implements OnInit {
  idAtividade: number;
  descricao: string;
  codigo: string;
  dataCriacao: Date;
  url: string;

  listaMaterias: Materia[] | undefined;
  materiaSelecionada: Materia | undefined;

  nomeArquivo: string = "Nenhum arquivo anexado";
  isImage: boolean = false;
  arquivoUrl: string | null = null;
  arquivoBlob: Blob;
  tipoArquivo: string;

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

  carregarDadosAtividade(id: number) {
    this.serviceAtividade.findById(id).subscribe({
      next: (atividade) => {
        this.codigo = atividade.codigo;
        this.materiaSelecionada = atividade.materia;
        this.dataCriacao = new Date(atividade.dataCriacao);
        this.descricao = atividade.descricao;
        this.url = atividade.url;
        if (atividade.arquivo) {
          this.nomeArquivo = atividade.codigo + atividade.extensao;
          this.carregarArquivoBlob(this.idAtividade);
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

  carregarArquivoBlob(id: number) {
    this.serviceAtividade.findArquivoByAtividade(id).subscribe({
      next: (blob) => {
        this.arquivoBlob = blob;
        this.arquivoUrl = URL.createObjectURL(blob);
      },
      error: (err) => {
        console.log(err);
        this.serviceMensagemGlobal.showMessage(
          'error',
          'Erro',
          'Não conseguimos identificar o arquivo'
        );
      },
    });
  }
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
