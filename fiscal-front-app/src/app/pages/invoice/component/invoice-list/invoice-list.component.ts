import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { Invoice } from '../../invoice.model';
import { SupplierService } from '../../../../services/supplier.service';

@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule],
  templateUrl: './invoice-list.component.html',
  styleUrl: './invoice-list.component.scss'
})
export class InvoiceListComponent implements OnInit{
  
  @Input() invoices: Invoice[] = [];
  @Output() edit = new EventEmitter<Invoice>();
  @Output() remove = new EventEmitter<number>();
  supplier: any = [];

  supplierMap: { [key: number]: any } = {};

  private supplierService = inject(SupplierService);

  ngOnInit(): void {
    this.loadSuppliers();
  }

  loadSuppliers(): void {
    this.invoices.forEach(invoice => {
      const fornecedorId = invoice.fornecedorId; 
      
      if (fornecedorId && !this.supplierMap[fornecedorId]) {
        this.supplierService.getSupplierById(fornecedorId).subscribe((data) => {
          // Armazena o fornecedor no mapa
          this.supplierMap[fornecedorId] = data;
        });
      }
    });
  }

  getSupplier(fornecedorId: number): any {
    return this.supplierMap[fornecedorId] || { cnpj: 'N/A', razaoSocial: 'Fornecedor não encontrado' };
  }
}