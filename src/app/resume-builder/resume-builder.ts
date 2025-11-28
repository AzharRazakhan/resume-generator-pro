import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// MODEL TYPES (Angular 20 strict-typed forms)
export interface Experience {
  role: FormControl<string>;
  company: FormControl<string>;
  duration: FormControl<string>;
  points: FormArray<FormControl<string>>;
}

export interface Project {
  name: FormControl<string>;
  link: FormControl<string>;
  desc: FormControl<string>;
}

@Component({
  selector: 'app-resume-builder',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './resume-builder.html',
  styleUrls: ['./resume-builder.scss'],
})
export class ResumeBuilder implements OnInit {
  @ViewChild('resumeContent', { static: false }) resumeContent!: ElementRef;



  resumeData = {
    name: "AZHAR KHAN",
    title: "Full Stack Developer",

    summary: `Full Stack Developer with 3+ years of experience building responsive, scalable applications using Angular (v2–19), React.js, Node.js, Express.js, TypeScript, and MongoDB/MySQL. Skilled in REST APIs, JWT authentication, state management (RxJS/NgRx), reusable
components, and performance optimization with clean, maintainable architecture.`,

    contact: {
      email: "azharrazakhan78611@gmail.com",
      phone: "9826108734",
      location: "Indore, India",
      linkedin: "linkedin.com/in/azhar-khan-aa13aa187"
    },

    experience: [
      {
        role: "Full Stack Developer",
        company: "Shiwansh Solutions",
        duration: "04/2025 - Present",
        points: [
          "Developed scalable web modules using Angular 13 , React.js , and Node.js , improving UI/UX and maintainability.",
          "Enhanced performance with lazy loading, component refactoring, and OnPush change detection",
          "Built secure, optimized REST APIs with JWT authentication ,interceptors, and robust error - handling flows.",
          "Built responsive, reusable UI components using Angular Material, Bootstrap, and custom design systems",
          "Collaborated with backend teams, resolved bugs, improved UX flows, and ensured timely sprint deliveries."
        ]
      },
      {
        role: "MEAN Stack Developer",
        company: "Thoughtwin IT Solution",
        duration: "01/2023 - 04/2025",
        points: [
          "Developed scalable web modules using Angular 13 , React.js , and Node.js , improving UI/UX and maintainability.",
          "Enhanced performance with lazy loading, component refactoring, and OnPush change detection",
          "Built secure, optimized REST APIs with JWT authentication ,interceptors, and robust error - handling flows.",
          "Built responsive, reusable UI components using Angular Material, Bootstrap, and custom design systems",
          "Collaborated with backend teams, resolved bugs, improved UX flows, and ensured timely sprint deliveries."
        ]
      },
      {
        role: "Angular Developer",
        company: "CDN Solutions Group",
        duration: "05/2022 - 11/2022",
        points: [
          "Built reusable UI components in Angular 12 to streamline user interface.",
          "Collaborated with backend developers for seamless API integration."
        ]
      }
    ],

    education: {
      course: "Bachelor of Engineering (Computer Science)",
      university: "RGPV University",
      year: "2019",
      cgpa: "6.3"
    },

    skills: {
      frontend: "Angular(v2+), React.js, HTML5, CSS3, JavaScript, TypeScript, Bootstrap ,Rxjs,Ngrx,RESTful Services, ",
      backend: "Node.js, Express.js, JWT, RBAC, REST APIs",
      database: "MySQL, MongoDB, MS SQL, PostgreSQL",
      tools: "Git, GitHub, VS Code, Postman, Swagger, Jira, CI/CD"
    },

    certificates: [
      {
        name: "Certified MEAN Stack Developer",
        issuedBy: "Simplilearn",
        year: "2023"
      },
      {
        name: "Certified MERN Stack Web Developer",
        issuedBy: "Udemy",
        year: "2024"
      }

    ],

    projects: [
      {
        name: "Enriched Academy – Education Platform",
        link: "https://www.enrichedacademy.com/",
        desc: "Developed core frontend modules for course management, coaching content, and user dashboards using Angular 13. Integrated secure REST APIs for authentication and progress tracking.Improved responsive UI, cross- device compatibility, and performance with reusable components,lazy loading, and optimized state handling in an Agile MEAN Stack environment."
      },
      {
        name: "MyReferral – Real Estate Referral Platform",
        desc: "Built a real estate web platform for property listings, referral tracking, and user management . Developed scalable admin and client- facing modules using Angular 12 with reusable components.Integrated secure REST APIs and backend logic for dynamic data handling.Delivered a fully responsive, high- performance UI optimized for cross - device usage in an Agile MEAN Stack environment."
      },
      {
        name: "Perimi Admin Panel – Quiz Management System",
        desc: "Developed a scalable admin dashboard for managing quiz categories, questions, scoring, and user results .Built reusable Angular components and services for real - time data interaction and smooth workflows.Ensured responsive, mobile- friendly UI with optimized performance. Integrated secure REST APIs and structured backend logic in an Agile MEAN Stack environment."
      }
    ]
  };
  resumeForm!: FormGroup<any>;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.resumeForm = this.fb.group({
      name: this.fb.control('', { nonNullable: true }),
      title: this.fb.control('', { nonNullable: true }),
      summary: this.fb.control('', { nonNullable: true }),

      email: this.fb.control('', { nonNullable: true }),
      phone: this.fb.control('', { nonNullable: true }),
      location: this.fb.control('', { nonNullable: true }),
      linkedin: this.fb.control('', { nonNullable: true }),

      frontendSkills: this.fb.control('', { nonNullable: true }),
      backendSkills: this.fb.control('', { nonNullable: true }),
      databaseSkills: this.fb.control('', { nonNullable: true }),
      tools: this.fb.control('', { nonNullable: true }),

      experience: this.fb.array<FormGroup<Experience>>([]),
      projects: this.fb.array<FormGroup<Project>>([]),
      education: this.fb.array([]),
      certificates: this.fb.array([]),
      skills: this.fb.array<FormGroup<any>>([]),
    });

