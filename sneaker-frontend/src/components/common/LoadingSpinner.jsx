import React from 'react';

export default function LoadingSpinner({ message = "CARGANDO DROPS..." }) {
  return (
    <div className="text-center py-20 font-mono text-xs uppercase tracking-widest text-neutral-400">
      {message}
    </div>
  );
}
