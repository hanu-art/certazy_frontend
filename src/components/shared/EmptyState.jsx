export function EmptyState({ message = 'No data found', icon = '📭' }) {
    return (
        <div className="empty-state">
            <span className="empty-icon">{icon}</span>
            <p>{message}</p>
        </div>
    );
}

export default EmptyState;
