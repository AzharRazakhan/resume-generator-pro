import { Injectable } from '@angular/core';
declare let pdfMake: any;

@Injectable({
    providedIn: 'root',
})
export class Pdf {

    private getDocumentDefinition(data: any) {

        return {
            images: {},
            pageBreakBefore: function (currentNode: any, newPage: any) {
                return currentNode.hasOwnProperty('pageBreak') && currentNode.pageBreak === 'before';
            },

            defaultStyle: {
                fontSize: 9.5,
                lineHeight: 1.2
            },
            pageMargins: [30, 30, 30, 30],

            content: [
                { text: data.name, style: 'header' },

                {
                    columns: [
                        {
                            width: '*',
                            stack: [
                                { text: data.designation, style: 'subheader' },
                                { text: data.summary, margin: [0, 5, 0, 5], style: 'bodyText' }
                            ]
                        },
                        {
                            width: 'auto',
                            stack: [
                                { text: data.email, style: 'contactInfo' },
                                { text: data.contact, style: 'contactInfo' },
                                { text: data.linkedin, style: 'contactInfoLink', link: `https://${data.linkedin}` },
                            ]
                        }
                    ],
                    columnGap: 10
                },

                {
                    canvas: [
                        {
                            type: 'line',
                            x1: 0, y1: 0,
                            x2: 535, y2: 0,
                            lineWidth: 0.5,
                            lineColor: '#000000'
                        }
                    ],
                    margin: [0, 5, 0, 5]
                },

                { text: 'WORK EXPERIENCE', style: 'sectionHeader' },
                ...data.workExperience.map((exp: any) => ({
                    margin: [0, 3, 0, 7],
                    stack: [
                        {
                            columns: [
                                { text: exp.role, bold: true, fontSize: 10 },
                                { text: `${exp.company} | ${exp.duration}`, alignment: 'right', color: '#666666', fontSize: 9 }
                            ],
                            margin: [0, 0, 0, 2]
                        },
                        { text: 'Achievements/Tasks', bold: true, fontSize: 9, margin: [0, 0, 0, 2] },
                        exp.points?.length ? { ul: exp.points, style: 'bodyText', margin: [5, 0, 0, 0] } : null
                    ]
                })),

                { text: 'PROJECTS', style: 'sectionHeader' },
                ...data.projects.map((p: any) => ({
                    margin: [0, 3, 0, 7],
                    stack: [
                        { text: p.title, bold: true, fontSize: 10 },
                        {
                            columns: [
                                { text: p.link || '', color: 'blue', decoration: 'underline', fontSize: 9 },
                                { text: `Role: ${p.role || 'N/A'} | Tech: ${p.tech || 'N/A'}`, alignment: 'right', color: '#666666', fontSize: 9 }
                            ],
                            margin: [0, 0, 0, 2]
                        },
                        { text: 'Tasks/Achievements', bold: true, fontSize: 9, margin: [0, 0, 0, 2] },
                        p.points?.length ? { ul: p.points, style: 'bodyText', margin: [5, 0, 0, 0] } : null
                    ]
                })),

                { text: 'EDUCATION', style: 'sectionHeader' },
                ...data.education.map((edu: any) => ({
                    margin: [0, 3, 0, 5],
                    text: `${edu.degree} - ${edu.institute} - ${edu.year} | CGPA: ${edu.cgpa}`,
                    fontSize: 10
                })),
                { text: data.address, style: 'bodyText', margin: [0, 0, 0, 5] },

                { text: 'SKILLS', style: 'sectionHeader' },
                {
                    stack: [
                        { text: [{ text: 'Frontend: ', bold: true }, { text: data?.skillsFrontend?.join(', ') }], style: 'skillLine' },
                        { text: [{ text: 'Backend: ', bold: true }, { text: data?.skillsBackend?.join(', ') }], style: 'skillLine' },
                        { text: [{ text: 'Database: ', bold: true }, { text: data?.skillsDatabase?.join(', ') }], style: 'skillLine' },
                        { text: [{ text: 'Tools & Version Control: ', bold: true }, { text: data?.skillsTools?.join(', ') }], style: 'skillLine' },
                    ],
                    margin: [0, 0, 0, 5]
                }
            ],

            styles: {
                header: { fontSize: 22, bold: true, margin: [0, 0, 0, 2] },
                subheader: { fontSize: 14, margin: [0, 0, 0, 0] },
                sectionHeader: { fontSize: 12, bold: true, decoration: 'underline', margin: [0, 10, 0, 5], color: '#000000' },
                contactInfo: { fontSize: 9, alignment: 'right', color: '#000000', margin: [0, 0, 0, 0] },
                contactInfoLink: { fontSize: 9, alignment: 'right', color: 'blue', decoration: 'underline', margin: [0, 0, 0, 5] },
                bodyText: { fontSize: 9.5 },
                skillLine: { fontSize: 9.5, margin: [0, 1, 0, 1] }
            }
        };
    }

    generateResumePDF(data: any) {
        const documentDefinition = this.getDocumentDefinition(data);
        pdfMake.createPdf(documentDefinition).download(`${data.name}-Resume.pdf`);
    }

    getResumePDFBase64(data: any, callback: (base64String: string) => void) {
        const documentDefinition = this.getDocumentDefinition(data);
        pdfMake.createPdf(documentDefinition).getBase64(callback);
    }
}