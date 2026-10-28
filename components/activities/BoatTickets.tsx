import React, { useState, useMemo, useEffect } from 'react';
import type { SpeedBoatTrip, Staff, TaxiBoatOption, PaymentType, Booking } from '../../types';
import { Role } from '../../types';
import Modal from '../Modal';
import { PlusIcon, EditIcon, TrashIcon } from '../../constants';

// Form for adding/editing SpeedBoatTrip
interface SpeedBoatTripFormProps {
    onSave: (trip: Omit<SpeedBoatTrip, 'id'> | SpeedBoatTrip) => void;
    onClose: () => void;
    initialData?: SpeedBoatTrip | null;
}

const SpeedBoatTripForm: React.FC<SpeedBoatTripFormProps> = ({ onSave, onClose, initialData }) => {
    const [formData, setFormData] = useState({
        route: initialData?.route || '',
        company: initialData?.company || '',
        price: initialData?.price.toString() || '',
        cost: initialData?.cost.toString() || '',
        commission: initialData?.commission?.toString() || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const tripData = {
            ...formData,
            price: Number(formData.price) || 0,
            cost: Number(formData.cost) || 0,
            commission: Number(formData.commission) || undefined,
        };
        if (initialData) {
            onSave({ ...initialData, ...tripData });
        } else {
            onSave(tripData);
        }
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="route" className="block text-sm font-medium text-slate-700">Route</label>
                    <input type="text" id="route" value={formData.route} onChange={handleChange} required className="mt-1 block w-full input-field" placeholder="e.g., Lipe - Pakbara"/>
                </div>
                 <div>
                    <label htmlFor="company" className="block text-sm font-medium text-slate-700">Company</label>
                    <input type="text" id="company" value={formData.company} onChange={handleChange} required className="mt-1 block w-full input-field" />
                </div>
                 <div>
                    <label htmlFor="price" className="block text-sm font-medium text-slate-700">Price (THB)</label>
                    <input type="number" id="price" value={formData.price} onChange={handleChange} required className="mt-1 block w-full input-field" />
                </div>
                <div>
                    <label htmlFor="cost" className="block text-sm font-medium text-slate-700">Cost (THB)</label>
                    <input type="number" id="cost" value={formData.cost} onChange={handleChange} required className="mt-1 block w-full input-field" />
                </div>
                 <div className="md:col-span-2">
                    <label htmlFor="commission" className="block text-sm font-medium text-slate-700">Default Commission (per person)</label>
                    <input type="number" id="commission" value={formData.commission} onChange={handleChange} className="mt-1 block w-full input-field" />
                </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">{initialData ? 'Save Changes' : 'Add Trip'}</button>
            </div>
        </form>
    )
}

// Form for adding/editing TaxiBoatOption
interface TaxiBoatOptionFormProps {
    onSave: (option: Omit<TaxiBoatOption, 'id'> | TaxiBoatOption) => void;
    onClose: () => void;
    initialData?: TaxiBoatOption | null;
}

const TaxiBoatOptionForm: React.FC<TaxiBoatOptionFormProps> = ({ onSave, onClose, initialData }) => {
    const [formData, setFormData] = useState({
        name: initialData?.name || ('One Way' as 'One Way' | 'Round Trip'),
        price: initialData?.price.toString() || '',
        commission: initialData?.commission?.toString() || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const optionData = {
            name: formData.name as 'One Way' | 'Round Trip',
            price: Number(formData.price) || 0,
            commission: Number(formData.commission) || undefined,
        };
        if (initialData) {
            onSave({ ...initialData, ...optionData });
        } else {
            onSave(optionData);
        }
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700">Trip Type</label>
                <select id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full input-field">
                    <option value="One Way">One Way</option>
                    <option value="Round Trip">Round Trip</option>
                </select>
            </div>
            <div>
                <label htmlFor="price" className="block text-sm font-medium text-slate-700">Price (THB)</label>
                <input type="number" id="price" value={formData.price} onChange={handleChange} required className="mt-1 block w-full input-field" />
            </div>
            <div>
                <label htmlFor="commission" className="block text-sm font-medium text-slate-700">Default Commission (per person)</label>
                <input type="number" id="commission" value={formData.commission} onChange={handleChange} className="mt-1 block w-full input-field" />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">{initialData ? 'Save Changes' : 'Add Option'}</button>
            </div>
        </form>
    );
};

const CommonFormFields: React.FC<{ staff: Staff[]; selectedStaffId: string; onStaffChange: (id: string) => void; numberOfPeople: string; onPeopleChange: (num: string) => void; includePeopleCount?: boolean; }> = ({ staff, selectedStaffId, onStaffChange, numberOfPeople, onPeopleChange, includePeopleCount = false }) => (
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


interface BoatTicketsProps {
    speedBoatTrips: SpeedBoatTrip[];
    taxiBoatOptions: TaxiBoatOption[];
    staff: Staff[];
    paymentTypes: PaymentType[];
    bookings: Booking[];
    onBookSpeedBoat: (tripId: string, staffId: string, numberOfPeople: number, paymentMethod: string, bookingDate: string, receiptImage?: string, employeeCommission?: number) => void;
    onBookTaxiBoat: (taxiOptionId: string, staffId: string, numberOfPeople: number, paymentMethod: string, bookingDate: string, receiptImage?: string, employeeCommission?: number) => void;
    onAddSpeedBoatTrip: (newTrip: Omit<SpeedBoatTrip, 'id'>) => void;
    onUpdateSpeedBoatTrip: (updatedTrip: SpeedBoatTrip) => void;
    onDeleteSpeedBoatTrip: (tripId: string) => void;
    onAddTaxiBoatOption: (newOption: Omit<TaxiBoatOption, 'id'>) => void;
    onUpdateTaxiBoatOption: (updatedOption: TaxiBoatOption) => void;
    onDeleteTaxiBoatOption: (optionId: string) => void;
    currentUserRole: Role;
}

const BoatTickets: React.FC<BoatTicketsProps> = ({ speedBoatTrips, taxiBoatOptions, staff, paymentTypes, bookings, onBookSpeedBoat, onBookTaxiBoat, onAddSpeedBoatTrip, onUpdateSpeedBoatTrip, onDeleteSpeedBoatTrip, onAddTaxiBoatOption, onUpdateTaxiBoatOption, onDeleteTaxiBoatOption, currentUserRole }) => {
    // Modal states
    const [isSpeedBoatModalOpen, setIsSpeedBoatModalOpen] = useState(false);
    const [selectedTrip, setSelectedTrip] = useState<SpeedBoatTrip | null>(null);
    const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
    const [availableTripsForRoute, setAvailableTripsForRoute] = useState<SpeedBoatTrip[]>([]);
    const [isTaxiModalOpen, setIsTaxiModalOpen] = useState(false);
    const [selectedTaxiOption, setSelectedTaxiOption] = useState<TaxiBoatOption | null>(null);
    const [isManageTripsModalOpen, setIsManageTripsModalOpen] = useState(false);
    const [editingSpeedBoatTrip, setEditingSpeedBoatTrip] = useState<SpeedBoatTrip | null>(null);
    const [showTripForm, setShowTripForm] = useState(false);
    const [isManageTaxiModalOpen, setIsManageTaxiModalOpen] = useState(false);
    const [editingTaxiOption, setEditingTaxiOption] = useState<TaxiBoatOption | null>(null);
    const [showTaxiForm, setShowTaxiForm] = useState(false);


    const initialPaymentState = useMemo(() => ({
        method: paymentTypes[0]?.name || '',
        receiptImage: undefined as string | undefined,
    }), [paymentTypes]);

    // Form states
    const [selectedStaffId, setSelectedStaffId] = useState<string>('');
    const [numberOfPeople, setNumberOfPeople] = useState('1');
    const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
    const [paymentDetails, setPaymentDetails] = useState<{ method: string; receiptImage?: string }>(initialPaymentState);
    const [employeeCommission, setEmployeeCommission] = useState('');
    const [selectedReportMonth, setSelectedReportMonth] = useState<string>(new Date().toISOString().slice(0, 7));


    useEffect(() => {
        setPaymentDetails(initialPaymentState);
    }, [initialPaymentState]);

    const resetFormStates = () => {
        setSelectedStaffId('');
        setNumberOfPeople('1');
        setBookingDate(new Date().toISOString().split('T')[0]);
        setPaymentDetails(initialPaymentState);
        setEmployeeCommission('');
    };
    
    useEffect(() => {
        if (isSpeedBoatModalOpen && selectedTrip) {
            setEmployeeCommission(selectedTrip.commission?.toString() || '0');
        } else if (isTaxiModalOpen && selectedTaxiOption) {
            setEmployeeCommission(selectedTaxiOption.commission?.toString() || '0');
        }
    }, [isSpeedBoatModalOpen, selectedTrip, isTaxiModalOpen, selectedTaxiOption]);

    const currencyFormat = (value: number) => `฿${value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

    const staffMap = useMemo(() => new Map(staff.map(s => [s.id, s.name])), [staff]);

    const filteredBoatBookings = useMemo(() => {
        return bookings.filter(b => 
            (b.itemType === 'speedboat' || b.itemType === 'taxi_boat') && 
            b.bookingDate.startsWith(selectedReportMonth)
        );
    }, [bookings, selectedReportMonth]);


    const handleCloseModals = () => {
        setIsSpeedBoatModalOpen(false);
        setIsTaxiModalOpen(false);
        setIsManageTripsModalOpen(false);
        setIsManageTaxiModalOpen(false);
        setSelectedTrip(null);
        setSelectedRoute(null);
        setSelectedTaxiOption(null);
        setEditingSpeedBoatTrip(null);
        setShowTripForm(false);
        setEditingTaxiOption(null);
        setShowTaxiForm(false);
    };
    
    const groupedSpeedBoatTrips = useMemo(() => {
        // Fix: Explicitly type the accumulator for the reduce function to ensure correct type inference.
        return speedBoatTrips.reduce((acc, trip) => {
            const { route } = trip;
            if (!acc[route]) {
                acc[route] = [];
            }
            acc[route].push(trip);
            return acc;
        }, {} as Record<string, SpeedBoatTrip[]>);
    }, [speedBoatTrips]);

    const handleOpenSpeedBoatModalForRoute = (route: string, trips: SpeedBoatTrip[]) => {
        resetFormStates();
        setSelectedRoute(route);
        setAvailableTripsForRoute(trips);
        setSelectedTrip(trips[0] || null);
        setIsSpeedBoatModalOpen(true);
    };

    const handleOpenTaxiModal = (option: TaxiBoatOption) => {
        resetFormStates();
        setSelectedTaxiOption(option);
        setIsTaxiModalOpen(true);
    }
    
    const handleBookSpeedBoat = () => {
        if (!selectedTrip || !selectedStaffId) return alert('Please select a staff member.');
        onBookSpeedBoat(selectedTrip.id, selectedStaffId, Number(numberOfPeople), paymentDetails.method, bookingDate, paymentDetails.receiptImage, Number(employeeCommission) || undefined);
        handleCloseModals();
    };

    const handleBookTaxi = () => {
        if (!selectedTaxiOption || !selectedStaffId) return alert('Please select a staff member.');
        onBookTaxiBoat(selectedTaxiOption.id, selectedStaffId, Number(numberOfPeople), paymentDetails.method, bookingDate, paymentDetails.receiptImage, Number(employeeCommission) || undefined);
        handleCloseModals();
    };

    const handleEditTrip = (trip: SpeedBoatTrip) => {
        setEditingSpeedBoatTrip(trip);
        setShowTripForm(true);
    };

    const handleSaveSpeedBoatTrip = (tripData: Omit<SpeedBoatTrip, 'id'> | SpeedBoatTrip) => {
        if ('id' in tripData) {
            onUpdateSpeedBoatTrip(tripData);
        } else {
            onAddSpeedBoatTrip(tripData);
        }
        setEditingSpeedBoatTrip(null);
        setShowTripForm(false);
    };

    const handleEditTaxiOption = (option: TaxiBoatOption) => {
        setEditingTaxiOption(option);
        setShowTaxiForm(true);
    };

    const handleSaveTaxiOption = (optionData: Omit<TaxiBoatOption, 'id'> | TaxiBoatOption) => {
        if ('id' in optionData) {
            onUpdateTaxiBoatOption(optionData);
        } else {
            onAddTaxiBoatOption(optionData);
        }
        setEditingTaxiOption(null);
        setShowTaxiForm(false);
    };


    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-md p-4">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-semibold text-slate-800">Speed Boat Routes</h3>
                        {currentUserRole === Role.Admin && (
                            <button onClick={() => setIsManageTripsModalOpen(true)} className="px-3 py-1.5 text-sm font-semibold text-white bg-slate-600 rounded-md hover:bg-slate-700">Manage Trips</button>
                        )}
                    </div>
                    <div className="space-y-4">
                        {Object.entries(groupedSpeedBoatTrips).map(([route, trips]) => (
                            <div key={route} className="flex justify-between items-center p-3 rounded-md bg-slate-50 border">
                                <div>
                                    <p className="font-semibold text-slate-800">{route}</p>
                                    <p className="text-xs text-slate-500">{trips.length} {trips.length > 1 ? 'companies' : 'company'} available</p>
                                </div>
                                <button onClick={() => handleOpenSpeedBoatModalForRoute(route, trips)} className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">Book</button>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-semibold text-slate-800">Taxi Boat</h3>
                        {currentUserRole === Role.Admin && (
                            <button onClick={() => setIsManageTaxiModalOpen(true)} className="px-3 py-1.5 text-sm font-semibold text-white bg-slate-600 rounded-md hover:bg-slate-700">Manage Options</button>
                        )}
                    </div>
                     <div className="space-y-2">
                        {taxiBoatOptions.map(opt => (
                            <div key={opt.id} className="flex justify-between items-center p-2 rounded-md hover:bg-slate-50">
                                <div>
                                    <p className="font-medium text-slate-700">{opt.name}</p>
                                    <p className="text-sm text-slate-500">{opt.price} THB</p>
                                </div>
                                <button onClick={() => handleOpenTaxiModal(opt)} className="px-3 py-1 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">Book</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {currentUserRole === Role.Admin && (
                <div className="mt-8 bg-white rounded-lg shadow-md overflow-x-auto">
                    <div className="p-4 border-b">
                        <h3 className="text-lg font-semibold text-slate-800">Boat Ticket Financial Details</h3>
                        <div className="mt-2">
                            <label htmlFor="month-filter-boat-report" className="text-sm font-medium text-slate-600">Month:</label>
                            <input 
                                type="month" 
                                id="month-filter-boat-report"
                                value={selectedReportMonth}
                                onChange={e => setSelectedReportMonth(e.target.value)}
                                className="ml-2 rounded-md border-slate-300 shadow-sm text-sm py-1"
                            />
                        </div>
                    </div>
                    <table className="w-full text-sm">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                            <tr>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Route</th>
                                <th className="px-6 py-3">People</th>
                                <th className="px-6 py-3">Total Price</th>
                                <th className="px-6 py-3">Company Cost</th>
                                <th className="px-6 py-3">Employee Comm.</th>
                                <th className="px-6 py-3">Hostel Net Profit</th>
                                <th className="px-6 py-3">Staff</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBoatBookings
                                .map(b => {
                                    const totalPrice = b.customerPrice - (b.discount || 0);
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
                            {filteredBoatBookings.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="text-center p-4 text-slate-500">
                                        No boat ticket bookings for this period.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
            
            <Modal isOpen={isSpeedBoatModalOpen} onClose={handleCloseModals} title={`Book: ${selectedRoute}`}>
                 <div className="space-y-6">
                    <div>
                        <label htmlFor="bookingDate" className="block text-sm font-medium text-slate-700">Booking Date</label>
                        <input type="date" id="bookingDate" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} required className="mt-1 block w-full input-field" />
                    </div>
                    <div>
                        <label htmlFor="company" className="block text-sm font-medium text-slate-700">Company</label>
                        <select 
                            id="company" 
                            value={selectedTrip?.id || ''} 
                            onChange={(e) => {
                                const trip = availableTripsForRoute.find(t => t.id === e.target.value);
                                if (trip) setSelectedTrip(trip);
                            }} 
                            required 
                            className="mt-1 block w-full input-field"
                        >
                            {availableTripsForRoute.map(trip => (
                                <option key={trip.id} value={trip.id}>{trip.company} - {trip.price} THB</option>
                            ))}
                        </select>
                    </div>
                    <CommonFormFields staff={staff} selectedStaffId={selectedStaffId} onStaffChange={setSelectedStaffId} numberOfPeople={numberOfPeople} onPeopleChange={setNumberOfPeople} includePeopleCount />
                    {currentUserRole === Role.Admin && (
                        <div>
                            <label htmlFor="employeeCommission" className="block text-sm font-medium text-slate-700">Employee Commission (per person)</label>
                            <input type="number" id="employeeCommission" value={employeeCommission} onChange={(e) => setEmployeeCommission(e.target.value)} className="mt-1 block w-full input-field" />
                        </div>
                    )}
                    <PaymentFormFields paymentDetails={paymentDetails} onPaymentChange={setPaymentDetails} paymentTypes={paymentTypes} />
                     {(() => {
                        const numPeople = Number(numberOfPeople) || 1;
                        const finalTotal = (selectedTrip?.price || 0) * numPeople;
                        const totalProfit = selectedTrip ? (selectedTrip.price - selectedTrip.cost) * numPeople : 0;
                        const totalEmpCommission = (Number(employeeCommission) || 0) * numPeople;
                        const hostelNet = totalProfit - totalEmpCommission;

                        return (
                            <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                                <h4 className="text-lg font-semibold text-slate-800 mb-2">Booking Summary</h4>
                                <div className="space-y-1 text-sm">
                                    <div className="flex justify-between font-bold text-base">
                                        <span>Total</span>
                                        <span>{currencyFormat(finalTotal)}</span>
                                    </div>
                                    {currentUserRole === Role.Admin && (
                                        <>
                                            <p className="text-xs text-slate-500 text-right">
                                                Hostel Gross Profit: {currencyFormat(totalProfit)}
                                            </p>
                                            {totalEmpCommission > 0 && (
                                                <div className="flex justify-between text-orange-600">
                                                    <span>Employee Commission ({numPeople} x {currencyFormat(Number(employeeCommission) || 0)})</span>
                                                    <span>-{currencyFormat(totalEmpCommission)}</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between font-semibold text-green-600 text-base border-t mt-1 pt-1">
                                                <span>Hostel Net Profit</span>
                                                <span>{currencyFormat(hostelNet)}</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })()}
                    <div className="flex justify-end pt-4">
                        <button onClick={handleBookSpeedBoat} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Confirm Booking</button>
                    </div>
                </div>
            </Modal>
            
             <Modal isOpen={isTaxiModalOpen} onClose={handleCloseModals} title={`Book Taxi: ${selectedTaxiOption?.name}`}>
                 <div className="space-y-6">
                    <div>
                        <label htmlFor="bookingDate" className="block text-sm font-medium text-slate-700">Booking Date</label>
                        <input type="date" id="bookingDate" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} required className="mt-1 block w-full input-field" />
                    </div>
                    <CommonFormFields staff={staff} selectedStaffId={selectedStaffId} onStaffChange={setSelectedStaffId} numberOfPeople={numberOfPeople} onPeopleChange={setNumberOfPeople} includePeopleCount />
                    {currentUserRole === Role.Admin && (
                        <div>
                            <label htmlFor="employeeCommission" className="block text-sm font-medium text-slate-700">Employee Commission (per person)</label>
                            <input type="number" id="employeeCommission" value={employeeCommission} onChange={(e) => setEmployeeCommission(e.target.value)} className="mt-1 block w-full input-field" />
                        </div>
                    )}
                    <PaymentFormFields paymentDetails={paymentDetails} onPaymentChange={setPaymentDetails} paymentTypes={paymentTypes} />
                     {(() => {
                        const numPeople = Number(numberOfPeople) || 1;
                        const finalTotal = (selectedTaxiOption?.price || 0) * numPeople;
                        const totalEmpCommission = (Number(employeeCommission) || 0) * numPeople;
                        return (
                            <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                                <h4 className="text-lg font-semibold text-slate-800 mb-2">Booking Summary</h4>
                                <div className="space-y-1 text-sm">
                                    <div className="flex justify-between font-bold text-base">
                                        <span>Total</span>
                                        <span>{currencyFormat(finalTotal)}</span>
                                    </div>
                                    {currentUserRole === Role.Admin && totalEmpCommission > 0 && (
                                        <div className="flex justify-between text-orange-600">
                                            <span>Employee Commission ({numPeople} x {currencyFormat(Number(employeeCommission) || 0)})</span>
                                            <span>-{currencyFormat(totalEmpCommission)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })()}
                     <div className="flex justify-end pt-4">
                        <button onClick={handleBookTaxi} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Confirm Booking</button>
                    </div>
                </div>
            </Modal>
             <Modal isOpen={isManageTripsModalOpen} onClose={handleCloseModals} title="Manage Speed Boat Trips">
                <div className="space-y-4">
                    <div className="flex justify-end">
                        <button onClick={() => { setEditingSpeedBoatTrip(null); setShowTripForm(prev => !prev); }} className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center">
                           <PlusIcon className="w-4 h-4 mr-1"/>
                           {showTripForm && !editingSpeedBoatTrip ? 'Close Form' : 'Add New Trip'}
                        </button>
                    </div>

                    {showTripForm && (
                         <div className="p-4 bg-slate-50 rounded-lg border">
                            <h4 className="text-md font-semibold text-slate-800 mb-3">{editingSpeedBoatTrip ? 'Edit Trip' : 'Add New Trip'}</h4>
                            <SpeedBoatTripForm 
                                onSave={handleSaveSpeedBoatTrip}
                                onClose={() => { setShowTripForm(false); setEditingSpeedBoatTrip(null); }}
                                initialData={editingSpeedBoatTrip}
                            />
                        </div>
                    )}
                
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                        {speedBoatTrips.map(trip => (
                            <div key={trip.id} className="flex justify-between items-center p-2 bg-white rounded-md shadow-sm border">
                                <div>
                                    <p className="font-medium text-slate-800">{trip.route}</p>
                                    <p className="text-xs text-slate-500">
                                        {trip.company} - Price: {trip.price} THB, Cost: {trip.cost} THB
                                        {trip.commission ? ` | Commission: ${trip.commission} THB` : ''}
                                    </p>
                                </div>
                                <div className="flex space-x-3">
                                    <button onClick={() => handleEditTrip(trip)} className="text-slate-500 hover:text-blue-600"><EditIcon className="w-4 h-4" /></button>
                                    <button onClick={() => onDeleteSpeedBoatTrip(trip.id)} className="text-slate-500 hover:text-red-600"><TrashIcon className="w-4 h-4" /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Modal>

            <Modal isOpen={isManageTaxiModalOpen} onClose={handleCloseModals} title="Manage Taxi Boat Options">
                <div className="space-y-4">
                    <div className="flex justify-end">
                         <button onClick={() => { setEditingTaxiOption(null); setShowTaxiForm(prev => !prev); }} className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center">
                           <PlusIcon className="w-4 h-4 mr-1"/>
                           {showTaxiForm && !editingTaxiOption ? 'Close Form' : 'Add New Option'}
                        </button>
                    </div>
                     {showTaxiForm && (
                         <div className="p-4 bg-slate-50 rounded-lg border">
                            <h4 className="text-md font-semibold text-slate-800 mb-3">{editingTaxiOption ? 'Edit Option' : 'Add New Option'}</h4>
                            <TaxiBoatOptionForm 
                                onSave={handleSaveTaxiOption}
                                onClose={() => { setShowTaxiForm(false); setEditingTaxiOption(null); }}
                                initialData={editingTaxiOption}
                            />
                        </div>
                    )}
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                        {taxiBoatOptions.map(option => (
                            <div key={option.id} className="flex justify-between items-center p-2 bg-white rounded-md shadow-sm border">
                                <div>
                                    <p className="font-medium text-slate-800">{option.name}</p>
                                    <p className="text-xs text-slate-500">
                                        Price: {option.price} THB
                                        {option.commission ? ` | Commission: ${option.commission} THB` : ''}
                                    </p>
                                </div>
                                <div className="flex space-x-3">
                                    <button onClick={() => handleEditTaxiOption(option)} className="text-slate-500 hover:text-blue-600"><EditIcon className="w-4 h-4" /></button>
                                    <button onClick={() => onDeleteTaxiBoatOption(option.id)} className="text-slate-500 hover:text-red-600"><TrashIcon className="w-4 h-4" /></button>
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

export default BoatTickets;