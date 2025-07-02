import {
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { PrimengImports } from '../../../shared/primengImports.module';
import { Aluno } from '../../../model/Alunos';
import { ServiceAlunos } from '../../../services/service_alunos';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http'; // Importando o módulo
import { ServiceMensagemGlobal } from '../../../services/mensagens_global';
import { ServiceContratos } from '../../../services/service_contratos';
import { Contrato } from '../../../interfaces/contrato';


@Component({
  selector: 'app-lista-alunos',
  imports: [PrimengImports],
  templateUrl: './lista-alunos.component.html',
  styleUrl: './lista-alunos.component.css',
  providers: [MessageService, ConfirmationService],
})
export class ListaAlunosComponent implements OnInit {
  listaAlunos: Contrato[];
  filtroNome: String;

  @ViewChild('menu') menu!: Menu;

  alunoId: Number;;

  opcoesDeAcoes: MenuItem[] | undefined;

    
  API_BACKEND: string = 'http://localhost:8080/api/auth/google'

  constructor(
    private serviceContratos: ServiceContratos,
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
        ],
      },
    ];
  }

  carregarDadosNaLista(){
    this.serviceContratos.listarContratos().subscribe({
      next: (dados) => this.listaAlunos = dados,
      error: (erro) => console.log('Erro:', erro)
    });
  }


  abrirMenu(event: Event, aluno: any) {
    this.alunoId = aluno;
    this.menu.toggle(event);
  }


  filtrarLista(event: any) {
    this.serviceContratos.listarContratos().subscribe((contratos) => {
      if (this.filtroNome.length > 0) {
        this.listaAlunos = contratos.filter((aluno) =>
          aluno.aluno.nome.toLowerCase().startsWith(this.filtroNome.toLowerCase())
        );
      }else{
        this.listaAlunos = contratos
      }
    });
  }
}
