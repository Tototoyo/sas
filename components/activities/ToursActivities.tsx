import React, { useState, useMemo, useEffect } from 'react';
import type { Activity, Extra, Staff, PaymentType, Booking } from '../../types';
import { Role } from '../../types';
import Modal from '../Modal';
import { PlusIcon, EditIcon, TrashIcon } from '../../constants';

// Form for adding/editing Activity
interface ActivityFormProps {
    onSave: (activity: Omit<Activity, 'id'> | Activity) => void;
    onClose: () => void;
    initialData?: Activity | null;
}

const ActivityForm: React.FC<ActivityFormProps> = ({ onSave, onClose, initialData }) => {
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        description: initialData?.description || '',
        price: initialData?.price.toString() || '',
        imageUrl: initialData?.imageUrl || '',
        commission: initialData?.commission?.toString() || '',
        type: initialData?.type || 'Internal',
        companyCost: initialData?.companyCost?.toString() || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const activityData = {
            ...formData,
            price: Number(formData.price) || 0,
            commission: Number(formData.commission) || undefined,
            type: formData.type as 'Internal' | 'External',
            companyCost: formData.type === 'External' ? Number(formData.companyCost) || undefined : undefined,
        };
        if (initialData) {
            onSave({ ...initialData, ...activityData });
        } else {
            onSave(activityData);
        }
        onClose();
    };
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="type" className="block text-sm font-medium text-slate-700">Activity Type</label>
                <select id="type" value={formData.type} onChange={handleChange} className="mt-1 block w-full input-field">
                    <option value="Internal">Internal (Hostel Tour)</option>
                    <option value="External">External (Partner Tour)</option>
                </select>
            </div>
            <div><label htmlFor="name" className="block text-sm font-medium text-slate-700">Name</label><input type="text" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full input-field" /></div>
            <div><label htmlFor="description" className="block text-sm font-medium text-slate-700">Description</label><textarea id="description" value={formData.description} onChange={handleChange} required rows={3} className="mt-1 block w-full input-field" /></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="price" className="block text-sm font-medium text-slate-700">Price (THB)</label>
                    <input type="number" id="price" value={formData.price} onChange={handleChange} required className="mt-1 block w-full input-field" />
                </div>
                 {formData.type === 'External' && (
                    <div>
                        <label htmlFor="companyCost" className="block text-sm font-medium text-slate-700">Company Cost (per person)</label>
                        <input type="number" id="companyCost" value={formData.companyCost} onChange={handleChange} placeholder="e.g. 500" className="mt-1 block w-full input-field" />
                    </div>
                )}
                <div>
                    <label htmlFor="commission" className="block text-sm font-medium text-slate-700">Default Employee Commission (per person)</label>
                    <input type="number" id="commission" value={formData.commission} onChange={handleChange} placeholder="e.g. 100" className="mt-1 block w-full input-field" />
                </div>
            </div>
            <div><label htmlFor="imageUrl" className="block text-sm font-medium text-slate-700">Image URL</label><input type="text" id="imageUrl" value={formData.imageUrl} onChange={handleChange} required className="mt-1 block w-full input-field" placeholder="https://placehold.co/..." /></div>
            <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">{initialData ? 'Save Changes' : 'Add Activity'}</button>
            </div>
        </form>
    );
};

const initialPrivateTourState = {
    type: 'Half Day' as 'Half Day' | 'Full Day',
    price: '',
};

