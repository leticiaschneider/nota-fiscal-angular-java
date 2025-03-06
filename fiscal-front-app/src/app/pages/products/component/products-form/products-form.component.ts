import { Component, Input, OnInit, Output, EventEmitter, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Product } from '../../product.model';
import { ProductService } from '../../../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-products-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DropdownModule, InputTextModule, CheckboxModule, ButtonModule, ToastModule],
  templateUrl: './products-form.component.html',
  styleUrls: ['./products-form.component.scss'],
  providers: [MessageService]
})
export class ProductsFormComponent implements OnInit {
  productId: string | null = null;
  product: Product | null = null;
  @Output() save = new EventEmitter<Product>();

  productForm!: FormGroup;
  fb = inject(FormBuilder);
  productService = inject(ProductService);
  messageService = inject(MessageService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  statusOptions = [
    { label: 'Ativo', value: 'ATIVO' },
    { label: 'Inativo', value: 'INATIVO' }
  ];

  ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('id');

    this.productForm = this.fb.group({
      codigo: ['', Validators.required],
      descricao: ['', Validators.required],
      situacao: ['ATIVO', Validators.required]
    });
    
    if (this.productId) {
      this.productService.getProductById(Number(this.productId)).subscribe((product: Product) => {
        this.productForm.patchValue(product);

        const changeSituacao = this.statusOptions.find(option => option.value === product.situacao);
      
        this.productForm.patchValue({
          ...product,
          situacao: changeSituacao ?? this.statusOptions[0]
        });
      });
    }
  }

  onSubmit() {
    if (this.productForm.valid) {

      const productData = { 
        ...this.productForm.value, 
        id: this.productId ? Number(this.productId) : undefined,
        situacao: this.productForm.value.situacao?.value || 'ATIVO'
       };

      if (this.productId) {
        this.productService.updateProduct(productData).subscribe(
          updatedProduct => {
            this.save.emit(updatedProduct);
            this.showSuccess('Produto atualizado com sucesso!');
          },
          error => {
            this.showError('Ocorreu um erro ao atualizar o produto.');
          }
        );
      } else {
        this.productService.createProduct(productData).subscribe(
          newProduct => {
            this.save.emit(newProduct);
            this.showSuccess('Produto criado com sucesso!');
            this.productForm.reset();
          },
          error => {
            this.showError('Ocorreu um erro ao criar o produto.');
          }
        );
      }
    }
  }

  onCancel() {
    this.productForm.reset();
    this.router.navigate(['/produtos']);
  }

  showSuccess(message: string) {
    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: message });
  }

  showError(message: string) {
    this.messageService.add({ severity: 'error', summary: 'Erro', detail: message });
  }
}