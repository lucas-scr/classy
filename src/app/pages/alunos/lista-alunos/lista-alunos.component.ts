import {
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { PrimengImports } from '../../../shared/primengImports.module';
import { ServiceAlunos } from '../../../services/service_alunos';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http'; // Importando o módulo
import { ServiceMensagemGlobal } from '../../../services/mensagens_global';
import { ServiceContratos } from '../../../services/service_contratos';
import { Contrato } from '../../../interfaces/contrato';
import { Aluno } from '../../../interfaces/aluno';
import { DiasDaSemanaDescricao } from '../../../shared/Enums/enumDiasDaSemana';


@Component({
  selector: 'app-lista-alunos',
  imports: [PrimengImports],
  templateUrl: './lista-alunos.component.html',
  styleUrl: './lista-alunos.component.css',
  providers: [MessageService, ConfirmationService],
})
export class ListaAlunosComponent implements OnInit {
  listaAlunos: Aluno[];
  filtroNome: String;
  descricaoAmigavelDias = DiasDaSemanaDescricao;
  

  @ViewChild('menu') menu!: Menu;

  alunoId: Number;;

  opcoesDeAcoes: MenuItem[] | undefined;

  constructor(
    private serviceAlunos: ServiceAlunos,
    private router: Router,
  ) {}

  ngOnInit() {
    
    this.carregarDadosNaLista();

    this.opcoesDeAcoes = [
      {
        label: 'Opções',
        items: [
          {
            label: 'Detalhar',
            icon: 'pi pi-eye',
            command: () =>
              this.router.navigate(['/detalhar-aluno', this.alunoId]),
          },
                    {
            label: 'Editar',
            icon: 'pi pi-pencil',
            command: () => this.router.navigate(['/editar-aluno', this.alunoId]),

          },
        ],
      },
    ];
  }

  carregarDadosNaLista(){
    this.serviceAlunos.obterAlunos().subscribe({
      next: (dados) => {

        this.listaAlunos = dados
        console.log(this.listaAlunos)
      },
      error: (erro) => console.log('Erro:', erro)
    });
  }


  abrirMenu(event: Event, aluno: any) {
    this.alunoId = aluno;
    this.menu.toggle(event);
  }


  filtrarLista(event: any) {
    this.serviceAlunos.obterAlunos().subscribe((contratos) => {
      if (this.filtroNome.length > 0) {
        this.listaAlunos = contratos.filter((aluno) =>
          aluno.nome.toLowerCase().startsWith(this.filtroNome.toLowerCase())
        );
      }else{
        this.listaAlunos = contratos
      }
    });
  }
}
