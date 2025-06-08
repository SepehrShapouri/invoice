import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
            <div className="space-y-4 text-center">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">404</h1>
                <h2 className="text-2xl font-semibold">Page not found</h2>
                <p className="text-muted-foreground max-w-[500px]">
                    Sorry, we couldn't find the page you're looking for.
                </p>
                <Link href="/">
                    <Button variant="default" size="lg">
                        <Home className="mr-2 h-4 w-4" />
                        Back to Home
                    </Button>
                </Link>
            </div>
        </div>
    )
}
