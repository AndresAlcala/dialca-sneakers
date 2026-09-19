import React from 'react';

export default function SneakerCard({ sneaker, onSelect }) {
  return (
    <div
      className="group cursor-pointer"
      onClick={() => onSelect(sneaker)}
    >
      <div className="aspect-square bg-neutral-100 overflow-hidden border border-neutral-200 relative mb-4">
        {sneaker.imageUrl && (
          <img
            src={sneaker.imageUrl}
            alt={sneaker.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        )}
        <span className="absolute top-3 left-3 bg-black text-white text-[10px] font-mono px-2 py-0.5 uppercase tracking-wider">
          {sneaker.brand}
        </span>
      </div>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide group-hover:underline">
            {sneaker.name}
          </h3>
          <p className="text-xs text-neutral-500 line-clamp-1 mt-0.5">
            {sneaker.description}
          </p>
        </div>
        <span className="text-sm font-mono font-bold">
          ${Number(sneaker.price).toFixed(2)}
        </span>
      </div>
    </div>
  );
}
