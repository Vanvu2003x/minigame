import React from 'react';
import CategoryBox from './CategoryBox';

export default function Board({ categories, cards, onDrop, onDeleteCategory, onDeleteCard }) {
    return (
        <div className="board">
            {categories.map(cat => (
                <CategoryBox
                    key={cat.id}
                    category={cat}
                    cards={cards.filter(c => c.status === 'placed' && c.placedCatId === cat.id)}
                    onDrop={onDrop}
                    onDeleteCategory={onDeleteCategory}
                    onDeleteCard={onDeleteCard}
                />
            ))}
        </div>
    );
}
