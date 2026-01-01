import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { CVData } from '@/types/cv';
import { formatDate } from '@/lib/utils';

// Create styles
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        fontFamily: 'Helvetica',
        fontSize: 10,
        lineHeight: 1.6, // Increased for better readability
        color: '#111827',
    },
    header: {
        backgroundColor: '#F97316',
        paddingVertical: 35,
        paddingHorizontal: 30,
        color: '#FFFFFF',
    },
    name: {
        fontSize: 28, // Slightly larger
        fontWeight: 'bold',
        marginBottom: 2,
    },
    role: {
        fontSize: 15, // Slightly smaller for contrast
        color: '#FED7AA', // lighter orange
        marginBottom: 0,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    contactRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        fontSize: 9,
        color: '#FFFFFF',
    },
    mainLayout: {
        flexDirection: 'row',
        flex: 1,
    },
    contentColumn: {
        flex: 1,
        paddingTop: 30,
        paddingHorizontal: 25,
        paddingBottom: 40,
    },
    sidebar: {
        width: 170, // Slightly narrower
        backgroundColor: '#F8FAFC',
        padding: 25,
        borderLeftWidth: 1,
        borderLeftColor: '#E2E8F0',
    },
    section: {
        marginBottom: 25, // More space between sections
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionLine: {
        width: 20,
        height: 2, // Thicker line
        backgroundColor: '#F97316', // Orange theme line
        marginRight: 10,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#1E293B',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    summary: {
        color: '#374151',
        fontSize: 9.5,
        lineHeight: 1.6,
    },
    experienceItem: {
        marginBottom: 15,
        paddingLeft: 12,
        borderLeftWidth: 1.5,
        borderLeftColor: '#FED7AA', // Softer theme color
        marginLeft: 4,
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 2,
    },
    jobTitle: {
        fontSize: 10.5,
        fontWeight: 'bold',
        color: '#111827',
    },
    dateTag: {
        fontSize: 8.5,
        color: '#64748B',
    },
    company: {
        fontSize: 9,
        color: '#475569',
        fontWeight: 'medium',
        marginBottom: 6,
    },
    bulletPoint: {
        flexDirection: 'row',
        marginBottom: 3,
    },
    bulletSymbol: {
        width: 10,
        fontSize: 9,
        color: '#F97316', // Theme colored bullet
    },
    bulletText: {
        flex: 1,
        color: '#4B5563',
        fontSize: 9,
        lineHeight: 1.4,
    },
    sidebarTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 15,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    sidebarSection: {
        marginBottom: 20,
    },
    sidebarSubTitle: {
        fontSize: 8.5,
        fontWeight: 'bold',
        color: '#F97316', // Theme colored subtitle
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 8,
    },
    skillBadgeContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    skillBadge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        backgroundColor: '#F1F5F9',
        borderRadius: 4,
        fontSize: 8.5,
        color: '#334155',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    skillBadgeSoft: {
        backgroundColor: '#F0FDF4',
        borderColor: '#DCFCE7',
        color: '#166534',
    },
    skillBadgeLang: {
        backgroundColor: '#FAF5FF',
        borderColor: '#F3E8FF',
        color: '#6B21A8',
    },
});

interface PDFTemplateProps {
    data: CVData;
}

