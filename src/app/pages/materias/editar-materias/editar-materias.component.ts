import { Component, OnInit } from '@angular/core';
import { ServiceMateria } from '../../../services/service_materias';
import { PrimengImports } from '../../../shared/primengImports.module';
import { ServiceMensagemGlobal } from '../../../services/mensagens_global';
import { ActivatedRoute, Router } from '@angular/router';
import { Materia } from '../../../interfaces/materias';

@Component({
  selector: 'app-editar-materias',
  imports: [PrimengImports],
  templateUrl: './editar-materias.component.html',
  styleUrl: './editar-materias.component.css'
})
export class EditarMateriasComponent implements OnInit{
  materiaId: number;
  materia: Materia;
  nome: string;
  ativo: boolean;

  constructor(
    private serviceMensagemGlobal: ServiceMensagemGlobal,
    private serviceMateria : ServiceMateria,
    private router: Router,
    private route: ActivatedRoute,
    
  ) { }

  ngOnInit() {
    this.carregarMateria(this.materiaId);
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
      
      this.editarMateria(materia);
    }
  }

  carregarMateria(id: number){
    this.serviceMateria.getById(id).subscribe((res)=>{
      this.nome = res.nome;
      this.ativo = res.ativo
    })
  }

  editarMateria(materia: Materia) {
    this.serviceMateria.atualizarMateria(materia).subscribe({
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

    capturarId() {
    this.route.params.subscribe((params) => {
      if (params != undefined) {
        this.materiaId = params['id'];
      } else {
        throw console.error('Aluno não identificado');
      }
    });
  }
}
