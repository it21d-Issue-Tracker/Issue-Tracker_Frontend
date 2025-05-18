import { useState, useEffect } from 'react';
import CaracteristicaSelect from './CaracteristicaSelect.jsx';
import axios from 'axios';
import '../css/issueFormPage.css';

export default function IssueForm({ isEdit }) {
    const [formData, setFormData] = useState({
        subject: '',
        descripcio: '',
        assignat: '',
        estat: '',
        tipus: '',
        gravetat: '',
        prioritat: '',
    });

    const [usuaris, setUsuaris] = useState([]);
    const [fields, setFields] = useState({
        estat: [],
        tipus: [],
        gravetat: [],
        prioritat: [],
    });

    useEffect(() => {
        async function fetchData() {
            try {
                const [
                    resUsuaris,
                    resEstats,
                    resTipus,
                    resGravetats,
                    resPrioritats,
                ] = await Promise.all([
                    axios.get('https://issue-tracker-c802.onrender.com/api/usuaris/'),
                    axios.get('https://issue-tracker-c802.onrender.com/api/statuses/'),
                    axios.get('https://issue-tracker-c802.onrender.com/api/tipus/'),
                    axios.get('https://issue-tracker-c802.onrender.com/api/severity/'),
                    axios.get('https://issue-tracker-c802.onrender.com/api/priorities/'),
                ]);

                setUsuaris(resUsuaris.data);
                setFields({
                    estat: resEstats.data,
                    tipus: resTipus.data,
                    gravetat: resGravetats.data,
                    prioritat: resPrioritats.data,
                });

                if (isEdit) {
                    const issueId = 123; // Posar l'id que vindra d el acrida mes adalt
                    const resIssue = await axios.get(`/api/issues/${issueId}/`);

                    setFormData({
                        subject: resIssue.data.subject,
                        descripcio: resIssue.data.descripcio,
                        assignat: resIssue.data.assignat,
                        estat: resIssue.data.estat,
                        tipus: resIssue.data.tipus,
                        gravetat: resIssue.data.gravetat,
                        prioritat: resIssue.data.prioritat,
                    });
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchData();
    }, []);


    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = e => {
        e.preventDefault();
        // falta fer la crida al post
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-container">
                <div className="left-column">
                    <fieldset className="form-fields">
                        <input
                            type="text"
                            name="subject"
                            placeholder="Subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                        />
                    </fieldset>
                    <fieldset className="form-fields">
            <textarea
                name="descripcio"
                placeholder="Please add descriptive text..."
                value={formData.descripcio}
                onChange={handleChange}
                required
            />
                    </fieldset>
                </div>

                <div className="right-column">
                    <div>
                        <label htmlFor="assignat">Assign to:</label>
                        <select name="assignat" id="assignat" value={formData.assignat} onChange={handleChange}>
                            <option value="">None</option>
                            {usuaris.map(user => (
                                <option key={user.username} value={user.username}>{user.username}</option>
                            ))}
                        </select>
                    </div>

                    {Object.entries(fields).map(([field, options]) => (
                        <CaracteristicaSelect
                            key={field}
                            field={field}
                            label={field.charAt(0).toUpperCase() + field.slice(1)}
                            options={options}
                            value={formData[field]}
                            onChange={handleChange}
                        />
                    ))}
                </div>
            </div>

            <div className="form-buttons">
                <button type="submit" className="create-issue-button">
                    {isEdit ? 'Save changes' : 'CREATE'}
                </button>
            </div>
        </form>
    );
}
