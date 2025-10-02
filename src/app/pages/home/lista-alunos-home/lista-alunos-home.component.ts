import { Component, OnInit } from '@angular/core';
import { PrimengImports } from '../../../shared/primengImports.module';
import { ServiceHome } from '../../../services/service-home.service';
import { Aula, AulasPorIntervalo } from '../../../interfaces/aula';
import { error } from 'pdf-lib';
import { CarouselModule } from 'primeng/carousel';


@Component({
  selector: 'app-lista-alunos-home',
  imports: [PrimengImports, CarouselModule],
  templateUrl: './lista-alunos-home.component.html',
  styleUrl: './lista-alunos-home.component.css'
})
export class ListaAlunosHomeComponent implements OnInit {

  dataAtual: Date = new Date();
  dataLocal = this.dataAtual.toLocaleDateString("pt-BR"); 
  qtdCardsVisiveis = 4;
  qtdCardsArrastados = 1;
  paginaInicial: number;
  responsiveOptions: any[] | undefined;

  listaAulasDoDia: Aula[] = [];
  listaAulasPorIntervalo: AulasPorIntervalo[];


  constructor(private serviceHome: ServiceHome) {
  }


  ngOnInit(): void {
    this.serviceHome.getAulasDoDia(this.dataAtual).subscribe({
      next: (data) => {
        this.listaAulasDoDia = data;
        this.serviceHome.atribuirAulasDoDiaAoIntervalo(this.dataAtual).subscribe({
          next: (lista) => {
            this.listaAulasPorIntervalo = lista
            this.paginaInicial = this.encontrarIndiceDoHorario() - 1;
          },
          error: (err) => console.log(err)
        })
      },
      error: (err) => console.log(err)
    });



    this.responsiveOptions = [
      {
        breakpoint: '1400px',
        numVisible: 2,
        numScroll: 1,
      },
      {
        breakpoint: '1199px',
        numVisible: 3,
        numScroll: 1,
      },
      {
        breakpoint: '767px',
        numVisible: 2,
        numScroll: 1,
      },
      {
        breakpoint: '575px',
        numVisible: 1,
        numScroll: 1,
      },
    ];

  }


  encontrarIndiceDoHorario(): number {
    let indice: number = 0

    this.listaAulasPorIntervalo.some(element => {
      let data = this.serviceHome.ajustarMinutosParaIntervalo(new Date(this.dataAtual))

      let isHorarioIgual = this.serviceHome.ajustarMinutosParaIntervalo(element.data).getHours() === data.getHours() &&
        this.serviceHome.ajustarMinutosParaIntervalo(element.data).getMinutes() === data.getMinutes();

      if (isHorarioIgual) {
        return true
      }
      indice++;
      return false
    }
    )
    return indice
  }
}
