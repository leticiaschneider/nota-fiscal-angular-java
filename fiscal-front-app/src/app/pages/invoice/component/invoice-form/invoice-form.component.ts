import { Component, OnInit, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, Router } from '@angular/router';
import { SupplierService } from '../../../../services/supplier.service';
import { ProductService } from '../../../../services/product.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { InvoiceService } from '../../../../services/invoice.service';
import { Invoice } from '../../invoice.model';


@Component({
  selector: 'app-invoice-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DropdownModule, InputTextModule, CalendarModule, ButtonModule, ToastModule],
  templateUrl: './invoice-form.component.html',
  styleUrl: './invoice-form.component.scss',
  providers: [MessageService]
})
export class InvoiceFormComponent implements OnInit {
  invoiceForm!: FormGroup;
  suppliers: any[] = [];
  products: any[] = [];
  invoiceId: string | null = null;

  private supplierService = inject(SupplierService);
  private productService = inject(ProductService);
  private invoiceService = inject(InvoiceService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private messageService = inject(MessageService);
  private fb = inject(FormBuilder);

  ngOnInit(): void {
    this.invoiceId = this.route.snapshot.paramMap.get('id');

    this.invoiceForm = this.fb.group({
      numeroNota: ['', Validators.required],
      dataEmissao: ['', Validators.required],
      fornecedorId: ['', Validators.required],
      endereco: [''],
      valorTotal: [''],
      items: this.fb.array([])
    });

    this.loadSuppliers();
    this.loadProducts();

    if (this.invoiceId) {
      this.invoiceService.getInvoiceById(Number(this.invoiceId)).subscribe((invoice: Invoice) => {
        this.supplierService.getSupplierById(invoice.fornecedorId).subscribe((supplier) => {
          this.invoiceForm.patchValue({
            numeroNota: invoice.numeroNota,
            dataEmissao: new Date(invoice.dataEmissao),
            fornecedorId: supplier,
            endereco: invoice.endereco,
            valorTotal: invoice.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
          });

          const itemsFormArray = this.invoiceForm.get('items') as FormArray;
          invoice.itens.forEach(item => {
            itemsFormArray.push(this.fb.group({
              produtoId: this.products.find(p => p.id === item.produtoId) || '',
              valorUnitario: item.valorUnitario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
              quantidade: item.quantidade,
              valorTotalItem: item.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
            }));
          });
        });
      });
    }

  }

  get items(): FormArray {
    return this.invoiceForm.get('items') as FormArray;
  }

  loadSuppliers(): void {
    this.supplierService.getSuppliers().subscribe((data) => {
      this.suppliers = data;
    });
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe((data) => {
      this.products = data;
    });
  }

  addItem(): void {
    const item = this.fb.group({
      produtoId: ['', Validators.required],
      valorUnitario: ['', Validators.required],
      quantidade: ['', Validators.required],
      valorTotalItem: [{ value: '', disabled: true }]
    });

    this.items.push(item);
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
    this.updateTotalValue();
  }

  updateTotalItemValue(index: number): void {
    const item = this.items.at(index);
    const unitPrice = item.get('valorUnitario')?.value;
    const quantity = item.get('quantidade')?.value;

    const numericUnitPrice = parseFloat(
      String(unitPrice).replace(/[^\d,]/g, '').replace(',', '.')
    );

    if (!isNaN(numericUnitPrice) && quantity) {
      const total = numericUnitPrice * quantity;

      const formattedTotal = total.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      });

      item.patchValue({ valorTotalItem: formattedTotal }, { emitEvent: false });
    } else {
      item.patchValue({ valorTotalItem: '' }, { emitEvent: false });
    }

    this.updateTotalValue();
  }

  updateTotalValue(): void {
    const total = this.items.controls.reduce((sum, item) => {
      const totalItemValue = item.get('valorTotalItem')?.value;

      const numericValue = parseFloat(
        String(totalItemValue).replace(/[^\d,]/g, '').replace(',', '.')
      );

      return sum + (isNaN(numericValue) ? 0 : numericValue);
    }, 0);

    const formattedTotal = total.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });

    this.invoiceForm.get('valorTotal')?.setValue(formattedTotal, { emitEvent: false });
  }

  allowOnlyNumbers(event: KeyboardEvent): void {
    const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', ',', 'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
    if (!allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  formatCurrency(index: number): void {
    const item = this.items.at(index);
    let value = item.get('valorUnitario')?.value;

    value = String(value || '');

    value = value.replace(/[^\d,]/g, '');

    const numericValue = parseFloat(value.replace(',', '.'));

    if (!isNaN(numericValue)) {
      value = numericValue.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      });
    } else {
      value = '';
    }

    item.patchValue({ valorUnitario: value }, { emitEvent: false });

    this.updateTotalItemValue(index);
  }

  onSubmit() {
    if (this.invoiceForm.valid) {

      const formValue = this.invoiceForm.value;

      const formatCurrencyToNumber = (currencyValue: string) => {
        return parseFloat(currencyValue.replace("R$", "").replace(",", ".").trim());
      };

      const formattedInvoiceData = {
        id: this.invoiceId ? Number(this.invoiceId) : undefined,
        numeroNota: formValue.numeroNota,
        dataEmissao: new Date(formValue.dataEmissao).toISOString(),
        endereco: formValue.endereco,
        valorTotal: formatCurrencyToNumber(formValue.valorTotal),
        fornecedorId: formValue.fornecedorId.id,
        itens: formValue.items.map((item: any) => ({
          produtoId: item.produtoId.id,
          valorUnitario: formatCurrencyToNumber(item.valorUnitario),
          quantidade: item.quantidade,
          valorTotal: formatCurrencyToNumber(item.valorUnitario) * item.quantidade
        }))
      };



      if (this.invoiceId) {
        this.invoiceService.updateInvoice(formattedInvoiceData).subscribe(
          updatedInvoice => {
            this.showSuccess('Nota Fiscal atualizado com sucesso!');
          },
          error => {
            this.showError('Ocorreu um erro ao atualizar a Nota Fiscal.');
          }
        );
      } else {
        this.invoiceService.createInvoice(formattedInvoiceData).subscribe(
          newInvoice => {
            this.showSuccess('Nota Fiscal criado com sucesso!');
            this.invoiceForm.reset();
          },
          error => {
            this.showError('Ocorreu um erro ao criar a Nota Fiscal.');
          }
        );
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/notas-fiscais']);
  }

  showSuccess(message: string) {
    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: message });
  }

  showError(message: string) {
    this.messageService.add({ severity: 'error', summary: 'Erro', detail: message });
  }

}