// Skills Form Component with categories and AI suggestions
import { useState } from 'react';
import { useCVStore } from '@/lib/store';
import type { Skill } from '@/types/cv';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Wrench, Plus, X, Sparkles, Loader2 } from 'lucide-react';
import { suggestSkills } from '@/lib/api';

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

function SkillTag({ skill, onRemove }: { skill: Skill; onRemove: () => void }) {
    const categoryColors: Record<Skill['category'], string> = {
        technical: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
        soft: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
        language: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20',
    };

    return (
        <Badge
            variant="outline"
            className={`gap-1 pr-1 ${categoryColors[skill.category]}`}
        >
            {skill.name}
            {skill.level && (
                <span className="text-xs opacity-60">
                    ({SKILL_LEVELS.find(l => l.value === skill.level)?.label})
                </span>
            )}
            <button
                type="button"
                onClick={onRemove}
                className="ml-1 rounded-full p-0.5 hover:bg-foreground/10"
            >
                <X className="h-3 w-3" />
            </button>
        </Badge>
    );
}

export function SkillsForm() {
    const { cvData, addSkill, removeSkill } = useCVStore();
    const [newSkill, setNewSkill] = useState('');
    const [category, setCategory] = useState<Skill['category']>('technical');
    const [level, setLevel] = useState<Skill['level']>('intermediate');
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

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

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Wrench className="h-5 w-5" />
                    Keahlian
                </CardTitle>
                <CardDescription>
                    Tambahkan keahlian teknis, soft skill, dan kemampuan bahasa Anda
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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
                        <Button type="button" onClick={handleAddSkill} disabled={!newSkill.trim()}>
                            <Plus className="h-4 w-4" />
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
                                        variant={category === cat.value ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setCategory(cat.value)}
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
                                        variant={level === lvl.value ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setLevel(lvl.value)}
                                    >
                                        {lvl.label}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Skills by category */}
                <div className="space-y-4">
                    {skillsByCategory.map((cat) => (
                        <div key={cat.value} className="space-y-2">
                            <h4 className="text-sm font-medium text-muted-foreground">
                                {cat.label} ({cat.skills.length})
                            </h4>
                            {cat.skills.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {cat.skills.map((skill) => (
                                        <SkillTag
                                            key={skill.id}
                                            skill={skill}
                                            onRemove={() => removeSkill(skill.id)}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground/60">
                                    Belum ada skill {cat.label.toLowerCase()}
                                </p>
                            )}
                        </div>
                    ))}
                </div>

                {/* AI Suggestions */}
                <div className="space-y-3 rounded-lg border bg-muted/30 p-4">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">Saran Skill dari AI</h4>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleGetSuggestions}
                            disabled={isLoadingSuggestions}
                            className="gap-2"
                        >
                            {isLoadingSuggestions ? (
                                <>
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                    Memuat...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="h-3 w-3" />
                                    Dapatkan Saran
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
