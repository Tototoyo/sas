import React, { useState, useEffect } from 'react';
import type { Asset } from '../types';
import { EntityCondition } from '../types';
import Modal from './Modal';
import Badge from './Badge';
import { PlusIcon, EditIcon, TrashIcon } from '../constants';

interface AssetFormProps {
  onSubmit: (asset: Omit<Asset, 'id'> | Asset) => void;
  onClose: () => void;
  initialData?: Asset | null;
}

const AssetForm: React.FC<AssetFormProps> = ({ onSubmit, onClose, initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    location: '',
    purchaseDate: '',
    warranty: '',
    supplier: '',
    condition: EntityCondition.Good,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        type: initialData.type,
        location: initialData.location,
        purchaseDate: initialData.purchaseDate,
        warranty: initialData.warranty,
        supplier: initialData.supplier,
        condition: initialData.condition,
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (initialData) {
      onSubmit({ ...initialData, ...formData });
    } else {
      onSubmit(formData);
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700">Asset Name</label>
          <input type="text" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full input-field" />
        </div>
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-slate-700">Asset Type</label>
          <input type="text" id="type" value={formData.type} onChange={handleChange} placeholder="e.g., Furniture, Appliance" required className="mt-1 block w-full input-field" />
        </div>
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-slate-700">Location</label>
          <input type="text" id="location" value={formData.location} onChange={handleChange} required className="mt-1 block w-full input-field" />
        </div>
         <div>
          <label htmlFor="condition" className="block text-sm font-medium text-slate-700">Condition</label>
          <select id="condition" value={formData.condition} onChange={handleChange} className="mt-1 block w-full select-field">
            {Object.values(EntityCondition).map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="purchaseDate" className="block text-sm font-medium text-slate-700">Purchase Date</label>
          <input type="date" id="purchaseDate" value={formData.purchaseDate} onChange={handleChange} required className="mt-1 block w-full input-field" />
        </div>
        <div>
          <label htmlFor="warranty" className="block text-sm font-medium text-slate-700">Warranty Expiry</label>
          <input type="date" id="warranty" value={formData.warranty} onChange={handleChange} className="mt-1 block w-full input-field" />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="supplier" className="block text-sm font-medium text-slate-700">Supplier</label>
          <input type="text" id="supplier" value={formData.supplier} onChange={handleChange} className="mt-1 block w-full input-field" />
        </div>
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Cancel</button>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">{initialData ? 'Update Asset' : 'Add Asset'}</button>
      </div>
      <style>{`
        .input-field, .select-field {
          padding: 0.5rem 0.75rem;
          background-color: white;
          border: 1px solid #cbd5e1;
          border-radius: 0.375rem;
          box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
          outline: none;
          color: #1e293b;
        }
        .input-field:focus, .select-field:focus {
          ring: 1px solid #3b82f6;
          border-color: #3b82f6;
        }
      `}</style>
    </form>
  );
};


interface AssetManagementProps {
  assets: Asset[];
  onAddAsset: (newAsset: Omit<Asset, 'id'>) => void;
  onUpdateAsset: (updatedAsset: Asset) => void;
  onDeleteAsset: (assetId: string) => void;
}

const AssetManagement: React.FC<AssetManagementProps> = ({ assets, onAddAsset, onUpdateAsset, onDeleteAsset }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);

  const handleOpenModal = (asset?: Asset) => {
    setEditingAsset(asset || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingAsset(null);
    setIsModalOpen(false);
  };
  
  const handleSubmit = (assetData: Omit<Asset, 'id'> | Asset) => {
    if ('id' in assetData) {
      onUpdateAsset(assetData);
    } else {
      onAddAsset(assetData);
    }
  };


  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Asset Inventory</h1>
        <button onClick={() => handleOpenModal()} className="flex items-center justify-center sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 transition-colors">
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Asset
        </button>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {assets.map(asset => (
          <div key={asset.id} className="bg-white rounded-lg shadow-md p-4 space-y-3">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-slate-800">{asset.name}</h3>
              <div className="flex space-x-3">
                <button onClick={() => handleOpenModal(asset)} className="text-slate-500 hover:text-blue-600"><EditIcon /></button>
                <button onClick={() => onDeleteAsset(asset.id)} className="text-slate-500 hover:text-red-600"><TrashIcon /></button>
              </div>
            </div>
            <div className="text-sm text-slate-600">
              <p><span className="font-semibold">Type:</span> {asset.type}</p>
              <p><span className="font-semibold">Location:</span> {asset.location}</p>
              <p><span className="font-semibold">Supplier:</span> {asset.supplier}</p>
              <p><span className="font-semibold">Purchased:</span> {asset.purchaseDate}</p>
              <p><span className="font-semibold">Warranty Ends:</span> {asset.warranty}</p>
            </div>
            <div>
              <Badge status={asset.condition} />
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-500">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50">
            <tr>
              <th scope="col" className="px-6 py-3">Name</th>
              <th scope="col" className="px-6 py-3">Type</th>
              <th scope="col" className="px-6 py-3">Location</th>
              <th scope="col" className="px-6 py-3">Condition</th>
              <th scope="col" className="px-6 py-3">Purchase Date</th>
              <th scope="col" className="px-6 py-3">Warranty End</th>
              <th scope="col" className="px-6 py-3">Supplier</th>
              <th scope="col" className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset) => (
              <tr key={asset.id} className="bg-white border-b hover:bg-slate-50">
                <th scope="row" className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">{asset.name}</th>
                <td className="px-6 py-4">{asset.type}</td>
                <td className="px-6 py-4">{asset.location}</td>
                <td className="px-6 py-4"><Badge status={asset.condition} /></td>
                <td className="px-6 py-4">{asset.purchaseDate}</td>
                <td className="px-6 py-4">{asset.warranty}</td>
                <td className="px-6 py-4">{asset.supplier}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end space-x-3">
                    <button onClick={() => handleOpenModal(asset)} className="text-slate-500 hover:text-blue-600"><EditIcon /></button>
                    <button onClick={() => onDeleteAsset(asset.id)} className="text-slate-500 hover:text-red-600"><TrashIcon /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingAsset ? 'Edit Asset' : 'Add New Asset'}>
        <AssetForm onSubmit={handleSubmit} onClose={handleCloseModal} initialData={editingAsset} />
      </Modal>
    </div>
  );
};

export default AssetManagement;