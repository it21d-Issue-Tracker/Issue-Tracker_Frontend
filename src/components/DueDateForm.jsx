import DeleteDeadlineButton from "./DeleteDeadlineButton.jsx";
import '../css/viewIssue.css';

export default function DueDateForm({
                                        dueDate,
                                        comment,
                                        setDueDate,
                                        setComment,
                                        onSubmit,
                                        onDelete,
                                    }) {
    return (
        <form onSubmit={onSubmit}>
            <div className="date-container">
                <fieldset className="form-fields date-box">
                    <input
                        type="date"
                        name="due_date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="date-box"
                    />
                </fieldset>
            </div>

            <fieldset className="form-fields">
                <label htmlFor="id_due_date_comment" className="label-due-date"></label>
                <textarea
                    name="due_date_comment"
                    id="id_due_date_comment"
                    className="form-control"
                    rows="3"
                    placeholder="Reasons for the due date"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
            </fieldset>

            <div className="form-buttons" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                <button type="submit" className="create-issue-button">Save</button>
                <div className="bottom-actions">
                    <DeleteDeadlineButton onDelete={onDelete} />
                </div>
            </div>
        </form>

    );
}
