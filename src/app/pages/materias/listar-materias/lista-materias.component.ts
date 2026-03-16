import { Component, OnInit, ViewChild } from '@angular/core';
import { PrimengImports } from '../../../shared/primengImports.module';
import { Materia } from '../../../interfaces/materias';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { ServiceMensagemGlobal } from '../../../services/mensagens_global';
import { ServiceMateria } from '../../../services/service_materias';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-materias',
  imports: [PrimengImports],
  templateUrl: './lista-materias.component.html',
  styleUrl: './lista-materias.component.css'
})
export class ListaMateriasComponent implements OnInit {
  searchValue: String;
  loading: false;
  itemId: number;
  listaMaterias: Materia[];
  opcoesDeAcoes: MenuItem[] | undefined;
  
  @ViewChild('menu') menu!: Menu;

  constructor(
    private router: Router,
    private serviceMateria: ServiceMateria,
    private serviceMensagemGlobal: ServiceMensagemGlobal,
    private confirmationService: ConfirmationService
  ) {

  }

  ngOnInit(): void {

    this.carregarMaterias()

    this.opcoesDeAcoes = [
      {
        label: 'Opções',
        items: [
          {
            label: 'Editar',
            icon: 'pi pi-pencil',
            command: () =>  this.router.navigate(['/editar-materia', this.itemId]),
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
      message: 'Tem certeza que deseja remover a materia?',
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
        this.removerMateria(this.itemId);
      },
    });
  }

  removerMateria(id: number){

  }

  abrirMenu(event: any, id: number) {
    this.itemId = id;
    this.menu.toggle(event);
  }
    carregarMaterias() {
    this.serviceMateria.getMaterias().subscribe({
        next: (materias) => {this.listaMaterias = materias;
          console.log(this.listaMaterias)
        },
        error: (erro) => console.log(erro),
      });
  }

    getSituacao(situacao: boolean): string {
    switch (situacao) {
      case true:
        return 'Ativo';
      case false:
        return 'Inativo';
      default:
        return 'Inativo'; // Classe vazia caso não encontre a situação
    }
  }

  
    getSituacaoClass(situacao: boolean): string {
    switch (situacao) {
      case true:
        return 'situacao-ativo';
      case false:
        return 'situacao-inativo';
      default:
        return 'situacao-inativo'; // Classe vazia caso não encontre a situação
    }
  }

}
