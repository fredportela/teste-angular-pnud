import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from './dashboard.component';
import { UserService } from '../../../../core/services/user.service';
import { User } from '../../../../core/models/user.model';
import { SharedModule } from 'src/app/shared/shared.module';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockUsers: User[];

  beforeEach(async () => {
    mockUsers = [
      {
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
      },
      {
        id: '2',
        name: 'Jane Smith',
        username: 'janesmith',
        email: 'jane@example.com',
        address: {
          street: '456 Oak Ave',
          suite: 'Suite 2',
          city: 'Los Angeles',
          zipcode: '90210'
        },
        phone: '098-765-4321',
        active: false
      },
      {
        id: '3',
        name: 'Bob Johnson',
        username: 'bobjohnson',
        email: 'bob@example.com',
        address: {
          street: '789 Pine St',
          suite: 'Apt 3',
          city: 'Chicago',
          zipcode: '60601'
        },
        phone: '555-123-4567',
        active: true
      }
    ];

    mockUserService = jasmine.createSpyObj('UserService', ['list']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      imports: [
        NoopAnimationsModule,
        SharedModule
      ],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: Router, useValue: mockRouter }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    mockUserService.list.and.returnValue(of([]));

    fixture.detectChanges();

    expect(component.loading).toBe(false);
    expect(component.totalUsers).toBe(0);
    expect(component.activeUsers).toBe(0);
    expect(component.inactiveUsers).toBe(0);
    expect(component.chartData).toEqual([0, 0]);
    expect(component.chartLabels).toEqual(['Ativos', 'Inativos']);
  });

  it('should load user statistics on init', () => {
    mockUserService.list.and.returnValue(of(mockUsers));
    
    fixture.detectChanges();
    
    expect(mockUserService.list).toHaveBeenCalled();
    expect(component.totalUsers).toBe(3);
    expect(component.activeUsers).toBe(2);
    expect(component.inactiveUsers).toBe(1);
    expect(component.chartData).toEqual([2, 1]);
    expect(component.loading).toBe(false);
  });

  it('should handle error when loading users', () => {
    const error = new Error('API Error');
    mockUserService.list.and.returnValue(throwError(() => error));
    spyOn(console, 'error');
    
    fixture.detectChanges();
    
    expect(console.error).toHaveBeenCalledWith('Erro ao carregar estatísticas:', error);
    expect(component.loading).toBe(false);
  });

  it('should calculate percentage correctly', () => {
    expect(component.getPercentage(25, 100)).toBe(25);
    expect(component.getPercentage(0, 100)).toBe(0);
    expect(component.getPercentage(100, 100)).toBe(100);
    expect(component.getPercentage(33, 100)).toBe(33);
  });

  it('should return 0 percentage when total is 0', () => {
    expect(component.getPercentage(10, 0)).toBe(0);
  });

  it('should round percentage to nearest integer', () => {
    expect(component.getPercentage(33.6, 100)).toBe(34);
    expect(component.getPercentage(33.4, 100)).toBe(33);
  });

  it('should navigate to users list without status filter', () => {
    component.navigateToUsers();
    
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/users']);
  });

  it('should navigate to users list with active status filter', () => {
    component.navigateToUsers('active');
    
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/users'], { state: { status: 'active' } });
  });

  it('should navigate to users list with inactive status filter', () => {
    component.navigateToUsers('inactive');
    
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/users'], { state: { status: 'inactive' } });
  });

  it('should update chart data when statistics are loaded', () => {
    mockUserService.list.and.returnValue(of(mockUsers));
    
    fixture.detectChanges();
    
    expect(component.chartData).toEqual([2, 1]);
    expect(component.chartLabels).toEqual(['Ativos', 'Inativos']);
  });

  it('should set loading to false after successful data load', () => {
    mockUserService.list.and.returnValue(of(mockUsers));
    
    fixture.detectChanges();
    
    expect(component.loading).toBe(false);
  });
});
