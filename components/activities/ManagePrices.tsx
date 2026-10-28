import React, { useState } from 'react';
import type { Activity, SpeedBoatTrip, TaxiBoatOption, Extra, PaymentType } from '../../types';
import Modal from '../Modal';
import { PlusIcon, EditIcon, TrashIcon } from '../../constants';


// --- Item Creation Forms ---
interface ActivityFormProps {
    onSave: (activity: Omit<Activity, 'id'>) => void;
    onClose: () => void;
}
const ActivityForm: React.FC<ActivityFormProps> = ({ onSave, onClose }) => {
    const [formData, setFormData] = useState({ name: '', description: '', price: '', imageUrl: '' });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, price: Number(formData.price), type: 'Internal' });
        onClose();
    };
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div><label htmlFor="name" className="block text-sm font-medium text-slate-700">Name</label><input type="text" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full input-field" /></div>
            <div><label htmlFor="description" className="block text-sm font-medium text-slate-700">Description</label><textarea id="description" value={formData.description} onChange={handleChange} required rows={3} className="mt-1 block w-full input-field" /></div>
            <div><label htmlFor="price" className="block text-sm font-medium text-slate-700">Price (THB)</label><input type="number" id="price" value={formData.price} onChange={handleChange} required className="mt-1 block w-full input-field" /></div>
            <div><label htmlFor="imageUrl" className="block text-sm font-medium text-slate-700">Image URL</label><input type="text" id="imageUrl" value={formData.imageUrl} onChange={handleChange} required className="mt-1 block w-full input-field" placeholder="https://placehold.co/..." /></div>
            <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Save Activity</button>
            </div>
        </form>
    );
};

interface ExtraFormProps {
    onSave: (extra: Omit<Extra, 'id'>) => void;
    onClose: () => void;
}
const ExtraForm: React.FC<ExtraFormProps> = ({ onSave, onClose }) => {
    const [formData, setFormData] = useState({ name: '', price: '', commission: '' });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, price: Number(formData.price), commission: Number(formData.commission) || undefined });
        onClose();
    };
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div><label htmlFor="name" className="block text-sm font-medium text-slate-700">Extra Name</label><input type="text" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full input-field" /></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label htmlFor="price" className="block text-sm font-medium text-slate-700">Price (THB)</label><input type="number" id="price" value={formData.price} onChange={handleChange} required className="mt-1 block w-full input-field" /></div>
              <div><label htmlFor="commission" className="block text-sm font-medium text-slate-700">Default Commission (THB)</label><input type="number" id="commission" value={formData.commission} onChange={handleChange} className="mt-1 block w-full input-field" /></div>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Save Extra</button>
            </div>
        </form>
    );
};

interface TaxiBoatOptionFormProps {
    onSave: (option: Omit<TaxiBoatOption, 'id'>) => void;
    onClose: () => void;
}
const TaxiBoatOptionForm: React.FC<TaxiBoatOptionFormProps> = ({ onSave, onClose }) => {
    const [formData, setFormData] = useState({ name: 'One Way' as 'One Way' | 'Round Trip', price: '' });
    const handleNameChange = (e: React.ChangeEvent<HTMLSelectElement>) => { setFormData(prev => ({ ...prev, name: e.target.value as 'One Way' | 'Round Trip' })); };
    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => { setFormData(prev => ({ ...prev, price: e.target.value })); };
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave({ ...formData, price: Number(formData.price) }); onClose(); };
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div><label htmlFor="name" className="block text-sm font-medium text-slate-700">Trip Type</label><select id="name" value={formData.name} onChange={handleNameChange} required className="mt-1 block w-full input-field"><option value="One Way">One Way</option><option value="Round Trip">Round Trip</option></select></div>
            <div><label htmlFor="price" className="block text-sm font-medium text-slate-700">Price (THB)</label><input type="number" id="price" value={formData.price} onChange={handlePriceChange} required className="mt-1 block w-full input-field" /></div>
            <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Save Option</button>
            </div>
        </form>
    );
};

