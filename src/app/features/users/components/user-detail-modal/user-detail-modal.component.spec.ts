import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserDetailModalComponent } from './user-detail-modal.component';
import { User } from '../../../../core/models/user.model';
import { SharedModule } from 'src/app/shared/shared.module';

describe('UserDetailModalComponent', () => {
  let component: UserDetailModalComponent;
  let fixture: ComponentFixture<UserDetailModalComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<UserDetailModalComponent>>;
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

    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      declarations: [UserDetailModalComponent],
      imports: [
        NoopAnimationsModule,
        SharedModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { user: mockUser } }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have user data injected', () => {
    expect(component.data.user).toEqual(mockUser);
  });

  it('should close dialog when close method is called', () => {
    component.close();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('should display user information', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain(mockUser.name);
    expect(compiled.textContent).toContain(mockUser.email);
  });
});
