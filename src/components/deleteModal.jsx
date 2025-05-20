import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
 */
export default function DeleteModal({ 
  isOpen, 
  onClose, 
  title, 
  itemName, 
  entityType, 
  itemId,
  apiEndpoint,
  redirectUrl
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Si el modal no está abierto, no renderizar nada
  if (!isOpen) return null;

  const handleDelete = async () => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch(`${apiEndpoint}/${itemId}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 5d835a42496a91a23a02fe988257a1d7ae6e4561399843f71275e010cf398e43'
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Error ${response.status}: No se pudo eliminar ${entityType}`);
      }

      onClose();
      navigate(redirectUrl);
    } catch (err) {
      console.error(`Error al eliminar ${entityType}:`, err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4"
      onClick={onClose} // Cerrar al hacer clic en el fondo
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()} // Evitar que los clics dentro del modal lo cierren
      >
        <div className="p-6">
          <div className="flex justify-between items-center w-full mb-5">
            <h2 className="text-xl text-left text-gray-800 font-medium m-0">{title}</h2>
            <button 
              onClick={onClose}
              className="text-2xl bg-transparent border-0 cursor-pointer"
              aria-label="Close"
            >
              x
            </button>
          </div>
          
          <p className="mb-5">
            ¿Estás seguro que deseas eliminar este {entityType}: "{itemName}"?
          </p>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700">
              {error}
            </div>
          )}
          
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleDelete}
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
            >
              {isSubmitting ? "Procesando..." : "Eliminar"}
            </button>
            
            <button
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}