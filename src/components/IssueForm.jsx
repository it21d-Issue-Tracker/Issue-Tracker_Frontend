import { useState, useEffect } from 'react';
import CaracteristicaSelect from './CaracteristicaSelect.jsx';
import axios from 'axios';
import {useNavigate, useParams} from 'react-router-dom';
import '../css/issueFormPage.css';

export default function IssueForm({ isEdit }) {
    const navigate = useNavigate();
    const { id } = useParams();
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
                    const issueId = id;
                    const resIssue = await axios.get(`https://issue-tracker-c802.onrender.com/api/issues/${issueId}/`);

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
                else {
                    setFormData(prev => ({
                        ...prev,
                        estat: resEstats.data[0]?.name ?? '',
                        tipus: resTipus.data[0]?.name ?? '',
                        gravetat: resGravetats.data[0]?.name ?? '',
                        prioritat: resPrioritats.data[0]?.name ?? '',
                    }));
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

    const handleSubmit = async e => {
        e.preventDefault();

        try {
            const headers = {
                Authorization: 'a0e9e8d35f67afa31eb5fab93182bdf93540ee30409234dab4e5b38a453b7983',
                'Content-Type': 'application/json',
            };

            const data = {
                subject: formData.subject,
                descripcio: formData.descripcio,
                assignat: formData.assignat || null,
                estat: formData.estat,
                tipus: formData.tipus,
                gravetat: formData.gravetat,
                prioritat: formData.prioritat,
            };

            if (isEdit) {
                await axios.patch(
                    `https://issue-tracker-c802.onrender.com/api/issues/${id}/editar/`,
                    data,
                    { headers }
                );
            } else {
                await axios.post(
                    'https://issue-tracker-c802.onrender.com/api/issues/',
                    data,
                    {headers}
                );
            }

            navigate('/issues');

        } catch (error) {
            console.error(`Error al ${isEdit ? 'editar' : 'crear'} la issue:`, error.response?.data || error.message);
        }
    }

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
