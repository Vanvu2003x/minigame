import React, { useState, useRef } from 'react';

export default function Controls({ categories, onAddCategory, onAddCard, onSave }) {
    const [catName, setCatName] = useState('');
    const [selectedCat, setSelectedCat] = useState('');
    const [cardText, setCardText] = useState('');
    const [imgUrl, setImgUrl] = useState('');
    const [previewSrc, setPreviewSrc] = useState('');

    const fileInputRef = useRef(null);

    const handleCatSubmit = () => {
        if (!catName.trim()) return;
        onAddCategory(catName.trim());
        setCatName('');
    };

    const handleCardSubmit = () => {
        if (!cardText.trim() || !selectedCat) {
            alert("Vui lòng nhập Tên Thẻ và chọn Nhóm!");
            return;
        }
        onAddCard(cardText.trim(), previewSrc || imgUrl, selectedCat);

        // Reset
        setCardText('');
        setImgUrl('');
        setPreviewSrc('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImgUrl('');
            const reader = new FileReader();
            reader.onload = (ev) => {
                setPreviewSrc(ev.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUrlInput = (e) => {
        const val = e.target.value;
        setImgUrl(val);
        if (val) {
            setPreviewSrc(val);
        } else {
            setPreviewSrc('');
        }
    };

    return (
        <div className="controls">
            {/* Add Category */}
            <div className="control-group">
                <div className="input-wrapper">
                    <label>Tạo Nhóm Mới</label>
                    <input
                        type="text"
                        value={catName}
                        onChange={(e) => setCatName(e.target.value)}
                        placeholder="VD: Hoa Quả"
                    />
                </div>
                <button onClick={handleCatSubmit}><i className="fa-solid fa-folder-plus"></i> Tạo Nhóm</button>
            </div>

            {/* Add Word */}
            <div className="control-group" style={{ borderLeft: '1px solid #444', paddingLeft: '20px' }}>
                <div className="input-wrapper">
                    <label>Thuộc Nhóm Nào?</label>
                    <select value={selectedCat} onChange={(e) => setSelectedCat(e.target.value)}>
                        <option value="" disabled>Chọn nhóm...</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                <div className="input-wrapper">
                    <label>Tên Thẻ</label>
                    <input
                        type="text"
                        value={cardText}
                        onChange={(e) => setCardText(e.target.value)}
                        placeholder="VD: Quả Táo"
                    />
                </div>

                {/* Image Inputs */}
                <div className="input-wrapper">
                    <label>Hình Ảnh</label>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>

                        {/* UPLOAD BUTTON */}
                        <label
                            htmlFor="wordFile"
                            className="custom-file-upload"
                            style={{ cursor: 'pointer' }}
                        >
                            <i className="fa-solid fa-upload"></i> Tải Ảnh
                        </label>
                        <input
                            type="file"
                            id="wordFile"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            style={{ display: 'none' }}
                        />

                        {/* OR URL */}
                        <input
                            type="text"
                            value={imgUrl}
                            onChange={handleUrlInput}
                            placeholder="Hoặc dán Link..."
                            style={{ width: '120px' }}
                        />

                        {/* PREVIEW */}
                        <div className="preview-box">
                            {previewSrc && <img src={previewSrc} alt="Prev" style={{ display: 'block' }} />}
                        </div>
                    </div>
                </div>

                <button onClick={handleCardSubmit}><i className="fa-solid fa-plus-circle"></i> Thêm Thẻ</button>
            </div>
        </div>
    );
}
