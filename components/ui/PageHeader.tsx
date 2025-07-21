// components/ui/PageHeader.tsx
type Props = {
    title?: string;
    subtitle?: string;
    icon?: React.ReactNode;
};

export default function PageHeader({ title, subtitle, icon }: Props) {
    return (
        <div className="mb-6">
            <h1 className="text-2xl font-bold flex items-center gap-2">
                {icon}
                {title}
            </h1>
            {subtitle && <p className="text-muted-foreground text-sm">{subtitle}</p>}
        </div>
    );
}
