import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  template: `
    <mat-toolbar color="primary">
      <span class="brand">User Management</span>
      <span class="spacer"></span>
      <a mat-button routerLink="/users">Users</a>
      <a mat-raised-button color="accent" routerLink="/users/new">New</a>
    </mat-toolbar>
  `,
  styles: [`
    .brand { font-weight: 600; }
    .spacer { flex: 1 1 auto; }
  `]
})
export class HeaderComponent {}
