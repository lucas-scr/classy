import { Component } from '@angular/core';
import { ServiceMateria } from '../../../services/service_materias';
import { Router } from '@angular/router';
import { ServiceMensagemGlobal } from '../../../services/mensagens_global';
import { Materia } from '../../../interfaces/materias';
import { PrimengImports } from '../../../shared/primengImports.module';

@Component({
  selector: 'app-cadastro-materias',
  imports: [PrimengImports],
  templateUrl: './cadastro-materias.component.html',
  styleUrl: './cadastro-materias.component.css'
})
export class CadastroMateriasComponent {
  nome: string;
  ativo: true;

  constructor(
    private serviceMensagemGlobal: ServiceMensagemGlobal,
    private serviceMateria : ServiceMateria,
    private router: Router
  ) { }

  ngOnInit() {
  }

  onSubmit() {
    if (this.nome == null) {
      this.serviceMensagemGlobal.showMessage(
        'error',
        'Erro',
        'Informe o nome da Materia.'
      );
    } else {
      let materia: Materia = {
        nome: this.nome,
        ativo: this.ativo
    
      };
      
      this.cadastrarMateria(materia);
    }
  }


  cadastrarMateria(materia: Materia) {
    this.serviceMateria.cadastrarMateria(materia).subscribe({
      next: () => {
        this.serviceMensagemGlobal.showMessage(
          'success',
          'Sucesso!',
          'A materia foi salva com sucesso.'
        );
        this.router.navigate(['/materias']);
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

}
