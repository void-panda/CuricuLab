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

    const { personal, summary, experiences, education, skills, certifications, settings } = cvData;
    const { theme } = settings;

    // Theme Mappings
    const primaryColor = (theme.primaryColor || '#111827').replace('#', '');

    const fontMap: Record<string, string> = {
        'font-sans': 'Arial',
        'font-serif': 'Times New Roman',
        'font-mono': 'Courier New'
    };
    const headingFont = fontMap[theme.fontHeading || 'font-sans'] || 'Arial';
    const bodyFont = fontMap[theme.fontBody || 'font-sans'] || 'Arial';

    const spacingMultipliers = {
        compact: 0.6,
        normal: 1,
        relaxed: 1.4
    };
    const spacingFactor = spacingMultipliers[theme.spacing || 'normal'] || 1;

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
                children: [
                    new TextRun({
                        text: personal.fullName || 'Nama Lengkap',
                        bold: true,
                        size: 32,
                        font: headingFont,
                        color: primaryColor,
                    })
                ],
                alignment: AlignmentType.CENTER,
                spacing: { before: 0, after: 120 * spacingFactor },
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
                    children: [
                        new TextRun({
                            text: contactInfo,
                            font: bodyFont,
                            size: 18,
                        })
                    ],
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 200 * spacingFactor },
                })
            );
        }

        // Professional Summary
        if (summary) {
            sections.push(
                new Paragraph({
                    children: [
                        new TextRun({
                            text: 'RINGKASAN PROFESIONAL',
                            bold: true,
                            font: headingFont,
                            color: primaryColor,
                            size: 24,
                        })
                    ],
                    spacing: { before: 300 * spacingFactor, after: 100 * spacingFactor },
                }),
                new Paragraph({
                    children: [
                        new TextRun({
                            text: summary,
                            font: bodyFont,
                            size: 20,
                        })
                    ],
                    spacing: { after: 200 * spacingFactor },
                })
            );
        }

        // Experience
        if (experiences.length > 0) {
            sections.push(
                new Paragraph({
                    children: [
                        new TextRun({
                            text: 'PENGALAMAN KERJA',
                            bold: true,
                            font: headingFont,
                            color: primaryColor,
                            size: 24,
                        })
                    ],
                    spacing: { before: 300 * spacingFactor, after: 100 * spacingFactor },
                })
            );

            experiences.forEach((exp) => {
                sections.push(
                    new Paragraph({
                        children: [
                            new TextRun({ text: exp.position, bold: true, font: headingFont, size: 21 }),
                            new TextRun({ text: ` | ${formatDate(exp.startDate)} - ${exp.endDate ? formatDate(exp.endDate) : 'Sekarang'} `, font: bodyFont, size: 18, italics: true }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: `${exp.company}${exp.location ? ` • ${exp.location}` : ''} `,
                                font: bodyFont,
                                size: 19,
                                italics: true,
                                color: '666666'
                            })
                        ],
                        spacing: { after: 100 * spacingFactor },
                    })
                );

                exp.description.filter(d => d.trim()).forEach((desc) => {
                    sections.push(
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: `• ${desc.replace(/^[-•]\s*/, '')} `,
                                    font: bodyFont,
                                    size: 18,
                                })
                            ],
                            spacing: { after: 50 * spacingFactor },
                        })
                    );
                });

                sections.push(new Paragraph({ text: '', spacing: { after: 100 * spacingFactor } }));
            });
        }

        // Education
        if (education.length > 0) {
            sections.push(
                new Paragraph({
                    children: [
                        new TextRun({
                            text: 'PENDIDIKAN',
                            bold: true,
                            font: headingFont,
                            color: primaryColor,
                            size: 24,
                        })
                    ],
                    spacing: { before: 300 * spacingFactor, after: 100 * spacingFactor },
                })
            );

            education.forEach((edu) => {
                sections.push(
                    new Paragraph({
                        children: [
                            new TextRun({ text: `${edu.degree} - ${edu.field} `, bold: true, font: headingFont, size: 21 }),
                            new TextRun({ text: ` | ${formatDate(edu.startDate)} - ${formatDate(edu.endDate)} `, font: bodyFont, size: 18, italics: true }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: `${edu.institution}${edu.gpa ? ` • IPK: ${edu.gpa}` : ''} `,
                                font: bodyFont,
                                size: 19,
                                italics: true,
                                color: '666666'
                            })
                        ],
                        spacing: { after: 100 * spacingFactor },
                    })
                );
            });
        }

        // Certifications
        if (certifications && certifications.length > 0) {
            sections.push(
                new Paragraph({
                    children: [
                        new TextRun({
                            text: 'SERTIFIKASI & PENGHARGAAN',
                            bold: true,
                            font: headingFont,
                            color: primaryColor,
                            size: 24,
                        })
                    ],
                    spacing: { before: 300 * spacingFactor, after: 100 * spacingFactor },
                })
            );

            certifications.forEach((cert) => {
                const certInfo = [
                    cert.issuer,
                    cert.url ? `Link: ${cert.url}` : null
                ].filter(Boolean).join(' | ');

                sections.push(
                    new Paragraph({
                        children: [
                            new TextRun({ text: cert.name, bold: true, font: headingFont, size: 21 }),
                            new TextRun({ text: ` | ${formatDate(cert.date)}`, font: bodyFont, size: 18, italics: true }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: certInfo,
                                font: bodyFont,
                                size: 19,
                                italics: true,
                                color: '666666'
                            })
                        ],
                        spacing: { after: cert.description ? 50 * spacingFactor : 100 * spacingFactor },
                    })
                );

                if (cert.description) {
                    sections.push(
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: `• ${cert.description}`,
                                    font: bodyFont,
                                    size: 18,
                                })
                            ],
                            spacing: { after: 100 * spacingFactor },
                        })
                    );
                }
            });
        }

        // Skills
        if (skills.length > 0) {
            sections.push(
                new Paragraph({
                    children: [
                        new TextRun({
                            text: 'KEAHLIAN',
                            bold: true,
                            font: headingFont,
                            color: primaryColor,
                            size: 24,
                        })
                    ],
                    spacing: { before: 300 * spacingFactor, after: 100 * spacingFactor },
                })
            );

            const groups = [
                { label: 'Teknis', items: skills.filter(s => s.category === 'technical') },
                { label: 'Soft Skills', items: skills.filter(s => s.category === 'soft') },
                { label: 'Bahasa', items: skills.filter(s => s.category === 'language') }
            ];

            groups.filter(g => g.items.length > 0).forEach(g => {
                sections.push(
                    new Paragraph({
                        children: [
                            new TextRun({ text: `${g.label}: `, bold: true, font: headingFont, size: 19 }),
                            new TextRun({ text: g.items.map(s => s.name).join(', '), font: bodyFont, size: 18 }),
                        ],
                        spacing: { after: 80 * spacingFactor },
                    })
                );
            });
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
                                shading: { fill: primaryColor, type: ShadingType.CLEAR, color: "auto" },
                                children: [
                                    new Paragraph({
                                        children: [
                                            new TextRun({
                                                text: personal.fullName || 'Nama Lengkap',
                                                bold: true,
                                                size: 44,
                                                color: "FFFFFF",
                                                font: headingFont
                                            })
                                        ],
                                        alignment: AlignmentType.LEFT,
                                    }),
                                    new Paragraph({
                                        children: [
                                            new TextRun({
                                                text: cvData.settings.targetRole || '',
                                                size: 28,
                                                color: "FFFFFF",
                                                font: headingFont,
                                                bold: true
                                            })
                                        ],
                                        alignment: AlignmentType.LEFT,
                                        spacing: { before: 100 }
                                    }),
                                    new Paragraph({
                                        children: [
                                            new TextRun({
                                                text: [
                                                    personal.email ? ` ${personal.email}` : '',
                                                    personal.phone ? ` ${personal.phone}` : '',
                                                    personal.location ? ` ${personal.location}` : ''
                                                ].filter(Boolean).join(' | '),
                                                color: "FFFFFF",
                                                font: bodyFont,
                                                size: 18
                                            })
                                        ],
                                        alignment: AlignmentType.LEFT,
                                        spacing: { before: 150 }
                                    }),
                                    new Paragraph({
                                        children: [
                                            new TextRun({
                                                text: [
                                                    personal.linkedin ? `🔗 ${personal.linkedin}` : '',
                                                    personal.portfolio ? ` ${personal.portfolio}` : ''
                                                ].filter(Boolean).join(' | '),
                                                color: "FFFFFF",
                                                font: bodyFont,
                                                size: 18
                                            })
                                        ],
                                        alignment: AlignmentType.LEFT,
                                    })
                                ],
                                margins: { top: 200, bottom: 200, left: 200, right: 200 },
                            })
                        ]
                    })
                ]
            }),
            new Paragraph({ text: "", spacing: { after: 200 * spacingFactor } }) // Spacer
        );

        // 2. Two Column Layout (Main | Sidebar)
        const mainContent: any[] = [];
        const sidebarContent: any[] = [];

        // --- Main Content (Left) ---

        // Summary
        if (summary) {
            mainContent.push(
                new Paragraph({
                    children: [
                        new TextRun({ text: 'TENTANG SAYA', bold: true, size: 24, font: headingFont, color: primaryColor })
                    ],
                    spacing: { after: 100 * spacingFactor },
                }),
                new Paragraph({
                    children: [
                        new TextRun({ text: summary, font: bodyFont, size: 19 })
                    ],
                    spacing: { after: 200 * spacingFactor },
                })
            );
        }

        // Experience
        if (experiences.length > 0) {
            mainContent.push(
                new Paragraph({
                    children: [
                        new TextRun({ text: 'PENGALAMAN KERJA', bold: true, size: 24, font: headingFont, color: primaryColor })
                    ],
                    spacing: { before: 200 * spacingFactor, after: 100 * spacingFactor },
                })
            );
            experiences.forEach((exp) => {
                mainContent.push(
                    new Paragraph({
                        children: [
                            new TextRun({ text: exp.position, bold: true, size: 22, font: headingFont }),
                        ],
                        spacing: { before: 100 * spacingFactor }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: exp.company, bold: true, font: bodyFont, color: "666666", size: 19 }),
                            new TextRun({ text: ` | ${formatDate(exp.startDate)} - ${exp.endDate ? formatDate(exp.endDate) : 'Sekarang'}`, italics: true, size: 18, font: bodyFont, color: "666666" })
                        ]
                    }),
                    ...exp.description.filter(d => d.trim()).map(desc =>
                        new Paragraph({
                            children: [
                                new TextRun({ text: `• ${desc.replace(/^[-•]\s*/, '')}`, font: bodyFont, size: 18 })
                            ],
                            spacing: { after: 50 * spacingFactor },
                            indent: { left: 200 }
                        })
                    ),
                    new Paragraph({ text: "", spacing: { after: 100 * spacingFactor } })
                );
            });
        }

        // Education
        if (education.length > 0) {
            mainContent.push(
                new Paragraph({
                    children: [
                        new TextRun({ text: 'PENDIDIKAN', bold: true, size: 24, font: headingFont, color: primaryColor })
                    ],
                    spacing: { before: 200 * spacingFactor, after: 100 * spacingFactor },
                })
            );
            education.forEach((edu) => {
                mainContent.push(
                    new Paragraph({
                        children: [
                            new TextRun({ text: `${edu.degree} - ${edu.field}`, bold: true, font: headingFont, size: 21 }),
                        ],
                        spacing: { before: 100 * spacingFactor }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: `${edu.institution}${edu.gpa ? ` • IPK: ${edu.gpa}` : ''}`,
                                bold: true,
                                color: "666666",
                                font: bodyFont,
                                size: 19
                            })
                        ]
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: `${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}`,
                                italics: true,
                                size: 18,
                                font: bodyFont,
                                color: "666666"
                            })
                        ],
                        spacing: { after: 100 * spacingFactor }
                    })
                );
            });
        }

        // --- Sidebar Content (Right) ---
        if (skills.length > 0) {
            sidebarContent.push(
                new Paragraph({
                    children: [
                        new TextRun({ text: 'KEAHLIAN', bold: true, size: 24, font: headingFont, color: primaryColor })
                    ],
                    spacing: { after: 150 * spacingFactor },
                })
            );

            const groups = [
                { label: 'Teknis', items: skills.filter(s => s.category === 'technical') },
                { label: 'Soft Skills', items: skills.filter(s => s.category === 'soft') },
                { label: 'Bahasa', items: skills.filter(s => s.category === 'language') }
            ];

            groups.filter(g => g.items.length > 0).forEach(g => {
                sidebarContent.push(
                    new Paragraph({
                        children: [
                            new TextRun({ text: g.label, bold: true, font: headingFont, size: 19 })
                        ],
                        spacing: { before: 150 * spacingFactor }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: g.items.map(s => s.name).join(', '), font: bodyFont, size: 18 })
                        ]
                    })
                );
            });
        }

        if (certifications && certifications.length > 0) {
            sidebarContent.push(
                new Paragraph({
                    children: [
                        new TextRun({ text: 'SERTIFIKASI', bold: true, size: 24, font: headingFont, color: primaryColor })
                    ],
                    spacing: { before: 300 * spacingFactor, after: 150 * spacingFactor },
                })
            );
            certifications.forEach(cert => {
                sidebarContent.push(
                    new Paragraph({
                        children: [
                            new TextRun({ text: cert.name, bold: true, font: headingFont, size: 19 })
                        ],
                        spacing: { before: 100 * spacingFactor }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({ text: cert.issuer, font: bodyFont, size: 17 })
                        ]
                    })
                );
            });
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
