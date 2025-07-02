
import { Injectable } from '@angular/core';
import { Aluno } from '../model/Alunos';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root' // Torna o serviço disponível globalmente
})


export class ServiceAlunos {

    private url = 'api/alunos';

    constructor (private http: HttpClient){
        
    }

    obterAlunos(): Observable<Aluno[]>{
        return this.http.get<Aluno[]>(this.url);
    }


    adicionarAlunoNaLista(aluno: Aluno):Observable<Aluno>{
        return this.http.post<Aluno>(this.url, aluno)
    }
    

    removerAluno(id: Number): Observable<Aluno>{
        return this.http.delete<Aluno>(`${this.url}/${id}`)
    }   
 

    atualizarAlunoNalista(id: Number, aluno: Aluno):Observable<Aluno>{
       return this.http.put<Aluno>(`${this.url}/${id}`, aluno)
    }

    findById(id: Number): Observable<Aluno>{
        return this.http.get<Aluno>(`${this.url}/${id}`)
    }
}
