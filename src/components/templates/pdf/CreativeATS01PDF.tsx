import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import type { CVData } from '@/types/cv';
import { formatDate } from '@/lib/utils';

// Create styles
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        paddingVertical: 45,
        paddingHorizontal: 40,
        fontFamily: 'Helvetica',
        fontSize: 10,
        lineHeight: 1.6, // Better readability
        color: '#111827',
    },
    header: {
        borderBottomWidth: 1.5,
        borderBottomColor: '#111827',
        paddingBottom: 20,
        marginBottom: 25,
    },
    name: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#111827',
    },
    contactInfo: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 10,
        gap: 12,
        color: '#4B5563',
        fontSize: 9,
    },
    section: {
        marginBottom: 22,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#111827',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        paddingBottom: 4,
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    summary: {
        color: '#374151',
        fontSize: 9.5,
        textAlign: 'justify',
        lineHeight: 1.6,
    },
    experienceItem: {
        marginBottom: 15,
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 2,
    },
    role: {
        fontSize: 10.5,
        fontWeight: 'bold',
        color: '#111827',
    },
    date: {
        fontSize: 9,
        color: '#6B7280',
    },
    company: {
        fontSize: 9.5,
        color: '#374151',
        fontStyle: 'italic',
        marginBottom: 5,
    },
    bulletPoint: {
        flexDirection: 'row',
        marginBottom: 3,
        paddingLeft: 8,
    },
    bulletSymbol: {
        width: 10,
        fontSize: 10,
        color: '#9CA3AF',
    },
    bulletText: {
        flex: 1,
        color: '#374151',
        fontSize: 9,
        lineHeight: 1.4,
    },
    educationItem: {
        marginBottom: 12,
    },
    skillSection: {
        marginBottom: 15,
    },
    skillCategory: {
        flexDirection: 'row',
        marginBottom: 6,
    },
    skillLabel: {
        fontWeight: 'bold',
        width: 85,
        color: '#1F2937',
        fontSize: 9,
    },
    skillList: {
        flex: 1,
        color: '#374151',
        fontSize: 9,
    },
});

interface PDFTemplateProps {
    data: CVData;
}

