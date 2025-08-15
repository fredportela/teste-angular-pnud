import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../core/services/user.service';
import { User } from '../../../../core/models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html'
})
export class UserListComponent implements OnInit {
  displayedColumns = ['name', 'email', 'role', 'actions'];
  data: User[] = [];
  loading = false;

  constructor(private users: UserService, private router: Router) {}

  ngOnInit(): void { this.fetch(); }

  fetch(): void {
    this.loading = true;
    this.users.list().subscribe({
      next: res => (this.data = res, this.loading = false),
      error: _ => (this.loading = false)
    });
  }

  edit(u: User) { this.router.navigate(['/users', u.id, 'edit']); }
  remove(u: User) {
    if (!u.id) return;
    this.users.remove(u.id).subscribe(() => this.fetch());
  }
}
