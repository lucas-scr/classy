import { Component, OnInit, ViewChild } from '@angular/core';
import { PrimengImports } from '../../../shared/primengImports.module';
import { Atividade } from '../../../interfaces/atividades';
import { Route, Router } from '@angular/router';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { ServiceAtividades } from '../../../services/service_atividades';
import { ServiceMateria } from '../../../services/service_materias';
import { ServiceMensagemGlobal } from '../../../services/mensagens_global';

@Component({
  selector: 'app-listar-atividades',
  imports: [PrimengImports],
  templateUrl: './listar-atividades.component.html',
  styleUrl: './listar-atividades.component.css',
  providers: [ServiceAtividades, ConfirmationService],
})
export class ListarAtividadesComponent implements OnInit {
  searchValue: String;
  itemId: number;

  listaMaterias: [] = [];

  listaAtividades: Atividade[] = [];

  loading: boolean = true;

  opcoesDeAcoes: MenuItem[] | undefined;

  @ViewChild('menu') menu!: Menu;

  constructor(
    private serviceAtividades: ServiceAtividades,
    private router: Router,
    private serviceMateria: ServiceMateria,
    private serviceMensagemGlobal: ServiceMensagemGlobal,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.serviceMateria.consultarPorId;

    this.loading = false;

    this.carregarAtividades();
    

    this.opcoesDeAcoes = [
      {
        label: 'Opções',
        items: [
          {
            label: 'Detalhar',
            icon: 'pi pi-eye',
            command: () =>
              this.router.navigate(['/detalhar-atividade', this.itemId]),
          },
          {
            label: 'Editar',
            icon: 'pi pi-pencil',
            command: () =>
              this.router.navigate(['/editar-atividade', this.itemId]),
          },
          {
            label: 'Remover',
            icon: 'pi pi-trash',
            command: () => this.confirmarRemover(),
          },
        ],
      },
    ];
  }

  confirmarRemover() {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Tem certeza que deseja remover a atividade?',
      header: 'Remover atividade',
      closable: true,
      closeOnEscape: true,
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Não',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Sim',
        severity: 'danger',
      },
      accept: () => {
        this.removerAtividade(this.itemId);
      },
    });
  }

  abrirMenu(event: any, id: number) {
    this.itemId = id;
    this.menu.toggle(event);
  }

  carregarAtividades() {
    this.serviceAtividades
      .getAtividades()
      .subscribe({
        next: (atividades) => {this.listaAtividades = atividades;
        },
        error: (erro) => console.log(erro),
      });
  }

  removerAtividade(id: number) {
    this.serviceAtividades.removerAtividadeById(id).subscribe({
      next: () => {
        this.serviceMensagemGlobal.showMessage('success','Removido!', 'O registro foi excluído com sucesso.');
        this.carregarAtividades()
      },
      error: (err) =>{
        this.serviceMensagemGlobal.showMessage('error','Erro', 'Desculpe! Ocorreu um erro e não conseguimos remover o registro.')

      }
    });
  }
}
