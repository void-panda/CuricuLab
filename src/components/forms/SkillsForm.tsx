// Skills Form Component with categories and AI suggestions, plus Cross-Category DnD
import { useState } from 'react';
import { useCVStore } from '@/lib/store';
import type { Skill } from '@/types/cv';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Wrench, Plus, X, Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { suggestSkills } from '@/lib/api';
import { cn } from '@/lib/utils';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
    type DragOverEvent,
    DragOverlay,
    defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SKILL_CATEGORIES: { value: Skill['category']; label: string }[] = [
    { value: 'technical', label: 'Teknis' },
    { value: 'soft', label: 'Soft Skill' },
    { value: 'language', label: 'Bahasa' },
];

const SKILL_LEVELS: { value: Skill['level']; label: string }[] = [
    { value: 'beginner', label: 'Pemula' },
    { value: 'intermediate', label: 'Menengah' },
    { value: 'advanced', label: 'Mahir' },
    { value: 'expert', label: 'Ahli' },
];

function SortableSkillTag({ skill, onRemove, id }: { skill: Skill; onRemove: () => void; id: string }) {
    const categoryColors: Record<Skill['category'], string> = {
        technical: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
        soft: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
        language: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20',
    };

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="touch-none">
            <Badge
                variant="outline"
                className={cn(
                    `gap-1 pr-1 cursor-grab active:cursor-grabbing ${categoryColors[skill.category]}`,
                    isDragging && "ring-2 ring-primary"
                )}
            >
                {skill.name}
                {skill.level && (
                    <span className="text-xs opacity-60">
                        ({SKILL_LEVELS.find(l => l.value === skill.level)?.label})
                    </span>
                )}
                <button
                    type="button"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={onRemove}
                    className="ml-1 rounded-full p-0.5 hover:bg-foreground/10 cursor-pointer"
                >
                    <X className="h-3 w-3" />
                </button>
            </Badge>
        </div>
    );
}

// Separate component for DragOverlay to keep it clean
function SkillOverlay({ skill }: { skill: Skill }) {
    const categoryColors: Record<Skill['category'], string> = {
        technical: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
        soft: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
        language: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20',
    };

    return (
        <Badge
            variant="outline"
            className={`gap-1 pr-1 ${categoryColors[skill.category]} shadow-xl scale-105 cursor-grabbing`}
        >
            {skill.name}
            {skill.level && (
                <span className="text-xs opacity-60">
                    ({SKILL_LEVELS.find(l => l.value === skill.level)?.label})
                </span>
            )}
            <div className="ml-1 rounded-full p-0.5">
                <X className="h-3 w-3" />
            </div>
        </Badge>
    );
}

