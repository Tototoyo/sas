import React, { useState, useMemo, useEffect } from 'react';
import type { Extra, Staff, PaymentType } from '../../types';
import { Role } from '../../types';
import Modal from '../Modal';
import { PlusIcon, EditIcon, TrashIcon } from '../../constants';

// Form for adding/editing Extra
interface ExtraFormProps {
    onSave: (extra: Omit<Extra, 'id'> | Extra) => void;
    onClose: () => void;
    initialData?: Extra | null;
}

const ExtraForm: React.FC<ExtraFormProps> = ({ onSave, onClose, initialData }) => {
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        price: initialData?.price.toString() || '',
        commission: initialData?.commission?.toString() || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const extraData = {
            ...formData,
            price: Number(formData.price) || 0,
            commission: Number(formData.commission) || undefined,
        };
        if (initialData) {
            onSave({ ...initialData, ...extraData });
        } else {
            onSave(extraData);
        }
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700">Extra Name</label>
                <input type="text" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full input-field" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                  <label htmlFor="price" className="block text-sm font-medium text-slate-700">Price (THB)</label>
                  <input type="number" id="price" value={formData.price} onChange={handleChange} required className="mt-1 block w-full input-field" />
              </div>
              <div>
                  <label htmlFor="commission" className="block text-sm font-medium text-slate-700">Default Commission (THB)</label>
                  <input type="number" id="commission" value={formData.commission} onChange={handleChange} className="mt-1 block w-full input-field" />
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">{initialData ? 'Save Changes' : 'Add Extra'}</button>
            </div>
        </form>
    );
};


const CommonFormFields: React.FC<{ staff: Staff[]; selectedStaffId: string; onStaffChange: (id: string) => void; currentUserRole: Role }> = ({ staff, selectedStaffId, onStaffChange, currentUserRole }) => (
    <div>
        <label htmlFor="staffId" className="block text-sm font-medium text-slate-700">Booking Staff</label>
        <select id="staffId" value={selectedStaffId} onChange={(e) => onStaffChange(e.target.value)} required className="mt-1 block w-full input-field">
            <option value="">Select Staff</option>
            {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
    </div>
);

const PaymentFormFields: React.FC<{ paymentDetails: { method: string, receiptImage?: string }, onPaymentChange: (details: { method: string, receiptImage?: string }) => void, paymentTypes: PaymentType[] }> = ({ paymentDetails, onPaymentChange, paymentTypes }) => {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          const reader = new FileReader();
          reader.onloadend = () => {
            onPaymentChange({ ...paymentDetails, receiptImage: reader.result as string });
          };
          reader.readAsDataURL(file);
        }
    };
    return (
      <div>
          <h4 className="text-md font-semibold text-slate-800 border-b pb-2 mb-3">Payment</h4>
           <div>
                <label htmlFor="paymentMethod" className="block text-sm font-medium text-slate-700">Method</label>
                <select id="paymentMethod" value={paymentDetails.method} onChange={(e) => onPaymentChange({...paymentDetails, method: e.target.value as string})} className="mt-1 block w-full input-field">
                    {paymentTypes.map(pt => <option key={pt.id} value={pt.name}>{pt.name}</option>)}
                </select>
            </div>
            <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700">Receipt (Optional)</label>
                <div className="mt-1 flex items-center">
                    <input type="file" id="receipt" accept="image/*" onChange={handleFileChange} className="hidden" />
                    <label htmlFor="receipt" className="cursor-pointer bg-white py-2 px-3 border border-slate-300 rounded-md shadow-sm text-sm leading-4 font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        {paymentDetails.receiptImage ? 'Change Image' : 'Upload Image'}
                    </label>
                    {paymentDetails.receiptImage && <img src={paymentDetails.receiptImage} alt="Receipt Preview" className="ml-4 h-10 w-10 object-cover rounded" />}
                </div>
            </div>
      </div>
    );
};

interface SellExtrasProps {
    extras: Extra[];
    staff: Staff[];
    paymentTypes: PaymentType[];
    onBookStandaloneExtra: (extra: Extra, staffId: string, paymentMethod: string, bookingDate: string, receiptImage?: string, quantity?: number, employeeCommission?: number) => void;
    onAddExtra: (newExtra: Omit<Extra, 'id'>) => void;
    onUpdateExtra: (updatedExtra: Extra) => void;
    onDeleteExtra: (extraId: string) => void;
    currentUserRole: Role;
}

