import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SafeUrlPipe } from '../pipe/safe-url.pipe';
import { SafeUrl } from '@angular/platform-browser';
import { Pdf } from '../Service/pdf';

@Component({
  selector: 'app-resume-generator',
  imports: [FormsModule, ReactiveFormsModule, CommonModule, SafeUrlPipe],
  templateUrl: './resume-generator.html',
  styleUrl: './resume-generator.scss',
})
export class ResumeGenerator implements OnInit {

  pdfPreviewUrl: SafeUrl | null = null;
  pdfSrc: string = '';
  skillsString: string = '';


  resumeData: any = {
    name: "AZHAR KHAN",
    designation: "Full Stack Developer",
    email: "azharrazakhan78611@gmail.com",
    contact: "9826108734",
    address: "Indore, India",
    linkedin: "linkedin.com/in/azhar-khan-aa13aa187",
    summary: "Full Stack Developer with 3+ years of experience building responsive, scalable applications...",
    skillsFrontend: ["Angular(v2–19)", "React.js", "HTML5", "CSS3", "JS", "RxJS", "NgRx"],
    skillsBackend: ["Node.js", "Express.js", "JWT Auth", "REST APIs"],
    skillsDatabase: ["MySQL", "MongoDB", "PostgreSQL", "MS SQL"],
    skillsTools: ["Git", "GitHub", "VS Code", "Postman"],

    workExperience: [
      { role: "Full Stack Developer", company: "Shiwansh Solutions", duration: "04/2025 - Present", points: ["Developed scalable modules in Angular & React."], pointsString: "Developed scalable modules in Angular & React." },
      { role: "MEAN Stack Developer", company: "Thoughtwin IT Solution", duration: "01/2023 - 04/2025", points: ["Built Angular components with reusable architecture."], pointsString: "Built Angular components with reusable architecture." },
      { role: "Angular Developer", company: "CDN Solutions", duration: "05/2022 - 11/2022", points: ["Developed reusable UI components in Angular 12."], pointsString: "Developed reusable UI components in Angular 12." }
    ],

    projects: [
      { title: "Enriched Academy - Education Platform", link: "https://www.enrichedacademy.com/", points: ["Developed core education modules using Angular."], pointsString: "Developed core education modules using Angular." },
      { title: "MyReferral – Real Estate Platform", link: "", points: ["Built referral and property listing modules."], pointsString: "Built referral and property listing modules." }
    ],

    education: [
      { degree: "Bachelor of Engineering (Computer Science)", institute: "RGPV University", year: "2019" }
    ],
  };



  constructor(private pdfService: Pdf) {
    this.resumeData.workExperience.forEach((exp: any) => exp.pointsString = exp.points.join(','));
    this.resumeData.projects.forEach((p: any) => p.pointsString = p.points.join(','));
  }

  ngOnInit() {
    this.onPreviewClick()
  }
  // ------------------------------------------------------------------
  // METHODS TO HANDLE POINT STRINGS AND PREVIEW
  // ------------------------------------------------------------------

  updateSkills() {
    this.resumeData.skillsFrontend =
      this.skillsString.split(',')
        .map(s => s.trim())
        .filter(Boolean);

    this.onUpdatePreview();
  }

  updateExperiencePoints(exp: any) {
    // Split the string and map/trim the points in TypeScript
    exp.points = exp.pointsString ? exp.pointsString.split(',').map((p: string) => p.trim()) : [];
    this.onUpdatePreview();
  }

  updateProjectPoints(p: any) {
    // Split the string and map/trim the points in TypeScript
    p.points = p.pointsString ? p.pointsString.split(',').map((p: string) => p.trim()) : [];
    this.onUpdatePreview();
  }

  private prepareDataForPDF(): any {
    return JSON.parse(JSON.stringify(this.resumeData));
  }


  onPreviewClick() {
    this.onUpdatePreview();
  }

  // ---------- Dynamic Add / Remove ----------
  addExperience() {
    this.resumeData.workExperience.push({ role: '', company: '', duration: '', points: [], pointsString: '' });
    this.onUpdatePreview();
  }

  removeExperience(i: number) {
    this.resumeData.workExperience.splice(i, 1);
    this.onUpdatePreview();
  }

  addProject() {
    this.resumeData.projects.push({ title: '', link: '', points: [], pointsString: '' });
    this.onUpdatePreview();
  }

  removeProject(i: number) {
    this.resumeData.projects.splice(i, 1);
    this.onUpdatePreview();
  }

  addEducation() {
    this.resumeData.education.push({ degree: '', institute: '', year: '' });
    this.onUpdatePreview();
  }

  removeEducation(i: number) {
    this.resumeData.education.splice(i, 1);
    this.onUpdatePreview();
  }


  onUpdatePreview() {
    this.generatePreview();
  }

  generatePreview() {
    const data = this.prepareDataForPDF();
    this.pdfService.getResumePDFBase64(data, (base64String: string) => {
      this.pdfSrc = 'data:application/pdf;base64,' + base64String;
    });
  }

  generatePDF() {
    const data = this.prepareDataForPDF();
    this.pdfService.generateResumePDF(data);
  }

  // Helper function for base64 conversion (needed for PDF preview)
  private base64ToBlob(base64: string, type: string): Blob {
    const byteCharacters = atob(base64);
    const byteArrays = [];
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArrays.push(byteCharacters.charCodeAt(i));
    }
    return new Blob([new Uint8Array(byteArrays)], { type });
  }
}
