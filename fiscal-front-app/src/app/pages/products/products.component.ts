import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsListComponent } from './component/products-list/products-list.component';
import { Product } from './product.model';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ProductsListComponent, ButtonModule, FormsModule, ToastModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
  providers: [MessageService]
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchTerm: string = '';

  constructor(private router: Router, private productService: ProductService, private messageService: MessageService) { }

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe(
      (data: Product[]) => {
        this.products = data;
        this.filteredProducts = [...this.products];
      },
      (error) => {
        console.error('Erro ao carregar produtos', error);
      }
    );
  }

  filterProducts() {
    const term = this.searchTerm.toLowerCase().trim();

    if (term.length > 2) {
      this.productService.searchProducts(term).subscribe(
        (data: Product[]) => {
          this.filteredProducts = [...data];
        },
        (error) => {
          this.showError('Erro ao buscar produtos.');
        }
      );
    } else if (term.length === 0) {
      this.filteredProducts = [...this.products];
    } else {
      this.filteredProducts = this.products.filter(product =>
        product.descricao.toLowerCase().includes(term) ||
        product.codigo.toString().toLowerCase().includes(term)
      );
    }
  }

  navigateToNew() {
    this.router.navigate(['/produtos/novo']);
  }

  navigateToEdit(product: any) {
    this.router.navigate([`/produtos/editar/${product.id}`]);
  }

  deleteProduct(productId: number) {
    if (productId) {
      this.productService.deleteProduct(productId).subscribe(
        () => {
          this.showSuccess('Produto excluído com sucesso!');
          this.products = this.products.filter(product => product.id !== productId);
          this.filteredProducts = this.filteredProducts.filter(product => product.id !== productId);
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
