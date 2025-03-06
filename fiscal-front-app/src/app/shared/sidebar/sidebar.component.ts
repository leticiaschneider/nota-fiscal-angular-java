import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  @Output() toggleEvent = new EventEmitter<boolean>();

  isOpen = false;

  menuItems = [
    { icon: 'pi pi-home', label: 'Dashboard', route: '/' },
    { icon: 'pi pi-box', label: 'Produtos', route: '/produtos' },
    { icon: 'pi pi-building', label: 'Fornecedores', route: '/fornecedores' },
    { icon: 'pi pi-file', label: 'Notas Fiscais', route: '/notas-fiscais' }
  ];

  toggleSidebar() {
    this.isOpen = !this.isOpen;
    this.toggleEvent.emit(this.isOpen);
  }
}