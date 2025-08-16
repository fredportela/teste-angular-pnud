import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { UserService } from '../../../../core/services/user.service';
import { User } from '../../../../core/models/user.model';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit, AfterViewInit {
  displayedColumns = ['name', 'username', 'email', 'phone', 'city', 'actions'];
  skeletonData = [{}, {}, {}];
  data: User[] = [];
  filteredData: User[] = [];
  loading = false;
  dataSource = new MatTableDataSource<User>([]);
  searchControl = new FormControl('');
  currentPage = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pageSize = 5;
  pageSizeOptions = [5, 10, 25, 50];

  constructor(private users: UserService, private router: Router) {}

  ngOnInit(): void { 
    this.fetch();
    this.setupSearch();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  setupSearch(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(searchTerm => {
        this.filterCurrentPage(searchTerm || '');
      });
  }

  filterUsers(searchTerm: string): void {
    if (!searchTerm.trim()) {
      this.filteredData = [...this.data];
    } else {
      const term = searchTerm.toLowerCase();
      this.filteredData = this.data.filter(user => 
        user.name?.toLowerCase().includes(term) ||
        user.username?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term) ||
        user.phone?.toLowerCase().includes(term) ||
        user.address?.city?.toLowerCase().includes(term)
      );
    }
    
    this.dataSource.data = this.filteredData;
    
    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

  filterCurrentPage(searchTerm: string): void {
    if (!searchTerm.trim()) {
      this.dataSource.data = this.filteredData;
      return;
    }

    const term = searchTerm.toLowerCase();
    
    const allFiltered = this.data.filter(user => 
      user.name?.toLowerCase().includes(term) ||
      user.username?.toLowerCase().includes(term) ||
      user.email?.toLowerCase().includes(term) ||
      user.phone?.toLowerCase().includes(term) ||
      user.address?.city?.toLowerCase().includes(term) ||
      user.company?.name?.toLowerCase().includes(term)
    );

    this.filteredData = allFiltered;
    
    this.dataSource.data = this.filteredData;
    
    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

  fetch(): void {
    this.loading = true;
    this.users.list().subscribe({
      next: res => {
        this.data = res;
        this.iterator();
        this.loading = false;
      },
      error: _ => (this.loading = false)
    });
  }

  edit(u: User) { 
    this.router.navigate(['/users', u.id, 'edit']); 
  }
  
  remove(u: User) {
    if (!u.id) return;
    this.users.remove(u.id).subscribe(() => this.fetch());
  }

  clearSearch(): void {
    this.searchControl.setValue('');
    this.dataSource.data = this.filteredData;
  }

  private iterator() {
    const end = (this.currentPage + 1) * this.pageSize;
    const start = this.currentPage * this.pageSize;
    this.filteredData = this.data.slice(start, end);
    this.dataSource = new MatTableDataSource(this.filteredData);
  }

  changePage($event: any) {
    if($event.pageSize !== this.pageSize) {
      this.pageSize = $event.pageSize;
      this.currentPage = 0;
    } else {
      this.currentPage = $event.pageIndex;
    }
    this.iterator();
  }
}
