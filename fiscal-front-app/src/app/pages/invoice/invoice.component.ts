import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceListComponent } from './component/invoice-list/invoice-list.component';
import { Invoice } from './invoice.model';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { InvoiceService } from '../../services/invoice.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [CommonModule, InvoiceListComponent, ButtonModule, FormsModule, ToastModule],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.scss',
  providers: [MessageService]
})
export class InvoiceComponent implements OnInit {
  invoices: Invoice[] = [];
  filteredInvoices: Invoice[] = [];
  searchTerm: string = '';

  constructor(private router: Router, private invoiceService: InvoiceService, private messageService: MessageService) { }

  ngOnInit() {
    this.loadInvoices();
  }

  loadInvoices() {
    this.invoiceService.getInvoice().subscribe(
      (data: Invoice[]) => {
        this.invoices = data;
        this.filteredInvoices = [...this.invoices];
      },
      (error) => {
        console.error('Erro ao carregar notas fiscais: ', error);
      }
    );
  }

  filterInvoices() {
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredInvoices = this.invoices.filter(invoice =>
      invoice.numeroNota.toLowerCase().includes(term)
    );
  }

  navigateToNew() {
    this.router.navigate(['/notas-fiscais/novo']);
  }

  navigateToEdit(invoice: any) {
    this.router.navigate([`/notas-fiscais/editar/${invoice.id}`]);
  }

  deleteInvoice(invoceId: number) {
    if (invoceId) {
      this.invoiceService.deleteInvoice(invoceId).subscribe(
        () => {
          this.showSuccess('Nota fiscal excluído com sucesso!');
          this.invoices = this.invoices.filter((invoce: Invoice) => invoce.id !== invoceId);
          this.filteredInvoices = this.filteredInvoices.filter(invoce => invoce.id !== invoceId);
        },
        error => {
          this.showError('Ocorreu um erro ao excluir a Nota fiscal.');
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