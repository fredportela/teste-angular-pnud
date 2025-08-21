import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DeleteConfirmationModalComponent, DeleteConfirmationData } from './delete-confirmation-modal.component';
import { User } from '../../../../core/models/user.model';
import { SharedModule } from 'src/app/shared/shared.module';

describe('DeleteConfirmationModalComponent', () => {
  let component: DeleteConfirmationModalComponent;
  let fixture: ComponentFixture<DeleteConfirmationModalComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<DeleteConfirmationModalComponent>>;
  let mockUser: User;
  let mockData: DeleteConfirmationData;

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

    mockData = {
      user: mockUser,
      title: 'Custom Title',
      message: 'Custom message'
    };

    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      declarations: [DeleteConfirmationModalComponent],
      imports: [
        NoopAnimationsModule,
        SharedModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockData }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteConfirmationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have user data injected', () => {
    expect(component.data.user).toEqual(mockUser);
  });

  it('should return custom title when provided', () => {
    expect(component.title).toBe('Custom Title');
  });

  it('should return default title when not provided', async () => {
    await TestBed.resetTestingModule()
      .configureTestingModule({
        declarations: [DeleteConfirmationModalComponent],
        imports: [NoopAnimationsModule, SharedModule],
        providers: [
          { provide: MatDialogRef, useValue: mockDialogRef },
          { provide: MAT_DIALOG_DATA, useValue: { user: mockUser } }
        ]
      })
      .compileComponents();

    const fixtureNoTitle = TestBed.createComponent(DeleteConfirmationModalComponent);
    fixtureNoTitle.detectChanges();

    expect(fixtureNoTitle.componentInstance.title).toBe('Confirmar Exclusão');
  });

  it('should return custom message when provided', () => {
    expect(component.message).toBe('Custom message');
  });

  it('should return default message when not provided', async () => {
    await TestBed.resetTestingModule()
      .configureTestingModule({
        declarations: [DeleteConfirmationModalComponent],
        imports: [NoopAnimationsModule, SharedModule],
        providers: [
          { provide: MatDialogRef, useValue: mockDialogRef },
          { provide: MAT_DIALOG_DATA, useValue: { user: mockUser } }
        ]
      })
      .compileComponents();
  
    const fixtureNoMessage = TestBed.createComponent(DeleteConfirmationModalComponent);
    fixtureNoMessage.detectChanges();
  
    expect(fixtureNoMessage.componentInstance.message).toContain(mockUser.name);
  });

  it('should return user name', () => {
    expect(component.userName).toBe(mockUser.name);
  });

  it('should return user email', () => {
    expect(component.userEmail).toBe(mockUser.email);
  });

  it('should close dialog with true when confirm is called', () => {
    component.confirm();
    expect(mockDialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should close dialog with false when cancel is called', () => {
    component.cancel();
    expect(mockDialogRef.close).toHaveBeenCalledWith(false);
  });
});
