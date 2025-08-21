import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { UserFormComponent } from './user-form.component';
import { UserService } from '../../../../core/services/user.service';
import { User } from '../../../../core/models/user.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedModule } from 'src/app/shared/shared.module';

describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;
  let mockUser: User;

  beforeEach(async () => {
    mockUser = {
      id: '1',
      name: 'John Doe',
      username: 'johndoe',
      email: 'john@example.com',
      address: {
        street: '123 Main St',
        suite: 'Apt 1',
        city: 'New York',
        zipcode: '10001'
      },
      phone: '123-456-7890',
      active: true
    };

    mockUserService = jasmine.createSpyObj('UserService', ['get', 'create', 'update']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      declarations: [UserFormComponent],
      imports: [
        NoopAnimationsModule,
        SharedModule
      ],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: Router, useValue: mockRouter },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: ActivatedRoute, useValue: { paramMap: of({ get: () => null }) } }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    
    expect(component.form.get('name')?.value).toBe('');
    expect(component.form.get('email')?.value).toBe('');
    expect(component.form.get('active')?.value).toBe(true);
  });

  it('should not load user data when creating new user', () => {
    mockUserService.get.and.returnValue(of(mockUser));

    fixture.detectChanges(); // ativa ngOnInit
    
    expect(mockUserService.get).not.toHaveBeenCalled();
  });

  it('should validate required fields', () => {
    const form = component.form;
    
    expect(form.valid).toBeFalsy();
    
    form.patchValue({
      name: 'John Doe',
      email: 'john@example.com',
      active: true
    });
    
    expect(form.valid).toBeTruthy();
  });

  it('should validate email format', () => {
    const emailControl = component.form.get('email');
    
    emailControl?.setValue('invalid-email');
    expect(emailControl?.errors?.['email']).toBeTruthy();
    
    emailControl?.setValue('valid@email.com');
    expect(emailControl?.errors?.['email']).toBeFalsy();
  });

  it('should validate name minimum length', () => {
    const nameControl = component.form.get('name');
    
    nameControl?.setValue('A');
    expect(nameControl?.errors?.['minlength']).toBeTruthy();
    
    nameControl?.setValue('John');
    expect(nameControl?.errors?.['minlength']).toBeFalsy();
  });

  it('should create new user when no ID is present', () => {
    component.id = undefined;
    mockUserService.create.and.returnValue(of(mockUser));
    
    component.form.patchValue({
      name: 'New User',
      email: 'new@example.com',
      active: true
    });
    
    component.save();
    
    expect(mockUserService.create).toHaveBeenCalledWith({
      name: 'New User',
      email: 'new@example.com',
      active: true
    } as any);
    expect(mockSnackBar.open).toHaveBeenCalledWith('Usuário salvo com sucesso!', 'OK', { duration: 2000 });
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/users']);
  });

  it('should update existing user when ID is present', () => {
    component.id = '1';
    mockUserService.update.and.returnValue(of(mockUser));
    
    component.form.patchValue({
      name: 'Updated User',
      email: 'updated@example.com',
      active: false
    });
    
    component.save();
    
    expect(mockUserService.update).toHaveBeenCalledWith('1', {
      name: 'Updated User',
      email: 'updated@example.com',
      active: false
    } as any);
    expect(mockSnackBar.open).toHaveBeenCalledWith('Usuário salvo com sucesso!', 'OK', { duration: 2000 });
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/users']);
  });
});