const SellExtras: React.FC<SellExtrasProps> = ({ extras, staff, paymentTypes, onBookStandaloneExtra, onAddExtra, onUpdateExtra, onDeleteExtra, currentUserRole }) => {
    const [isExtraModalOpen, setIsExtraModalOpen] = useState(false);
    const [selectedExtra, setSelectedExtra] = useState<Extra | null>(null);

    const [isManageExtrasModalOpen, setIsManageExtrasModalOpen] = useState(false);
    const [editingExtra, setEditingExtra] = useState<Extra | null>(null);
    const [showExtraForm, setShowExtraForm] = useState(false);

    const initialPaymentState = useMemo(() => ({
        method: paymentTypes[0]?.name || '',
        receiptImage: undefined as string | undefined,
    }), [paymentTypes]);

    // Form states
    const [selectedStaffId, setSelectedStaffId] = useState<string>('');
    const [paymentDetails, setPaymentDetails] = useState<{ method: string; receiptImage?: string }>(initialPaymentState);
    const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
    const [quantity, setQuantity] = useState('1');
    const [employeeCommission, setEmployeeCommission] = useState('');

    useEffect(() => {
        setPaymentDetails(initialPaymentState);
    }, [initialPaymentState]);

    const resetFormStates = () => {
        setSelectedStaffId('');
        setPaymentDetails(initialPaymentState);
        setBookingDate(new Date().toISOString().split('T')[0]);
        setQuantity('1');
        setEmployeeCommission('');
    };

    const handleOpenExtraModal = (extra: Extra) => {
        resetFormStates();
        setEmployeeCommission(extra.commission?.toString() || '0');
        setSelectedExtra(extra);
        setIsExtraModalOpen(true);
    };

    const handleCloseModals = () => {
        setIsExtraModalOpen(false);
        setSelectedExtra(null);
        setIsManageExtrasModalOpen(false);
        setEditingExtra(null);
        setShowExtraForm(false);
    };

    const handleBookExtra = () => {
        if (!selectedExtra || !selectedStaffId) return alert('Please select a staff member.');
        const finalQuantity = Number(quantity) || 1;
        onBookStandaloneExtra(selectedExtra, selectedStaffId, paymentDetails.method, bookingDate, paymentDetails.receiptImage, finalQuantity, Number(employeeCommission) || undefined);
        handleCloseModals();
    };

    const handleEditExtra = (extra: Extra) => {
        setEditingExtra(extra);
        setShowExtraForm(true);
    };

    const handleSaveExtra = (extraData: Omit<Extra, 'id'> | Extra) => {
        if ('id' in extraData) {
            onUpdateExtra(extraData);
        } else {
            onAddExtra(extraData);
        }
        setEditingExtra(null);
        setShowExtraForm(false);
    };

    const getQuantityLabel = () => {
        if (!selectedExtra) return 'Quantity';
        if (selectedExtra.id === 'paddle_hour') return 'Number of Hours';
        if (selectedExtra.id === 'paddle_day') return 'Number of Days';
        return 'Quantity';
    };


    return (
        <>
            <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold text-slate-800">Sell Standalone Extras</h3>
                    {currentUserRole === Role.Admin && (
                        <button onClick={() => setIsManageExtrasModalOpen(true)} className="px-3 py-1.5 text-sm font-semibold text-white bg-slate-600 rounded-md hover:bg-slate-700">Manage Extras</button>
                    )}
                </div>
                <div className="space-y-2">
                    {extras.map(extra => (
                        <div key={extra.id} className="flex justify-between items-center p-2 rounded-md hover:bg-slate-50">
                            <div>
                                <p className="font-medium text-slate-700">{extra.name}</p>
                                <p className="text-sm text-slate-500">{extra.price} THB</p>
                            </div>
                            <button onClick={() => handleOpenExtraModal(extra)} className="px-3 py-1 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">Sell</button>
                        </div>
                    ))}
                </div>
            </div>

            <Modal isOpen={isExtraModalOpen} onClose={handleCloseModals} title={`Sell: ${selectedExtra?.name}`}>
                <div className="space-y-6">
                    <div>
                        <label htmlFor="bookingDate" className="block text-sm font-medium text-slate-700">Sale Date</label>
                        <input type="date" id="bookingDate" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} required className="mt-1 block w-full input-field" />
                    </div>
                    
                    <div>
                        <label htmlFor="quantity" className="block text-sm font-medium text-slate-700">{getQuantityLabel()}</label>
                        <input 
                            type="number" 
                            id="quantity" 
                            value={quantity} 
                            onChange={(e) => setQuantity(e.target.value)} 
                            min="1" 
                            required 
                            className="mt-1 block w-full input-field" 
                        />
                    </div>

                    <CommonFormFields staff={staff} selectedStaffId={selectedStaffId} onStaffChange={setSelectedStaffId} currentUserRole={currentUserRole} />
                    
                    {currentUserRole === Role.Admin && (
                        <div>
                            <label htmlFor="employeeCommission" className="block text-sm font-medium text-slate-700">Employee Commission (per item/hour)</label>
                            <input 
                                type="number" 
                                id="employeeCommission" 
                                value={employeeCommission} 
                                onChange={(e) => setEmployeeCommission(e.target.value)} 
                                className="mt-1 block w-full input-field" 
                            />
                        </div>
                    )}
                    
                    <PaymentFormFields paymentDetails={paymentDetails} onPaymentChange={setPaymentDetails} paymentTypes={paymentTypes} />
                    
                    {selectedExtra && (() => {
                        const finalQuantity = Number(quantity) || 1;
                        const total = (selectedExtra.price || 0) * finalQuantity;
                        const totalCommission = (Number(employeeCommission) || 0) * finalQuantity;
                        return (
                            <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                                <h4 className="text-lg font-semibold text-slate-800 mb-2">Sale Summary</h4>
                                <div className="space-y-1 text-sm">
                                    <div className="flex justify-between font-bold text-base">
                                        <span>Total Price</span>
                                        <span>{`฿${total.toLocaleString()}`}</span>
                                    </div>
                                    {currentUserRole === Role.Admin && totalCommission > 0 && (
                                        <div className="flex justify-between text-orange-600">
                                            <span>Employee Commission</span>
                                            <span>{`฿${totalCommission.toLocaleString()}`}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })()}

                    <div className="flex justify-end pt-4">
                        <button onClick={handleBookExtra} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Confirm Sale</button>
                    </div>
                </div>
            </Modal>
            
            <Modal isOpen={isManageExtrasModalOpen} onClose={handleCloseModals} title="Manage Extras">
                <div className="space-y-4">
                    <div className="flex justify-end">
                        <button onClick={() => { setEditingExtra(null); setShowExtraForm(prev => !prev); }} className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center">
                            <PlusIcon className="w-4 h-4 mr-1"/>
                            {showExtraForm && !editingExtra ? 'Close Form' : 'Add New Extra'}
                        </button>
                    </div>

                    {showExtraForm && (
                         <div className="p-4 bg-slate-50 rounded-lg border">
                            <h4 className="text-md font-semibold text-slate-800 mb-3">{editingExtra ? 'Edit Extra' : 'Add New Extra'}</h4>
                            <ExtraForm 
                                onSave={handleSaveExtra}
                                onClose={() => { setShowExtraForm(false); setEditingExtra(null); }}
                                initialData={editingExtra}
                            />
                        </div>
                    )}
                
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                        {extras.map(extra => (
                            <div key={extra.id} className="flex justify-between items-center p-2 bg-white rounded-md shadow-sm border">
                                <div>
                                    <p className="font-medium text-slate-800">{extra.name}</p>
                                    <p className="text-xs text-slate-500">
                                        Price: {extra.price} THB
                                        {extra.commission ? ` | Commission: ${extra.commission} THB` : ''}
                                    </p>
                                </div>
                                <div className="flex space-x-3">
                                    <button onClick={() => handleEditExtra(extra)} className="text-slate-500 hover:text-blue-600"><EditIcon className="w-4 h-4" /></button>
                                    <button onClick={() => onDeleteExtra(extra.id)} className="text-slate-500 hover:text-red-600"><TrashIcon className="w-4 h-4" /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Modal>

            <style>{`.input-field{padding:0.5rem 0.75rem;background-color:white;border:1px solid #cbd5e1;border-radius:0.375rem;box-shadow:0 1px 2px 0 rgb(0 0 0 / 0.05);outline:none;color:#1e293b;}.input-field:focus{ring:1px solid #3b82f6;border-color:#3b82f6;}`}</style>
        </>
    );
};

export default SellExtras;