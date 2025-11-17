import React, { useState } from 'react';
import { teaRecordService } from '../services/api';
import './TeaRecordForm.css';

function TeaRecordForm({ onRecordAdded }) {
  const [formData, setFormData] = useState({
    brand: '',
    category: '',
    sweetness: '',
    iceLevel: '',
    price: '',
    rating: '',
    comment: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.brand.trim()) newErrors.brand = '请输入品牌';
    if (!formData.category.trim()) newErrors.category = '请输入品类';
    if (!formData.sweetness) newErrors.sweetness = '请选择甜度';
    if (!formData.iceLevel) newErrors.iceLevel = '请选择冰度';
    if (!formData.price || formData.price <= 0) newErrors.price = '请输入有效价格';
    if (!formData.rating || formData.rating < 1 || formData.rating > 10) {
      newErrors.rating = '请输入1-10分的评分';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const recordData = {
        ...formData,
        price: parseFloat(formData.price),
        rating: parseInt(formData.rating),
      };
      
      await teaRecordService.createRecord(recordData);
      
      // Reset form
      setFormData({
        brand: '',
        category: '',
        sweetness: '',
        iceLevel: '',
        price: '',
        rating: '',
        comment: '',
      });
      setErrors({});
      
      if (onRecordAdded) {
        onRecordAdded();
      }
      
      alert('奶茶记录添加成功！');
    } catch (error) {
      console.error('Error creating record:', error);
      alert('添加记录失败，请重试');
    }
  };

  return (
    <div className="tea-record-form">
      <h2>添加奶茶记录</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>品牌 *</label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            placeholder="例如：喜茶、奈雪的茶"
          />
          {errors.brand && <span className="error">{errors.brand}</span>}
        </div>

        <div className="form-group">
          <label>品类 *</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="例如：芝士奶盖、水果茶"
          />
          {errors.category && <span className="error">{errors.category}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>甜度 *</label>
            <select name="sweetness" value={formData.sweetness} onChange={handleChange}>
              <option value="">请选择</option>
              <option value="无糖">无糖</option>
              <option value="三分糖">三分糖</option>
              <option value="五分糖">五分糖</option>
              <option value="七分糖">七分糖</option>
              <option value="全糖">全糖</option>
            </select>
            {errors.sweetness && <span className="error">{errors.sweetness}</span>}
          </div>

          <div className="form-group">
            <label>冰度 *</label>
            <select name="iceLevel" value={formData.iceLevel} onChange={handleChange}>
              <option value="">请选择</option>
              <option value="去冰">去冰</option>
              <option value="少冰">少冰</option>
              <option value="正常冰">正常冰</option>
              <option value="多冰">多冰</option>
            </select>
            {errors.iceLevel && <span className="error">{errors.iceLevel}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>价格 (元) *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              min="0"
              placeholder="0.00"
            />
            {errors.price && <span className="error">{errors.price}</span>}
          </div>

          <div className="form-group">
            <label>评分 (1-10分) *</label>
            <input
              type="number"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              min="1"
              max="10"
              placeholder="1-10"
            />
            {errors.rating && <span className="error">{errors.rating}</span>}
          </div>
        </div>

        <div className="form-group">
          <label>评语 (可选)</label>
          <textarea
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            rows="4"
            placeholder="写下你的感受..."
          />
        </div>

        <button type="submit" className="submit-btn">提交记录</button>
      </form>
    </div>
  );
}

export default TeaRecordForm;
