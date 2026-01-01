// Education Form Component with dynamic add/remove
import { useCVStore } from '@/lib/store';
import type { Education } from '@/types/cv';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { GraduationCap, Plus, Trash2, GripVertical } from 'lucide-react';

function EducationItem({
    education,
    onUpdate,
    onRemove
}: {
    education: Education;
    onUpdate: (data: Partial<Education>) => void;
    onRemove: () => void;
}) {
    return (
        <div className="space-y-4 rounded-lg border bg-card p-4">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <GripVertical className="h-4 w-4 cursor-grab" />
                    <span className="text-sm font-medium">
                        {education.institution || 'Institusi Baru'}
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
                {/* Institution */}
                <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor={`institution-${education.id}`}>Institusi *</Label>
                    <Input
                        id={`institution-${education.id}`}
                        placeholder="Nama universitas/sekolah"
                        value={education.institution}
                        onChange={(e) => onUpdate({ institution: e.target.value })}
                    />
                </div>

                {/* Degree */}
                <div className="space-y-2">
                    <Label htmlFor={`degree-${education.id}`}>Gelar/Jenjang *</Label>
                    <Input
                        id={`degree-${education.id}`}
                        placeholder="S1, D3, SMA, dll"
                        value={education.degree}
                        onChange={(e) => onUpdate({ degree: e.target.value })}
                    />
                </div>

                {/* Field of Study */}
                <div className="space-y-2">
                    <Label htmlFor={`field-${education.id}`}>Bidang Studi *</Label>
                    <Input
                        id={`field-${education.id}`}
                        placeholder="Teknik Informatika"
                        value={education.field}
                        onChange={(e) => onUpdate({ field: e.target.value })}
                    />
                </div>

                {/* Start Date */}
                <div className="space-y-2">
                    <Label htmlFor={`eduStartDate-${education.id}`}>Tahun Mulai *</Label>
                    <Input
                        id={`eduStartDate-${education.id}`}
                        type="month"
                        value={education.startDate}
                        onChange={(e) => onUpdate({ startDate: e.target.value })}
                    />
                </div>

                {/* End Date */}
                <div className="space-y-2">
                    <Label htmlFor={`eduEndDate-${education.id}`}>Tahun Selesai *</Label>
                    <Input
                        id={`eduEndDate-${education.id}`}
                        type="month"
                        value={education.endDate}
                        onChange={(e) => onUpdate({ endDate: e.target.value })}
                    />
                </div>

                {/* GPA */}
                <div className="space-y-2">
                    <Label htmlFor={`gpa-${education.id}`}>IPK/Nilai (Opsional)</Label>
                    <Input
                        id={`gpa-${education.id}`}
                        placeholder="3.85"
                        value={education.gpa || ''}
                        onChange={(e) => onUpdate({ gpa: e.target.value })}
                    />
                </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
                <Label htmlFor={`eduDescription-${education.id}`}>
                    Deskripsi Tambahan (Opsional)
                </Label>
                <Textarea
                    id={`eduDescription-${education.id}`}
                    placeholder="Prestasi, organisasi, atau aktivitas penting selama pendidikan"
                    value={education.description || ''}
                    onChange={(e) => onUpdate({ description: e.target.value })}
                    rows={2}
                    className="resize-none"
                />
            </div>
        </div>
    );
}

export function EducationForm() {
    const { cvData, addEducation, updateEducation, removeEducation } = useCVStore();

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Riwayat Pendidikan
                </CardTitle>
                <CardDescription>
                    Tambahkan riwayat pendidikan Anda, mulai dari yang tertinggi
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {cvData.education.length === 0 ? (
                    <div className="rounded-lg border-2 border-dashed p-8 text-center">
                        <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground/50" />
                        <h3 className="mt-4 text-lg font-medium">Belum ada pendidikan</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Klik tombol di bawah untuk menambahkan riwayat pendidikan
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {cvData.education.map((edu) => (
                            <EducationItem
                                key={edu.id}
                                education={edu}
                                onUpdate={(data) => updateEducation(edu.id, data)}
                                onRemove={() => removeEducation(edu.id)}
                            />
                        ))}
                    </div>
                )}

                <Button
                    type="button"
                    variant="outline"
                    onClick={addEducation}
                    className="w-full gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Tambah Pendidikan
                </Button>
            </CardContent>
        </Card>
    );
}
