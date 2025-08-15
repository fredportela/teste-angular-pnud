import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../../../core/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent implements OnInit {
  id?: number;

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    role: ['user', [Validators.required]]
  });

  constructor(
    private fb: FormBuilder,
    private users: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const idParam = params.get('id');
        if (!idParam) return of(null);
        this.id = Number(idParam);
        return this.users.get(this.id);
      })
    ).subscribe(user => {
      if (user) this.form.patchValue(user);
    });
  }

  save(): void {
    const payload = this.form.value as any;
    const req$ = this.id
      ? this.users.update(this.id, payload)
      : this.users.create(payload);

    req$.subscribe({
      next: () => {
        this.snack.open('Saved!', 'OK', { duration: 2000 });
        this.router.navigate(['/users']);
      }
    });
  }
}
