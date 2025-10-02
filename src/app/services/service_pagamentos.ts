import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pagamento } from '../interfaces/pagamentos';

@Injectable({
  providedIn: 'root',
})
export class ServicePagamentos {
    private url = 'api/pagamentos';

    constructor (private http: HttpClient){
        
    }

    getPagamentos():Observable<Pagamento[]>{
        return this.http.get<Pagamento[]>(this.url);
    }

    getPagamento(id: number):Observable<Pagamento>{
        return this.http.get<Pagamento>(`${this.url}/${id}`)
    }

    postPagamento(pagamento: Pagamento):Observable<Pagamento>{
        return this.http.post<Pagamento>(this.url,pagamento)
    }

    putPagamento(id: number, pagamento: Pagamento):Observable<Pagamento>{
        return this.http.put<Pagamento>(`${this.url}/${id}`,pagamento)
    }

    deletePagamento(id: number):Observable<Pagamento>{
        return this.http.delete<Pagamento>(`${this.url}/${id}`)
    }

    cancelarPagamento(id: number, pagamento: Pagamento, motivo: string):Observable<Pagamento>{
        pagamento.motivoCancelamento = motivo;
        pagamento.situacao = 'Cancelado'
        console.log(motivo)
        return this.http.post<Pagamento>(`${this.url}/${id}`,pagamento)
    }

   

}
