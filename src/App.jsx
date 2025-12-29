import { useState, useEffect } from 'react'
import Controls from './components/Controls'
import WordPool from './components/WordPool'
import Board from './components/Board'
import './index.css'

function App() {
  const [categories, setCategories] = useState([])
  const [cards, setCards] = useState([])

  // Load Data from Backend
  useEffect(() => {
    fetch('http://localhost:3000/api/data')
      .then(res => res.json())
      .then(data => {
        const newCats = [];
        const newCards = [];

        data.forEach(group => {
          const catId = 'ID_' + Date.now() + Math.random().toString(36).substr(2, 5);
          newCats.push({ id: catId, name: group.cat });

          group.items.forEach(item => {
            newCards.push({
              id: 'WORD_' + Math.random().toString(36).substr(2, 9),
              name: item.name,
              img: item.img,
              targetId: catId, // Origin Category
              status: 'pool',
              placedCatId: null,
              isCorrect: false,
              isWrong: false
            });
          });
        });

        setCategories(newCats);
        setCards(newCards);
      })
      .catch(err => console.warn("Load Error:", err));
  }, []);

  // --- Auto Save Logic ---
  const saveDataToBackend = (updatedCats, updatedCards) => {
    const dataToSave = updatedCats.map(cat => {
      // Current Logic: Save based on "Target ID" (Game Config)
      // This persists the *intended* structure, not the current *played* state.
      const catItems = updatedCards
        .filter(c => c.targetId === cat.id)
        .map(c => ({
          name: c.name,
          img: c.img
        }));

      return {
        cat: cat.name,
        items: catItems
      };
    });

    fetch('http://localhost:3000/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataToSave)
    }).catch(err => console.error("Auto Save Failed", err));
  };

  // --- Handlers ---

  const addCategory = (name) => {
    const id = 'ID_' + Date.now() + Math.random().toString(36).substr(2, 5);
    const newCats = [...categories, { id, name }];
    setCategories(newCats);
    saveDataToBackend(newCats, cards);
  };

  const deleteCategory = (id) => {
    const newCats = categories.filter(c => c.id !== id);
    setCategories(newCats);

    // Reset cards that were in this category? 
    // And also potentially remove them if they belonged to this category?
    // User said: "bấm x ở ảnh thì tự động xóa khỏi json".
    // This is deleting category. 
    // If we delete category, we should probably delete the cards associated with it permanently from JSON too?
    // Or keep them orphan? 
    // Standard behavior: Delete category -> Delete its items? 
    // Let's assume yes for "Clean" data.
    const newCards = cards.filter(c => c.targetId !== id);
    setCards(newCards);

    saveDataToBackend(newCats, newCards);
  };

  const addCard = (text, img, targetId) => {
    const newCard = {
      id: 'WORD_' + Date.now() + Math.random().toString(36).substr(2, 5),
      name: text,
      img: img,
      targetId: targetId,
      status: 'pool',
      placedCatId: null,
      isCorrect: false,
      isWrong: false
    };
    const newCards = [...cards, newCard];
    setCards(newCards);
    saveDataToBackend(categories, newCards);
  };

  const deleteCard = (id) => {
    // This handles the "bấm x ở ảnh" requirement
    const newCards = cards.filter(c => c.id !== id);
    setCards(newCards);
    saveDataToBackend(categories, newCards); // Auto sync to JSON
  };

  // DnD Logic (No save needed, just state)
  const handleDrop = (cardId, destinationId, isPool) => {
    setCards(cards.map(card => {
      if (card.id !== cardId) return card;
      if (isPool) {
        return { ...card, status: 'pool', placedCatId: null, isCorrect: false, isWrong: false };
      } else {
        const isCorrect = (card.targetId === destinationId);
        return {
          ...card,
          status: 'placed',
          placedCatId: destinationId,
          isCorrect: isCorrect,
          isWrong: !isCorrect
        };
      }
    }));
  };

  return (
    <>
      <h1><i className="fa-solid fa-gamepad"></i> Trò Chơi Ghép Từ (Auto-Save)</h1>

      <Controls
        categories={categories}
        onAddCategory={addCategory}
        onAddCard={addCard}
        onSave={() => { }} // No-op or remove prop
      />

      <div className="game-area">
        <WordPool
          cards={cards.filter(c => c.status === 'pool')}
          onDrop={handleDrop}
          onDeleteCard={deleteCard}
        />

        <Board
          categories={categories}
          cards={cards}
          onDrop={handleDrop}
          onDeleteCategory={deleteCategory}
          onDeleteCard={deleteCard}
        />
      </div>
    </>
  )
}

export default App
