import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface ToolCardProps {
  id: string;
  name: string;
  description: string;
  href: string;
  icon: LucideIcon;
  color?: string;
}

export function ToolCard({ name, description, href, icon: Icon, color = "text-blue-500" }: ToolCardProps) {
  return (
    <Link href={href} className="group">
      <Card className="h-full transition-all duration-300 hover:scale-[1.02]">
        <CardHeader>
          <div className={`flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-800/50 ${color} transition-colors group-hover:bg-zinc-800`}>
            <Icon className="h-6 w-6" />
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <CardTitle className="text-lg">{name}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
}
