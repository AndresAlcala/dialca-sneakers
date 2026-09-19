import React from 'react';
import SneakerCard from './SneakerCard';

export default function SneakerGrid({ sneakers, onSelectSneaker }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {sneakers.map((sneaker) => (
        <SneakerCard
          key={sneaker.id}
          sneaker={sneaker}
          onSelect={onSelectSneaker}
        />
      ))}
    </div>
  );
}
