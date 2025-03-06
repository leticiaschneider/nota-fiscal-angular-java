import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Supplier } from '../pages/supplier/supplier.model';


@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  private apiUrl = 'http://localhost:8080/fornecedor';
  
    constructor(private http: HttpClient) {}
  
    getSuppliers(): Observable<Supplier[]> {
      return this.http.get<Supplier[]>(this.apiUrl);
    }
    
    getSupplierById(id: number): Observable<Supplier> {
      return this.http.get<Supplier>(`${this.apiUrl}/${id}`);
    }  
  
    createSupplier(supplier: Supplier): Observable<Supplier> {
      return this.http.post<Supplier>(this.apiUrl, supplier);
    }
  
    updateSupplier(supplier: Supplier): Observable<Supplier> {
      return this.http.put<Supplier>(`${this.apiUrl}/${supplier.id}`, supplier);
    }
  
    deleteSupplier(id: number): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
  
    searchSupplier(term: string) {
      return this.http.get<Supplier[]>(`${this.apiUrl}/search?codigo=${term}&razaoSocial=${term}`);
    }
    
}
