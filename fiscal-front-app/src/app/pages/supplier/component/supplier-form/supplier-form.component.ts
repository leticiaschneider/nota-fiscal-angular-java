import { Component, Input, OnInit, Output, EventEmitter, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';

import { SupplierService } from '../../../../services/supplier.service';
import { Supplier } from '../../supplier.model';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-supplier-form',
  imports: [CommonModule, ReactiveFormsModule, DropdownModule, InputTextModule, CalendarModule, ButtonModule, InputMaskModule, ToastModule],
  templateUrl: './supplier-form.component.html',
  styleUrl: './supplier-form.component.scss',
  providers: [MessageService]
})
export class SupplierFormComponent implements OnInit {
  supplierId: string | null = null;

  upplier: Supplier | null = null;
  @Output() save = new EventEmitter<Supplier>();

  supplierForm!: FormGroup;
  fb = inject(FormBuilder);
  supplierService = inject(SupplierService);
  messageService = inject(MessageService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  statusOptions = [
    { label: 'Ativo', value: 'ATIVO' },
    { label: 'Baixado', value: 'BAIXADO' },
    { label: 'Suspenso', value: 'SUSPENSO' }
  ];

  ngOnInit() {
    this.supplierForm = this.fb.group({
      codigo: ['', Validators.required],
      razaoSocial: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', Validators.required],
      cnpj: ['', Validators.required],
      situacao: ['Ativo', Validators.required],
      dataBaixa: [null]
    });

    this.supplierForm.get('status')?.valueChanges.subscribe((status) => {
      if (status === 'Baixado') {
        this.supplierForm.get('deactivationDate')?.setValidators([Validators.required]);
      } else {
        this.supplierForm.get('deactivationDate')?.clearValidators();
      }
      this.supplierForm.get('deactivationDate')?.updateValueAndValidity();
    });

    this.supplierId = this.route.snapshot.paramMap.get('id');

    if (this.supplierId) {
      this.supplierService.getSupplierById(Number(this.supplierId)).subscribe((supplier: Supplier) => {
        this.supplierForm.patchValue(supplier);
         
      const changeSituacao = this.statusOptions.find(option => option.value === supplier.situacao);
      
      this.supplierForm.patchValue({
        ...supplier,
        situacao: changeSituacao ?? this.statusOptions[0]
      });

      });
      this.supplierForm.get('cnpj')?.disable();
    }
  }

  onSubmit() {
    if (this.supplierForm.valid) {
      this.supplierForm.value.situacao = this.supplierForm.value.situacao.value;
      const supplierData = {
        ...this.supplierForm.value,
        id: this.supplierId ? Number(this.supplierId) : undefined,
        cnpj: this.supplierForm.value.cnpj.replace(/\D/g, '')
      };      

      if (this.supplierId) {
        this.supplierService.updateSupplier(supplierData).subscribe(
          updatedSupplier => {
            this.save.emit(updatedSupplier);
            this.showSuccess('Fornecedor atualizado com sucesso!');
          },
          error => {
            this.showError('Ocorreu um erro ao atualizar o fornecedor.');
          }
        );
      } else {
        this.supplierService.createSupplier(supplierData).subscribe(
          newSupplier => {
            this.save.emit(newSupplier);
            this.showSuccess('Fornecedor criado com sucesso!');
            this.supplierForm.reset();
          },
          error => {
            this.showError('Ocorreu um erro ao criar o fornecedor.');
          }
        );
      }
    }
  }  

  onCancel() {
    this.supplierForm.reset();
    this.router.navigate(['/fornecedores']);
  }

  showSuccess(message: string) {
    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: message });
  }

  showError(message: string) {
    this.messageService.add({ severity: 'error', summary: 'Erro', detail: message });
  }
}