const CommonFormFields: React.FC<{
    staff: Staff[];
    selectedStaffId: string;
    onStaffChange: (id: string) => void;
    numberOfPeople: string;
    onPeopleChange: (num: string) => void;
    discount?: string;
    onDiscountChange?: (value: string) => void;
    fuelCost?: string;
    onFuelCostChange?: (value: string) => void;
    captainCost?: string;
    onCaptainCostChange?: (value: string) => void;
    includeDiscount?: boolean;
    includeFuelAndCaptain?: boolean;
    includePeopleCount?: boolean;
}> = ({ staff, selectedStaffId, onStaffChange, numberOfPeople, onPeopleChange, discount, onDiscountChange, fuelCost, onFuelCostChange, captainCost, onCaptainCostChange, includeDiscount, includeFuelAndCaptain, includePeopleCount }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
            <label htmlFor="staffId" className="block text-sm font-medium text-slate-700">Booking Staff</label>
            <select id="staffId" value={selectedStaffId} onChange={(e) => onStaffChange(e.target.value)} required className="mt-1 block w-full input-field">
                <option value="">Select Staff</option>
                {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
        </div>
        {includePeopleCount && (
             <div>
                <label htmlFor="numberOfPeople" className="block text-sm font-medium text-slate-700">Number of People</label>
                <input type="number" id="numberOfPeople" value={numberOfPeople} onChange={(e) => onPeopleChange(e.target.value)} min="1" required className="mt-1 block w-full input-field" />
            </div>
        )}
        {includeDiscount && onDiscountChange &&(
             <div>
                <label htmlFor="discount" className="block text-sm font-medium text-slate-700">Discount (THB)</label>
                <input type="number" id="discount" value={discount} onChange={(e) => onDiscountChange(e.target.value)} className="mt-1 block w-full input-field" />
            </div>
        )}
        {includeFuelAndCaptain && onFuelCostChange && onCaptainCostChange && (
            <>
                <div>
                    <label htmlFor="fuelCost" className="block text-sm font-medium text-slate-700">Fuel Cost (THB)</label>
                    <input type="number" id="fuelCost" value={fuelCost} onChange={(e) => onFuelCostChange(e.target.value)} className="mt-1 block w-full input-field" />
                </div>
                <div>
                    <label htmlFor="captainCost" className="block text-sm font-medium text-slate-700">Captain Cost (THB)</label>
                    <input type="number" id="captainCost" value={captainCost} onChange={(e) => onCaptainCostChange(e.target.value)} className="mt-1 block w-full input-field" />
                </div>
            </>
        )}
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


// Main component
interface ToursActivitiesProps {
    activities: Activity[];
    staff: Staff[];
    extras: Extra[];
    paymentTypes: PaymentType[];
    bookings: Booking[];
    onBookActivity: (activityId: string, staffId: string, numberOfPeople: number, discount: number, extras: Omit<Extra, 'id' | 'commission'>[], paymentMethod: string, bookingDate: string, receiptImage?: string, fuelCost?: number, captainCost?: number, employeeCommission?: number) => void;
    onBookPrivateTour: (tourType: 'Half Day' | 'Full Day', price: number, numberOfPeople: number, staffId: string, paymentMethod: string, bookingDate: string, receiptImage?: string, fuelCost?: number, captainCost?: number, employeeCommission?: number, hostelCommission?: number) => void;
    onAddActivity: (newActivity: Omit<Activity, 'id'>) => void;
    onUpdateActivity: (updatedActivity: Activity) => void;
    onDeleteActivity: (activityId: string) => void;
    currentUserRole: Role;
}

const ToursActivities: React.FC<ToursActivitiesProps> = ({ activities, staff, extras, paymentTypes, bookings, onBookActivity, onBookPrivateTour, onAddActivity, onUpdateActivity, onDeleteActivity, currentUserRole }) => {
    // Modal states
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
    const [isPrivateTourModalOpen, setIsPrivateTourModalOpen] = useState(false);
    const [isManageModalOpen, setIsManageModalOpen] = useState(false);
    const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
    const [showActivityForm, setShowActivityForm] = useState(false);

    const initialPaymentState = useMemo(() => ({
        method: paymentTypes[0]?.name || '',
        receiptImage: undefined as string | undefined,
    }), [paymentTypes]);

    // Form states
    const [selectedStaffId, setSelectedStaffId] = useState<string>('');
    const [numberOfPeople, setNumberOfPeople] = useState('1');
    const [discount, setDiscount] = useState('');
    const [selectedExtras, setSelectedExtras] = useState<Omit<Extra, 'id' | 'commission'>[]>([]);
    const [fuelCost, setFuelCost] = useState('');
    const [captainCost, setCaptainCost] = useState('');
    const [employeeCommission, setEmployeeCommission] = useState('');
    const [hostelCommission, setHostelCommission] = useState('');
    const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
    const [paymentDetails, setPaymentDetails] = useState<{ method: string; receiptImage?: string }>(initialPaymentState);
    const [privateTourData, setPrivateTourData] = useState(initialPrivateTourState);
    const [selectedReportMonth, setSelectedReportMonth] = useState<string>(new Date().toISOString().slice(0, 7));


    useEffect(() => {
        setPaymentDetails(initialPaymentState);
    }, [initialPaymentState]);

    const resetFormStates = () => {
        setSelectedStaffId('');
        setNumberOfPeople('1');
        setDiscount('');
        setSelectedExtras([]);
        setFuelCost('');
        setCaptainCost('');
        setEmployeeCommission('');
        setHostelCommission('');
        setBookingDate(new Date().toISOString().split('T')[0]);
        setPaymentDetails(initialPaymentState);
        setPrivateTourData(initialPrivateTourState);
    };

    useEffect(() => {
        if (isBookingModalOpen && selectedActivity) {
            setEmployeeCommission(selectedActivity.commission?.toString() || '0');
        }
    }, [isBookingModalOpen, selectedActivity]);

    const currencyFormat = (value: number) => `฿${value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    const staffMap = useMemo(() => new Map(staff.map(s => [s.id, s.name])), [staff]);

    const filteredActivityBookings = useMemo(() => {
        return bookings.filter(b => 
            b.itemType === 'activity' && 
            b.bookingDate.startsWith(selectedReportMonth)
        );
    }, [bookings, selectedReportMonth]);


    const handleCloseModals = () => {
        setIsBookingModalOpen(false);
        setIsPrivateTourModalOpen(false);
        setIsManageModalOpen(false);
        setSelectedActivity(null);
        setEditingActivity(null);
        setShowActivityForm(false);
    };

    const handleOpenBookingModal = (activity: Activity) => {
        resetFormStates();
        setSelectedActivity(activity);
        setIsBookingModalOpen(true);
    };
    
    const handleBookActivity = () => {
        if (!selectedActivity || !selectedStaffId) return alert('Please select a staff member.');
        onBookActivity(selectedActivity.id, selectedStaffId, Number(numberOfPeople), Number(discount) || 0, selectedExtras, paymentDetails.method, bookingDate, paymentDetails.receiptImage, Number(fuelCost) || undefined, Number(captainCost) || undefined, Number(employeeCommission) || undefined);
        handleCloseModals();
    };

    const handleOpenPrivateTourModal = () => {
        resetFormStates();
        setIsPrivateTourModalOpen(true);
    };

    const handleBookPrivateTour = () => {
        if (!selectedStaffId) return alert('Please select a staff member.');
        onBookPrivateTour(privateTourData.type, Number(privateTourData.price) || 0, Number(numberOfPeople), selectedStaffId, paymentDetails.method, bookingDate, paymentDetails.receiptImage, Number(fuelCost) || undefined, Number(captainCost) || undefined, Number(employeeCommission) || undefined, Number(hostelCommission) || undefined);
        handleCloseModals();
    };

    const handleEditActivity = (activity: Activity) => {
        setEditingActivity(activity);
        setShowActivityForm(true);
    };

    const handleSaveActivity = (activityData: Omit<Activity, 'id'> | Activity) => {
        if ('id' in activityData) {
            onUpdateActivity(activityData);
        } else {
            onAddActivity(activityData);
        }
        setEditingActivity(null);
        setShowActivityForm(false);
    };

    const toggleExtra = (extra: Extra) => {
        setSelectedExtras(prev => {
            const exists = prev.some(e => e.name === extra.name);
            if (exists) {
                return prev.filter(e => e.name !== extra.name);
            }
            return [...prev, { name: extra.name, price: extra.price }];
        });
    };

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activities.map(activity => (
                    <div key={activity.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
                        <img src={activity.imageUrl} alt={activity.name} className="w-full h-48 object-cover" />
                        <div className="p-4 flex flex-col flex-grow">
                            <h3 className="text-lg font-bold text-slate-800">{activity.name}</h3>
                            <p className="text-sm text-slate-600 mt-1 flex-grow">{activity.description}</p>
                            <div className="flex justify-between items-center mt-4">
                                <span className="text-xl font-bold text-slate-900">{currencyFormat(activity.price)}</span>
                                <button onClick={() => handleOpenBookingModal(activity)} className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">Book Now</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Private Tours</h2>
                        <p className="text-slate-500 text-sm mt-1">Book a custom private tour for guests.</p>
                    </div>
                    <button onClick={handleOpenPrivateTourModal} className="mt-4 sm:mt-0 px-6 py-2 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700">Book Private Tour</button>
                </div>
            </div>

            {currentUserRole === Role.Admin && (
                <div className="mt-8 bg-white rounded-lg shadow-md overflow-x-auto">
                    <div className="p-4 border-b flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-800">Tours & Activities Financial Details</h3>
                            <div className="mt-2">
                                <label htmlFor="month-filter-tour-report" className="text-sm font-medium text-slate-600">Month:</label>
                                <input 
                                    type="month" 
                                    id="month-filter-tour-report"
                                    value={selectedReportMonth}
                                    onChange={e => setSelectedReportMonth(e.target.value)}
                                    className="ml-2 rounded-md border-slate-300 shadow-sm text-sm py-1"
                                />
                            </div>
                        </div>
                        <button onClick={() => setIsManageModalOpen(true)} className="px-3 py-1.5 text-sm font-semibold text-white bg-slate-600 rounded-md hover:bg-slate-700">Manage Activities</button>
                    </div>
                    <table className="w-full text-sm">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                            <tr>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Activity</th>
                                <th className="px-6 py-3">People</th>
                                <th className="px-6 py-3">Total Price</th>
                                <th className="px-6 py-3">Company/Op. Cost</th>
                                <th className="px-6 py-3">Employee Comm.</th>
                                <th className="px-6 py-3">Hostel Net Profit</th>
                                <th className="px-6 py-3">Staff</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredActivityBookings
                                .map(b => {
                                    const totalPrice = b.customerPrice + (b.extrasTotal || 0) - (b.discount || 0);
                                    const companyCost = b.itemCost || 0;
                                    const employeeCommission = b.employeeCommission || 0;
                                    const hostelNetProfit = totalPrice - companyCost - employeeCommission;

                                    return (
                                        <tr key={b.id} className="border-b hover:bg-slate-50">
                                            <td className="px-6 py-4">{b.bookingDate}</td>
                                            <td className="px-6 py-4 font-medium text-slate-800">{b.itemName}</td>
                                            <td className="px-6 py-4 text-center">{b.numberOfPeople}</td>
                                            <td className="px-6 py-4">{currencyFormat(totalPrice)}</td>
                                            <td className="px-6 py-4 text-red-600">{currencyFormat(companyCost)}</td>
                                            <td className="px-6 py-4 text-orange-600">{currencyFormat(employeeCommission)}</td>
                                            <td className="px-6 py-4 font-bold text-green-600">{currencyFormat(hostelNetProfit)}</td>
                                            <td className="px-6 py-4 text-slate-500">{staffMap.get(b.staffId) || 'N/A'}</td>
                                        </tr>
                                    );
                                })
                            }
                            {filteredActivityBookings.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="text-center p-4 text-slate-500">
                                        No activity bookings for this period.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            <Modal isOpen={isBookingModalOpen} onClose={handleCloseModals} title={`Book: ${selectedActivity?.name}`}>
                <div className="space-y-6">
                    <div><label htmlFor="bookingDate" className="block text-sm font-medium text-slate-700">Booking Date</label><input type="date" id="bookingDate" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} required className="mt-1 block w-full input-field" /></div>
                    <CommonFormFields staff={staff} selectedStaffId={selectedStaffId} onStaffChange={setSelectedStaffId} numberOfPeople={numberOfPeople} onPeopleChange={setNumberOfPeople} discount={discount} onDiscountChange={setDiscount} includePeopleCount includeDiscount includeFuelAndCaptain={selectedActivity?.type === 'Internal'} fuelCost={fuelCost} onFuelCostChange={setFuelCost} captainCost={captainCost} onCaptainCostChange={setCaptainCost} />
                    {currentUserRole === Role.Admin && ( <div><label htmlFor="employeeCommission" className="block text-sm font-medium text-slate-700">Employee Commission (per person)</label><input type="number" id="employeeCommission" value={employeeCommission} onChange={(e) => setEmployeeCommission(e.target.value)} className="mt-1 block w-full input-field" /></div> )}
                    {extras.length > 0 && (<div className="border-t pt-4"> <h4 className="text-md font-semibold text-slate-800 mb-2">Extras</h4> <div className="flex flex-wrap gap-2"> {extras.map(extra => ( <button key={extra.id} onClick={() => toggleExtra(extra)} className={`px-3 py-1.5 text-sm rounded-full border ${selectedExtras.some(e => e.name === extra.name) ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-slate-700 hover:bg-slate-50'}`}> {extra.name} (+{extra.price} THB) </button> ))} </div> </div> )}
                    <PaymentFormFields paymentDetails={paymentDetails} onPaymentChange={setPaymentDetails} paymentTypes={paymentTypes} />
                    {selectedActivity && (() => {
                        const numPeople = Number(numberOfPeople) || 1;
                        const extrasTotal = selectedExtras.reduce((sum, extra) => sum + extra.price, 0);
                        const basePrice = (selectedActivity.price || 0) * numPeople;
                        const finalTotal = basePrice + extrasTotal - (Number(discount) || 0);
                        const totalEmpCommission = (Number(employeeCommission) || 0) * numPeople;
                        let cost = 0;
                        if (selectedActivity.type === 'Internal') cost = (Number(fuelCost) || 0) + (Number(captainCost) || 0);
                        else cost = (selectedActivity.companyCost || 0) * numPeople;
                        const hostelNet = finalTotal - cost - totalEmpCommission;

                        return (
                            <div className="mt-6 p-4 bg-slate-50 rounded-lg"><h4 className="text-lg font-semibold text-slate-800 mb-2">Booking Summary</h4>
                                <div className="space-y-1 text-sm"><div className="flex justify-between font-bold text-base"><span>Total</span><span>{currencyFormat(finalTotal)}</span></div>
                                    {currentUserRole === Role.Admin && (
                                        <>
                                            <div className="flex justify-between text-red-600"><span>{selectedActivity.type === 'Internal' ? 'Operational Cost' : 'Company Cost'}</span><span>-{currencyFormat(cost)}</span></div>
                                            {totalEmpCommission > 0 && (<div className="flex justify-between text-orange-600"><span>Employee Commission</span><span>-{currencyFormat(totalEmpCommission)}</span></div>)}
                                            <div className="flex justify-between font-semibold text-green-600 text-base border-t mt-1 pt-1"><span>Hostel Net Profit</span><span>{currencyFormat(hostelNet)}</span></div>
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })()}
                    <div className="flex justify-end pt-4"><button onClick={handleBookActivity} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Confirm Booking</button></div>
                </div>
            </Modal>
            
            <Modal isOpen={isPrivateTourModalOpen} onClose={handleCloseModals} title="Book Private Tour">
                <div className="space-y-6">
                    <div><label htmlFor="bookingDate" className="block text-sm font-medium text-slate-700">Booking Date</label><input type="date" id="bookingDate" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} required className="mt-1 block w-full input-field" /></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label htmlFor="tourType" className="block text-sm font-medium text-slate-700">Tour Type</label><select id="tourType" value={privateTourData.type} onChange={e => setPrivateTourData(p => ({ ...p, type: e.target.value as 'Half Day' | 'Full Day' }))} className="mt-1 block w-full input-field"><option value="Half Day">Half Day</option><option value="Full Day">Full Day</option></select></div>
                        <div><label htmlFor="tourPrice" className="block text-sm font-medium text-slate-700">Total Price</label><input type="number" id="tourPrice" value={privateTourData.price} onChange={e => setPrivateTourData(p => ({ ...p, price: e.target.value }))} required className="mt-1 block w-full input-field" /></div>
                    </div>
                    <CommonFormFields staff={staff} selectedStaffId={selectedStaffId} onStaffChange={setSelectedStaffId} numberOfPeople={numberOfPeople} onPeopleChange={setNumberOfPeople} includePeopleCount fuelCost={fuelCost} onFuelCostChange={setFuelCost} captainCost={captainCost} onCaptainCostChange={setCaptainCost} includeFuelAndCaptain />
                    {currentUserRole === Role.Admin && (<div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label htmlFor="hostelCommission" className="block text-sm font-medium text-slate-700">Hostel Commission</label><input type="number" id="hostelCommission" value={hostelCommission} onChange={(e) => setHostelCommission(e.target.value)} className="mt-1 block w-full input-field" /></div><div><label htmlFor="employeeCommission" className="block text-sm font-medium text-slate-700">Employee Commission</label><input type="number" id="employeeCommission" value={employeeCommission} onChange={(e) => setEmployeeCommission(e.target.value)} className="mt-1 block w-full input-field" /></div></div>)}
                    <PaymentFormFields paymentDetails={paymentDetails} onPaymentChange={setPaymentDetails} paymentTypes={paymentTypes} />
                    <div className="flex justify-end pt-4"><button onClick={handleBookPrivateTour} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Confirm Booking</button></div>
                </div>
            </Modal>
            
            <Modal isOpen={isManageModalOpen} onClose={handleCloseModals} title="Manage Activities">
                <div className="space-y-4">
                    <div className="flex justify-end"><button onClick={() => { setEditingActivity(null); setShowActivityForm(prev => !prev); }} className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center"><PlusIcon className="w-4 h-4 mr-1"/>{showActivityForm && !editingActivity ? 'Close Form' : 'Add New Activity'}</button></div>
                    {showActivityForm && (<div className="p-4 bg-slate-50 rounded-lg border"><h4 className="text-md font-semibold text-slate-800 mb-3">{editingActivity ? 'Edit Activity' : 'Add New Activity'}</h4><ActivityForm onSave={handleSaveActivity} onClose={() => { setShowActivityForm(false); setEditingActivity(null); }} initialData={editingActivity}/></div>)}
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                        {activities.map(activity => (<div key={activity.id} className="flex justify-between items-center p-2 bg-white rounded-md shadow-sm border"><div><p className="font-medium text-slate-800">{activity.name}</p><p className="text-xs text-slate-500">Price: {activity.price} THB</p></div><div className="flex space-x-3"><button onClick={() => handleEditActivity(activity)} className="text-slate-500 hover:text-blue-600"><EditIcon className="w-4 h-4" /></button><button onClick={() => onDeleteActivity(activity.id)} className="text-slate-500 hover:text-red-600"><TrashIcon className="w-4 h-4" /></button></div></div>))}
                    </div>
                </div>
            </Modal>
            <style>{`.input-field{padding:0.5rem 0.75rem;background-color:white;border:1px solid #cbd5e1;border-radius:0.375rem;box-shadow:0 1px 2px 0 rgb(0 0 0 / 0.05);outline:none;color:#1e293b;}.input-field:focus{ring:1px solid #3b82f6;border-color:#3b82f6;}`}</style>
        </div>
    );
};
export default ToursActivities;