import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-resume-pdf',
  imports: [CommonModule],
  templateUrl: './resume-pdf.html',
  styleUrl: './resume-pdf.scss',
})
export class ResumePdf {

  resumeData = {
    name: "AZHAR KHAN",
    title: "Full Stack Developer",

    summary: `Full Stack Developer with 3+ years of experience building responsive, scalable applications using Angular (v2–19),
React.js, Node.js, Express.js, TypeScript, and MongoDB/MySQL. Skilled in REST APIs, JWT authentication,
state management, reusable components, and performance optimization.`,

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
          "Developed scalable web modules using Angular 13, React.js, Node.js.",
          "Enhanced performance using lazy loading & OnPush strategy.",
          "Implemented JWT authentication, interceptors, error handling.",
          "Built responsive UI components with Angular Material & Bootstrap."
        ]
      },
      {
        role: "MEAN Stack Developer",
        company: "Thoughtwin IT Solution",
        duration: "01/2023 - 04/2025",
        points: [
          "Developed scalable modules using Angular 13, React.js, Node.js.",
          "Optimized performance with lazy loading & refactoring.",
          "Integrated secure REST APIs with JWT & interceptors.",
          "Built reusable UI components and improved UX flows."
        ]
      },
      {
        role: "Angular Developer",
        company: "CDN Solutions Group",
        duration: "05/2022 - 11/2022",
        points: [
          "Built reusable UI components in Angular 12.",
          "Collaborated for seamless API integration."
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
      frontend: "Angular, React.js, HTML, CSS, TypeScript, JavaScript, Bootstrap, RxJS, NgRx",
      backend: "Node.js, Express.js, JWT, RBAC, REST APIs",
      database: "MySQL, MongoDB, MS SQL, PostgreSQL",
      tools: "Git, GitHub, VS Code, Postman, Swagger, Jira, CI/CD"
    },

    projects: [
      {
        name: "Enriched Academy – Education Platform",
        link: "https://www.enrichedacademy.com/",
        desc: "Developed core modules, dashboards, authentication, and responsive UI with Angular 13."
      },
      {
        name: "MyReferral – Real Estate Referral Platform",
        desc: "Built property listings, referral tracking, and admin modules using Angular 12 + MongoDB."
      },
      {
        name: "Perimi Admin Panel – Quiz Management System",
        desc: "Developed admin dashboard for quiz categories, scoring, real-time workflows."
      }
    ]
  };
  generatePDF() {
    html2canvas(document.getElementById('resumeContent')!, {
      scale: 2,                 // high quality
      allowTaint: true,
      useCORS: true,
      scrollY: -window.scrollY  // IMPORTANT: capture full element
    }).then(canvas => {

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'pt', 'a4');

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = canvas.height * pdfWidth / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('Azhar-Khan-Resume.pdf');
    });
  }
}