export function SkillsForm() {
    const { cvData, addSkill, removeSkill, reorderSkill, updateSkill } = useCVStore();
    const [newSkill, setNewSkill] = useState('');
    const [category, setCategory] = useState<Skill['category']>('technical');
    const [level, setLevel] = useState<Skill['level']>('intermediate');
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [activeId, setActiveId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = (event: DragEndEvent) => {
        setActiveId(String(event.active.id));
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        const overId = over?.id;

        if (!overId || active.id === overId) return;

        const activeSkill = cvData.skills.find(s => s.id === active.id);
        if (!activeSkill) return;

        // Find which category we are over
        // If we are over a skill, check its category
        // If we are over a container (droppable zone), check which one
        let overCategory: Skill['category'] | undefined;

        // Check if over is a container
        const containerMatch = String(overId).match(/^container-(.+)$/);
        if (containerMatch) {
            overCategory = containerMatch[1] as Skill['category'];
        } else {
            // Check if over is a skill
            const overSkill = cvData.skills.find(s => s.id === overId);
            if (overSkill) {
                overCategory = overSkill.category;
            }
        }

        if (overCategory && activeSkill.category !== overCategory) {
            // OPTIMISTIC UPDATE: Update the category immediately during drag
            updateSkill(activeSkill.id, { category: overCategory });
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId !== overId) {
            const oldIndex = cvData.skills.findIndex((item) => item.id === activeId);
            const newIndex = cvData.skills.findIndex((item) => item.id === overId);

            if (oldIndex !== -1 && newIndex !== -1) {
                reorderSkill(oldIndex, newIndex);
            }
        }
    };

    const handleAddSkill = () => {
        if (!newSkill.trim()) return;

        addSkill({
            name: newSkill.trim(),
            category,
            level,
        });
        setNewSkill('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddSkill();
        }
    };

    const handleGetSuggestions = async () => {
        if (!cvData.settings.targetRole.trim()) {
            setError('Mohon isi posisi yang dilamar terlebih dahulu di langkah Ringkasan');
            return;
        }

        setIsLoadingSuggestions(true);
        setError(null);

        try {
            const currentSkillNames = cvData.skills.map(s => s.name);
            const suggestedSkills = await suggestSkills(
                cvData.settings.targetRole,
                currentSkillNames,
                cvData.settings.language
            );
            setSuggestions(suggestedSkills);
            toast.success("Saran keahlian berhasil dimuat!");
        } catch (err) {
            setError('Gagal mendapatkan saran skill. Silakan coba lagi.');
            console.error('Suggestion error:', err);
        } finally {
            setIsLoadingSuggestions(false);
        }
    };

    const handleAddSuggestion = (skillName: string) => {
        addSkill({
            name: skillName,
            category: 'technical',
            level: 'intermediate',
        });
        setSuggestions(suggestions.filter(s => s !== skillName));
    };

    const skillsByCategory = SKILL_CATEGORIES.map(cat => ({
        ...cat,
        skills: cvData.skills.filter(s => s.category === cat.value),
    }));

    const activeSkill = activeId ? cvData.skills.find(s => s.id === activeId) : null;

    return (
        <Card className="neo-card w-full mb-8 dark:bg-zinc-900 dark:border-white/10 dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.05)]">
            <CardHeader className="border-b-4 border-black dark:border-white/10 -mt-8 bg-purple-400 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]">
                <CardTitle className="flex items-center gap-2 text-black text-2xl font-black uppercase tracking-tighter">
                    <Wrench className="h-6 w-6 stroke-3" />
                    KEAHLIAN
                </CardTitle>
                <CardDescription className="text-black font-bold">
                    Tambahkan keahlian teknis, soft skill, dan kemampuan bahasa Anda
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
                {/* Add new skill */}
                <div className="space-y-4">
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <Label htmlFor="newSkill" className="sr-only">Skill baru</Label>
                            <Input
                                id="newSkill"
                                placeholder="Ketik skill dan tekan Enter"
                                value={newSkill}
                                onChange={(e) => setNewSkill(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                        </div>
                        <Button
                            type="button"
                            onClick={handleAddSkill}
                            disabled={!newSkill.trim()}
                            className="h-10 w-10 border-2 border-black dark:border-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_white] hover:translate-x-px hover:translate-y-px hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[1px_1px_0px_0px_white] transition-all bg-black dark:bg-white text-white dark:text-black p-0"
                        >
                            <Plus className="h-5 w-5" />
                        </Button>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Kategori</Label>
                            <div className="flex gap-1">
                                {SKILL_CATEGORIES.map((cat) => (
                                    <Button
                                        key={cat.value}
                                        type="button"
                                        variant="default"
                                        size="sm"
                                        onClick={() => setCategory(cat.value)}
                                        className={cn(
                                            "h-9 border-2 border-black dark:border-white font-bold uppercase transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_white]",
                                            category === cat.value
                                                ? "bg-primary text-white"
                                                : "bg-white dark:bg-background text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5"
                                        )}
                                    >
                                        {cat.label}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Level</Label>
                            <div className="flex gap-1">
                                {SKILL_LEVELS.map((lvl) => (
                                    <Button
                                        key={lvl.value}
                                        type="button"
                                        variant="default"
                                        size="sm"
                                        onClick={() => setLevel(lvl.value)}
                                        className={cn(
                                            "h-9 border-2 border-black dark:border-white font-bold uppercase transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_white]",
                                            level === lvl.value
                                                ? "bg-black dark:bg-white text-white dark:text-black"
                                                : "bg-white dark:bg-background text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5"
                                        )}
                                    >
                                        {lvl.label}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Skills by category (Cross-Sortable) */}
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                >
                    <div className="space-y-4">
                        {skillsByCategory.map((cat) => (
                            <div key={cat.value} className="space-y-2">
                                <h4 className="text-sm font-medium text-muted-foreground">
                                    {cat.label} ({cat.skills.length})
                                </h4>

                                {/* Droppable Area (Container) */}
                                <div className="min-h-[60px] rounded-lg border border-dashed border-gray-200 dark:border-gray-700 p-2 bg-muted/20">
                                    <SortableContext
                                        id={`container-${cat.value}`}
                                        items={cat.skills.map(s => s.id)}
                                        strategy={rectSortingStrategy}
                                    >
                                        {cat.skills.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {cat.skills.map((skill) => (
                                                    <SortableSkillTag
                                                        key={skill.id}
                                                        id={skill.id}
                                                        skill={skill}
                                                        onRemove={() => removeSkill(skill.id)}
                                                    />
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center min-h-[40px] text-xs text-muted-foreground/40 italic">
                                                Drop here
                                            </div>
                                        )}
                                    </SortableContext>
                                </div>
                            </div>
                        ))}
                    </div>

                    <DragOverlay dropAnimation={{ sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.4' } } }) }}>
                        {activeSkill ? <SkillOverlay skill={activeSkill} /> : null}
                    </DragOverlay>
                </DndContext>

                {/* AI Suggestions */}
                <div className="space-y-3 rounded-lg border bg-muted/30 p-4">
                    <div className="flex items-center md:flex-row flex-col justify-between">
                        <h4 className="text-sm font-medium">Saran Skill dari AI</h4>
                        <Button
                            type="button"
                            variant="default"
                            size="sm"
                            onClick={handleGetSuggestions}
                            disabled={isLoadingSuggestions}
                            className="h-10 border-2 border-black dark:border-white font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_white] hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[2px_2px_0px_0px_white] transition-all bg-green-400 text-black gap-2 uppercase"
                        >
                            {isLoadingSuggestions ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    MEMUAT...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="h-4 w-4" />
                                    DAPATKAN SARAN
                                </>
                            )}
                        </Button>
                    </div>

                    {error && (
                        <p className="text-xs text-destructive">{error}</p>
                    )}

                    {suggestions.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {suggestions.map((skill) => (
                                <Badge
                                    key={skill}
                                    variant="secondary"
                                    className="cursor-pointer gap-1 hover:bg-primary hover:text-primary-foreground"
                                    onClick={() => handleAddSuggestion(skill)}
                                >
                                    <Plus className="h-3 w-3" />
                                    {skill}
                                </Badge>
                            ))}
                        </div>
                    )}

                    {suggestions.length === 0 && !isLoadingSuggestions && !error && (
                        <p className="text-xs text-muted-foreground">
                            Klik "Dapatkan Saran" untuk mendapatkan rekomendasi skill berdasarkan posisi yang Anda lamar
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
