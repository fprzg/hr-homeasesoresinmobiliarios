import { useState, useEffect } from 'react';
import { BloqueDocumento } from '@shared/zod';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';

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
    <div className="bg-cyan-300">
      <div className="bloque-header">
        <Label>Bloque de Texto</Label>
        <Button
          type="button"
          className="btn-eliminar"
          onClick={onDelete}
        >
          Eliminar
        </Button>
      </div>
      <Textarea
        value={texto}
        onChange={handleChange}
        rows={5}
        placeholder="Escribe el contenido del bloque de texto aquí..."
      />
    </div>
  );
}