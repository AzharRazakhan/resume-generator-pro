import { Component, DoCheck, OnChanges, OnInit, SimpleChanges, Pipe, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { resumeData } from '../data/resume-data';
import { Experience, Project } from '../interface/resume.interface';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProfileService } from '../Service/profile-service';
import { Api } from '../auth/api';
import { catchError, debounceTime, of, Subject, Subscription, switchMap } from 'rxjs';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit, OnDestroy {
  //resumeData = resumeData;
  resumeForm!: FormGroup<any>
  userId: any;
  resumeId: any;
  private changes$ = new Subject<any>();
  private changesSub?: Subscription;
  constructor(private fb: FormBuilder,
    private router: Router,
    private profileServ: ProfileService,
    private api: Api
  ) { }


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
      education: this.fb.array<FormGroup<any>>([]),
      certificates: this.fb.array([]),
      skills: this.fb.array<FormGroup<any>>([]),
    });
    this.addCertificate();
    this.changesSub = this.changes$
      .pipe(
        debounceTime(700),
        switchMap(value => {
          console.log(value, '---000---')
          const payload = this.mapFormToPayload(value);

          if (this.resumeId) {
            console.log(this.resumeId, 'resu---')
            return this.profileServ.updateResume(this.resumeId, payload)
              .pipe(catchError(err => { console.error(err); return of(null); }));
          } else {
            payload.userId = this.userId;
            return this.profileServ.addResume(payload)
              .pipe(catchError(err => { console.error(err); return of(null); }));
          }
        })
      )
      .subscribe(res => {
        if (res && !this.resumeId && res.id) {
          this.resumeId = res.id;  // auto-set after create
          console.log("Resume created, ID =", this.resumeId);
        }
      });


    this.loadResume();
  }
  // ======= Education Methods =======
  get education(): FormArray<FormGroup> {
    return this.resumeForm.get('education') as FormArray<FormGroup>;
  }
  loadSkills(data: any) {
    const skills: any = data.skills;
    Object.keys(skills).forEach((key: string) => {
      const items = skills[key].split(",").map((s: any) => s.trim());
      const fullTitle =
        key.charAt(0).toUpperCase() + key.slice(1) + ": " + items.join(", ");

      const group = this.fb.group({
        title: this.fb.control(fullTitle)
      });

      this.skills.push(group);
    });
  }


  loadResume() {
    this.userId = this.api.getUser()?.userId;

    this.profileServ.getResumeById(this.userId).subscribe({
      next: (res: any) => {
        console.log(res, 'res---')
        this.resumeId = res.id;

        // Patch form with API data
        this.setResumeData(res);

        console.log("Resume loaded, ID =", this.resumeId);
      },
      error: (err) => {
        if (err.status === 404) {
          const payload = this.mapFormToPayload(this.resumeForm.value);
          payload.userId = this.userId;

          this.profileServ.addResume(payload).subscribe(created => {
            this.resumeId = created.id;
            console.log("Created new resume, ID =", this.resumeId);
          });
        } else {
          console.error(err);
        }
      }
    });
  }
  private mapFormToPayload(value: any) {
    const normalize = (v: any) =>
      Array.isArray(v) ? v.join(', ') : (v || '');

    return {
      id: this.resumeId ?? 0,
      userId: this.userId,

      name: value.name,
      title: value.title,
      summary: value.summary,

      contact: {
        email: value.email,
        phone: value.phone,
        location: value.location,
        linkedin: value.linkedin
      },

      skills: {
        frontend: normalize(value.frontendSkills),
        backend: normalize(value.backendSkills),
        database: normalize(value.databaseSkills),
        tools: normalize(value.tools)
      },

      experience: value.experience.map((e: any) => ({
        role: e.role,
        company: e.company,
        duration: e.duration,
        points: e.points
      })),

      projects: value.projects.map((p: any) => ({
        name: p.name,
        link: p.link,
        desc: p.desc
      })),

      certificates: value.certificates,

      education: value.education.map((e: any) => ({
        course: e.course,
        university: e.university,
        year: e.year,
        cgpa: e.score
      }))
    };
  }





  get contactCount(): number {
    let count = 0;
    const v = this.resumeForm.value;

    if (v.email?.trim()) count++;
    if (v.phone?.trim()) count++;
    if (v.location?.trim()) count++;
    if (v.linkedin?.trim()) count++;

    return count;
  }

  get skills(): FormArray<FormGroup> {
    return this.resumeForm.get('skills') as FormArray<FormGroup>;
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


  addSkillCategory() {
    const group = this.fb.group({
      title: this.fb.control('', { nonNullable: true }),
      list: this.fb.array<FormControl<string>>([])
    });

    this.skills.push(group);
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

  openLinkedIn() {
    let url = this.resumeForm.value.linkedin;

    // Auto add https:// if missing
    if (url && !url.startsWith('http')) {
      url = 'https://' + url;
    }
    window.open(url, "_blank");
  }


  setResumeData(data: any) {
    this.resumeForm.patchValue({
      name: data.name,
      title: data.title,
      summary: data.summary,

      email: data.contact.email,
      phone: data.contact.phone,
      location: data.contact.location,
      linkedin: data.contact.linkedin,

      frontendSkills: data.skills.frontend,
      backendSkills: data.skills.backend,
      databaseSkills: data.skills.database,
      tools: data.skills.tools
    });

    // Populate Experience
    data.experience.forEach((exp: any) => this.addExperience(exp));

    // Projects
    data.projects.forEach((p: any) => {
      const group = this.fb.group<Project>({
        name: this.fb.control(p.name, { nonNullable: true }),
        link: this.fb.control(p.link ?? '', { nonNullable: true }),
        desc: this.fb.control(p.desc, { nonNullable: true })
      });
      this.projects.push(group);
    });
    this.certificates.clear();

    data.certificates.forEach((t: any) => {
      const group = this.fb.group<any>({
        name: this.fb.control(t.name, { nonNullable: true }),
        issuedBy: this.fb.control(t.issuedBy ?? '', { nonNullable: true }),
        year: this.fb.control(t.year, { nonNullable: true })
      });
      this.certificates.push(group);
    })
    data.education.forEach((s: any) => {
      const group = this.fb.group<any>({
        course: this.fb.control(s.course, { nonNullable: true }),
        university: this.fb.control(s.university ?? '', { nonNullable: true }),
        year: this.fb.control(s.year, { nonNullable: true }),
        score: this.fb.control(s.cgpa, { nonNullable: true }),

      });
      this.education.push(group);
    })
  }

  goToMyProfile() {
    this.router.navigate(['myprofile'])
  }


  addResumeOrUpdateResume(resumeId: any, value: any) {
    this.profileServ.updateResume(resumeId, value).subscribe((res) => {
      console.log("Updated Successfully:", res);
    });
  }
  onFormChange() {
    if (!this.resumeId) {
      // CREATE FIRST
      this.profileServ.addResume(this.resumeForm.value)
        .subscribe((res: any) => {
          this.resumeId = res.id;
        });
    } else {
      // UPDATE
      this.profileServ.updateResume(this.resumeId, this.resumeForm.value)
        .subscribe();
    }
  }





  ngOnDestroy() {
    this.changesSub?.unsubscribe();
  }



}
