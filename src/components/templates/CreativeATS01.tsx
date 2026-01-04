// Creative ATS-01 Template - Single Column Modern
// ATS-friendly design with clean typography and structure
import type { CVData } from '@/types/cv';
import { cn, formatDate } from '@/lib/utils';

interface TemplateProps {
    data: CVData;
    className?: string;
}

export function CreativeATS01({ data, className }: TemplateProps) {
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
            {/* Header Section */}
            <header className="border-b-2 border-gray-800 pb-4 mb-6">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                    {personal.fullName || 'Nama Lengkap'}
                </h1>

                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-gray-600">
                    {personal.email && (
                        <span>{personal.email}</span>
                    )}
                    {personal.phone && (
                        <span>{personal.phone}</span>
                    )}
                    {personal.location && (
                        <span>{personal.location}</span>
                    )}
                    {personal.linkedin && (
                        <span>{personal.linkedin}</span>
                    )}
                    {personal.portfolio && (
                        <span>{personal.portfolio}</span>
                    )}
                </div>
            </header>

            {/* Professional Summary */}
            {summary && (
                <section className="mb-6 break-inside-avoid">
                    <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-3">
                        RINGKASAN PROFESIONAL
                    </h2>
                    <p className="text-gray-700 leading-relaxed font-normal whitespace-pre-wrap">
                        {summary}
                    </p>
                </section>
            )}

            {/* Experience Section */}
            {experiences.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-3">
                        PENGALAMAN KERJA
                    </h2>
                    <div className="space-y-4">
                        {experiences.map((exp) => (
                            <div key={exp.id} className="break-inside-avoid mb-4">
                                <div className="flex justify-between items-baseline flex-wrap gap-x-4">
                                    <h3 className="font-bold text-gray-900">{exp.position}</h3>
                                    <span className="text-sm text-gray-500">
                                        {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Sekarang'}
                                    </span>
                                </div>
                                <div className="text-gray-700 italic font-medium">
                                    {exp.company}{exp.location && ` • ${exp.location}`}
                                </div>
                                {exp.description.length > 0 && exp.description[0] && (
                                    <ul className="mt-2 space-y-1 list-disc list-inside text-gray-700">
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
                    <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-3">
                        PENDIDIKAN
                    </h2>
                    <div className="space-y-3">
                        {education.map((edu) => (
                            <div key={edu.id}>
                                <div className="flex justify-between items-baseline flex-wrap gap-x-4">
                                    <h3 className="font-bold text-gray-900">
                                        {edu.degree} {edu.field && `- ${edu.field}`}
                                    </h3>
                                    <span className="text-sm text-gray-500">
                                        {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                                    </span>
                                </div>
                                <div className="text-gray-700">
                                    {edu.institution}
                                    {edu.gpa && ` • IPK: ${edu.gpa}`}
                                </div>
                                {edu.description && (
                                    <p className="mt-1 text-gray-600 text-sm">{edu.description}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Certifications Section */}
            {data.certifications && data.certifications.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-3">
                        SERTIFIKASI & PENGHARGAAN
                    </h2>
                    <div className="space-y-3">
                        {data.certifications.map((cert) => (
                            <div key={cert.id} className="break-inside-avoid">
                                <div className="flex justify-between items-baseline flex-wrap gap-x-4">
                                    <h3 className="font-bold text-gray-900">{cert.name}</h3>
                                    <span className="text-sm text-gray-500">
                                        {formatDate(cert.date)}
                                    </span>
                                </div>
                                <div className="text-gray-700 font-medium">
                                    {cert.issuer}
                                    {cert.url && (
                                        <a href={cert.url} target="_blank" rel="noopener noreferrer" className="ml-2 text-primary hover:underline font-normal text-sm">
                                            (Lihat Kredensial)
                                        </a>
                                    )}
                                </div>
                                {cert.description && (
                                    <p className="mt-1 text-gray-600 text-sm">{cert.description}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Skills Section */}
            {skills.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-3">
                        KEAHLIAN
                    </h2>
                    <div className="space-y-2">
                        {technicalSkills.length > 0 && (
                            <div>
                                <span className="font-semibold text-gray-800">Teknis: </span>
                                <span className="text-gray-700">
                                    {technicalSkills.map(s => s.name).join(', ')}
                                </span>
                            </div>
                        )}
                        {softSkills.length > 0 && (
                            <div>
                                <span className="font-semibold text-gray-800">Soft Skills: </span>
                                <span className="text-gray-700">
                                    {softSkills.map(s => s.name).join(', ')}
                                </span>
                            </div>
                        )}
                        {languageSkills.length > 0 && (
                            <div>
                                <span className="font-semibold text-gray-800">Bahasa: </span>
                                <span className="text-gray-700">
                                    {languageSkills.map(s => s.name).join(', ')}
                                </span>
                            </div>
                        )}
                    </div>
                </section>
            )}
        </div>
    );
}
