import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { Supplier } from '../../supplier.model';
import { CnpjPipe } from '../../../../pipes/cnpj.pipe';

@Component({
  selector: 'app-supplier-list',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, CnpjPipe],
  templateUrl: './supplier-list.component.html',
  styleUrl: './supplier-list.component.scss'
})
export class SupplierListComponent {
  @Input() suppliers: Supplier[] = [];
  @Output() edit = new EventEmitter<Supplier>();
  @Output() remove = new EventEmitter<number>();
}
