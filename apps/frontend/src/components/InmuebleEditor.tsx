// src/components/InmuebleEditor.tsx
import React, { useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { inmueblePageSchema, InmueblePage } from "@shared/schemas/inmueble";
//import { z } from "zod";

const defaultPage: InmueblePage = {
  id: crypto.randomUUID(),
  slug: "nuevo-inmueble",
  categoria: "casas",
  titulo: "",
  metadata: {
    ubicacion: "",
    precio: 0,
    fechaPublicacion: new Date().toISOString(),
    portadaUrl: "",
  },
  contenido: {
    type: "doc",
    content: [{ type: "paragraph", content: [{ type: "text", text: "" }] }],
  },
  bloques: [],
};

export function InmuebleEditor({
  initial,
  onSubmit,
}: {
  initial?: InmueblePage;
  onSubmit: (data: InmueblePage) => void;
}) {
  const [page, setPage] = useState<InmueblePage>(initial || defaultPage);
  const editor = useEditor({
    extensions: [StarterKit],
    content: page.contenido,
    onUpdate({ editor }) {
      const json = editor.getJSON();
      setPage(p => ({ ...p, contenido: json }));
    },
  });

  function handleChange<K extends keyof InmueblePage["metadata"]>(
    key: K,
    value: InmueblePage["metadata"][K]
  ) {
    setPage(p => ({
      ...p,
      metadata: { ...p.metadata, [key]: value },
    }));
  }

  function handleSave() {
    try {
      const validated = inmueblePageSchema.parse(page);
      onSubmit(validated);
    } catch (err) {
      alert("Contenido inválido. Revisa los campos.");
      console.error(err);
    }
  }

  return (
    <div className="grid gap-4">
      <input
        type="text"
        className="input"
        placeholder="Título"
        value={page.titulo}
        onChange={e => setPage(p => ({ ...p, titulo: e.target.value }))}
      />

      <input
        type="text"
        className="input"
        placeholder="Ubicación"
        value={page.metadata.ubicacion}
        onChange={e => handleChange("ubicacion", e.target.value)}
      />

      <input
        type="number"
        className="input"
        placeholder="Precio"
        value={page.metadata.precio}
        onChange={e => handleChange("precio", parseFloat(e.target.value))}
      />

      <input
        type="text"
        className="input"
        placeholder="Portada (URL)"
        value={page.metadata.portadaUrl}
        onChange={e => handleChange("portadaUrl", e.target.value)}
      />

      <div className="prose border rounded p-4">
        <EditorContent editor={editor} />
      </div>

      <button className="btn btn-primary mt-2" onClick={handleSave}>
        Guardar
      </button>
    </div>
  );
}
