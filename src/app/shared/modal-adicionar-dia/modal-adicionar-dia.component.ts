import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DiasDaSemana, DiasDaSemanaDescricao } from '../Enums/enumDiasDaSemana';
import { ConfigAula } from '../../interfaces/configAula';
import { PrimengImports } from '../primengImports.module';



@Component({
  selector: 'app-modal-adicionar-dia',
  imports: [PrimengImports],
  templateUrl: './modal-adicionar-dia.component.html',
  styleUrl: './modal-adicionar-dia.component.css'
})
export class ModalAdicionarDiaComponent {

  @Input() visible: boolean = false;
  @Input() aulasAdicionadas: ConfigAula[] = [];

  @Output() fechar = new EventEmitter<void>();
  @Output() adicionar = new EventEmitter<{ dia: DiasDaSemana, horario: string }>();




  diaSelecionado: DiasDaSemana;
  descricaoAmigavelDias = DiasDaSemanaDescricao;

  horarioInicio_aula: Date;



  dias: string[] = [
    DiasDaSemana.SEGUNDA,
    DiasDaSemana.TERCA,
    DiasDaSemana.QUARTA,
    DiasDaSemana.QUINTA,
    DiasDaSemana.SEXTA,
  ];

  constructor() { }

  onAdicionar() {
    if (this.diaSelecionado && this.horarioInicio_aula) {
      this.adicionar.emit({
        dia: this.diaSelecionado,
        horario: this.horarioInicio_aula.toString().substring(16, 21),
      })
      this.limparDadosModal()
      this.onFechar();
    }

  }

  onFechar() {
    this.fechar.emit();
    this.visible = false;
  }

  abrirModalAdicionarAula() {
    this.limparDadosModal();
    this.visible = true;
  }

  limparDadosModal() {
    this.diaSelecionado = undefined;
    this.horarioInicio_aula = undefined;
  }


  diasDisponiveis(): { valor: DiasDaSemana, descricao: string }[] {
    return this.dias
      .filter(dia => !this.aulasAdicionadas?.some(a => a.diaSemana === dia))
      .map(dia => ({
        valor: dia as DiasDaSemana,
        descricao: this.descricaoAmigavelDias[dia]
      }));
  }

}
