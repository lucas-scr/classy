import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { BadgeModule } from 'primeng/badge';
import { RippleModule } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-menu-lateral',
  imports: [MenuModule, BadgeModule, RippleModule, AvatarModule, RouterLink],
  templateUrl: './menu-lateral.component.html',
  styleUrl: './menu-lateral.component.css',
})
export class MenuLateralComponent implements OnInit {
  menu: MenuItem[] | undefined;

  ngOnInit() {
    this.menu = [
      {
        separator: true,
      },
      {
        items: [
          {
            label: 'Início',
            icon: 'pi pi-home',
            route: '',
          },
        ],
      },
      {
        label: 'Aula',
        items: [
          {
            label: 'Alunos',
            icon: 'pi pi-user',
            route: '/alunos',
          },
          {
            label: 'Contratos',
            icon: 'pi pi-file-check',
            route: '/contratos',
          },
          {
            label: 'Atividades',
            icon: 'pi pi-book',
            route: '/atividades',
          },
        ],
      },
      {
        label: 'Administrativo',
        items: [
          {
            label: 'Pagamentos',
            icon: 'pi pi-dollar',
            route: '/pagamentos',
          },
          {
            label: 'Cronograma',
            icon: 'pi pi-calendar-clock',
          },
                {
            label: 'Turma',
            icon: 'pi pi-calendar-clock',
             route: '/turmas',
          },
        ],
      },
    ];
  }
}
