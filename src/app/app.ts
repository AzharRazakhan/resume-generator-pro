import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ResumeGenerator } from './resume-generator/resume-generator';
import { ResumePdf } from './resume-pdf/resume-pdf'
import { ResumeBuilder } from "./resume-builder/resume-builder";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ResumeBuilder, ReactiveFormsModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('resume-generator-pro');
}