interface SpeedBoatTripFormProps {
    onSave: (trip: Omit<SpeedBoatTrip, 'id'>) => void;
    onClose: () => void;
}
const SpeedBoatTripForm: React.FC<SpeedBoatTripFormProps> = ({ onSave, onClose }) => {
    const [formData, setFormData] = useState({ route: '', company: '', price: '', cost: '' });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { setFormData(prev => ({ ...prev, [e.target.id]: e.target.value })); };
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave({ ...formData, price: Number(formData.price), cost: Number(formData.cost) }); onClose(); };
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div><label htmlFor="route" className="block text-sm font-medium text-slate-700">Route</label><input type="text" id="route" value={formData.route} onChange={handleChange} required className="mt-1 block w-full input-field"/></div>
            <div><label htmlFor="company" className="block text-sm font-medium text-slate-700">Company</label><input type="text" id="company" value={formData.company} onChange={handleChange} required className="mt-1 block w-full input-field"/></div>
            <div><label htmlFor="price" className="block text-sm font-medium text-slate-700">Price (THB)</label><input type="number" id="price" value={formData.price} onChange={handleChange} required className="mt-1 block w-full input-field"/></div>
            <div><label htmlFor="cost" className="block text-sm font-medium text-slate-700">Cost (THB)</label><input type="number" id="cost" value={formData.cost} onChange={handleChange} required className="mt-1 block w-full input-field"/></div>
            <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Save Trip</button>
            </div>
        </form>
    );
};

interface PaymentTypeFormProps {
    onSave: (paymentType: Omit<PaymentType, 'id'>) => void;
    onClose: () => void;
}
const PaymentTypeForm: React.FC<PaymentTypeFormProps> = ({ onSave, onClose }) => {
    const [name, setName] = useState('');
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onSave({ name: name.trim() });
            onClose();
        } else {
            alert('Please enter a name for the payment method.');
        }
    };
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div><label htmlFor="name" className="block text-sm font-medium text-slate-700">Payment Method Name</label><input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full input-field" /></div>
            <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Save Method</button>
            </div>
        </form>
    );
};


interface EditablePriceItemProps<T extends { id: string; name: string; price: number }> {
  item: T;
  onSave: (item: T) => void;
  onDelete: (id: string) => void;
  currencySymbol?: string;
}

// Fix: Changed component to an arrow function expression. This is a more common pattern for generic components
// in TypeScript and helps the compiler correctly identify it as a React component, thus handling the `key` prop correctly.
// Fix: Changed component to a standard function declaration to ensure it's correctly identified as a React component by TypeScript, resolving issues with the `key` prop on generic components.
function EditablePriceItem<T extends { id: string; name: string; price: number }> (
  props: EditablePriceItemProps<T>
): React.ReactElement {
  const {
    item,
    onSave,
    onDelete,
    currencySymbol = 'THB',
  } = props;
  const [price, setPrice] = useState(item.price.toString());
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleSave = () => {
    const newPrice = Number(price);
    if (!isNaN(newPrice) && newPrice >= 0) {
      onSave({ ...item, price: newPrice });
      setIsEditing(false);
    } else {
      alert('Please enter a valid price.');
      setPrice(item.price.toString());
    }
  };
  
  const handleEdit = () => { setIsEditing(true); setTimeout(() => inputRef.current?.focus(), 0); }
  const handleDelete = () => { if (window.confirm(`Delete "${item.name}"?`)) { onDelete(item.id); } };

  return (
    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border">
      <span className="text-sm font-medium text-slate-800">{item.name}</span>
      <div className="flex items-center space-x-2">
        {isEditing ? (
             <input ref={inputRef} type="number" value={price} onChange={(e) => setPrice(e.target.value)} onBlur={handleSave} onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') setIsEditing(false); }} className="w-24 text-sm px-2 py-1 border rounded-md"/>
        ) : ( <span className="text-sm font-semibold text-slate-600 w-24 text-right pr-2">{currencySymbol}{item.price.toLocaleString()}</span> )}
        {isEditing ? (
             <button onClick={handleSave} className="px-3 py-1 text-sm font-semibold text-white bg-green-600 rounded-md">Save</button>
        ) : ( <> <button onClick={handleEdit} className="text-slate-500"><EditIcon className="w-4 h-4" /></button> <button onClick={handleDelete} className="text-slate-500"><TrashIcon className="w-4 h-4" /></button> </> )}
      </div>
    </div>
  );
}