export const CreativeATS02PDF = ({ data }: PDFTemplateProps) => {
    const { personal, summary, experiences, education, skills, settings } = data;

    const technicalSkills = skills.filter(s => s.category === 'technical');
    const softSkills = skills.filter(s => s.category === 'soft');
    const languageSkills = skills.filter(s => s.category === 'language');

    return (
        <Document title={`${personal.fullName || 'CV'} - CuricuLab`} author="CuricuLab">
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={[styles.header, { alignItems: 'center' }]}>
                    <View style={{ marginBottom: 20, alignItems: 'center' }}>
                        <Text style={[styles.name, { textAlign: 'center' }]}>{personal.fullName || 'Nama Lengkap'}</Text>
                        {settings.targetRole && (
                            <Text style={[styles.role, { marginTop: 15, textAlign: 'center' }]}>
                                {settings.targetRole}
                            </Text>
                        )}
                    </View>

                    <View style={[styles.contactRow, { justifyContent: 'center' }]}>
                        {personal.email && (
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15 }}>
                                <Text style={{ color: '#F1F5F9', opacity: 0.8, marginRight: 4 }}>Email:</Text>
                                <Text>{personal.email}</Text>
                            </View>
                        )}
                        {personal.phone && (
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15 }}>
                                <Text style={{ color: '#F1F5F9', opacity: 0.8, marginRight: 4 }}>Ph:</Text>
                                <Text>{personal.phone}</Text>
                            </View>
                        )}
                        {personal.location && (
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: '#F1F5F9', opacity: 0.8, marginRight: 4 }}>Loc:</Text>
                                <Text>{personal.location}</Text>
                            </View>
                        )}
                    </View>
                    {(personal.linkedin || personal.portfolio) && (
                        <View style={[styles.contactRow, { marginTop: 10, justifyContent: 'center' }]}>
                            {personal.linkedin && (
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15 }}>
                                    <Text style={{ color: '#F1F5F9', opacity: 0.8, marginRight: 4 }}>LinkedIn:</Text>
                                    <Text>{personal.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</Text>
                                </View>
                            )}
                            {personal.portfolio && (
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ color: '#F1F5F9', opacity: 0.8, marginRight: 4 }}>Web:</Text>
                                    <Text>{personal.portfolio.replace(/^https?:\/\/(www\.)?/, '')}</Text>
                                </View>
                            )}
                        </View>
                    )}
                </View>

                {/* Main Content Area */}
                <View style={styles.mainLayout}>
                    {/* Left - Content */}
                    <View style={styles.contentColumn}>
                        {/* Summary */}
                        {summary && (
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <View style={styles.sectionLine} />
                                    <Text style={styles.sectionTitle}>Tentang Saya</Text>
                                </View>
                                <Text style={styles.summary}>{summary}</Text>
                            </View>
                        )}

                        {/* Experience */}
                        {experiences.length > 0 && (
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <View style={styles.sectionLine} />
                                    <Text style={styles.sectionTitle}>Pengalaman Kerja</Text>
                                </View>
                                {experiences.map((exp) => (
                                    <View key={exp.id} style={styles.experienceItem}>
                                        <View style={styles.itemHeader}>
                                            <Text style={styles.jobTitle}>{exp.position}</Text>
                                            <Text style={styles.dateTag}>
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
                                <View style={styles.sectionHeader}>
                                    <View style={styles.sectionLine} />
                                    <Text style={styles.sectionTitle}>Pendidikan</Text>
                                </View>
                                {education.map((edu) => (
                                    <View key={edu.id} style={styles.experienceItem}>
                                        <View style={styles.itemHeader}>
                                            <Text style={styles.jobTitle}>
                                                {edu.degree} {edu.field && `- ${edu.field}`}
                                            </Text>
                                            <Text style={styles.dateTag}>
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
                    </View>

                    {/* Right - Sidebar */}
                    <View style={styles.sidebar}>
                        <Text style={styles.sidebarTitle}>Keahlian</Text>

                        {technicalSkills.length > 0 && (
                            <View style={styles.sidebarSection}>
                                <Text style={styles.sidebarSubTitle}>Teknis</Text>
                                <View style={styles.skillBadgeContainer}>
                                    {technicalSkills.map((skill) => (
                                        <Text key={skill.id} style={styles.skillBadge}>{skill.name}</Text>
                                    ))}
                                </View>
                            </View>
                        )}

                        {softSkills.length > 0 && (
                            <View style={styles.sidebarSection}>
                                <Text style={styles.sidebarSubTitle}>Soft Skills</Text>
                                <View style={styles.skillBadgeContainer}>
                                    {softSkills.map((skill) => (
                                        <Text key={skill.id} style={[styles.skillBadge, styles.skillBadgeSoft]}>{skill.name}</Text>
                                    ))}
                                </View>
                            </View>
                        )}

                        {languageSkills.length > 0 && (
                            <View style={styles.sidebarSection}>
                                <Text style={styles.sidebarSubTitle}>Bahasa</Text>
                                <View style={styles.skillBadgeContainer}>
                                    {languageSkills.map((skill) => (
                                        <Text key={skill.id} style={[styles.skillBadge, styles.skillBadgeLang]}>{skill.name}</Text>
                                    ))}
                                </View>
                            </View>
                        )}
                    </View>
                </View>
            </Page>
        </Document>
    );
};
