import React, {useEffect, useState} from 'react';
import { createPortal } from 'react-dom';
import '../css/modal.css';
import {AuthProvider, useAuth} from "../context/AuthContext.jsx";

const SettingsDeleteModal = ({
  isOpen,
  onClose,
  itemId,
  itemName,
  entityType,
  apiEndpoint,
  onDeleteSuccess
}) => {
  const [replacementId, setReplacementId] = useState('');
  const [options, setOptions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { getAuthHeaders } = useAuth();


  useEffect(() => {
    if (isOpen) {
      fetch(apiEndpoint)
        .then(res => res.json())
        .then(data => {
          const filtered = data.filter(item => item.id !== itemId);
          setOptions(filtered);
          if (filtered.length > 0) {
            setReplacementId(filtered[0].id.toString());
          }
        })
        .catch(() => setOptions([]));
    }
  }, [isOpen, apiEndpoint, itemId]);

  const handleDelete = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`${apiEndpoint}${itemId}/delete_with_replacement/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ sustituto: replacementId }),
      });

  if (!response.ok) {
    let errorMessage = `Error ${response.status}: Failed to delete ${entityType}.`;
    const contentType = response.headers.get('content-type');
    const text = await response.text();
    let combinedMessage = text;

    try {
      if (contentType?.includes('application/json')) {
        const data = JSON.parse(text);
        if (data?.detail || data?.error) {
          combinedMessage = `${data.detail || data.error} ${text}`;
        }
      }
    } catch {
      // Ignore JSON parse errors, keep using raw text
    }

    // Buscar mensaje específico si está en el texto combinado
    if (combinedMessage.includes("You cannot delete")) {
      errorMessage = `You cannot delete the ${entityType} "${itemName}".`;
    } else if (combinedMessage && !combinedMessage.trim().startsWith('<')) {
      errorMessage = combinedMessage;
    }

    throw new Error(errorMessage);
  }

      onDeleteSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const selectedOption = options.find(opt => opt.id === Number(replacementId));
  const selectedColor = selectedOption?.color || '#ccc';

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>Delete {entityType.charAt(0).toUpperCase() + entityType.slice(1)}</h2>
        <p>
          You are about to delete <strong>{itemName}</strong>.<br />
          Please choose a replacement {entityType}:
        </p>

        {options.length > 0 ? (
          <div className="modal-select-wrapper">
            <span className="modal-select-label">
              {entityType.charAt(0).toUpperCase() + entityType.slice(1)}:
            </span>

            <select
              value={replacementId}
              onChange={e => setReplacementId(e.target.value)}
              className="modal-select"
            >
              {options.map(opt => (
                <option key={opt.id} value={opt.id}>{opt.name}</option>
              ))}
            </select>

            <div
              className="modal-round-button"
              style={{ backgroundColor: selectedColor }}
            />
          </div>
        ) : (
          <p className="modal-error">No available replacement {entityType}s.</p>
        )}

        {error && <p className="modal-error">{error}</p>}

        <div className="modal-actions">
          <button onClick={onClose} className="cancel-button" disabled={isSubmitting}>
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="confirm-button"
            disabled={isSubmitting || !replacementId}
          >
            {isSubmitting ? 'Deleting...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default SettingsDeleteModal;
