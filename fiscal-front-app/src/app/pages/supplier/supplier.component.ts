import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Supplier } from './supplier.model';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { SupplierListComponent } from './component/supplier-list/supplier-list.component';
import { SupplierService } from '../../services/supplier.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [CommonModule, ButtonModule, FormsModule, SupplierListComponent, ToastModule],
  templateUrl: './supplier.component.html',
  styleUrl: './supplier.component.scss',
  providers: [MessageService]
})
export class SupplierComponent implements OnInit {
  suppliers: Supplier[] = [];
  filteredSuppliers: Supplier[] = [];
  searchTerm: string = '';

  constructor(private router: Router, private supplierService: SupplierService, private messageService: MessageService) { }

  ngOnInit() {
    this.loadSuppliers();
  }

  loadSuppliers() {
    this.supplierService.getSuppliers().subscribe(
      (data: Supplier[]) => {
        this.suppliers = data;
        this.filteredSuppliers = [...this.suppliers];
      },
      (error) => {
        console.error('Erro ao carregar fornecedores', error);
      }
    );
  }

  filterSuppliers() {
    const term = this.searchTerm.toLowerCase().trim();

    if (term.length > 2) {
      this.supplierService.searchSupplier(term).subscribe(
        (data: Supplier[]) => {
          this.filteredSuppliers = [...data];
        },
        (error) => {
          this.showError('Erro ao buscar fornecedores.');
        }
      );
    } else if (term.length === 0) {
      this.filteredSuppliers = [...this.suppliers];
    } else {
      this.filteredSuppliers = this.suppliers.filter(supplier =>
        supplier.codigo.toLowerCase().includes(term) ||
        supplier.razaoSocial.toLowerCase().includes(term)
      );
    }
  }

  navigateToNew() {
    this.router.navigate(['/fornecedores/novo']);
  }

  navigateToEdit(supplier: any) {
    this.router.navigate([`/fornecedores/editar/${supplier.id}`]);
  }

  deleteSupplier(supplierId: number) {
    if (supplierId) {
      this.supplierService.deleteSupplier(supplierId).subscribe(
        () => {
          this.showSuccess('Produto excluído com sucesso!');
          this.suppliers = this.suppliers.filter((supplier: Supplier) => supplier.id !== supplierId);
          this.filteredSuppliers = this.filteredSuppliers.filter(supplier => supplier.id !== supplierId);
        },
        error => {
          this.showError('Ocorreu um erro ao excluir o produto.');
        }
      );
    }
  }

  showSuccess(message: string) {
    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: message });
  }

  showError(message: string) {
    this.messageService.add({ severity: 'error', summary: 'Erro', detail: message });
  }
}