import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/core/models/user.model';
import { UserService } from 'src/app/core/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  
  loading = true;
  
  totalUsers = 0;
  activeUsers = 0;
  inactiveUsers = 0;
  
  chartData: number[] = [];
  chartLabels: string[] = ['Ativos', 'Inativos'];
  chartColors = [
    { backgroundColor: ['#4caf50', '#f44336'] }
  ];

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserStatistics();
  }

  loadUserStatistics(): void {
    this.loading = true;
    this.userService.list().subscribe({
      next: (users: User[]) => {
        this.totalUsers = users.length;
        this.activeUsers = users.filter(user => user.active).length;
        this.inactiveUsers = users.filter(user => !user.active).length;
        
        this.chartData = [this.activeUsers, this.inactiveUsers];
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar estatísticas:', error);
        this.loading = false;
      }
    });
  }

  getPercentage(value: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  }

  navigateToUsers(status?: 'active' | 'inactive'): void {
    if (status) {
      this.router.navigate(['/users'], { state: { status: status } });
    } else {
      this.router.navigate(['/users']);
    }
  }
}
