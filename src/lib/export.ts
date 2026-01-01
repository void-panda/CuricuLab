// Export utilities for PDF and DOCX generation
import type { CVData } from '@/types/cv';
import React from 'react';

/**
 * Export CV to PDF using @react-pdf/renderer (Real Selectable Text)
 */
export async function exportToPDF(cvData: CVData): Promise<void> {
    const { pdf } = await import('@react-pdf/renderer');
    const { saveAs } = await import('file-saver');

    // Import PDF templates
    const { CreativeATS01PDF } = await import('@/components/templates/pdf/CreativeATS01PDF');
    const { CreativeATS02PDF } = await import('@/components/templates/pdf/CreativeATS02PDF');

    const exportOptions = cvData.settings.exportOptions || {
        margin: 'normal' as const,
        pageSize: 'a4' as const,
        filenamePrefix: 'CV'
    };
    const { filenamePrefix } = exportOptions;

    const filename = `${filenamePrefix}_${cvData.personal.fullName.replace(/\s+/g, '_') || 'Document'}.pdf`;

    // Map template to its PDF component
    let PDFComponent = CreativeATS01PDF;
    if (cvData.settings.template === 'creative-ats-02') {
        PDFComponent = CreativeATS02PDF;
    }

    try {
        // Generate PDF blob
        const blob = await pdf(React.createElement(PDFComponent, { data: cvData }) as any).toBlob();
        saveAs(blob, filename);
    } catch (error) {
        console.error('PDF generation error:', error);
        throw error;
    }
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
                        new TextRun({ text: ` | ${formatDate(exp.startDate)} - ${exp.endDate ? formatDate(exp.endDate) : 'Sekarang'} ` }),
                    ],
                }),
                new Paragraph({
                    text: `${exp.company}${exp.location ? ` • ${exp.location}` : ''} `,
                    spacing: { after: 100 },
                })
            );

            exp.description.filter(d => d.trim()).forEach((desc) => {
                children.push(
                    new Paragraph({
                        text: `• ${desc.replace(/^[-•]\s*/, '')} `,
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
                        new TextRun({ text: `${edu.degree} - ${edu.field} `, bold: true }),
                        new TextRun({ text: ` | ${formatDate(edu.startDate)} - ${formatDate(edu.endDate)} ` }),
                    ],
                }),
                new Paragraph({
                    text: `${edu.institution}${edu.gpa ? ` • IPK: ${edu.gpa}` : ''} `,
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
    const { filenamePrefix } = cvData.settings.exportOptions || { filenamePrefix: 'CV' };
    const filename = `${filenamePrefix}_${personal.fullName.replace(/\s+/g, '_') || 'Document'}.docx`;
    saveAs(blob, filename);
}
