import * as React from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export function OnboardingTour() {
    React.useEffect(() => {
        // Only run on client-side and on /builder page
        if (typeof window === "undefined") return;
        if (window.location.pathname !== "/builder" && window.location.pathname !== "/builder/") return;

        const hasSeenTour = localStorage.getItem("curiculab-tour-seen");
        if (hasSeenTour) return;

        const driverObj = driver({
            showProgress: true,
            animate: true,
            overlayColor: "rgba(0, 0, 0, 0.75)",
            stagePadding: 10,
            popoverClass: "neobrutalist-tour-popover",
            steps: [
                {
                    element: "#step-logo",
                    popover: {
                        title: "Selamat Datang di CuricuLab! 🚀",
                        description: "Platform pembuat CV berbasis AI tercanggih untuk karier impianmu.",
                        side: "bottom",
                        align: "start",
                    },
                },
                {
                    element: "#step-build-btn",
                    popover: {
                        title: "Mulai Membuat CV",
                        description: "Klik tombol ini untuk masuk ke halaman Builder dan mulai susun CV-mu.",
                        side: "bottom",
                        align: "center",
                    },
                },
                {
                    element: "#step-settings",
                    popover: {
                        title: "Pengaturan Lanjut",
                        description: "Di sini kamu bisa memasukkan API Key Gemini pribadimu untuk penggunaan lebih efektif.",
                        side: "bottom",
                        align: "end",
                    },
                },
                {
                    element: "#step-indicator",
                    popover: {
                        title: "Navigasi Langkah",
                        description: "Gunakan bar navigasi ini untuk berpindah antar bagian CV (Info Pribadi, Pengalaman, Skill, dll).",
                        side: "bottom",
                        align: "center",
                    },
                },
                {
                    element: "#step-form-content",
                    popover: {
                        title: "Isi Data & Gunakan AI",
                        description: "Isi form ini sesuai datamu. Jangan lupa gunakan tombol 'Enhance' bertenaga AI untuk memoles tulisanmu!",
                        side: "right",
                        align: "center",
                    },
                },
                {
                    element: "#step-navigation",
                    popover: {
                        title: "Selesaikan & Download",
                        description: "Gunakan tombol Next untuk lanjut ke langkah berikutnya. Di akhir, kamu bisa download CV-mu dalam format PDF atau DOCX.",
                        side: "top",
                        align: "center",
                    },
                },
            ],
            onDestroyed: () => {
                localStorage.setItem("curiculab-tour-seen", "true");
            },
        });

        // Small delay to ensure all elements are rendered
        const timer = setTimeout(() => {
            driverObj.drive();
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    return null;
}

// Global styles for the tour popover (to be added to global.css if needed)
// But for now, we can inject a style tag or just rely on the neobrutalist classes we will add
