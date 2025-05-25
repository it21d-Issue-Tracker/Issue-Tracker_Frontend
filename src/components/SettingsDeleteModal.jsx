import React, {useEffect, useState} from 'react';
import { createPortal } from 'react-dom';
import '../css/modal.css';
import {AuthProvider} from "../context/AuthContext.jsx";

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
        headers: {
          'Content-Type': 'application/json',
          'Authorization': AuthProvider.currentUser.getApiKey(),
        },
        body: JSON.stringify({ sustituto: replacementId }),
      });

      if (!response.ok) {
        let errorMessage = `Error ${response.status}: No se pudo eliminar ${entityType}`;
        try {
          const contentType = response.headers.get('content-type');

          if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            errorMessage = data?.detail || JSON.stringify(data);
          } else {
            const text = await response.text();
            // Detectamos el caso de "Bug"
            if (text.includes("You cannot delete")) {
              errorMessage = `No puedes eliminar el tipus ${itemName}.`;
            } else if (text && !text.trim().startsWith('<')) {
              errorMessage = text;
            }
          }
        } catch {
          // dejamos el mensaje por defecto
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
