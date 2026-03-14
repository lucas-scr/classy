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
import { endWith } from 'rxjs';
import { SelectItemGroup } from 'primeng/api';
import { SelectModule } from 'primeng/select';



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

  isImagem: boolean;

  imagensSelecionadas = [];
  atividadeSelecionada?: Atividade;
  atividadeSelecionada2?: Atividade;

  observacoes: string = '';

  atividades: Atividade[] = [];
  grupoAtividades: SelectItemGroup[]

  constructor(
    private serviceAluno: ServiceAlunos,
    private serviceAtividades: ServiceAtividades,
    private serviceMensagem: ServiceMensagemGlobal
  ) {
    
  }

  ngOnInit(): void {
    this.grupoAtividades = [
            {
                label: 'Germany',
                value: 'de',
                items: [
                    { label: 'Berlin', value: 'Berlin' },
                    { label: 'Frankfurt', value: 'Frankfurt' },
                    { label: 'Hamburg', value: 'Hamburg' },
                    { label: 'Munich', value: 'Munich' }
                ]
            },
            {
                label: 'USA',
                value: 'us',
                items: [
                    { label: 'Chicago', value: 'Chicago' },
                    { label: 'Los Angeles', value: 'Los Angeles' },
                    { label: 'New York', value: 'New York' },
                    { label: 'San Francisco', value: 'San Francisco' }
                ]
            },
            {
                label: 'Japan',
                value: 'jp',
                items: [
                    { label: 'Kyoto', value: 'Kyoto' },
                    { label: 'Osaka', value: 'Osaka' },
                    { label: 'Tokyo', value: 'Tokyo' },
                    { label: 'Yokohama', value: 'Yokohama' }
                ]
            }
        ];





    this.isImagem = false
    this.serviceAtividades.getAtividades().subscribe({
      next: (data) => {
        this.atividades = data;
        let gpAtividadedes = [... new Set(this.atividades.map(a => a.nome_materia))]
        console.log(gpAtividadedes)
        gpAtividadedes.forEach(element => {
          this.grupoAtividades.push({
            label: element,
            value: element,
            items: this.atividades.filter(a => a.nome_materia === element)
            .map(a => ({
              label: a.codigo + "-" + a.descricao,
              value: a
            }))
          })
        });
        console.log('grupo de atividades', this.grupoAtividades)
      },
      error: (err) => console.log("erro", err)
    })
  }


  fechar() {
    this.visible = false;
    this.observacoes = '';
    this.limparEscolha()
    this.visibleChange.emit(this.visible);
  }

  apresentarAtividade(url: string, index: number) {
    this.serviceAtividades.abrirArquivo(url).subscribe({
      next: (data) => {
        console.log('data', data)
        this.urlArquivo = ''
        this.urlArquivo = data
        console.log('urlArquivo', this.urlArquivo)

        if (this.urlArquivo.endsWith('.pdf')) {
          this.atividadeSelecionada.url = data
        } else {
          if (this.imagensSelecionadas.length <= 2) {
            console.log("adicionado imagem em lista")
            this.imagensSelecionadas[index] = this.urlArquivo;
            console.log(this.imagensSelecionadas.length )
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
    this.atividadeSelecionada2 = undefined;
    this.imagensSelecionadas = [];
    this.urlArquivo = ''
    this.urlArquivoSelecionado = ''
  }

  escolherAtividade(){
    this.verificarTipoArquivoAtividade(this.atividadeSelecionada);
    this.urlArquivoSelecionado = this.atividadeSelecionada.url;
    this.apresentarAtividade(this.urlArquivoSelecionado, 0)
  }

  escolherAtividade2(){
    this.verificarTipoArquivoAtividade(this.atividadeSelecionada2)
    if(this.isImagem = false){
      this.atividadeSelecionada2 = undefined;
    }
    this.urlArquivoSelecionado = this.atividadeSelecionada2.url;
    this.apresentarAtividade(this.urlArquivoSelecionado, 1)
  }

  verificarTipoArquivoAtividade(arquivo: Atividade){
     if(arquivo.url.endsWith('.pdf')){
      this.isImagem = false;
      console.log("imagem", this.isImagem)
    }else{
      this.isImagem = true;
      console.log("imagem", this.isImagem)

    }
    console.log("Fim da verificação")
  }
}
