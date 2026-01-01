// Experience Form Component with dynamic add/remove and AI enhancement
import { useState } from 'react';
import { useCVStore } from '@/lib/store';
import type { Experience } from '@/types/cv';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Briefcase, Plus, Trash2, Sparkles, Loader2, GripVertical } from 'lucide-react';
import { enhanceExperience } from '@/lib/api';

function ExperienceItem({
    experience,
    onUpdate,
    onRemove
}: {
    experience: Experience;
    onUpdate: (data: Partial<Experience>) => void;
    onRemove: () => void;
}) {
    const [isEnhancing, setIsEnhancing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { cvData } = useCVStore();

    const handleEnhance = async () => {
        if (experience.description.filter(d => d.trim()).length === 0) {
            setError('Mohon isi deskripsi pekerjaan terlebih dahulu');
            return;
        }

        setIsEnhancing(true);
        setError(null);

        try {
            const enhanced = await enhanceExperience(
                experience.description,
                experience.position,
                cvData.settings.targetRole,
                cvData.settings.language
            );
            onUpdate({ description: enhanced, isEnhanced: true });
        } catch (err) {
            setError('Gagal meningkatkan deskripsi. Silakan coba lagi.');
            console.error('Enhancement error:', err);
        } finally {
            setIsEnhancing(false);
        }
    };

    const handleDescriptionChange = (value: string) => {
        const lines = value.split('\n');
        onUpdate({ description: lines });
    };

    return (
        <div className="space-y-4 border-2 border-black dark:border-white bg-white dark:bg-card p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_white] transition-all">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <GripVertical className="h-4 w-4 cursor-grab" />
                    <span className="text-sm font-medium">
                        {experience.position || 'Posisi Baru'}
                    </span>
                </div>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={onRemove}
                    className="h-8 w-8 text-destructive hover:bg-destructive/10"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                {/* Company */}
                <div className="space-y-2">
                    <Label htmlFor={`company-${experience.id}`}>Perusahaan *</Label>
                    <Input
                        id={`company-${experience.id}`}
                        placeholder="Nama perusahaan"
                        value={experience.company}
                        onChange={(e) => onUpdate({ company: e.target.value })}
                    />
                </div>

                {/* Position */}
                <div className="space-y-2">
                    <Label htmlFor={`position-${experience.id}`}>Posisi *</Label>
                    <Input
                        id={`position-${experience.id}`}
                        placeholder="Jabatan Anda"
                        value={experience.position}
                        onChange={(e) => onUpdate({ position: e.target.value })}
                    />
                </div>

                {/* Start Date */}
                <div className="space-y-2">
                    <Label htmlFor={`startDate-${experience.id}`}>Tanggal Mulai *</Label>
                    <Input
                        id={`startDate-${experience.id}`}
                        type="month"
                        placeholder="YYYY-MM"
                        value={experience.startDate}
                        onChange={(e) => onUpdate({ startDate: e.target.value })}
                    />
                </div>

                {/* End Date */}
                <div className="space-y-2">
                    <Label htmlFor={`endDate-${experience.id}`}>Tanggal Selesai</Label>
                    <div className="flex items-center gap-2">
                        <Input
                            id={`endDate-${experience.id}`}
                            type="month"
                            placeholder="YYYY-MM"
                            value={experience.endDate || ''}
                            onChange={(e) => onUpdate({ endDate: e.target.value || null })}
                            disabled={experience.endDate === null}
                        />
                        <label className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                            <input
                                type="checkbox"
                                checked={experience.endDate === null}
                                onChange={(e) => onUpdate({ endDate: e.target.checked ? null : '' })}
                                className="rounded"
                            />
                            Sekarang
                        </label>
                    </div>
                </div>

                {/* Location */}
                <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor={`location-${experience.id}`}>Lokasi (Opsional)</Label>
                    <Input
                        id={`location-${experience.id}`}
                        placeholder="Jakarta, Indonesia"
                        value={experience.location || ''}
                        onChange={(e) => onUpdate({ location: e.target.value })}
                    />
                </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label htmlFor={`description-${experience.id}`}>
                        Deskripsi Pekerjaan *
                        {experience.isEnhanced && (
                            <span className="ml-2 text-xs text-green-600">✓ AI Enhanced</span>
                        )}
                    </Label>
                </div>
                <Textarea
                    id={`description-${experience.id}`}
                    placeholder="Tulis setiap pencapaian di baris baru. Contoh:&#10;- Mengembangkan fitur X yang meningkatkan konversi 20%&#10;- Memimpin tim 5 orang dalam proyek Y"
                    value={experience.description.join('\n')}
                    onChange={(e) => handleDescriptionChange(e.target.value)}
                    rows={4}
                    className="resize-none font-mono text-sm"
                />

                {/* AI Enhancement */}
                <Button
                    type="button"
                    variant="default"
                    size="sm"
                    onClick={handleEnhance}
                    disabled={isEnhancing}
                    className="h-10 border-2 border-black dark:border-white px-4 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_white] hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all bg-green-400 text-black gap-2 uppercase text-xs"
                >
                    {isEnhancing ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            MENINGKATKAN...
                        </>
                    ) : (
                        <>
                            <Sparkles className="h-4 w-4" />
                            TINGKATKAN DENGAN AI
                        </>
                    )}
                </Button>

                {error && (
                    <p className="text-xs text-destructive">{error}</p>
                )}
            </div>
        </div>
    );
}

export function ExperienceForm() {
    const { cvData, addExperience, updateExperience, removeExperience } = useCVStore();

    return (
        <Card className="neo-card w-full mb-8">
            <CardHeader className="border-b-4 border-black -mt-8 bg-yellow-400 p-6">
                <CardTitle className="flex items-center gap-2 text-2xl font-black uppercase tracking-tighter">
                    <Briefcase className="h-6 w-6 stroke-3" />
                    PENGALAMAN KERJA
                </CardTitle>
                <CardDescription className="font-bold text-black/80">
                    Tambahkan pengalaman kerja Anda, mulai dari yang terbaru
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
                {cvData.experiences.length === 0 ? (
                    <div className="rounded-lg border-2 border-dashed p-8 text-center">
                        <Briefcase className="mx-auto h-12 w-12 text-muted-foreground/50" />
                        <h3 className="mt-4 text-lg font-medium">Belum ada pengalaman</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Klik tombol di bawah untuk menambahkan pengalaman kerja pertama Anda
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {cvData.experiences.map((exp) => (
                            <ExperienceItem
                                key={exp.id}
                                experience={exp}
                                onUpdate={(data) => updateExperience(exp.id, data)}
                                onRemove={() => removeExperience(exp.id)}
                            />
                        ))}
                    </div>
                )}

                <Button
                    type="button"
                    variant="default"
                    onClick={addExperience}
                    className="h-12 w-full border-2 border-black dark:border-white font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_white] hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all bg-blue-400 text-white gap-2 uppercase"
                >
                    <Plus className="h-5 w-5" />
                    TAMBAH PENGALAMAN
                </Button>
            </CardContent>
        </Card>
    );
}
