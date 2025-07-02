import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { ServiceLoading } from '../../services/service-loading.service';

@Component({
  selector: 'app-loading',
  imports: [CommonModule],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.css'
})
export class LoadingComponent {

    isLoading = false;

  constructor(private loadingService: ServiceLoading) {
    this.loadingService.loading$.subscribe(state => {
      this.isLoading = state;
    })
  }

}