    this.loadEducationFromData();
    this.addCertificate();
    this.loadSkills();

    // Load Data
    this.setResumeData();
  }
  // ======= Education Methods =======
  get education(): FormArray<FormGroup> {
    return this.resumeForm.get('education') as FormArray<FormGroup>;
  }
  loadSkills() {
    const skills = this.resumeData.skills;
    Object.keys(skills).forEach((key: string) => {
      const group = this.fb.group({
        title: this.fb.control(key.toUpperCase()[0] + key.slice(1), { nonNullable: true }),
        list: this.fb.array([])
      });
      const items = skills[key as keyof typeof skills]?.split(",") || [];
      items.forEach(s => {
        (group.get('list') as FormArray).push(
          this.fb.control(s.trim(), { nonNullable: true })
        );
      });

      this.skills.push(group);
    });
  }

  get skills(): FormArray<FormGroup> {
    return this.resumeForm.get('skills') as FormArray<FormGroup>;
  }
  getSkillItems(group: AbstractControl): FormArray<FormControl<string>> {
    return group.get('list') as FormArray<FormControl<string>>;
  }

  getSkillLine(group: AbstractControl<any>): string {
    const items = this.getSkillItems(group).controls.map((c: any) => c.value);
    return items.join(', ');
  }
  // Add Education dynamically
  addEducation(edu?: any) {
    const group = this.fb.group({
      course: this.fb.control(edu?.course ?? '', { nonNullable: true }),
      university: this.fb.control(edu?.university ?? '', { nonNullable: true }),
      year: this.fb.control(edu?.year ?? '', { nonNullable: true }),
      score: this.fb.control(edu?.cgpa ?? '', { nonNullable: true }) // rename to score
    });
    this.education.push(group);
  }

  // Remove Education
  removeEducation(index: number) {
    this.education.removeAt(index);
  }

  // GETTERS (fully typed)
  get experience(): FormArray<FormGroup<Experience>> {
    return this.resumeForm.get('experience') as FormArray<FormGroup<Experience>>;
  }

  get projects(): FormArray<FormGroup<Project>> {
    return this.resumeForm.get('projects') as FormArray<FormGroup<Project>>;
  }

  // ADD EXPERIENCE
  addExperience(exp?: any) {
    const group: any = this.fb.group({
      role: this.fb.control(exp?.role ?? '', { nonNullable: true }),
      company: this.fb.control(exp?.company ?? '', { nonNullable: true }),
      duration: this.fb.control(exp?.duration ?? '', { nonNullable: true }),
      points: this.fb.array(
        exp?.points?.map((p: string) => this.fb.control(p, { nonNullable: true })) ?? [this.fb.control('', { nonNullable: true })]
      )
    });
    this.experience.push(group);
  }

  addPoint(expIndex: number) {
    this.getPoints(this.experience.at(expIndex)).push(this.fb.control('', { nonNullable: true }));
  }

  removePoint(expIndex: number, pointIndex: number) {
    this.getPoints(this.experience.at(expIndex)).removeAt(pointIndex);
  }
  getPoints(exp: FormGroup<Experience>): FormArray<FormControl<string>> {
    return exp.get('points') as FormArray<FormControl<string>>;
  }

  loadEducationFromData() {
    if (this.resumeData.education) {
      this.addEducation({
        ...this.resumeData.education,
        score: this.resumeData.education.cgpa
      });
    }
  }



  addSkillCategory() {
    const group = this.fb.group({
      title: this.fb.control('', { nonNullable: true }),
      list: this.fb.array<FormControl<string>>([])
    });

    this.skills.push(group);
  }

  addSkillItem(i: number) {
    this.getSkillItems(this.skills.at(i)).push(
      this.fb.control('', { nonNullable: true })
    );
  }

  removeSkillItem(i: number, j: number) {
    this.getSkillItems(this.skills.at(i)).removeAt(j);
  }

  removeSkillCategory(i: number) {
    this.skills.removeAt(i);
  }



  formatLinkedIn(link: string) {
    if (!link) return '';
    if (link.startsWith('http')) return link;
    return 'https://' + link;   // Auto-add https:// if missing
  }



  removeExperience(i: number) {
    this.experience.removeAt(i);
  }

  // ADD PROJECT
  addProject() {
    const group: any = this.fb.group<any>({
      name: this.fb.control(''),
      link: this.fb.control(''),
      desc: this.fb.control('')
    });
    this.projects.push(group);
  }

  removeProject(i: number) {
    this.projects.removeAt(i);
  }

  get certificates(): FormArray<FormGroup> {
    return this.resumeForm.get('certificates') as FormArray<FormGroup>;
  }

  addCertificate() {
    this.certificates.push(
      this.fb.group({
        name: [''],
        issuedBy: [''],
        year: ['']
      })
    );
  }

  removeCertificate(index: number) {
    this.certificates.removeAt(index);
  }

  // GENERATE PDF
  /*
  generatePDF() {
    if (!this.resumeContent) return;
  
    html2canvas(this.resumeContent.nativeElement, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL('image/png', 0.6);
      const pdf = new jsPDF('p', 'pt', 'a4', compress: true);
      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;
  
      pdf.addImage(imgData, 'PNG', 0, 0, width, height);
      pdf.save(this.resumeData.name);
    });
  }
  */

  generatePDF() {
    if (!this.resumeContent) {
      console.error("resumeContent is NOT found");
      return;
    }

    const element = this.resumeContent.nativeElement;

    const options = {
      backgroundColor: "#ffffff",
      scale: 3, // Higher DPI → Clearer text
      useCORS: true,
      logging: false
    };

    html2canvas(element, options).then(canvas => {
      const imgData = canvas.toDataURL('image/png', 1.0); // Max quality

      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'pt',
        format: 'a4',
        compress: true
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');

      pdf.save(`${this.resumeData.name}-Resume.pdf`);
    });
  }


  openLinkedIn() {
    let url = this.resumeForm.value.linkedin;

    // Auto add https:// if missing
    if (url && !url.startsWith('http')) {
      url = 'https://' + url;
    }

    window.open(url, "_blank");
  }


  setResumeData() {
    this.resumeForm.patchValue({
      name: this.resumeData.name,
      title: this.resumeData.title,
      summary: this.resumeData.summary,

      email: this.resumeData.contact.email,
      phone: this.resumeData.contact.phone,
      location: this.resumeData.contact.location,
      linkedin: this.resumeData.contact.linkedin,

      frontendSkills: this.resumeData.skills.frontend,
      backendSkills: this.resumeData.skills.backend,
      databaseSkills: this.resumeData.skills.database,
      tools: this.resumeData.skills.tools
    });

    // Populate Experience
    this.resumeData.experience.forEach(exp => this.addExperience(exp));

    // Projects
    this.resumeData.projects.forEach(p => {
      const group = this.fb.group<Project>({
        name: this.fb.control(p.name, { nonNullable: true }),
        link: this.fb.control(p.link ?? '', { nonNullable: true }),
        desc: this.fb.control(p.desc, { nonNullable: true })
      });
      this.projects.push(group);
    });
    this.certificates.clear();

    this.resumeData.certificates.forEach((t) => {
      const group = this.fb.group<any>({
        name: this.fb.control(t.name, { nonNullable: true }),
        issuedBy: this.fb.control(t.issuedBy ?? '', { nonNullable: true }),
        year: this.fb.control(t.year, { nonNullable: true })
      });
      this.certificates.push(group);
    })
  }
}
