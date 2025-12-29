import React from 'react';
import WordCard from './WordCard';

export default function WordPool({ cards, onDrop, onDeleteCard }) {
    const handleDrop = (e) => {
        e.preventDefault();
        const cardId = e.dataTransfer.getData('text/plain');
        onDrop(cardId, null, true); // true = isPool
    };

    return (
        <div
            className="word-pool"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
        >
            <h3><i className="fa-solid fa-layer-group"></i> Kho Thẻ Bài</h3>
            {cards.map(card => (
                <WordCard
                    key={card.id}
                    card={card}
                    onDelete={onDeleteCard}
                />
            ))}
        </div>
    );
}
