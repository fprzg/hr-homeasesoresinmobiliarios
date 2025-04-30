// src/components/BloqueTexto.tsx
import { useState, useEffect } from 'react';
import { BloqueDocumento } from '@shared/zodSchemas/documento';

interface BloqueTextoProps {
  bloque: Extract<BloqueDocumento, { tipo: 'Texto' }>;
  onChange: (bloque: Extract<BloqueDocumento, { tipo: 'Texto' }>) => void;
  onDelete: () => void;
}

export default function BloqueTexto({ bloque, onChange, onDelete }: BloqueTextoProps) {
  const [texto, setTexto] = useState(bloque.texto);

  useEffect(() => {
    setTexto(bloque.texto);
  }, [bloque.texto]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const nuevoTexto = e.target.value;
    setTexto(nuevoTexto);
    onChange({ ...bloque, texto: nuevoTexto });
  };

  return (
    <div className="bloque-texto">
      <div className="bloque-header">
        <h4>Bloque de Texto</h4>
        <button 
          type="button" 
          className="btn-eliminar" 
          onClick={onDelete}
        >
          Eliminar
        </button>
      </div>
      <textarea 
        value={texto} 
        onChange={handleChange} 
        rows={5} 
        placeholder="Escribe el contenido del bloque de texto aquí..."
      />
    </div>
  );
}