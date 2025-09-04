import { Component, OnInit } from '@angular/core';

import { ServiceAlunos } from '../../../services/service_alunos';
import { Aluno } from '../../../interfaces/aluno';
import { ActivatedRoute, Router  } from '@angular/router';
import { PrimengImports } from '../../../shared/primengImports.module';
import { NgForm } from '@angular/forms';
import { ServiceMensagemGlobal } from '../../../services/mensagens_global';


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
   private route: ActivatedRoute,
   private serviceMensagens: ServiceMensagemGlobal,
   private router: Router
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
          next: () => {
          this.serviceMensagens.showMessage(
            'success',
            'Atualizado!',
            'Aluno atualizado com sucesso.',
          );
          this.router.navigate(['/contratos']);
        },
        error: () =>
          this.serviceMensagens.showMessage(
            'error',
            'Algo deu errado!',
            'Não foi possível realizar a atualização.'
          ),
    })
  }
}
