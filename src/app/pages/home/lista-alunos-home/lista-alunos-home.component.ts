import { Component, OnInit } from '@angular/core';
import { PrimengImports } from '../../../shared/primengImports.module';
import { ServiceHome } from '../../../services/service-home.service';
import { Aula, AulasPorIntervalo } from '../../../interfaces/aula';
import { error } from 'pdf-lib';
import { CarouselModule } from 'primeng/carousel';
import { DetalharAlunosComponent } from "../../alunos/detalhar-alunos/detalhar-alunos.component";
import { DateUtils } from '../../../shared/utils/date-utils';
import { CadatrarAulaComponent } from "../../aulas/cadatrar-aula/cadatrar-aula.component";


@Component({
  selector: 'app-lista-alunos-home',
  imports: [PrimengImports, CarouselModule, DetalharAlunosComponent, CadatrarAulaComponent],
  templateUrl: './lista-alunos-home.component.html',
  styleUrl: './lista-alunos-home.component.css'
})
export class ListaAlunosHomeComponent implements OnInit {

  detalhesAlunoApresentado: boolean = false;
  modalCadastrarAulaAberta: boolean = false;
  detalhealunoId: number;
  DataAulaDetalhe: Date;
  aula_id: number;

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
    this.carregarAulasDoDia(this.dataAtual)


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

  carregarAulasDoDia(data: Date) {
    this.serviceHome.getAulasDoDia(data).subscribe({
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


  abrirDetalhes(id_aluno: number, data_aula: Date, aula_id: number) {
    this.detalhealunoId = id_aluno;
    this.DataAulaDetalhe= data_aula;
    this.aula_id = aula_id;
    this.detalhesAlunoApresentado = true;
    this.obterAula(data_aula)
     
  }

  avancarDia() {
    this.dataAtual = DateUtils.adjustDate(this.dataAtual, 1, 'days')
    console.log(this.dataAtual)
    this.carregarAulasDoDia(this.dataAtual
    )
  }

    retornarDia() {
    this.dataAtual = DateUtils.adjustDate(this.dataAtual, -1, 'days')
    this.carregarAulasDoDia(this.dataAtual
    )
  }


  obterAula(dataAula: Date): Date{
    return dataAula
  }

  abrirCadastroAulas(): boolean{
    return this.modalCadastrarAulaAberta = true;
  }


}
