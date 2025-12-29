import React, { useState } from 'react';
import WordCard from './WordCard';

export default function CategoryBox({ category, cards, onDrop, onDeleteCategory, onDeleteCard }) {
    const [isDragOver, setIsDragOver] = useState(false);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e) => {
        setIsDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        const cardId = e.dataTransfer.getData('text/plain');
        onDrop(cardId, category.id);
    };

    return (
        <div
            className={`category-box ${isDragOver ? 'drag-over' : ''}`}
            id={category.id}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <div className="category-header">
                {category.name}
                <button
                    className="delete-btn"
                    onClick={() => onDeleteCategory(category.id)}
                    title="Xóa nhóm"
                >
                    <i className="fa-solid fa-xmark"></i>
                </button>
            </div>

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
