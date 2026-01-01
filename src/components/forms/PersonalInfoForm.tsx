// Personal Information Form Component
import { useEffect } from 'react';
import { useCVStore } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { User, Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

export function PersonalInfoForm() {
    const { cvData, setPersonal, loadFromStorage } = useCVStore();
    const { personal } = cvData;

    // Load data from storage on mount
    useEffect(() => {
        loadFromStorage();
    }, []);

    return (
        <Card className="neo-card w-full mb-8">
            <CardHeader className="border-b-4 border-black dark:border-white -mt-8 bg-yellow-400 p-6">
                <CardTitle className="flex items-center gap-2 text-2xl font-black uppercase tracking-tighter">
                    <User className="h-6 w-6 stroke-3" />
                    DATA PRIBADI
                </CardTitle>
                <CardDescription className="font-bold text-black/80">
                    Masukkan informasi dasar Anda yang akan ditampilkan di CV
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
                {/* Full Name */}
                <div className="space-y-2">
                    <Label htmlFor="fullName">Nama Lengkap *</Label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            id="fullName"
                            placeholder="Contoh: John Doe"
                            value={personal.fullName}
                            onChange={(e) => setPersonal({ fullName: e.target.value })}
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            id="email"
                            type="email"
                            placeholder="contoh@email.com"
                            value={personal.email}
                            onChange={(e) => setPersonal({ email: e.target.value })}
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                    <Label htmlFor="phone">Nomor Telepon *</Label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            id="phone"
                            type="tel"
                            placeholder="+62 812 3456 7890"
                            value={personal.phone}
                            onChange={(e) => setPersonal({ phone: e.target.value })}
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* Location */}
                <div className="space-y-2">
                    <Label htmlFor="location">Lokasi *</Label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            id="location"
                            placeholder="Jakarta, Indonesia"
                            value={personal.location}
                            onChange={(e) => setPersonal({ location: e.target.value })}
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* LinkedIn (Optional) */}
                <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn (Opsional)</Label>
                    <div className="relative">
                        <Linkedin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            id="linkedin"
                            placeholder="linkedin.com/in/username"
                            value={personal.linkedin || ''}
                            onChange={(e) => setPersonal({ linkedin: e.target.value })}
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* Portfolio (Optional) */}
                <div className="space-y-2">
                    <Label htmlFor="portfolio">Portfolio/Website (Opsional)</Label>
                    <div className="relative">
                        <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            id="portfolio"
                            placeholder="https://portfolio.com"
                            value={personal.portfolio || ''}
                            onChange={(e) => setPersonal({ portfolio: e.target.value })}
                            className="pl-10"
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
