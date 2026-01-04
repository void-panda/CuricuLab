import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
    const { theme = "system" } = useTheme()

    return (
        <Sonner
            theme={theme as ToasterProps["theme"]}
            className="toaster group"
            toastOptions={{
                classNames: {
                    toast:
                        "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-4 group-[.toaster]:border-black dark:group-[.toaster]:border-white group-[.toaster]:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:group-[.toaster]:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] group-[.toaster]:rounded-none group-[.toaster]:font-black group-[.toaster]:uppercase group-[.toaster]:tracking-tight",
                    description: "group-[.toast]:text-muted-foreground group-[.toast]:font-bold",
                    actionButton:
                        "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:border-2 group-[.toast]:border-black group-[.toast]:font-black",
                    cancelButton:
                        "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:border-2 group-[.toast]:border-black group-[.toast]:font-black",
                },
            }}
            {...props}
        />
    )
}

export { Toaster }
