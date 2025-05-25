import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import {useAuth} from "../context/AuthContext.jsx";

/**
 * DeleteModal - Componente Modal de eliminación adaptado para React Router
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Controla si el modal está abierto
 * @param {Function} props.onClose - Función para cerrar el modal
 * @param {string} props.title - Título del modal (ej: "Delete Issue")
 * @param {string} props.itemName - Nombre del elemento a eliminar
 * @param {string} props.entityType - Tipo de entidad (ej: "issue", "due date")
 * @param {string} props.itemId - ID del elemento a eliminar
 * @param {string} props.apiEndpoint - Endpoint para la eliminación
 * @param {string} props.redirectUrl - URL a la que redirigir después de eliminar
 * @param {Function} props.customDeleteFunction - Función personalizada de eliminación (opcional)
 */
export default function DeleteModal({
  isOpen,
  onClose,
  title,
  itemName,
  entityType,
  itemId,
  apiEndpoint,
  redirectUrl,
  customDeleteFunction
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { getAuthHeaders } = useAuth();


    if (!isOpen) return null;

  const handleDelete = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      if (typeof customDeleteFunction === 'function') {
        await customDeleteFunction();
      } else {
        const response = await fetch(`${apiEndpoint}/${itemId}/`, {
          method: 'DELETE',
          headers: getAuthHeaders(),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.detail || `Error ${response.status}: No se pudo eliminar ${entityType}`);
        }
        navigate(redirectUrl);
      }
        onClose();
    } catch (err) {
      console.error(`Error al eliminar ${entityType}:`, err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '1rem'
      }}
      onClick={onClose} 
    >
      <div 
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
          width: '100%',
          maxWidth: '600px', 
          minWidth: '500px', 
          maxHeight: '90vh',
          overflow: 'auto'
        }}
        onClick={(e) => e.stopPropagation()} 
      >
        <div style={{ padding: '2rem' }}> 
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '1.25rem' 
          }}>
            <h2 style={{ 
              fontSize: '1.5rem', 
              textAlign: 'left', 
              color: '#374151', 
              fontWeight: '500', 
              margin: 0 
            }}>
              {title}
            </h2>
            <button 
              onClick={onClose}
              style={{
                fontSize: '1.5rem',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '0.25rem',
                lineHeight: 1,
                color: '#6B7280'
              }}
              aria-label="Close"
            >
              ×
            </button>
          </div>
          
          <p style={{ 
            marginBottom: '1.5rem', 
            color: '#374151',
            fontSize: '1.1rem', 
            lineHeight: '1.6' 
          }}>
            Are you sure you want to delete the {entityType}: "{itemName}"?
          </p>
          
          {error && (
            <div style={{
              marginBottom: '1rem',
              padding: '0.75rem',
              backgroundColor: '#FEE2E2',
              borderLeft: '4px solid #EF4444',
              color: '#B91C1C'
            }}>
              {error}
            </div>
          )}
          
          <div style={{ 
            display: 'flex', 
            gap: '0.75rem', 
            justifyContent: 'center' 
          }}>
            <button
              onClick={handleDelete}
              disabled={isSubmitting}
              style={{
                backgroundColor: isSubmitting ? '#DC2626' : '#DC2626',
                color: 'white',
                padding: '0.75rem 1.5rem', 
                borderRadius: '6px', 
                border: 'none',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.7 : 1,
                fontSize: '1rem', 
                fontWeight: '500'
              }}
              onMouseOver={(e) => {
                if (!isSubmitting) {
                  e.target.style.backgroundColor = '#B91C1C';
                }
              }}
              onMouseOut={(e) => {
                if (!isSubmitting) {
                  e.target.style.backgroundColor = '#DC2626';
                }
              }}
            >
              {isSubmitting ? "Deleating..." : "Delete"}
            </button>
            
            <button
              onClick={onClose}
              style={{
                backgroundColor: '#E5E7EB',
                color: '#374151',
                padding: '0.75rem 1.5rem',
                borderRadius: '6px', 
                border: 'none',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#D1D5DB';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#E5E7EB';
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body 
  );
}