export const CreativeATS01PDF = ({ data }: PDFTemplateProps) => {
    const { personal, summary, experiences, education, skills, settings } = data;

    const technicalSkills = skills.filter(s => s.category === 'technical').map(s => s.name).join(', ');
    const softSkills = skills.filter(s => s.category === 'soft').map(s => s.name).join(', ');
    const languageSkills = skills.filter(s => s.category === 'language').map(s => s.name).join(', ');

    return (
        <Document title={`${personal.fullName || 'CV'} - CuricuLab`} author="CuricuLab">
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={[styles.header, { alignItems: 'center' }]}>
                    <View style={{ marginBottom: 15, alignItems: 'center' }}>
                        <Text style={[styles.name, { textAlign: 'center' }]}>{personal.fullName || 'Nama Lengkap'}</Text>
                        {settings.targetRole && (
                            <Text style={{ fontSize: 13, color: '#4B5563', marginTop: 15, textTransform: 'uppercase', letterSpacing: 1, textAlign: 'center' }}>
                                {settings.targetRole}
                            </Text>
                        )}
                    </View>

                    <View style={[styles.contactInfo, { justifyContent: 'center' }]}>
                        {personal.email && (
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: '#9CA3AF', marginRight: 3 }}>Email:</Text>
                                <Text>{personal.email}</Text>
                            </View>
                        )}
                        {personal.phone && (
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: '#9CA3AF', marginRight: 3 }}>Ph:</Text>
                                <Text>{personal.phone}</Text>
                            </View>
                        )}
                        {personal.location && (
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: '#9CA3AF', marginRight: 3 }}>Loc:</Text>
                                <Text>{personal.location}</Text>
                            </View>
                        )}
                    </View>
                    {(personal.linkedin || personal.portfolio) && (
                        <View style={[styles.contactInfo, { marginTop: 8, justifyContent: 'center' }]}>
                            {personal.linkedin && (
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ color: '#9CA3AF', marginRight: 3 }}>LinkedIn:</Text>
                                    <Text>{personal.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</Text>
                                </View>
                            )}
                            {personal.portfolio && (
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ color: '#9CA3AF', marginRight: 3 }}>Web:</Text>
                                    <Text>{personal.portfolio.replace(/^https?:\/\/(www\.)?/, '')}</Text>
                                </View>
                            )}
                        </View>
                    )}
                </View>

                {/* Summary */}
                {summary && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Ringkasan Profesional</Text>
                        <Text style={styles.summary}>{summary}</Text>
                    </View>
                )}

                {/* Experience */}
                {experiences.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Pengalaman Kerja</Text>
                        {experiences.map((exp) => (
                            <View key={exp.id} style={styles.experienceItem}>
                                <View style={styles.itemHeader}>
                                    <Text style={styles.role}>{exp.position}</Text>
                                    <Text style={styles.date}>
                                        {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Sekarang'}
                                    </Text>
                                </View>
                                <Text style={styles.company}>
                                    {exp.company}{exp.location && ` • ${exp.location}`}
                                </Text>
                                {exp.description.filter(d => d.trim()).map((desc, idx) => (
                                    <View key={idx} style={styles.bulletPoint}>
                                        <Text style={styles.bulletSymbol}>•</Text>
                                        <Text style={styles.bulletText}>{desc.replace(/^[-•]\s*/, '')}</Text>
                                    </View>
                                ))}
                            </View>
                        ))}
                    </View>
                )}

                {/* Education */}
                {education.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Pendidikan</Text>
                        {education.map((edu) => (
                            <View key={edu.id} style={styles.educationItem}>
                                <View style={styles.itemHeader}>
                                    <Text style={styles.role}>
                                        {edu.degree} {edu.field && `- ${edu.field}`}
                                    </Text>
                                    <Text style={styles.date}>
                                        {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                                    </Text>
                                </View>
                                <Text style={styles.company}>
                                    {edu.institution}{edu.gpa && ` • IPK: ${edu.gpa}`}
                                </Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* Certifications */}
                {data.certifications && data.certifications.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Sertifikasi & Penghargaan</Text>
                        {data.certifications.map((cert) => (
                            <View key={cert.id} style={styles.experienceItem}>
                                <View style={styles.itemHeader}>
                                    <Text style={styles.role}>{cert.name}</Text>
                                    <Text style={styles.date}>
                                        {formatDate(cert.date)}
                                    </Text>
                                </View>
                                <Text style={styles.company}>
                                    {cert.issuer}
                                    {cert.url ? ` • ${cert.url}` : ''}
                                </Text>
                                {cert.description && (
                                    <View style={styles.bulletPoint}>
                                        <Text style={styles.bulletSymbol}>•</Text>
                                        <Text style={styles.bulletText}>{cert.description}</Text>
                                    </View>
                                )}
                            </View>
                        ))}
                    </View>
                )}

                {/* Skills */}
                {skills.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Keahlian</Text>
                        {technicalSkills && (
                            <View style={styles.skillCategory}>
                                <Text style={styles.skillLabel}>Teknis:</Text>
                                <Text style={styles.skillList}>{technicalSkills}</Text>
                            </View>
                        )}
                        {softSkills && (
                            <View style={styles.skillCategory}>
                                <Text style={styles.skillLabel}>Soft Skills:</Text>
                                <Text style={styles.skillList}>{softSkills}</Text>
                            </View>
                        )}
                        {languageSkills && (
                            <View style={styles.skillCategory}>
                                <Text style={styles.skillLabel}>Bahasa:</Text>
                                <Text style={styles.skillList}>{languageSkills}</Text>
                            </View>
                        )}
                    </View>
                )}
            </Page>
        </Document>
    );
};
