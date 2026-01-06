interface QuickActionsProps {
    onActionClick: (message: string) => void;
}

const quickActions = [
    {
        icon: '🧮',
        title: 'Math Help',
        description: 'Solve equations and problems',
        message: 'I need help with a math problem'
    },
    {
        icon: '🔬',
        title: 'Science Tutor',
        description: 'Explore scientific concepts',
        message: 'Can you explain a science concept to me?'
    },
    {
        icon: '📝',
        title: 'Essay Writing',
        description: 'Get writing assistance',
        message: 'I need assistance with essay writing'
    }
];

export default function QuickActions({ onActionClick }: QuickActionsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 max-w-4xl mx-auto">
            {quickActions.map((action, index) => (
                <button
                    key={index}
                    onClick={() => onActionClick(action.message)}
                    className="glass-card text-center hover:border-purple-400/50 transition-all"
                >
                    <div className="text-2xl mb-2">{action.icon}</div>
                    <strong className="block text-white mb-1">{action.title}</strong>
                    <p className="text-sm text-gray-400 m-0">{action.description}</p>
                </button>
            ))}
        </div>
    );
}
