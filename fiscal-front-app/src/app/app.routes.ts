import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'fornecedores',
    loadComponent: () => import('./pages/supplier/supplier.component').then(m => m.SupplierComponent)
  },
  {
    path: 'fornecedores/novo',
    loadComponent: () => import('./pages/supplier/component/supplier-form/supplier-form.component').then(m => m.SupplierFormComponent)
  },
  {
    path: 'fornecedores/editar/:id',
    loadComponent: () => import('./pages/supplier/component/supplier-form/supplier-form.component').then(m => m.SupplierFormComponent)
  },
  {
    path: 'produtos',
    loadComponent: () => import('./pages/products/products.component').then(m => m.ProductsComponent)
  },
  {
    path: 'produtos/novo',
    loadComponent: () => import('./pages/products/component/products-form/products-form.component').then(m => m.ProductsFormComponent)
  },
  {
    path: 'produtos/editar/:id',
    loadComponent: () => import('./pages/products/component/products-form/products-form.component').then(m => m.ProductsFormComponent)
  },
  {
    path: 'notas-fiscais',
    loadComponent: () => import('./pages/invoice/invoice.component').then(m => m.InvoiceComponent)
  },
  {
    path: 'notas-fiscais/novo',
    loadComponent: () => import('./pages/invoice/component/invoice-form/invoice-form.component').then(m => m.InvoiceFormComponent)
  },
  {
    path: 'notas-fiscais/editar/:id',
    loadComponent: () => import('./pages/invoice/component/invoice-form/invoice-form.component').then(m => m.InvoiceFormComponent)
  },
//   {
//     path: '**',
//     loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent)
//   }
];
