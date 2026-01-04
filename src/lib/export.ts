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
    const {
        Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
        Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType
    } = await import('docx');
    const { saveAs } = await import('file-saver');

    const { personal, summary, experiences, education, skills } = cvData;

    // Helper to format date
    const formatDate = (dateString: string): string => {
        if (!dateString) return '';
        const date = new Date(dateString + '-01');
        return date.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });
    };

    // --- Generators ---

    const generateProfessionalContent = () => {
        const sections: any[] = [];

        // Header - Name and Contact
        sections.push(
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
            sections.push(
                new Paragraph({
                    text: contactInfo,
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 200 },
                })
            );
        }

        // Professional Summary
        if (summary) {
            sections.push(
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
            sections.push(
                new Paragraph({
                    text: 'PENGALAMAN KERJA',
                    heading: HeadingLevel.HEADING_1,
                    spacing: { before: 300, after: 100 },
                })
            );

            experiences.forEach((exp) => {
                sections.push(
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
                    sections.push(
                        new Paragraph({
                            text: `• ${desc.replace(/^[-•]\s*/, '')} `,
                            spacing: { after: 50 },
                        })
                    );
                });

                sections.push(new Paragraph({ text: '', spacing: { after: 100 } }));
            });
        }

        // Education
        if (education.length > 0) {
            sections.push(
                new Paragraph({
                    text: 'PENDIDIKAN',
                    heading: HeadingLevel.HEADING_1,
                    spacing: { before: 300, after: 100 },
                })
            );

            education.forEach((edu) => {
                sections.push(
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
            sections.push(
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
                sections.push(
                    new Paragraph({
                        children: [
                            new TextRun({ text: 'Teknis: ', bold: true }),
                            new TextRun({ text: technicalSkills.map(s => s.name).join(', ') }),
                        ],
                    })
                );
            }

            if (softSkills.length > 0) {
                sections.push(
                    new Paragraph({
                        children: [
                            new TextRun({ text: 'Soft Skills: ', bold: true }),
                            new TextRun({ text: softSkills.map(s => s.name).join(', ') }),
                        ],
                    })
                );
            }

            if (languageSkills.length > 0) {
                sections.push(
                    new Paragraph({
                        children: [
                            new TextRun({ text: 'Bahasa: ', bold: true }),
                            new TextRun({ text: languageSkills.map(s => s.name).join(', ') }),
                        ],
                    })
                );
            }
        }

        return sections;
    };

    const generateCreativeContent = () => {
        const sections: any[] = [];
        const noBorder = { style: BorderStyle.NONE, size: 0, color: "auto" };

        // 1. Header (Name, Role, Contact) - Full Width
        sections.push(
            new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                borders: { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder, insideVertical: noBorder, insideHorizontal: noBorder },
                rows: [
                    new TableRow({
                        children: [
                            new TableCell({
                                shading: { fill: "333333", type: ShadingType.CLEAR, color: "auto" }, // Dark background
                                children: [
                                    new Paragraph({
                                        text: personal.fullName || 'Nama Lengkap',
                                        heading: HeadingLevel.TITLE,
                                        alignment: AlignmentType.LEFT,
                                        style: "Heading1Inverse" // Custom style we'll define or just manual coloring
                                    }),
                                    new Paragraph({
                                        text: cvData.settings.targetRole || '',
                                        heading: HeadingLevel.HEADING_2,
                                        alignment: AlignmentType.LEFT,
                                    }),
                                    new Paragraph({
                                        text: [
                                            personal.email ? ` ${personal.email}` : '',
                                            personal.phone ? ` ${personal.phone}` : '',
                                            personal.location ? ` ${personal.location}` : ''
                                        ].filter(Boolean).join(' | '),
                                        alignment: AlignmentType.LEFT,
                                        spacing: { before: 100 }
                                    }),
                                    new Paragraph({
                                        text: [
                                            personal.linkedin ? `🔗 ${personal.linkedin}` : '',
                                            personal.portfolio ? ` ${personal.portfolio}` : ''
                                        ].filter(Boolean).join(' | '),
                                        alignment: AlignmentType.LEFT,
                                    })
                                ],
                                margins: { top: 200, bottom: 200, left: 200, right: 200 },
                            })
                        ]
                    })
                ]
            }),
            new Paragraph({ text: "", spacing: { after: 200 } }) // Spacer
        );

        // 2. Two Column Layout (Main | Sidebar)
        const mainContent: any[] = [];
        const sidebarContent: any[] = [];

        // --- Main Content (Left) ---

        // Summary
        if (summary) {
            mainContent.push(
                new Paragraph({
                    text: 'TENTANG SAYA',
                    heading: HeadingLevel.HEADING_2,
                    spacing: { after: 100 },
                }),
                new Paragraph({
                    text: summary,
                    spacing: { after: 200 },
                })
            );
        }

        // Experience
        if (experiences.length > 0) {
            mainContent.push(
                new Paragraph({
                    text: 'PENGALAMAN KERJA',
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 200, after: 100 },
                })
            );
            experiences.forEach((exp) => {
                mainContent.push(
                    new Paragraph({
                        children: [
                            new TextRun({ text: exp.position, bold: true, size: 24 }),
                        ],
                        spacing: { before: 100 }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: exp.company, bold: true, color: "666666" }),
                            new TextRun({ text: ` | ${formatDate(exp.startDate)} - ${exp.endDate ? formatDate(exp.endDate) : 'Sekarang'}`, italics: true, size: 20 })
                        ]
                    }),
                    ...exp.description.filter(d => d.trim()).map(desc =>
                        new Paragraph({
                            text: `• ${desc.replace(/^[-•]\s*/, '')}`,
                            spacing: { after: 50 },
                            indent: { left: 200 }
                        })
                    ),
                    new Paragraph({ text: "", spacing: { after: 100 } })
                );
            });
        }

        // Education
        if (education.length > 0) {
            mainContent.push(
                new Paragraph({
                    text: 'PENDIDIKAN',
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 200, after: 100 },
                })
            );
            education.forEach((edu) => {
                mainContent.push(
                    new Paragraph({
                        children: [
                            new TextRun({ text: `${edu.degree} - ${edu.field}`, bold: true }),
                        ],
                        spacing: { before: 100 }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: `${edu.institution}${edu.gpa ? ` • IPK: ${edu.gpa}` : ''}`,
                                bold: true,
                                color: "666666"
                            })
                        ]
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: `${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}`,
                                italics: true,
                                size: 20
                            })
                        ],
                        spacing: { after: 100 }
                    })
                );
            });
        }


        // --- Sidebar Content (Right) ---
        if (skills.length > 0) {
            sidebarContent.push(
                new Paragraph({
                    text: 'KEAHLIAN',
                    heading: HeadingLevel.HEADING_2,
                    spacing: { after: 100 },
                })
            );

            const technicalSkills = skills.filter(s => s.category === 'technical');
            const softSkills = skills.filter(s => s.category === 'soft');
            const languageSkills = skills.filter(s => s.category === 'language');

            if (technicalSkills.length > 0) {
                sidebarContent.push(
                    new Paragraph({
                        children: [
                            new TextRun({ text: 'Teknis', bold: true })
                        ],
                        spacing: { before: 100 }
                    }),
                    new Paragraph({ text: technicalSkills.map(s => s.name).join(', ') })
                );
            }
            if (softSkills.length > 0) {
                sidebarContent.push(
                    new Paragraph({
                        children: [
                            new TextRun({ text: 'Soft Skills', bold: true })
                        ],
                        spacing: { before: 100 }
                    }),
                    new Paragraph({ text: softSkills.map(s => s.name).join(', ') })
                );
            }
            if (languageSkills.length > 0) {
                sidebarContent.push(
                    new Paragraph({
                        children: [
                            new TextRun({ text: 'Bahasa', bold: true })
                        ],
                        spacing: { before: 100 }
                    }),
                    new Paragraph({ text: languageSkills.map(s => s.name).join(', ') })
                );
            }
        }


        // Combine into 2-column table
        sections.push(
            new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                borders: { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder, insideVertical: noBorder, insideHorizontal: noBorder },
                rows: [
                    new TableRow({
                        children: [
                            new TableCell({
                                width: { size: 65, type: WidthType.PERCENTAGE },
                                children: mainContent,
                                margins: { right: 200 }
                            }),
                            new TableCell({
                                width: { size: 35, type: WidthType.PERCENTAGE },
                                shading: { fill: "F3F4F6", type: ShadingType.CLEAR, color: "auto" }, // Light gray sidebar
                                children: sidebarContent,
                                margins: { left: 200, top: 200, bottom: 200, right: 100 }
                            })
                        ]
                    })
                ]
            })
        );

        return sections;
    };

    // Determine template
    const isCreative = cvData.settings.template === 'creative-ats-02';
    const children = isCreative ? generateCreativeContent() : generateProfessionalContent();

    // Create document
    const doc = new Document({
        styles: {
            paragraphStyles: [
                {
                    id: "Heading1Inverse",
                    name: "Heading 1 Inverse",
                    basedOn: "Normal",
                    next: "Normal",
                    quickFormat: true,
                    run: {
                        size: 32,
                        bold: true,
                        color: "FFFFFF", // White text for header
                    },
                },
            ]
        },
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
