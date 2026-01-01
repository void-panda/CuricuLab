// Creative ATS-02 Template - Two Column with Sidebar
// Creative yet ATS-friendly with sidebar for skills
import type { CVData } from '@/types/cv';
import { cn, formatDate } from '@/lib/utils';

interface TemplateProps {
    data: CVData;
    className?: string;
}

export function CreativeATS02({ data, className }: TemplateProps) {
    const { personal, summary, experiences, education, skills } = data;

    // Group skills by category
    const technicalSkills = skills.filter(s => s.category === 'technical');
    const softSkills = skills.filter(s => s.category === 'soft');
    const languageSkills = skills.filter(s => s.category === 'language');

    return (
        <div className={cn(
            "bg-white text-gray-900 font-sans text-sm leading-relaxed",
            "w-full max-w-[210mm] mx-auto print:max-w-none",
            className
        )}>
            {/* Header - Full Width */}
            <header className="bg-linear-to-r from-primary to-primary/80 p-8 text-primary-foreground">
                <h1 className="text-3xl font-bold tracking-tight">
                    {personal.fullName || 'Nama Lengkap'}
                </h1>
                {data.settings.targetRole && (
                    <p className="text-slate-300 mt-1 text-lg">
                        {data.settings.targetRole}
                    </p>
                )}

                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-sm text-slate-200">
                    {personal.email && <span>📧 {personal.email}</span>}
                    {personal.phone && <span>📱 {personal.phone}</span>}
                    {personal.location && <span>📍 {personal.location}</span>}
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-slate-300">
                    {personal.linkedin && <span>🔗 {personal.linkedin}</span>}
                    {personal.portfolio && <span>🌐 {personal.portfolio}</span>}
                </div>
            </header>

            {/* Two Column Layout */}
            <div className="flex gap-6">
                {/* Main Content - 70% */}
                <div className="flex-1">
                    {/* Professional Summary */}
                    {summary && (
                        <section className="mb-6 break-inside-avoid">
                            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-3">
                                <span className="w-8 h-0.5 bg-slate-800"></span>
                                Tentang Saya
                            </h2>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                {summary}
                            </p>
                        </section>
                    )}

                    {/* Experience Section */}
                    {experiences.length > 0 && (
                        <section className="mb-6">
                            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-3">
                                <span className="w-8 h-0.5 bg-slate-800"></span>
                                Pengalaman Kerja
                            </h2>
                            <div className="space-y-4">
                                {experiences.map((exp) => (
                                    <div key={exp.id} className="relative pl-4 border-l-2 border-slate-300 break-inside-avoid mb-4">
                                        <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-slate-800" />
                                        <div className="flex justify-between items-baseline flex-wrap gap-x-4">
                                            <h3 className="font-bold text-gray-900">{exp.position}</h3>
                                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                                {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Sekarang'}
                                            </span>
                                        </div>
                                        <div className="text-slate-600 font-medium italic">
                                            {exp.company}{exp.location && ` • ${exp.location}`}
                                        </div>
                                        {exp.description.length > 0 && exp.description[0] && (
                                            <ul className="mt-2 space-y-1 list-disc list-inside text-gray-600 text-sm">
                                                {exp.description.filter(d => d.trim()).map((desc, idx) => (
                                                    <li key={idx} className="leading-normal">{desc.replace(/^[-•]\s*/, '')}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Education Section */}
                    {education.length > 0 && (
                        <section className="mb-6">
                            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-3">
                                <span className="w-8 h-0.5 bg-slate-800"></span>
                                Pendidikan
                            </h2>
                            <div className="space-y-3">
                                {education.map((edu) => (
                                    <div key={edu.id} className="relative pl-4 border-l-2 border-slate-300 break-inside-avoid">
                                        <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-slate-800" />
                                        <div className="flex justify-between items-baseline flex-wrap gap-x-4">
                                            <h3 className="font-bold text-gray-900">
                                                {edu.degree} {edu.field && `- ${edu.field}`}
                                            </h3>
                                            <span className="text-xs text-gray-500">
                                                {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                                            </span>
                                        </div>
                                        <div className="text-slate-600">
                                            {edu.institution}
                                            {edu.gpa && ` • IPK: ${edu.gpa}`}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Sidebar - 30% */}
                {skills.length > 0 && (
                    <aside className="w-48 shrink-0">
                        <div className="bg-slate-50 rounded-lg p-4 sticky top-4">
                            <h2 className="text-lg font-bold text-slate-800 mb-4">
                                Keahlian
                            </h2>

                            {technicalSkills.length > 0 && (
                                <div className="mb-4">
                                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                        Teknis
                                    </h3>
                                    <div className="flex flex-wrap gap-1">
                                        {technicalSkills.map((skill) => (
                                            <span
                                                key={skill.id}
                                                className="bg-slate-200 text-slate-700 text-xs px-2 py-1 rounded"
                                            >
                                                {skill.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {softSkills.length > 0 && (
                                <div className="mb-4">
                                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                        Soft Skills
                                    </h3>
                                    <div className="flex flex-wrap gap-1">
                                        {softSkills.map((skill) => (
                                            <span
                                                key={skill.id}
                                                className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded"
                                            >
                                                {skill.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {languageSkills.length > 0 && (
                                <div>
                                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                        Bahasa
                                    </h3>
                                    <div className="flex flex-wrap gap-1">
                                        {languageSkills.map((skill) => (
                                            <span
                                                key={skill.id}
                                                className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded"
                                            >
                                                {skill.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </aside>
                )}
            </div>
        </div>
    );
}
