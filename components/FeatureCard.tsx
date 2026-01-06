interface FeatureCardProps {
    icon: string;
    title: string;
    description: string;
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
    return (
        <div className="glass-card cursor-pointer group">
            <div className="w-16 h-16 gradient-primary rounded-xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-gray-400">{description}</p>
        </div>
    );
}
