export default function DeleteDeadlineButton({ onDelete }) {
    return (
        <button type="button" className="delete-btn" onClick={onDelete}>
            <i className="fa-solid fa-trash"></i>
        </button>

        
    );
}