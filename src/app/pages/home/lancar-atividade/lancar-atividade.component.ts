import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PrimengImports } from '../../../shared/primengImports.module';
import { DropdownModule } from 'primeng/dropdown';
import { TextareaModule } from 'primeng/textarea';
import { ServiceAlunos } from '../../../services/service_alunos';
import { ServiceAtividades } from '../../../services/service_atividades';
import { Atividade } from '../../../interfaces/atividades';
import { ServiceMensagemGlobal } from '../../../services/mensagens_global';
import { HistoricoAtividade } from '../../../interfaces/historico-atividade';
import { VisualizarArquivoComponent } from "../../atividades/visualizar-arquivo/visualizar-arquivo.component";
import { SelectModule } from 'primeng/select';
import { Materia } from '../../../interfaces/materias';
import { ServiceMateria } from '../../../services/service_materias';




@Component({
  selector: 'app-lancar-atividade',
  imports: [PrimengImports, DropdownModule, TextareaModule, VisualizarArquivoComponent, SelectModule],
  templateUrl: './lancar-atividade.component.html',
  styleUrl: './lancar-atividade.component.css'
})

export class LancarAtividadeComponent implements OnInit {


  @Input() visible = false;
  @Input('id_aula') id_aula: number;
  @Input('id_aluno') id_aluno: number;

  @Output() visibleChange = new EventEmitter<boolean>();

  urlArquivo: string = '';
  urlArquivoSelecionado: string;
  isImagem: boolean = false;
  imagemSelecionada: string;
  atividadeSelecionada?: Atividade;

  observacoes: string = '';
  nomeArquivo: string = '';
  atividades: Atividade[] = [];
  materias: Materia[] = [];
  materiaSelecionada: Materia | undefined;
  enableAtividade: boolean = false;

  constructor(
    private serviceAluno: ServiceAlunos,
    private serviceAtividades: ServiceAtividades,
    private serviceMensagem: ServiceMensagemGlobal,
    private serviceMateria: ServiceMateria
  ) {

  }

  ngOnInit(): void {
    this.serviceMateria.getMaterias().subscribe({
      next: (data) => {
        this.materias = data
        console.log(this.materias)

      },
      error: (erro) => console.log('Erro ao carregar materias', erro)
    })
  }
  fechar() {
    this.visible = false;
    this.observacoes = '';
    this.limparEscolha()
    this.visibleChange.emit(this.visible);
  }

  apresentarAtividade(url: string) {
    this.serviceAtividades.abrirArquivo(url).subscribe({
      next: (data) => {
        this.urlArquivo = ''
        this.urlArquivo = data
        if (this.urlArquivo.endsWith('.pdf')) {
          this.atividadeSelecionada.url = data
        } else {
          if (this.imagemSelecionada) {
            this.imagemSelecionada = this.urlArquivo;
          }
        }
      },
      error: (err) => console.log("Erro", err)
    })
  }

  salvar() {
    let atividadeLancada: HistoricoAtividade = {
      aluno_id: this.id_aluno,
      aula_id: this.id_aula,
      descricao: this.observacoes,
      atividade_id: this.atividadeSelecionada.id,
      codigo_atividade: '',
      materia: '',
      nome_atividade: '',
      data_criacao: undefined
    };

    atividadeLancada.aula_id = this.id_aula;
    atividadeLancada.atividade_id = this.atividadeSelecionada.id;
    atividadeLancada.descricao = this.observacoes;


    this.serviceAluno.lançarAtividade(atividadeLancada).subscribe({
      next: (data) => {
        this.serviceMensagem.showMessage('success', 'Sucesso.', 'Atividade lançada com sucesso.');
        this.fechar();
      },
      error: (err) => {
        this.serviceMensagem.showMessage('danger', 'Erro ao lançar', 'Não foi possível registrar o histórico da atividade. Tente novamente.');
        console.log(err)
      }
    })
  }


  limparEscolha() {
    this.atividadeSelecionada = undefined;
    this.imagemSelecionada = '';
    this.nomeArquivo = undefined;
    this.urlArquivo = undefined;
    this.urlArquivoSelecionado = '';
    this.isImagem = false;
  }

  escolherAtividade() {
    if (this.atividadeSelecionada == null) {
      this.limparEscolha();
    } else {
      this.verificarTipoArquivoAtividade(this.atividadeSelecionada);
      this.urlArquivoSelecionado = this.atividadeSelecionada.url;
      this.apresentarAtividade(this.urlArquivoSelecionado)
      this.nomeArquivo = this.materiaSelecionada.nome + '_' 
      + this.atividadeSelecionada.codigo
    }
  }



  verificarTipoArquivoAtividade(arquivo: Atividade) {
    if (arquivo.url.endsWith('.pdf')) {
      this.isImagem = false;
      console.log("imagem", this.isImagem)
    } else {
      this.isImagem = true;
      console.log("imagem", this.isImagem)

    }
    console.log("Fim da verificação")
  }
  escolherMateria() {
    if (this.materiaSelecionada) {
      this.enableAtividade = true;
      this.carregarAtividades()
    } else {
      this.enableAtividade = false;
      this.atividadeSelecionada = undefined;
    }
  }

  carregarAtividades() {
    this.serviceAtividades.findByMateria(this.materiaSelecionada.id).subscribe({
      next: (data) => { this.atividades = data; console.log('atividades', this.atividades) },
      error: (err) => console.log(err)
    });
  }
}
