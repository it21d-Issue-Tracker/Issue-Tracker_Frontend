import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/issueFormPage.css';

export default function BulkInsertForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        subject: ''
    });
    const [errors, setErrors] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors.length > 0) {
            setErrors([]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors([]);

        try {
            const lines = formData.subject
                .split('\n')
                .map(line => line.trim())
                .filter(line => line.length > 0);

            if (lines.length === 0) {
                setErrors(['Please enter at least one issue title']);
                setIsSubmitting(false);
                return;
            }

            const data = lines.map(line => ({
                titol: line
            }));

            const headers = {
                Authorization: '5d835a42496a91a23a02fe988257a1d7ae6e4561399843f71275e010cf398e43',
                'Content-Type': 'application/json',
            };

            await axios.post(
                'https://issue-tracker-c802.onrender.com/api/issues/bulk-insert/',
                data,
                { headers }
            );

            navigate('/issues');

        } catch (error) {
            console.error('Error creating bulk issues:', error);
            
            if (error.response?.data) {
                const errorData = error.response.data;
                if (Array.isArray(errorData)) {
                    setErrors(errorData.map(err => err.message || 'Unknown error'));
                } else if (typeof errorData === 'object') {
                    const errorMessages = Object.entries(errorData).map(
                        ([field, messages]) => {
                            const message = Array.isArray(messages) ? messages.join(', ') : messages;
                            // Remove "detail:" prefix if it exists
                            if (field.toLowerCase() === 'detail') {
                                return message;
                            }
                            return `${field}: ${message}`;
                        }
                    );
                    setErrors(errorMessages);
                } else {
                    setErrors([errorData.toString()]);
                }
            } else {
                setErrors(['Error creating issues. Please try again.']);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="lightbox-create-edit">
            <div style={{ textAlign: 'right' }}>
                <Link
                    to="/issues"
                    className="back-link"
                >
                    x
                </Link>
            </div>
            <h2 className="title">New Bulk Insert</h2>
            
            <form onSubmit={handleSubmit}>
                <div className="form-container">
                    <div className="left-column" style={{ width: '100%' }}>
                        <fieldset className="form-fields">
                            <textarea
                                name="subject"
                                id="id_subject"
                                placeholder="Write each issue on a new line"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                                rows={10}
                                style={{ minHeight: '200px' }}
                            />
                        </fieldset>
                    </div>
                </div>
                
                <div className="form-buttons">
                    <button 
                        type="submit" 
                        className="create-issue-button"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </form>

            {errors.length > 0 && (
                <div style={{
                    marginTop: '20px',
                    padding: '16px',
                    backgroundColor: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: '8px',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <div style={{
                            width: '20px',
                            height: '20px',
                            backgroundColor: '#dc2626',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: '8px',
                            flexShrink: 0
                        }}>
                            <span style={{
                                color: 'white',
                                fontSize: '12px',
                                fontWeight: 'bold'
                            }}>!</span>
                        </div>
                        <h4 style={{
                            margin: 0,
                            color: '#dc2626',
                            fontSize: '16px',
                            fontWeight: '600',
                            marginRight: '8px'
                        }}>
                            Error{errors.length > 1 ? 's' : ''} occurred:
                        </h4>
                        <span style={{
                            color: '#7f1d1d',
                            fontSize: '14px',
                            lineHeight: '1.5'
                        }}>
                            {errors.join(', ')}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}