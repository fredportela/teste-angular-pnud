import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { User } from '../models/user.model';
import { environment } from '../../../environments/environment';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  let mockUsers: User[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);

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
      }
    ];
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have correct base URL', () => {
    expect(service['baseUrl']).toBe(`${environment.apiUrl}/users`);
  });

  describe('list', () => {
    it('should return users list', () => {
      service.list().subscribe(users => {
        expect(users).toEqual(mockUsers);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/users`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUsers);
    });

    it('should handle error when API fails', () => {
      const errorMessage = 'Server error';
      
      service.list().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(500);
          expect(error.error).toBe(errorMessage);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/users`);
      req.flush(errorMessage, { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('get', () => {
    it('should return user by id', () => {
      const userId = '1';
      const user = mockUsers[0];

      service.get(userId).subscribe(retrievedUser => {
        expect(retrievedUser).toEqual(user);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/users/${userId}`);
      expect(req.request.method).toBe('GET');
      req.flush(user);
    });

    it('should handle error when user not found', () => {
      const userId = '999';
      
      service.get(userId).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/users/${userId}`);
      req.flush('User not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('create', () => {
    it('should create new user', () => {
      const newUser: Omit<User, 'id'> = {
        name: 'New User',
        username: 'newuser',
        email: 'new@example.com',
        address: {
          street: '789 New St',
          suite: 'Apt 4',
          city: 'Boston',
          zipcode: '02101'
        },
        phone: '555-999-8888',
        active: true
      };

      const createdUser: User = { ...newUser, id: '3' };

      service.create(newUser).subscribe(user => {
        expect(user).toEqual(createdUser);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/users`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newUser);
      req.flush(createdUser);
    });

    it('should handle error when creation fails', () => {
      const newUser: Omit<User, 'id'> = {
        name: 'New User',
        username: 'newuser',
        email: 'new@example.com',
        address: {
          street: '789 New St',
          suite: 'Apt 4',
          city: 'Boston',
          zipcode: '02101'
        },
        phone: '555-999-8888',
        active: true
      };

      service.create(newUser).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/users`);
      req.flush('Bad Request', { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('update', () => {
    it('should update existing user', () => {
      const userId = '1';
      const updateData = {
        name: 'Updated John Doe',
        email: 'updated.john@example.com'
      };

      const updatedUser: User = { ...mockUsers[0], ...updateData };

      service.update(userId, updateData as User).subscribe(user => {
        expect(user).toEqual(updatedUser);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/users/${userId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updateData);
      req.flush(updatedUser);
    });

    it('should handle error when update fails', () => {
      const userId = '1';
      const updateData = {
        name: 'Updated John Doe'
      };

      service.update(userId, updateData as User).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/users/${userId}`);
      req.flush('Bad Request', { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('remove', () => {
    it('should delete user', () => {
      const userId = '1';

      service.remove(userId).subscribe(() => {});

      const req = httpMock.expectOne(`${environment.apiUrl}/users/${userId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('should handle error when deletion fails', () => {
      const userId = '1';

      service.remove(userId).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/users/${userId}`);
      req.flush('User not found', { status: 404, statusText: 'Not Found' });
    });
  });
});
