import { Component, OnInit } from '@angular/core';

import { IUser } from '../shared/users.model';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersApiService } from '../shared/users-api.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {

  errorMessage = '';
  user: IUser | undefined;
  pageTitle = 'User Detail';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private usersApiService: UsersApiService
  ) { }

  ngOnInit() {
    const param = this.route.snapshot.paramMap.get('id');
    if (param) {
      const id = +param;
      this.getUser(id);
    }
  }

  getUser(id: number) {
    this.usersApiService.getUser(id).subscribe(
      user => this.user = user,
      error => this.errorMessage = <any>error);
  }

  onBack(): void {
    this.router.navigate(['/user-list']);
  }

}
