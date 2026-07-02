import { Component, inject } from '@angular/core';

import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast-host',
  standalone: true,
  templateUrl: './toast-host.component.html',
  styleUrl: './toast-host.component.css'
})
export class ToastHostComponent {
  protected readonly toastService = inject(ToastService);
}