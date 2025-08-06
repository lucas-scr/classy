import { Component } from '@angular/core';
import { ServiceTurma } from '../../../services/service-turma';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { PrimengImports } from '../../../shared/primengImports.module';
import { ServiceMensagemGlobal } from '../../../services/mensagens_global';
import { Turma } from '../../../interfaces/turma';

@Component({
  selector: 'app-cadastro-turmas',
  imports: [PrimengImports, RouterModule, RouterLink],
  templateUrl: './cadastro-turmas.component.html',
  styleUrl: './cadastro-turmas.component.css'
})
export class CadastroTurmasComponent {
  nome: string;

  constructor(
    private serviceMensagemGlobal: ServiceMensagemGlobal,
    private serviceTurma: ServiceTurma,
    private router: Router
  ) { }

  ngOnInit() {
  }

  onSubmit() {
    if (this.nome == null) {
      this.serviceMensagemGlobal.showMessage(
        'error',
        'Erro',
        'Informe o nome da turma.'
      );
    } else {
      let turma: Turma = {
        nome: this.nome
      };
      
      this.cadastrarAtividade(turma);
    }
  }


  cadastrarAtividade(turma: Turma) {
    this.serviceTurma.cadastrarTurma(turma).subscribe({
      next: () => {
        this.serviceMensagemGlobal.showMessage(
          'success',
          'Sucesso!',
          'A turma foi salva com sucesso.'
        );
        this.router.navigate(['/turmas']);
      },
      error: (erro) => {
        this.serviceMensagemGlobal.showMessage(
          'error',
          'Erro',
          `Não foi possível realizar o cadastro. ${erro}`
        );
        console.log(erro)
      },
    });
  }
  ngOnDestroy() {
  }


}
