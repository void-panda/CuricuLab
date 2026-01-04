import { useState } from 'react';
import { useCVStore } from '@/lib/store';
import type { Certification } from '@/types/cv';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Award, Plus, Trash2, GripVertical, ChevronDown, ChevronUp } from 'lucide-react';
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

function CertificationItem({
    certification,
    onUpdate,
    onRemove
}: {
    certification: Certification;
    onUpdate: (data: Partial<Certification>) => void;
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
    } = useSortable({ id: certification.id });

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
                            {certification.name || 'Sertifikasi Baru'}
                        </span>
                        {certification.issuer && (
                            <span className="text-sm text-muted-foreground">
                                {certification.issuer}
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
                <div className="space-y-4 pt-2 border-t border-dashed border-gray-200 dark:border-gray-700 animate-in slide-in-from-top-2 duration-200">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor={`name-${certification.id}`}>Nama Sertifikasi *</Label>
                            <Input
                                id={`name-${certification.id}`}
                                placeholder="Contoh: AWS Solutions Architect"
                                value={certification.name}
                                onChange={(e) => onUpdate({ name: e.target.value })}
                                onKeyDown={(e) => e.stopPropagation()}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor={`issuer-${certification.id}`}>Penerbit *</Label>
                            <Input
                                id={`issuer-${certification.id}`}
                                placeholder="Contoh: Amazon Web Services"
                                value={certification.issuer}
                                onChange={(e) => onUpdate({ issuer: e.target.value })}
                                onKeyDown={(e) => e.stopPropagation()}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor={`date-${certification.id}`}>Tanggal *</Label>
                            <Input
                                id={`date-${certification.id}`}
                                type="month"
                                value={certification.date}
                                onChange={(e) => onUpdate({ date: e.target.value })}
                                onKeyDown={(e) => e.stopPropagation()}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor={`url-${certification.id}`}>Link Kredensial (Opsional)</Label>
                            <Input
                                id={`url-${certification.id}`}
                                placeholder="https://..."
                                value={certification.url || ''}
                                onChange={(e) => onUpdate({ url: e.target.value })}
                                onKeyDown={(e) => e.stopPropagation()}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor={`description-${certification.id}`}>Deskripsi (Opsional)</Label>
                        <Textarea
                            id={`description-${certification.id}`}
                            placeholder="Deskripsi singkat tentang sertifikasi ini..."
                            value={certification.description || ''}
                            onChange={(e) => onUpdate({ description: e.target.value })}
                            rows={3}
                            className="resize-none"
                            onKeyDown={(e) => e.stopPropagation()}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export function CertificationForm() {
    const { cvData, addCertification, updateCertification, removeCertification, reorderCertification } = useCVStore();

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            const oldIndex = cvData.certifications.findIndex((item) => item.id === active.id);
            const newIndex = cvData.certifications.findIndex((item) => item.id === over?.id);

            if (oldIndex !== -1 && newIndex !== -1) {
                reorderCertification(oldIndex, newIndex);
            }
        }
    };

    return (
        <Card className="neo-card w-full mb-8 dark:bg-zinc-900 dark:border-white/10 dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.05)]">
            <CardHeader className="border-b-4 border-black dark:border-white/10 -mt-8 bg-primary p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]">
                <CardTitle className="flex items-center gap-2 text-2xl font-black uppercase text-black tracking-tighter">
                    <Award className="h-6 w-6 stroke-3" />
                    Sertifikasi & Penghargaan
                </CardTitle>
                <CardDescription className="font-bold text-black/80">
                    Tambahkan sertifikasi, lisensi, atau penghargaan yang relevan
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    {cvData.certifications.length === 0 ? (
                        <div className="rounded-lg border-2 border-dashed p-8 text-center">
                            <Award className="mx-auto h-12 w-12 text-muted-foreground/50" />
                            <h3 className="mt-4 text-lg font-medium">Belum ada sertifikasi</h3>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Tambahkan sertifikasi untuk meningkatkan kredibilitas Anda
                            </p>
                        </div>
                    ) : (
                        <SortableContext
                            items={cvData.certifications.map(cert => cert.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="space-y-4">
                                {cvData.certifications.map((cert) => (
                                    <CertificationItem
                                        key={cert.id}
                                        certification={cert}
                                        onUpdate={(data) => updateCertification(cert.id, data)}
                                        onRemove={() => removeCertification(cert.id)}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    )}
                </DndContext>

                <Button
                    type="button"
                    variant="default"
                    onClick={addCertification}
                    className="h-12 w-full border-2 border-black dark:border-white font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_white] hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[2px_2px_0px_0px_white] transition-all bg-purple-400 text-black gap-2 uppercase"
                >
                    <Plus className="h-5 w-5" />
                    TAMBAH SERTIFIKASI
                </Button>
            </CardContent>
        </Card>
    );
}
