import { Component, OnInit } from '@angular/core';

import { IUser } from '../shared/users.model';
import { UsersApiService } from '../shared/users-api.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  errorMessage = '';
  users: any;
  loading: boolean;

  constructor(
    private usersApiService: UsersApiService,
  ) { }

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.loading = true;
    this.usersApiService.getUsers().subscribe(
      users => {
        this.users = users ;
        this.loading = false;
      },
      error => this.errorMessage = <any>error
    );
  }

}
