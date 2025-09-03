import { Component, OnInit } from '@angular/core';

import { ServiceAlunos } from '../../../services/service_alunos';
import { Aluno } from '../../../interfaces/aluno';
import { ActivatedRoute } from '@angular/router';
import { PrimengImports } from '../../../shared/primengImports.module';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { error } from 'pdf-lib';


@Component({
  selector: 'app-editar-alunos',
  imports: [PrimengImports],
  templateUrl: './editar-alunos.component.html',
  styleUrl: './editar-alunos.component.css'
})
export class EditarAlunosComponent implements OnInit {

  aluno: Aluno = {} as Aluno;
  alunoId: number;
  dataNascimentoLimite: Date = new Date();

  constructor(
   private serviceAluno: ServiceAlunos,
   private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.capturarId()
    this.carregarDadosAluno(this.alunoId)

  }

  carregarDadosAluno(id: number) {
    this.serviceAluno.findById(id).subscribe((res) => {
      this.aluno = res;
      this.aluno.dataNascimento = new Date(this.aluno.dataNascimento);
    });
  }

    capturarId() {
    this.route.params.subscribe((params) => {
      if (params != undefined) {
        this.alunoId = params['id'];
      } else {
        throw console.error('Aluno não identificado');
      }
    });
  }

  onSubmit(form: NgForm){
    this.serviceAluno.atualizarAluno(this.aluno).subscribe({
      next: (data) => {
        console.log("Sucesso");
        console.log(this.aluno);
        console.log(data);
      },
      error: (err) => {
        console.log(err)
      }
    })
  }
}
