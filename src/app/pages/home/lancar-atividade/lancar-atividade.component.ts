import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PrimengImports } from '../../../shared/primengImports.module';
import { DropdownModule } from 'primeng/dropdown';
import { TextareaModule } from 'primeng/textarea';




interface Atividade {
  id: number;
  codigo: string;
  materia: string;
  arquivoUrl?: string;
  descricaoFormatada?: string;
}

@Component({
  selector: 'app-lancar-atividade',
  imports: [PrimengImports, DropdownModule, TextareaModule],
  templateUrl: './lancar-atividade.component.html',
  styleUrl: './lancar-atividade.component.css'
})

export class LancarAtividadeComponent {


  @Input() visible = false;
  @Input() id_aula: number;
  @Input() id_aluno: number;

  @Output() visibleChange = new EventEmitter<boolean>();
  

  atividadeSelecionada?: Atividade;
  observacoes: string = '';

  atividades: Atividade[] = [
    { id: 20, codigo: 'MAT01', materia: 'Matemática', arquivoUrl: 'https://exemplo.com/mat01.pdf' },
    { id: 21, codigo: 'PORT02', materia: 'Português', arquivoUrl: 'https://exemplo.com/port02.pdf' },
    { id: 22, codigo: 'HIST03', materia: 'História', arquivoUrl: 'https://exemplo.com/hist03.pdf' },
  ];

  constructor() {
    this.atividades.forEach(
      a => a.descricaoFormatada = `${a.materia} - ${a.codigo}`
    );
  }

  abrir() {
    this.visible = true;
  }

  fechar() {
    this.visible = false;
    this.atividadeSelecionada = undefined;
    this.observacoes = '';
    this.visibleChange.emit(this.visible);

    
  }

  baixarAtividade() {
    if (this.atividadeSelecionada?.arquivoUrl) {
      window.open(this.atividadeSelecionada.arquivoUrl, '_blank');
    }
  }

  salvar() {
    const historico = {
      atividadeId: this.atividadeSelecionada?.id,
      observacoes: this.observacoes,
      data: new Date(),
    };
    console.log('Histórico salvo:', historico);
    this.fechar();
  }

}
