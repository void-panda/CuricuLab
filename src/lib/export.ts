// Export utilities for PDF and DOCX generation
import type { CVData } from '@/types/cv';

/**
 * Export CV to PDF using html2pdf.js
 */
export async function exportToPDF(cvData: CVData): Promise<void> {
    // Dynamic import to avoid SSR issues
    const html2pdf = (await import('html2pdf.js')).default;

    const element = document.getElementById('cv-preview');
    if (!element) {
        throw new Error('CV preview element not found');
    }

    const filename = `CV_${cvData.personal.fullName.replace(/\s+/g, '_') || 'Document'}.pdf`;

    const options = {
        margin: 10,
        filename,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: {
            scale: 2,
            useCORS: true,
            letterRendering: true,
        },
        jsPDF: {
            unit: 'mm' as const,
            format: 'a4' as const,
            orientation: 'portrait' as const,
        },
    };

    await html2pdf().set(options).from(element).save();
}

/**
 * Export CV to DOCX using docx library
 */
export async function exportToDOCX(cvData: CVData): Promise<void> {
    const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = await import('docx');
    const { saveAs } = await import('file-saver');

    const { personal, summary, experiences, education, skills } = cvData;

    // Helper to format date
    const formatDate = (dateString: string): string => {
        if (!dateString) return '';
        const date = new Date(dateString + '-01');
        return date.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });
    };

    // Build document sections
    const children: any[] = [];

    // Header - Name and Contact
    children.push(
        new Paragraph({
            text: personal.fullName || 'Nama Lengkap',
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
        })
    );

    const contactInfo = [
        personal.email,
        personal.phone,
        personal.location,
        personal.linkedin,
        personal.portfolio,
    ].filter(Boolean).join(' | ');

    if (contactInfo) {
        children.push(
            new Paragraph({
                text: contactInfo,
                alignment: AlignmentType.CENTER,
                spacing: { after: 200 },
            })
        );
    }

    // Professional Summary
    if (summary) {
        children.push(
            new Paragraph({
                text: 'RINGKASAN PROFESIONAL',
                heading: HeadingLevel.HEADING_1,
                spacing: { before: 300, after: 100 },
            }),
            new Paragraph({
                text: summary,
                spacing: { after: 200 },
            })
        );
    }

    // Experience
    if (experiences.length > 0) {
        children.push(
            new Paragraph({
                text: 'PENGALAMAN KERJA',
                heading: HeadingLevel.HEADING_1,
                spacing: { before: 300, after: 100 },
            })
        );

        experiences.forEach((exp) => {
            children.push(
                new Paragraph({
                    children: [
                        new TextRun({ text: exp.position, bold: true }),
                        new TextRun({ text: ` | ${formatDate(exp.startDate)} - ${exp.endDate ? formatDate(exp.endDate) : 'Sekarang'}` }),
                    ],
                }),
                new Paragraph({
                    text: `${exp.company}${exp.location ? ` • ${exp.location}` : ''}`,
                    spacing: { after: 100 },
                })
            );

            exp.description.filter(d => d.trim()).forEach((desc) => {
                children.push(
                    new Paragraph({
                        text: `• ${desc.replace(/^[-•]\s*/, '')}`,
                        spacing: { after: 50 },
                    })
                );
            });

            children.push(new Paragraph({ text: '', spacing: { after: 100 } }));
        });
    }

    // Education
    if (education.length > 0) {
        children.push(
            new Paragraph({
                text: 'PENDIDIKAN',
                heading: HeadingLevel.HEADING_1,
                spacing: { before: 300, after: 100 },
            })
        );

        education.forEach((edu) => {
            children.push(
                new Paragraph({
                    children: [
                        new TextRun({ text: `${edu.degree} - ${edu.field}`, bold: true }),
                        new TextRun({ text: ` | ${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}` }),
                    ],
                }),
                new Paragraph({
                    text: `${edu.institution}${edu.gpa ? ` • IPK: ${edu.gpa}` : ''}`,
                    spacing: { after: 100 },
                })
            );
        });
    }

    // Skills
    if (skills.length > 0) {
        children.push(
            new Paragraph({
                text: 'KEAHLIAN',
                heading: HeadingLevel.HEADING_1,
                spacing: { before: 300, after: 100 },
            })
        );

        const technicalSkills = skills.filter(s => s.category === 'technical');
        const softSkills = skills.filter(s => s.category === 'soft');
        const languageSkills = skills.filter(s => s.category === 'language');

        if (technicalSkills.length > 0) {
            children.push(
                new Paragraph({
                    children: [
                        new TextRun({ text: 'Teknis: ', bold: true }),
                        new TextRun({ text: technicalSkills.map(s => s.name).join(', ') }),
                    ],
                })
            );
        }

        if (softSkills.length > 0) {
            children.push(
                new Paragraph({
                    children: [
                        new TextRun({ text: 'Soft Skills: ', bold: true }),
                        new TextRun({ text: softSkills.map(s => s.name).join(', ') }),
                    ],
                })
            );
        }

        if (languageSkills.length > 0) {
            children.push(
                new Paragraph({
                    children: [
                        new TextRun({ text: 'Bahasa: ', bold: true }),
                        new TextRun({ text: languageSkills.map(s => s.name).join(', ') }),
                    ],
                })
            );
        }
    }

    // Create document
    const doc = new Document({
        sections: [{
            children,
        }],
    });

    // Generate and save
    const blob = await Packer.toBlob(doc);
    const filename = `CV_${personal.fullName.replace(/\s+/g, '_') || 'Document'}.docx`;
    saveAs(blob, filename);
}
