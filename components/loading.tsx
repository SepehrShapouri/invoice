import { Loader2 } from "lucide-react"

interface LoadingProps {
    className?: string
    size?: "sm" | "md" | "lg"
    fullScreen?: boolean
}

const sizeMap = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12"
}

export function Loading({ className = "", size = "md", fullScreen = false }: LoadingProps) {
    const containerClasses = fullScreen
        ? "min-h-screen flex items-center justify-center bg-background/50"
        : "flex items-center justify-center p-4"

    return (
        <div className={containerClasses}>
            <div className="flex flex-col items-center gap-2">
                <Loader2 className={`animate-spin ${sizeMap[size]} text-muted-foreground ${className}`} />
                {size === "lg" && (
                    <p className="text-sm text-muted-foreground animate-pulse">Loading...</p>
                )}
            </div>
        </div>
    )
} 