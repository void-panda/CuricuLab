import { useState } from 'react';
import { useCVStore } from '@/lib/store';
import type { Education } from '@/types/cv';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { GraduationCap, Plus, Trash2, GripVertical, ChevronDown, ChevronUp } from 'lucide-react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function EducationItem({
    education,
    onUpdate,
    onRemove
}: {
    education: Education;
    onUpdate: (data: Partial<Education>) => void;
    onRemove: () => void;
}) {
    const [isExpanded, setIsExpanded] = useState(false);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: education.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 'auto',
        position: 'relative' as const,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`space-y-4 border-2 border-black dark:border-white bg-white dark:bg-card p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_white] transition-all ${isDragging ? 'opacity-80 scale-[1.02] shadow-xl ring-2 ring-primary rotate-1' : ''}`}
        >
            <div className="flex items-center justify-between">
                <div
                    className="flex items-center gap-3 text-muted-foreground cursor-grab active:cursor-grabbing p-2 rounded hover:bg-black/5 dark:hover:bg-white/5 flex-1"
                    {...attributes}
                    {...listeners}
                >
                    <GripVertical className="h-5 w-5" />
                    <div className="flex flex-col">
                        <span className="text-base font-bold text-black dark:text-white leading-tight">
                            {education.institution || 'Institusi Baru'}
                        </span>
                        {education.degree && (
                            <span className="text-sm text-muted-foreground">
                                {education.degree} {education.field ? `- ${education.field}` : ''}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="h-8 w-8 p-0"
                    >
                        {isExpanded ? (
                            <ChevronUp className="h-4 w-4" />
                        ) : (
                            <ChevronDown className="h-4 w-4" />
                        )}
                    </Button>
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
            </div>

            {isExpanded && (
                <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t border-dashed border-gray-200 dark:border-gray-700 animate-in slide-in-from-top-2 duration-200">
                    {/* Institution */}
                    <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor={`institution-${education.id}`}>Institusi *</Label>
                        <Input
                            id={`institution-${education.id}`}
                            placeholder="Nama universitas/sekolah"
                            value={education.institution}
                            onChange={(e) => onUpdate({ institution: e.target.value })}
                            onKeyDown={(e) => e.stopPropagation()}
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
                            onKeyDown={(e) => e.stopPropagation()}
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
                            onKeyDown={(e) => e.stopPropagation()}
                        />
                    </div>

                    {/* Start Date */}
                    <div className="space-y-2">
                        <Label htmlFor={`eduStartDate-${education.id}`}>Tahun Mulai *</Label>
                        <Input
                            id={`eduStartDate-${education.id}`}
                            type="month"
                            placeholder="YYYY-MM"
                            value={education.startDate}
                            onChange={(e) => onUpdate({ startDate: e.target.value })}
                            onKeyDown={(e) => e.stopPropagation()}
                        />
                    </div>

                    {/* End Date */}
                    <div className="space-y-2">
                        <Label htmlFor={`eduEndDate-${education.id}`}>Tahun Selesai *</Label>
                        <Input
                            id={`eduEndDate-${education.id}`}
                            type="month"
                            placeholder="YYYY-MM"
                            value={education.endDate}
                            onChange={(e) => onUpdate({ endDate: e.target.value })}
                            onKeyDown={(e) => e.stopPropagation()}
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
                            onKeyDown={(e) => e.stopPropagation()}
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2 sm:col-span-2">
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
                            onKeyDown={(e) => e.stopPropagation()}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export function EducationForm() {
    const { cvData, addEducation, updateEducation, removeEducation, reorderEducation } = useCVStore();

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            const oldIndex = cvData.education.findIndex((item) => item.id === active.id);
            const newIndex = cvData.education.findIndex((item) => item.id === over?.id);

            if (oldIndex !== -1 && newIndex !== -1) {
                reorderEducation(oldIndex, newIndex);
            }
        }
    };

    return (
        <Card className="neo-card w-full mb-8 dark:bg-zinc-900 dark:border-white/10 dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.05)]">
            <CardHeader className="border-b-4 border-black dark:border-white/10 -mt-8 bg-yellow-400 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]">
                <CardTitle className="flex items-center gap-2 text-black text-2xl font-black uppercase tracking-tighter">
                    <GraduationCap className="h-6 w-6 stroke-3" />
                    RIWAYAT PENDIDIKAN
                </CardTitle>
                <CardDescription className="text-black font-bold">
                    Tambahkan riwayat pendidikan Anda, mulai dari yang tertinggi
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    {cvData.education.length === 0 ? (
                        <div className="rounded-lg border-2 border-dashed p-8 text-center">
                            <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground/50" />
                            <h3 className="mt-4 text-lg font-medium">Belum ada pendidikan</h3>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Klik tombol di bawah untuk menambahkan riwayat pendidikan
                            </p>
                        </div>
                    ) : (
                        <SortableContext
                            items={cvData.education.map(edu => edu.id)}
                            strategy={verticalListSortingStrategy}
                        >
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
                        </SortableContext>
                    )}
                </DndContext>

                <Button
                    type="button"
                    variant="default"
                    onClick={addEducation}
                    className="h-12 w-full border-2 border-black dark:border-white font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_white] hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[2px_2px_0px_0px_white] transition-all bg-yellow-400 text-black gap-2 uppercase"
                >
                    <Plus className="h-5 w-5" />
                    TAMBAH PENDIDIKAN
                </Button>
            </CardContent>
        </Card>
    );
}
