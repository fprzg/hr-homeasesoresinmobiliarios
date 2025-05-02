// src/components/DragDropList.tsx
import { useState, useRef } from 'react';

interface DragDropListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: ((item: T) => string);
  onReorder: (items: T[]) => void;
}

export default function DragDropList<T>({ 
  items, 
  renderItem, 
  keyExtractor, 
  onReorder 
}: DragDropListProps<T>) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const draggedItemRef = useRef<HTMLDivElement | null>(null);

  const handleDragStart = (index: number, e: React.DragEvent<HTMLDivElement>) => {
    setDraggedIndex(index);
    draggedItemRef.current = e.currentTarget;
    
    // Establecer el efecto de arrastre
    e.dataTransfer.effectAllowed = 'move';
    
    // Hacer la imagen del elemento arrastrado semitransparente
    setTimeout(() => {
      if (draggedItemRef.current) {
        draggedItemRef.current.style.opacity = '0.5';
      }
    }, 0);
  };

  const handleDragEnd = () => {
    if (draggedItemRef.current) {
      draggedItemRef.current.style.opacity = '1';
    }
    setDraggedIndex(null);
    draggedItemRef.current = null;
  };

  const handleDragOver = (index: number, e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    
    // Reordenar los elementos
    const newItems = [...items];
    const draggedItem = newItems[draggedIndex];
    
    // Eliminar el elemento arrastrado y luego insertarlo en la nueva posición
    newItems.splice(draggedIndex, 1);
    newItems.splice(index, 0, draggedItem);
    
    onReorder(newItems);
    setDraggedIndex(index);
  };

  return (
    <div className="grid grid-cols-1">
      {items.map((item, index) => (
        <div
          key={keyExtractor(item)}
          draggable
          onDragStart={(e) => handleDragStart(index, e)}
          onDragEnd={handleDragEnd}
          onDragOver={(e) => handleDragOver(index, e)}
          className="drag-drop-item"
        >
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
}