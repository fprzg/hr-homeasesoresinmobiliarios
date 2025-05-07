// src/components/ImageUploader.tsx
import { useState } from 'react';
import { ArchivosApi } from '@/api';
import { Label } from './ui/label';
import { Input } from './ui/input';

interface ImageUploaderProps {
    onImageUploaded: (imageId: string, fileName: string) => void;
    label?: string;
    className?: string;
}

export default function ImageUploader({
    onImageUploaded,
    label = 'Subir imagen',
    className = ''
}: ImageUploaderProps) {
    const [isUploading, setIsUploading] = useState(false);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        try {
            setIsUploading(true);
            //const file = e.target.files[0];
            const files = [...e.target.files];
            const result = await ArchivosApi.subir(files);

            if (result.length > 0) {
                const { id, originalName } = result[0];
                onImageUploaded(id, originalName);
            }
        } catch (error) {
            console.error('Error al subir imagen:', error);
            alert('Error al subir la imagen. Inténtalo de nuevo.');
        } finally {
            setIsUploading(false);
        }
    };

    const elementId = Math.random();

    return (
        <div className={`${className}`}>
            <Input
                type="file"
                id={`image-upload-${elementId}`}
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploading}
                style={{ display: 'none' }}
            />
            <Label
                htmlFor={`image-upload-${elementId}`}
                className="btn-upload"
            >
                {isUploading ? 'Subiendo...' : label}
            </Label>
        </div>
    );
}