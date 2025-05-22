export default function UserSelector({ users, selectedUser, onChange }) {
    const handleClick = (username) => {
        onChange(selectedUser === username ? null : username);
    };

    return (
        <div>
            {users.map((user) => {
                return (
                    <div
                        key={user.id}
                        className={`user-option ${selectedUser === user.username ? 'selected' : ''}`}
                        onClick={() => handleClick(user.username)}
                    >
                        {user.username}
                    </div>
                );
            })}
        </div>
    );
}