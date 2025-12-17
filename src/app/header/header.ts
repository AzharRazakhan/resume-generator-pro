import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { Api } from '../auth/api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {
  isLogin = false;
  userName = '';
  constructor(private router: Router, private api: Api) { }
  ngOnInit(): void {
    this.isLogin = this.api.isLogin();

    let user = this.api.getUser();
    this.userName = user.name;
  }

  logout() {
    this.api.logout();
    this.router.navigate(['/login'])
  }

  goToHome() {
    this.router.navigate(['/'])
  }




}
