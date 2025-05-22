import React from "react";
import "../css/assignedAndWatchers.css";

export default function MultiUserSelector({ users, selectedUsers, onChange }) {
    const toggleUser = (username) => {
        if (selectedUsers.includes(username)) {
            onChange(selectedUsers.filter(u => u !== username));
        } else {
            onChange([...selectedUsers, username]);
        }
    };

    return (
        <div>
            {users.map((user) => (
                <div
                    key={user.id}
                    className={`user-option ${selectedUsers.includes(user.username) ? 'selected' : ''}`}
                    onClick={() => toggleUser(user.username)}
                >
                    {user.username}
                </div>
            ))}
        </div>
    );
}
