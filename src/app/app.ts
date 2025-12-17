import { Component, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { ResumeGenerator } from './resume-generator/resume-generator';
import { ResumePdf } from './resume-pdf/resume-pdf'
import { ResumeBuilder } from "./resume-builder/resume-builder";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Header } from "./header/header";
import { Footer } from "./footer/footer";
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ReactiveFormsModule, FormsModule, Header, Footer, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('resume-generator-pro');
  public hideNavPath = ['/login', '/signup'];
  public showHeaderFooter = true;

  constructor(private router: Router) { }

  ngOnInit(): void {
    // 1. Subscribe to router events to react to page changes
    this.router.events
      .pipe(
        // We only care when the navigation has successfully finished
        filter((event): event is NavigationEnd => event instanceof NavigationEnd)
      )
      .subscribe((event: NavigationEnd) => {
        // 2. Check if the current URL path is in the hidden list
        const currentPath = event.urlAfterRedirects;

        // Use .some() to check if the current path starts with any of the hidden paths
        this.showHeaderFooter = !this.hideNavPath.some(path => currentPath.startsWith(path));
      });
  }

}
