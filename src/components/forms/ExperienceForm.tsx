// Experience Form Component with dynamic add/remove and AI enhancement
import { useState } from 'react';
import { useCVStore } from '@/lib/store';
import type { Experience } from '@/types/cv';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Briefcase, Plus, Trash2, Sparkles, Loader2, GripVertical, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import { enhanceExperience } from '@/lib/api';
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
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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
    const [isExpanded, setIsExpanded] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { cvData } = useCVStore();

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: experience.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 'auto',
        position: 'relative' as const,
    };

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
            toast.success("Deskripsi pekerjaan berhasil ditingkatkan!");
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
                            {experience.position || 'Posisi Baru'}
                        </span>
                        {experience.company && (
                            <span className="text-sm text-muted-foreground">
                                {experience.company}
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
                    {/* Company */}
                    <div className="space-y-2">
                        <Label htmlFor={`company-${experience.id}`}>Perusahaan *</Label>
                        <Input
                            id={`company-${experience.id}`}
                            placeholder="Nama perusahaan"
                            value={experience.company}
                            onChange={(e) => onUpdate({ company: e.target.value })}
                            onKeyDown={(e) => e.stopPropagation()}
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
                            onKeyDown={(e) => e.stopPropagation()}
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
                            onKeyDown={(e) => e.stopPropagation()}
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
                                onKeyDown={(e) => e.stopPropagation()}
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
                            onKeyDown={(e) => e.stopPropagation()}
                        />
                    </div>
                </div>
            )}

            {isExpanded && (
                /* Description */
                <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
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
                        onKeyDown={(e) => e.stopPropagation()}
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
            )}
        </div>
    );
}

export function ExperienceForm() {
    const { cvData, addExperience, updateExperience, removeExperience, reorderExperience } = useCVStore();

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            const oldIndex = cvData.experiences.findIndex((item) => item.id === active.id);
            const newIndex = cvData.experiences.findIndex((item) => item.id === over?.id);

            if (oldIndex !== -1 && newIndex !== -1) {
                reorderExperience(oldIndex, newIndex);
            }
        }
    };

    return (
        <Card className="neo-card w-full mb-8">
            <CardHeader className="border-b-4 border-black -mt-8 bg-yellow-400 p-6">
                <CardTitle className="flex items-center gap-2 text-2xl font-black uppercase text-black tracking-tighter">
                    <Briefcase className="h-6 w-6 stroke-3" />
                    PENGALAMAN KERJA
                </CardTitle>
                <CardDescription className="font-bold text-black/80">
                    Tambahkan pengalaman kerja Anda, mulai dari yang terbaru
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    {cvData.experiences.length === 0 ? (
                        <div className="rounded-lg border-2 border-dashed p-8 text-center">
                            <Briefcase className="mx-auto h-12 w-12 text-muted-foreground/50" />
                            <h3 className="mt-4 text-lg font-medium">Belum ada pengalaman</h3>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Klik tombol di bawah untuk menambahkan pengalaman kerja pertama Anda
                            </p>
                        </div>
                    ) : (
                        <SortableContext
                            items={cvData.experiences.map(exp => exp.id)}
                            strategy={verticalListSortingStrategy}
                        >
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
                        </SortableContext>
                    )}
                </DndContext>

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
