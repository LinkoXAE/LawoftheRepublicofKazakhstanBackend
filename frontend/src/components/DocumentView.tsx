import React from 'react';

export default function DocumentView({ doc }: { doc: any }) {
  if (!doc) return null;

  if (doc.error) {
    return <div style={{ color: 'red' }}>{doc.error}</div>;
  }

  return (
    <div>
      <h2>{doc.title}</h2>
      <p><b>Статус:</b> {doc.status}</p>
      <p>{doc.description}</p>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{doc.text}</pre>
      <a href={doc.source} target="_blank">Источник</a>
    </div>
  );
}
