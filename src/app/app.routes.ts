import { Routes } from '@angular/router';

import { ListaAlunosComponent } from './pages/alunos/lista-alunos/lista-alunos.component';
import { DetalharAlunosComponent } from './pages/alunos/detalhar-alunos/detalhar-alunos.component';
import { ListaContratosComponent } from './pages/contratos/lista-contratos/lista-contratos.component';
import { CadastroContratosComponent } from './pages/contratos/cadastro-contratos/cadastro-contratos.component';
import { EditarContratosComponent } from './pages/contratos/editar-contratos/editar-contratos.component';
import { DetalharContratosComponent } from './pages/contratos/detalhar-contratos/detalhar-contratos.component';
import { PaginaPrincipalComponent } from './pages/pagina-principal/pagina-principal.component';
import { ListarAtividadesComponent } from './pages/atividades/listar-atividades/listar-atividades.component';
import { EditarAtividadesComponent } from './pages/atividades/editar-atividades/editar-atividades.component';
import { DetalharAtividadesComponent } from './pages/atividades/detalhar-atividades/detalhar-atividades.component';
import { CadastrarAtividadesComponent } from './pages/atividades/cadastrar-atividades/cadastrar-atividades.component';
import { ListarPagamentosComponent } from './pages/pagamentos/listar-pagamentos/listar-pagamentos.component';
import { EditarPagamentosComponent } from './pages/pagamentos/editar-pagamentos/editar-pagamentos.component';
import { DetalharPagamentosComponent } from './pages/pagamentos/detalhar-pagamentos/detalhar-pagamentos.component';
import { CadastrarPagamentosComponent } from './pages/pagamentos/cadastrar-pagamentos/cadastrar-pagamentos.component';
import { PaginaProtegidaComponent } from './pages/pagina-protegida/pagina-protegida.component';
import { AuthGuard } from './core/guards/auth.guard';
import { ListaTurmasComponent } from './pages/turma/lista-turmas/lista-turmas/lista-turmas.component';
import { CadastroTurmasComponent } from './pages/turma/cadastro-turmas/cadastro-turmas.component';
import { EditarAlunosComponent } from './pages/alunos/editar-alunos/editar-alunos.component';
import { HomeComponent } from './pages/home/home/home.component';


export const routes: Routes = [
    {
        path: '', component: PaginaPrincipalComponent, canActivate: [AuthGuard], children: [
            { path: 'alunos', component: ListaAlunosComponent, canActivate: [AuthGuard] },
            { path: 'detalhar-aluno/:id', component: DetalharAlunosComponent, canActivate: [AuthGuard] },
            { path: 'editar-aluno/:id', component: EditarAlunosComponent, canActivate: [AuthGuard] },
            { path: 'contratos', component: ListaContratosComponent, canActivate: [AuthGuard] },
            { path: 'cadastrar-contratos', component: CadastroContratosComponent, canActivate: [AuthGuard] },
            { path: 'turmas', component: ListaTurmasComponent, canActivate: [AuthGuard] },
            { path: 'cadastrar-turmas', component: CadastroTurmasComponent, canActivate: [AuthGuard] },
            { path: 'editar-contrato/:id', component: EditarContratosComponent, canActivate: [AuthGuard] },
            { path: 'detalhar-contrato/:id', component: DetalharContratosComponent, canActivate: [AuthGuard] },
            { path: 'atividades', component: ListarAtividadesComponent, canActivate: [AuthGuard] },
            { path: 'editar-atividade/:id', component: EditarAtividadesComponent, canActivate: [AuthGuard] },
            { path: 'detalhar-atividade/:id', component: DetalharAtividadesComponent, canActivate: [AuthGuard] },
            { path: 'cadastrar-atividade', component: CadastrarAtividadesComponent, canActivate: [AuthGuard] },
            { path: 'pagamentos', component: ListarPagamentosComponent, canActivate: [AuthGuard] },
            { path: 'editar-pagamento/:id', component: EditarPagamentosComponent, canActivate: [AuthGuard] },
            { path: 'detalhar-pagamento/:id', component: DetalharPagamentosComponent, canActivate: [AuthGuard] },
            { path: 'cadastrar-pagamento', component: CadastrarPagamentosComponent, canActivate: [AuthGuard] },
            { path: 'forbidden', component: PaginaProtegidaComponent },
             { path: 'home', component: HomeComponent }


        ]
    },
    { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
    { path: '**', redirectTo: 'auth/login' }
];

