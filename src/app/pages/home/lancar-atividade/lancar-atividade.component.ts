import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PrimengImports } from '../../../shared/primengImports.module';
import { DropdownModule } from 'primeng/dropdown';
import { TextareaModule } from 'primeng/textarea';
import { ServiceAlunos } from '../../../services/service_alunos';
import { ServiceAtividades } from '../../../services/service_atividades';
import { Atividade } from '../../../interfaces/atividades';
import { ServiceMensagemGlobal } from '../../../services/mensagens_global';
import { HistoricoAtividade } from '../../../interfaces/historico-atividade';



@Component({
  selector: 'app-lancar-atividade',
  imports: [PrimengImports, DropdownModule, TextareaModule],
  templateUrl: './lancar-atividade.component.html',
  styleUrl: './lancar-atividade.component.css'
})

export class LancarAtividadeComponent implements OnInit {


  @Input() visible = false;
  @Input('id_aula') id_aula: number;
  @Input('id_aluno') id_aluno: number;

  @Output() visibleChange = new EventEmitter<boolean>();

  urlArquivo: string = '';

  atividadeSelecionada?: Atividade;
  observacoes: string = '';

  atividades: Atividade[] = [];

  constructor( 
    private serviceAluno: ServiceAlunos,  
    private serviceAtividades: ServiceAtividades,
    private serviceMensagem: ServiceMensagemGlobal
  ) {
  }

  ngOnInit(): void {
    this.serviceAtividades.getAtividades().subscribe({
      next:(data) => this.atividades = data,
      error: (err) => console.log("erro", err)

    })


  }


  fechar() {
    this.visible = false;
    this.observacoes = '';
    this.limparEscolha()
    this.visibleChange.emit(this.visible);    
  }

  baixarAtividade() {
    this.serviceAtividades.abrirArquivo(this.atividadeSelecionada.url).subscribe({
      next: (data) => {console.log(data)
        this.urlArquivo = data
      },
      error: (err) => console.log("Erro", err)
    })
      console.log(this.atividadeSelecionada.url)
          console.log('teste',this.id_aluno, this.id_aula)

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
        this.serviceMensagem.showMessage('success','Sucesso.', 'Atividade lançada com sucesso.');
        this.fechar();
      },
      error: (err) => {
        this.serviceMensagem.showMessage('danger', 'Erro ao lançar', 'Não foi possível registrar o histórico da atividade. Tente novamente.');
        console.log(err)
      }
    })
  }


  limparEscolha(){
    this.atividadeSelecionada = undefined;
    this.urlArquivo = ''
  }

}
