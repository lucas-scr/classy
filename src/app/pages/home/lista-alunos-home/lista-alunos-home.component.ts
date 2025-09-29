import { Component, OnInit } from '@angular/core';
import { PrimengImports } from '../../../shared/primengImports.module';
import { ServiceHome } from '../../../services/service-home.service';
import { Aula, AulasPorIntervalo } from '../../../interfaces/aula';
import { error } from 'pdf-lib';

@Component({
  selector: 'app-lista-alunos-home',
  imports: [PrimengImports],
  templateUrl: './lista-alunos-home.component.html',
  styleUrl: './lista-alunos-home.component.css'
})
export class ListaAlunosHomeComponent implements OnInit {

  dataAtual: Date = new Date();
  listaAulasDoDia: Aula[] = [];
  listaAulasPorIntervalo: AulasPorIntervalo[] = []

  listaAlunos: [
    { nome: 'Aluno 1', status: 'Normal' },
    { nome: 'Aluno 2', status: 'Normal' },
    { nome: 'Aluno 3', status: 'Normal' },
    { nome: 'Aluno 4', status: 'Reposição' },
    { nome: 'Aluno 5', status: 'Normal' },
  ]

  listaHorarios: [
    {horario: Date}
  ]

  constructor(private serviceHome: ServiceHome){
  }


  ngOnInit(): void {
       this.serviceHome.getAulasDoDia(this.dataAtual).subscribe({
        next: (data) => {
          this.listaAulasDoDia = data;
        },
        error: (err) => console.log(err) 
       });


      this.listaAulasPorIntervalo = this.serviceHome.atribuirAulasDoDiaAoIntervalo(this.dataAtual)
      console.log('listinha',this.listaAulasPorIntervalo)
  }


}