interface EditableSpeedBoatPriceItemProps {
  trip: SpeedBoatTrip;
  onSave: (trip: SpeedBoatTrip) => void;
  onDelete: (id: string) => void;
}
const EditableSpeedBoatPriceItem: React.FC<EditableSpeedBoatPriceItemProps> = ({ trip, onSave, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [price, setPrice] = useState(trip.price.toString());
    const [cost, setCost] = useState(trip.cost.toString());

    const handleSave = () => {
        const newPrice = Number(price); const newCost = Number(cost);
        if (!isNaN(newPrice) && newPrice >= 0 && !isNaN(newCost) && newCost >= 0) {
            onSave({ ...trip, price: newPrice, cost: newCost }); setIsEditing(false);
        } else { alert('Please enter valid price and cost values.'); }
    };
    const handleDelete = () => { if (window.confirm(`Delete "${trip.route}" by ${trip.company}?`)) { onDelete(trip.id); } };

    return (
        <div className="flex flex-wrap justify-between items-center p-3 bg-slate-50 rounded-lg border gap-2">
            <div className="flex-grow"><p className="text-sm font-medium">{trip.route}</p><p className="text-xs text-slate-500">{trip.company}</p></div>
            <div className="flex items-center space-x-2">
                {isEditing ? (
                    <><div className="relative"><span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-slate-400">Price:</span><input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-28 text-sm pl-12 pr-2 py-1 border rounded-md" /></div><div className="relative"><span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-slate-400">Cost:</span><input type="number" value={cost} onChange={(e) => setCost(e.target.value)} className="w-28 text-sm pl-12 pr-2 py-1 border rounded-md" /></div></>
                ) : (
                    <><span className="text-sm text-slate-600 w-28 text-right">Price: THB {trip.price.toLocaleString()}</span><span className="text-sm text-slate-600 w-28 text-right">Cost: THB {trip.cost.toLocaleString()}</span></>
                )}
                {isEditing ? ( <button onClick={handleSave} className="px-3 py-1 text-sm font-semibold text-white bg-green-600 rounded-md">Save</button> ) : ( <><button onClick={() => setIsEditing(true)}><EditIcon className="w-4 h-4" /></button><button onClick={handleDelete}><TrashIcon className="w-4 h-4" /></button></> )}
            </div>
        </div>
    );
};

interface EditableExtraItemProps {
  item: Extra;
  onSave: (item: Extra) => void;
  onDelete: (id: string) => void;
}
const EditableExtraItem: React.FC<EditableExtraItemProps> = ({ item, onSave, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [price, setPrice] = useState(item.price.toString());
    const [commission, setCommission] = useState(item.commission?.toString() || '');

    const handleSave = () => {
        const newPrice = Number(price);
        const newCommission = commission ? Number(commission) : undefined;
        if (!isNaN(newPrice) && newPrice >= 0 && (commission === '' || (!isNaN(newCommission) && newCommission >= 0))) {
            onSave({ ...item, price: newPrice, commission: newCommission });
            setIsEditing(false);
        } else {
            alert('Please enter valid price and commission values.');
        }
    };
    const handleDelete = () => { if (window.confirm(`Delete "${item.name}"?`)) { onDelete(item.id); } };
    
    return (
        <div className="flex flex-wrap justify-between items-center p-3 bg-slate-50 rounded-lg border gap-2">
            <div className="flex-grow">
                <p className="text-sm font-medium">{item.name}</p>
            </div>
            <div className="flex items-center space-x-2">
                {isEditing ? (
                    <>
                        <div className="relative">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-slate-400">Price:</span>
                            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-28 text-sm pl-12 pr-2 py-1 border rounded-md" />
                        </div>
                        <div className="relative">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-slate-400">Comm:</span>
                            <input type="number" value={commission} onChange={(e) => setCommission(e.target.value)} className="w-28 text-sm pl-12 pr-2 py-1 border rounded-md" placeholder="e.g. 20" />
                        </div>
                    </>
                ) : (
                    <>
                        <span className="text-sm text-slate-600 w-28 text-right">Price: THB {item.price.toLocaleString()}</span>
                        <span className="text-sm text-slate-600 w-28 text-right">Comm: THB {item.commission?.toLocaleString() || '0'}</span>
                    </>
                )}
                {isEditing ? (
                    <button onClick={handleSave} className="px-3 py-1 text-sm font-semibold text-white bg-green-600 rounded-md">Save</button>
                ) : (
                    <>
                        <button onClick={() => setIsEditing(true)}><EditIcon className="w-4 h-4" /></button>
                        <button onClick={handleDelete}><TrashIcon className="w-4 h-4" /></button>
                    </>
                )}
            </div>
        </div>
    );
};


interface EditablePaymentTypeItemProps {
    item: PaymentType;
    onSave: (item: PaymentType) => void;
    onDelete: (id: string) => void;
}
const EditablePaymentTypeItem: React.FC<EditablePaymentTypeItemProps> = ({ item, onSave, onDelete }) => {
    const [name, setName] = useState(item.name);
    const [isEditing, setIsEditing] = useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleSave = () => {
        if (name.trim()) {
            onSave({ ...item, name: name.trim() });
            setIsEditing(false);
        } else {
            alert('Name cannot be empty.');
            setName(item.name);
        }
    };
    const handleEdit = () => { setIsEditing(true); setTimeout(() => inputRef.current?.focus(), 0); };
    const handleDelete = () => { if (window.confirm(`Delete payment method "${item.name}"?`)) { onDelete(item.id); } };

    return (
        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border">
            {isEditing ? (
                <input ref={inputRef} type="text" value={name} onChange={(e) => setName(e.target.value)} onBlur={handleSave} onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') setIsEditing(false); }} className="text-sm font-medium text-slate-800 input-field" />
            ) : (
                <span className="text-sm font-medium text-slate-800">{item.name}</span>
            )}
            <div className="flex items-center space-x-2">
                {isEditing ? (
                    <button onClick={handleSave} className="px-3 py-1 text-sm font-semibold text-white bg-green-600 rounded-md">Save</button>
                ) : (
                    <>
                        <button onClick={handleEdit} className="text-slate-500"><EditIcon className="w-4 h-4" /></button>
                        <button onClick={handleDelete} className="text-slate-500"><TrashIcon className="w-4 h-4" /></button>
                    </>
                )}
            </div>
        </div>
    );
}


interface ManagePricesProps {
    activities: Activity[];
    speedBoatTrips: SpeedBoatTrip[];
    taxiBoatOptions: TaxiBoatOption[];
    extras: Extra[];
    paymentTypes: PaymentType[];
    onAddActivity: (activity: Omit<Activity, 'id'>) => void;
    onUpdateActivity: (activity: Activity) => void;
    onDeleteActivity: (id: string) => void;
    onAddSpeedBoatTrip: (trip: Omit<SpeedBoatTrip, 'id'>) => void;
    onUpdateSpeedBoatTrip: (trip: SpeedBoatTrip) => void;
    onDeleteSpeedBoatTrip: (id: string) => void;
    onAddTaxiBoatOption: (option: Omit<TaxiBoatOption, 'id'>) => void;
    onUpdateTaxiBoatOption: (option: TaxiBoatOption) => void;
    onDeleteTaxiBoatOption: (id: string) => void;
    onAddExtra: (extra: Omit<Extra, 'id'>) => void;
    onUpdateExtra: (extra: Extra) => void;
    onDeleteExtra: (id: string) => void;
    onAddPaymentType: (newType: Omit<PaymentType, 'id'>) => void;
    onUpdatePaymentType: (updatedType: PaymentType) => void;
    onDeletePaymentType: (typeId: string) => void;
}

const ManagePrices: React.FC<ManagePricesProps> = ({ activities, speedBoatTrips, taxiBoatOptions, extras, paymentTypes, onAddActivity, onUpdateActivity, onDeleteActivity, onAddSpeedBoatTrip, onUpdateSpeedBoatTrip, onDeleteSpeedBoatTrip, onAddTaxiBoatOption, onUpdateTaxiBoatOption, onDeleteTaxiBoatOption, onAddExtra, onUpdateExtra, onDeleteExtra, onAddPaymentType, onUpdatePaymentType, onDeletePaymentType }) => {
    const [modal, setModal] = useState<'activity' | 'speedboat' | 'taxi' | 'extra' | 'payment' | null>(null);

    const handleSaveActivity = (activity: Omit<Activity, 'id'>) => { onAddActivity(activity); setModal(null); }
    const handleSaveExtra = (extra: Omit<Extra, 'id'>) => { onAddExtra(extra); setModal(null); }
    const handleSaveTaxi = (option: Omit<TaxiBoatOption, 'id'>) => { onAddTaxiBoatOption(option); setModal(null); }
    const handleSaveSpeedboat = (trip: Omit<SpeedBoatTrip, 'id'>) => { onAddSpeedBoatTrip(trip); setModal(null); }
    const handleSavePaymentType = (paymentType: Omit<PaymentType, 'id'>) => { onAddPaymentType(paymentType); setModal(null); }

    return (
        <div className="space-y-8">
            <Modal isOpen={modal === 'activity'} onClose={() => setModal(null)} title="Add New Activity"><ActivityForm onSave={handleSaveActivity} onClose={() => setModal(null)} /></Modal>
            <Modal isOpen={modal === 'speedboat'} onClose={() => setModal(null)} title="Add New Speed Boat Trip"><SpeedBoatTripForm onSave={handleSaveSpeedboat} onClose={() => setModal(null)} /></Modal>
            <Modal isOpen={modal === 'taxi'} onClose={() => setModal(null)} title="Add New Taxi Boat Option"><TaxiBoatOptionForm onSave={handleSaveTaxi} onClose={() => setModal(null)} /></Modal>
            <Modal isOpen={modal === 'extra'} onClose={() => setModal(null)} title="Add New Extra"><ExtraForm onSave={handleSaveExtra} onClose={() => setModal(null)} /></Modal>
            <Modal isOpen={modal === 'payment'} onClose={() => setModal(null)} title="Add New Payment Method"><PaymentTypeForm onSave={handleSavePaymentType} onClose={() => setModal(null)} /></Modal>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4 border-b pb-2"><h2 className="text-xl font-bold text-slate-800">Activity Prices</h2><button onClick={() => setModal('activity')} className="flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800"><PlusIcon className="w-4 h-4 mr-1"/> Add Activity</button></div>
                <div className="space-y-3">{activities.map(activity => ( <EditablePriceItem key={activity.id} item={activity} onSave={onUpdateActivity} onDelete={onDeleteActivity} /> ))}</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4 border-b pb-2"><h2 className="text-xl font-bold text-slate-800">Speed Boat Prices</h2><button onClick={() => setModal('speedboat')} className="flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800"><PlusIcon className="w-4 h-4 mr-1"/> Add Speed Boat</button></div>
                <div className="space-y-3">{speedBoatTrips.map(trip => ( <EditableSpeedBoatPriceItem key={trip.id} trip={trip} onSave={onUpdateSpeedBoatTrip} onDelete={onDeleteSpeedBoatTrip} /> ))}</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4 border-b pb-2"><h2 className="text-xl font-bold text-slate-800">Taxi Boat Prices</h2><button onClick={() => setModal('taxi')} className="flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800"><PlusIcon className="w-4 h-4 mr-1"/> Add Taxi Option</button></div>
                <div className="space-y-3">{taxiBoatOptions.map(option => ( <EditablePriceItem key={option.id} item={option} onSave={onUpdateTaxiBoatOption} onDelete={onDeleteTaxiBoatOption} /> ))}</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4 border-b pb-2"><h2 className="text-xl font-bold text-slate-800">Extras Prices</h2><button onClick={() => setModal('extra')} className="flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800"><PlusIcon className="w-4 h-4 mr-1"/> Add Extra</button></div>
                <div className="space-y-3">{extras.map(extra => ( <EditableExtraItem key={extra.id} item={extra} onSave={onUpdateExtra} onDelete={onDeleteExtra} /> ))}</div>
            </div>
             <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4 border-b pb-2"><h2 className="text-xl font-bold text-slate-800">Payment Methods</h2><button onClick={() => setModal('payment')} className="flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800"><PlusIcon className="w-4 h-4 mr-1"/> Add Method</button></div>
                <div className="space-y-3">{paymentTypes.map(pt => ( <EditablePaymentTypeItem key={pt.id} item={pt} onSave={onUpdatePaymentType} onDelete={onDeletePaymentType} /> ))}</div>
            </div>
            <style>{`.input-field{padding:0.5rem 0.75rem;background-color:white;border:1px solid #cbd5e1;border-radius:0.375rem;box-shadow:0 1px 2px 0 rgb(0 0 0 / 0.05);outline:none;color:#1e293b;}.input-field:focus{ring:1px solid #3b82f6;border-color:#3b82f6;}`}</style>
        </div>
    );
}

export default ManagePrices;