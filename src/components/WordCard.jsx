import React from 'react';

export default function WordCard({ card, onDelete, onDragStart }) {
    const handleDragStart = (e) => {
        e.dataTransfer.setData('text/plain', card.id);
        // Add dragging class for visual effect (state-based via parent usually better, 
        // but native DnD uses internal browser preview)
        if (onDragStart) onDragStart(card.id);
    };

    let className = 'word-card';
    if (!card.img) className += ' no-img';
    if (card.status === 'correct') className += ' correct';
    if (card.status === 'wrong') className += ' wrong';

    return (
        <div
            className={className}
            draggable
            onDragStart={handleDragStart}
            id={card.id}
        >
            <div
                className="del-word"
                onClick={(e) => { e.stopPropagation(); onDelete(card.id); }}
                title="Xóa thẻ"
            >
                <i className="fa-solid fa-xmark"></i>
            </div>

            {card.img ? (
                <img src={card.img} draggable="false" alt={card.name} />
            ) : null}

            <div className="content">{card.name}</div>
        </div>
    );
}
