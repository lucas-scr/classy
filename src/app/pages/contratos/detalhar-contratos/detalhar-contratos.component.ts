import { Component } from '@angular/core';
import { ServiceMensagemGlobal } from '../../../services/mensagens_global';
import { ServiceContratos } from '../../../services/service_contratos';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PrimengImports } from '../../../shared/primengImports.module';
import { Contrato } from '../../../interfaces/contrato';
import { DiasDaSemanaDescricao } from '../../../shared/Enums/enumDiasDaSemana';

@Component({
  selector: 'app-detalhar-contratos',
  imports: [PrimengImports, RouterLink],
  templateUrl: './detalhar-contratos.component.html',
  styleUrl: './detalhar-contratos.component.css'
})
export class DetalharContratosComponent {

  modalAdicionar: boolean = false;
  descricaoAmigavelDiaSemana = DiasDaSemanaDescricao;

    dataLimite: Date = new Date();
    contratoId: number;
    contratoCarregado: Contrato
      
    diasSelecionados: string[] = [];
  
  
    constructor(
      private messageService: ServiceMensagemGlobal,
      private contratoService: ServiceContratos,
      private route: ActivatedRoute
    ) {
      this.capturarId();
  
    }
  
    ngOnInit() {
     this.capturarId();
    }

  

    carregarDadosContrato(id: number) {
      this.contratoService.findById(id).subscribe({
        next: (contrato) => {
          this.contratoCarregado = contrato;
          this.contratoCarregado.dataInicio = new Date (contrato.dataInicio);
        },
        error: (erro) => {
          this.messageService.showMessage(
            'danger',
            'Erro',
            'Não conseguimos recuperar os dados do contrato.'
          );
          console.log(erro);
        },
  
      });
    }
    capturarId(){
      this.route.params.subscribe((params)=> {
        if(params != undefined){
          this.contratoId = params['id'];
          this.carregarDadosContrato(this.contratoId)
  
        }else{
          throw console.error('Aluno não identificado');
        }
      })
    }
  
}
