import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { UserService } from '../../../../core/services/user.service';
import { User } from '../../../../core/models/user.model';
import { Router, ActivatedRoute } from '@angular/router';
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
  displayedColumns = ['name', 'email', 'active', 'actions'];
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

  constructor(
    private users: UserService, 
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void { 
    this.setupSearch();
    this.fetch();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  checkState(): void {
    const state = history.state;
    if (state && state?.status) {
      const status = history.state.status;
        this.applyStatusFilter(status);
    }
  }

  applyStatusFilter(status: string): void {
    if (status === 'active') {
      this.filteredData = this.data.filter(user => user.active);
      this.searchControl.setValue('Ativo');
    } else if (status === 'inactive') {
      this.filteredData = this.data.filter(user => !user.active);
      this.searchControl.setValue('Inativo');
    }
    
    this.dataSource.data = this.filteredData;
    if (this.paginator) {
      this.paginator.firstPage();
    }
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

  filterCurrentPage(searchTerm: string): void {
    if (!searchTerm.trim()) {
      this.iterator();
      return;
    }
    const term = searchTerm.toLowerCase();
    
    const allFiltered = this.data.filter(user => 
      user.name?.toLowerCase().includes(term) ||
      user.email?.toLowerCase().includes(term) ||    
      (term === 'ativo' && user.active) ||
      (term === 'inativo' && !user.active)  
    );

    this.filteredData = allFiltered;
    this.dataSource.data = this.filteredData;
    if (this.paginator) {
      this.filterIterator();
    }
  }
  
  private filterIterator() {
    const end = (this.currentPage + 1) * this.pageSize;
    const start = this.currentPage * this.pageSize;
    this.filteredData = this.filteredData.slice(start, end);
    this.dataSource = new MatTableDataSource(this.filteredData);
  }

  fetch(): void {
    this.loading = true;
    this.users.list().subscribe({
      next: res => {
        this.data = res;
        this.iterator();
        this.checkState();
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
      this.paginator.pageIndex = 0
    } else {
      this.paginator.pageIndex = $event.pageIndex;
    }
    this.currentPage = this.paginator.pageIndex ?? 0;
    this.iterator();
  }
}
