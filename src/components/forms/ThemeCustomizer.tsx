
import { useCVStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Palette, Type, Layout } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming cn utility exists

const PRIMARY_COLORS = [
    { name: 'Hitam', value: '#000000', class: 'bg-black' },
    { name: 'Biru', value: '#3B82F6', class: 'bg-blue-500' },
    { name: 'Merah', value: '#EF4444', class: 'bg-red-500' },
    { name: 'Hijau', value: '#22C55E', class: 'bg-green-500' },
    { name: 'Ungu', value: '#A855F7', class: 'bg-purple-500' },
    { name: 'Indigo', value: '#6366F1', class: 'bg-indigo-500' },
];

const FONTS = [
    { name: 'Sans Serif (Modern)', value: 'font-sans' },
    { name: 'Serif (Formal)', value: 'font-serif' },
    { name: 'Monospace (Technical)', value: 'font-mono' },
];

const SPACING = [
    { name: 'Compact', value: 'compact' },
    { name: 'Normal', value: 'normal' },
    { name: 'Relaxed', value: 'relaxed' },
];

export function ThemeCustomizer() {
    const { cvData, setSettings } = useCVStore();
    const { theme } = cvData.settings;

    const updateTheme = (key: keyof typeof theme, value: any) => {
        setSettings({
            theme: {
                ...theme,
                [key]: value,
            },
        });
    };

    return (
        <Card className="neo-card w-full mb-6 border-2 border-black dark:border-white/20">
            <CardHeader className="bg-muted/20 border-b-2 border-black dark:border-white/10 pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                    <Palette className="h-5 w-5" />
                    Kustomisasi Tema
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
                {/* Primary Color */}
                <div className="space-y-3">
                    <Label className="flex items-center gap-2 text-base font-semibold">
                        <div className="h-2 w-2 rounded-full bg-current" />
                        Warna Aksen
                    </Label>
                    <div className="flex flex-wrap gap-3">
                        {PRIMARY_COLORS.map((color) => (
                            <button
                                key={color.value}
                                onClick={() => updateTheme('primaryColor', color.value)}
                                className={cn(
                                    "h-10 w-10 rounded-full border-2 border-transparent transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2",
                                    color.class,
                                    theme.primaryColor === color.value && "border-black dark:border-white ring-2 ring-black/20 dark:ring-white/20 scale-110 shadow-md"
                                )}
                                title={color.name}
                                aria-label={`Pilih warna ${color.name}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Typography */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <Label className="flex items-center gap-2 text-base font-semibold">
                            <Type className="h-4 w-4" />
                            Jenis Font
                        </Label>
                        <Select
                            value={theme.fontBody}
                            onValueChange={(val) => {
                                updateTheme('fontBody', val);
                                updateTheme('fontHeading', val); // Sync for simplicity for now
                            }}
                        >
                            <SelectTrigger className="w-full border-2 border-black dark:border-white/10 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_white]">
                                <SelectValue>Pilih Font</SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {FONTS.map((font) => (
                                    <SelectItem key={font.value} value={font.value}>
                                        <span className={font.value}>{font.name}</span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Spacing */}
                    <div className="space-y-3">
                        <Label className="flex items-center gap-2 text-base font-semibold">
                            <Layout className="h-4 w-4" />
                            Kerapatan
                        </Label>
                        <Select
                            value={theme.spacing}
                            onValueChange={(val) => updateTheme('spacing', val)}
                        >
                            <SelectTrigger className="w-full border-2 border-black dark:border-white/10 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_white]">
                                <SelectValue>Pilih Spasi</SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {SPACING.map((space) => (
                                    <SelectItem key={space.value} value={space.value}>
                                        {space.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
