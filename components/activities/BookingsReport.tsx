import React, { useState, useMemo, useEffect } from 'react';
import type { Booking, ExternalSale, PlatformPayment, UtilityRecord, SalaryAdvance, WalkInGuest, AccommodationBooking, Staff, SpeedBoatTrip, Room, PaymentType, Activity, TaxiBoatOption, Extra, Absence, Bonus } from '../../types';
import Modal from '../Modal';
import { PlusIcon, EditIcon, TrashIcon, EyeIcon, CurrencyDollarIcon, ReceiptPercentIcon, TrendingUpIcon, BuildingOfficeIcon } from '../../constants';

// --- Sub-Components & Forms ---
const SummaryCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; }> = ({ title, value, icon }) => (
    <div className="bg-white p-5 rounded-lg shadow-sm flex items-center space-x-4">
        <div className="bg-blue-100 text-blue-600 rounded-full p-3">
            {icon}
        </div>
        <div>
            <h4 className="text-sm font-medium text-slate-500 truncate">{title}</h4>
            <p className="text-2xl font-semibold text-slate-800 mt-1">{value}</p>
        </div>
    </div>
);

interface ExternalSaleFormProps {
    onSave: (sale: Omit<ExternalSale, 'id'> | ExternalSale) => void;
    onClose: () => void;
    initialData?: ExternalSale | null;
}
const ExternalSaleForm: React.FC<ExternalSaleFormProps> = ({ onSave, onClose, initialData }) => {
    const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0]);
    const [amount, setAmount] = useState(initialData?.amount.toString() || '');
    const [description, setDescription] = useState(initialData?.description || '');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const saleData = { date, amount: Number(amount) || 0, description };
        if (initialData) { onSave({ ...initialData, ...saleData }); } else { onSave(saleData); }
        onClose();
    };

    return (
         <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="saleDate" className="block text-sm font-medium text-slate-700">Date</label>
                <input type="date" id="saleDate" value={date} onChange={(e) => setDate(e.target.value)} required className="mt-1 block w-full input-field" />
            </div>
            <div>
                <label htmlFor="saleAmount" className="block text-sm font-medium text-slate-700">Total Amount (THB)</label>
                <input type="number" id="saleAmount" value={amount} onChange={(e) => setAmount(e.target.value)} required className="mt-1 block w-full input-field" />
            </div>
            <div>
                <label htmlFor="saleDescription" className="block text-sm font-medium text-slate-700">Description (Optional)</label>
                <textarea id="saleDescription" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="mt-1 block w-full input-field" />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">{initialData ? 'Save Changes' : 'Add Sale'}</button>
            </div>
        </form>
    );
};

interface PlatformPaymentFormProps {
    onSave: (payment: Omit<PlatformPayment, 'id'> | PlatformPayment) => void;
    onClose: () => void;
    initialData?: PlatformPayment | null;
}
const PlatformPaymentForm: React.FC<PlatformPaymentFormProps> = ({ onSave, onClose, initialData }) => {
    const PLATFORMS = ['Booking.com', 'Hostelworld', 'Agoda'];
    const initialPlatform = initialData?.platform && !PLATFORMS.includes(initialData.platform) ? 'Other' : initialData?.platform || '';

    const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0]);
    const [platform, setPlatform] = useState(initialPlatform);
    const [otherPlatform, setOtherPlatform] = useState(initialData?.platform && !PLATFORMS.includes(initialData.platform) ? initialData.platform : '');
    const [amount, setAmount] = useState(initialData?.amount.toString() || '');
    const [bookingReference, setBookingReference] = useState(initialData?.bookingReference || '');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalPlatform = platform === 'Other' ? otherPlatform : platform;
        if (!finalPlatform) { alert('Please select or specify a platform.'); return; }

        const paymentData = { date, platform: finalPlatform, amount: Number(amount) || 0, bookingReference };
        if (initialData) { onSave({ ...initialData, ...paymentData }); } else { onSave(paymentData); }
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div><label htmlFor="paymentDate" className="block text-sm font-medium text-slate-700">Date</label><input type="date" id="paymentDate" value={date} onChange={(e) => setDate(e.target.value)} required className="mt-1 block w-full input-field" /></div>
            <div>
                <label htmlFor="platform" className="block text-sm font-medium text-slate-700">Platform</label>
                <select id="platform" value={platform} onChange={(e) => setPlatform(e.target.value)} required className="mt-1 block w-full input-field">
                    <option value="">Select a platform...</option>{PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}<option value="Other">Other</option>
                </select>
            </div>
            {platform === 'Other' && ( <div><label htmlFor="otherPlatform" className="block text-sm font-medium text-slate-700">Specify Platform Name</label><input type="text" id="otherPlatform" value={otherPlatform} onChange={(e) => setOtherPlatform(e.target.value)} required className="mt-1 block w-full input-field" /></div> )}
            <div><label htmlFor="paymentAmount" className="block text-sm font-medium text-slate-700">Total Amount (THB)</label><input type="number" id="paymentAmount" value={amount} onChange={(e) => setAmount(e.target.value)} required className="mt-1 block w-full input-field" /></div>
            <div><label htmlFor="bookingReference" className="block text-sm font-medium text-slate-700">Booking Reference (Optional)</label><input type="text" id="bookingReference" value={bookingReference} onChange={(e) => setBookingReference(e.target.value)} className="mt-1 block w-full input-field" /></div>
            <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">{initialData ? 'Save Changes' : 'Add Payment'}</button>
            </div>
        </form>
    );
};

// --- Main Component ---
interface BookingsReportProps {
  bookings: Booking[];
  externalSales: ExternalSale[];
  platformPayments: PlatformPayment[];
  utilityRecords: UtilityRecord[];
  salaryAdvances: SalaryAdvance[];
  bonuses: Bonus[];
  absences: Absence[];
  walkInGuests: WalkInGuest[];
  accommodationBookings: AccommodationBooking[];
  staff: Staff[];
  speedBoatTrips: SpeedBoatTrip[];
  activities: Activity[];
  taxiBoatOptions: TaxiBoatOption[];
  extras: Extra[];
  rooms: Room[];
  paymentTypes: PaymentType[];
  onUpdateBooking: (updatedBooking: Booking) => void;
  onDeleteBooking: (bookingId: string) => void;
  onAddExternalSale: (newSale: Omit<ExternalSale, 'id'>) => void;
  onUpdateExternalSale: (updatedSale: ExternalSale) => void;
  onDeleteExternalSale: (saleId: string) => void;
  onAddPlatformPayment: (newPayment: Omit<PlatformPayment, 'id'>) => void;
  onUpdatePlatformPayment: (updatedPayment: PlatformPayment) => void;
  onDeletePlatformPayment: (paymentId: string) => void;
}

const BookingsReport: React.FC<BookingsReportProps> = ({ bookings, externalSales, platformPayments, utilityRecords, salaryAdvances, bonuses, absences, walkInGuests, accommodationBookings, staff, speedBoatTrips, activities, taxiBoatOptions, extras, rooms, paymentTypes, onUpdateBooking, onDeleteBooking, onAddExternalSale, onUpdateExternalSale, onDeleteExternalSale, onAddPlatformPayment, onUpdatePlatformPayment, onDeletePlatformPayment }) => {
    // State
    const [reportGranularity, setReportGranularity] = useState<'monthly' | 'yearly'>('monthly');
    const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().slice(0, 7));
    const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
    const [selectedDay, setSelectedDay] = useState<string>('');
    const [viewingReceipt, setViewingReceipt] = useState<string | null>(null);
    const [isExternalSaleModalOpen, setIsExternalSaleModalOpen] = useState(false);
    const [editingExternalSale, setEditingExternalSale] = useState<ExternalSale | null>(null);
    const [isPlatformPaymentModalOpen, setIsPlatformPaymentModalOpen] = useState(false);
    const [editingPlatformPayment, setEditingPlatformPayment] = useState<PlatformPayment | null>(null);
    const [isEditBookingModalOpen, setIsEditBookingModalOpen] = useState(false);
    const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
    
    const staffMap = useMemo(() => new Map(staff.map(s => [s.id, s.name])), [staff]);
    const roomMap = useMemo(() => new Map(rooms.map(r => [r.id, r.name])), [rooms]);

    const currencyFormat = (value: number) => `฿${value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

    // --- Edit Booking Form ---
    interface FullEditBookingFormProps {
        booking: Booking;
        staff: Staff[];
        paymentTypes: PaymentType[];
        activities: Activity[];
        speedBoatTrips: SpeedBoatTrip[];
        taxiBoatOptions: TaxiBoatOption[];
        extras: Extra[];
        onSave: (booking: Booking) => void;
        onClose: () => void;
        onDelete: (booking: Booking) => void;
    }
    const FullEditBookingForm: React.FC<FullEditBookingFormProps> = ({ booking, staff, paymentTypes, activities, speedBoatTrips, taxiBoatOptions, extras, onSave, onClose, onDelete }) => {
        // Fix: Use `any` for formData state to allow strings from form inputs for fields that are numbers in the Booking type. This aligns with the conversion logic in handleSave.
        const [formData, setFormData] = useState<any>(booking);

        const availableItems = useMemo(() => {
            switch (booking.itemType) {
                case 'activity':
                    return activities;
                case 'speedboat':
                    return speedBoatTrips;
                case 'taxi_boat':
                    return taxiBoatOptions;
                case 'extra':
                    return extras;
                default:
                    return [];
            }
        }, [booking.itemType, activities, speedBoatTrips, taxiBoatOptions, extras]);

        // Fix: Changed `field` type from `keyof Booking` to `string` to prevent TypeScript errors when updating state with string values for number fields.
        const handleFormChange = (field: string, value: any) => {
            setFormData(prev => ({ ...prev, [field]: value }));
        };
        
        useEffect(() => {
            const selectedItem = availableItems.find(item => item.id === formData.itemId);
            if (!selectedItem) return;

            const numPeople = Number(formData.numberOfPeople) || 1;
            let newPrice = 0;
            let newItemCost = 0;
            let newCommission = selectedItem.commission || 0;

            if ('price' in selectedItem) {
                newPrice = selectedItem.price * numPeople;
            }
            if ('cost' in selectedItem) {
                newItemCost = (selectedItem as SpeedBoatTrip).cost * numPeople;
            }

            setFormData(prev => ({
                ...prev,
                itemName: 'route' in selectedItem ? `${(selectedItem as SpeedBoatTrip).route} (${(selectedItem as SpeedBoatTrip).company})` : selectedItem.name,
                customerPrice: newPrice,
                itemCost: newItemCost > 0 ? newItemCost : undefined,
                employeeCommission: newCommission * numPeople,
            }));
        }, [formData.itemId, formData.numberOfPeople, availableItems]);

        const handleSave = () => {
            // Fix: Changed the type of `finalData` from `Booking` to `any` to prevent type errors when spreading `formData`, which contains string values for number fields. The conversion logic below ensures the final object shape is correct before saving.
            const finalData: any = { ...formData };
            // Ensure numeric fields are numbers
            (Object.keys(finalData) as Array<keyof Booking>).forEach(key => {
                const numericKeys: (keyof Booking)[] = ['customerPrice', 'numberOfPeople', 'discount', 'extrasTotal', 'fuelCost', 'captainCost', 'itemCost', 'employeeCommission', 'hostelCommission'];
                if (numericKeys.includes(key)) {
                    const value = finalData[key] as any;
                    (finalData as any)[key] = value === '' || value === null || isNaN(Number(value)) ? undefined : Number(value);
                }
            });
            onSave(finalData);
            onClose();
        };
        
        const canEditCosts = ['activity', 'private_tour'].includes(booking.itemType);
        
        return (
            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Booking Date</label>
                        <input type="date" value={formData.bookingDate} onChange={e => handleFormChange('bookingDate', e.target.value)} className="mt-1 block w-full input-field" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Staff Member</label>
                        <select value={formData.staffId} onChange={e => handleFormChange('staffId', e.target.value)} className="mt-1 block w-full input-field">
                            {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>
                 </div>
                 <div className="border-t pt-4">
                    {availableItems.length > 0 ? (
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Item</label>
                            <select value={formData.itemId} onChange={e => handleFormChange('itemId', e.target.value)} className="mt-1 block w-full input-field">
                                {availableItems.map(item => <option key={item.id} value={item.id}>{ 'route' in item ? `${(item as SpeedBoatTrip).route} (${(item as SpeedBoatTrip).company})` : item.name}</option>)}
                            </select>
                        </div>
                    ) : (
                        <div>
                           <label className="block text-sm font-medium text-slate-700">Item Name</label>
                           <input type="text" value={formData.itemName} onChange={e => handleFormChange('itemName', e.target.value)} className="mt-1 block w-full input-field" />
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <div>
                        <label className="block text-sm font-medium text-slate-700">Number of People</label>
                        <input type="number" value={formData.numberOfPeople} onChange={e => handleFormChange('numberOfPeople', e.target.value)} min="1" className="mt-1 block w-full input-field" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Total Price (THB)</label>
                        <input type="number" value={formData.customerPrice} onChange={e => handleFormChange('customerPrice', e.target.value)} className="mt-1 block w-full input-field" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700">Discount (THB)</label>
                        <input type="number" value={formData.discount || ''} onChange={e => handleFormChange('discount', e.target.value)} className="mt-1 block w-full input-field" />
                    </div>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                     {canEditCosts && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Fuel Cost (THB)</label>
                                <input type="number" value={formData.fuelCost || ''} onChange={e => handleFormChange('fuelCost', e.target.value)} className="mt-1 block w-full input-field" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Captain Cost (THB)</label>
                                <input type="number" value={formData.captainCost || ''} onChange={e => handleFormChange('captainCost', e.target.value)} className="mt-1 block w-full input-field" />
                            </div>
                        </>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Employee Commission (Total)</label>
                        <input type="number" value={formData.employeeCommission || ''} onChange={e => handleFormChange('employeeCommission', e.target.value)} className="mt-1 block w-full input-field" />
                    </div>
                    {booking.itemType === 'private_tour' && (
                         <div>
                            <label className="block text-sm font-medium text-slate-700">Hostel Commission (Total)</label>
                            <input type="number" value={formData.hostelCommission || ''} onChange={e => handleFormChange('hostelCommission', e.target.value)} className="mt-1 block w-full input-field" />
                        </div>
                    )}
                     <div>
                        <label className="block text-sm font-medium text-slate-700">Payment Method</label>
                        <select value={formData.paymentMethod} onChange={e => handleFormChange('paymentMethod', e.target.value)} className="mt-1 block w-full input-field">
                            {paymentTypes.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                        </select>
                    </div>
                </div>
                <div className="flex justify-between items-center pt-4 border-t mt-4">
                    <button
                        type="button"
                        onClick={() => {
                            onDelete(formData);
                            onClose();
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
                    >
                       <TrashIcon className="w-4 h-4 mr-2"/> Delete Booking
                    </button>
                    <div className="flex space-x-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Save Changes</button>
                    </div>
                </div>
            </form>
        );
    };


    // Handlers
    const handleGranularityChange = (value: 'monthly' | 'yearly') => {
        setReportGranularity(value);
        setSelectedDay('');
    };
    const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedMonth(e.target.value);
        setSelectedDay('');
    };
    const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedYear(e.target.value);
        setSelectedDay('');
    };
    const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const day = e.target.value;
        setSelectedDay(day);
        if (day) {
            setReportGranularity('monthly');
            setSelectedMonth(day.substring(0, 7));
            setSelectedYear(day.substring(0, 4));
        }
    };

    const handleCloseModals = () => {
        setViewingReceipt(null);
        setIsExternalSaleModalOpen(false);
        setEditingExternalSale(null);
        setIsPlatformPaymentModalOpen(false);
        setEditingPlatformPayment(null);
        setIsEditBookingModalOpen(false);
        setEditingBooking(null);
    };
    const handleOpenExternalSaleModal = (sale?: ExternalSale) => { setEditingExternalSale(sale || null); setIsExternalSaleModalOpen(true); };
    const handleSaveExternalSale = (saleData: Omit<ExternalSale, 'id'> | ExternalSale) => { if ('id' in saleData) { onUpdateExternalSale(saleData); } else { onAddExternalSale(saleData); } handleCloseModals(); };
    const handleOpenPlatformPaymentModal = (payment?: PlatformPayment) => { setEditingPlatformPayment(payment || null); setIsPlatformPaymentModalOpen(true); };
    const handleSavePlatformPayment = (paymentData: Omit<PlatformPayment, 'id'> | PlatformPayment) => { if ('id' in paymentData) { onUpdatePlatformPayment(paymentData); } else { onAddPlatformPayment(paymentData); } handleCloseModals(); };
    const handleOpenEditBookingModal = (booking: Booking) => { setEditingBooking(booking); setIsEditBookingModalOpen(true); };
    const handleDeleteBookingPrompt = (booking: Booking) => {
        onDeleteBooking(booking.id);
    };


    // Memos for data processing...
    const currentFilter = useMemo(() => {
        if (reportGranularity === 'yearly') {
            if (selectedYear && /^\d{4}$/.test(selectedYear)) { return selectedYear; }
            return new Date().getFullYear().toString();
        }
        return selectedMonth;
    }, [reportGranularity, selectedMonth, selectedYear]);

    const reportPeriodTitle = useMemo(() => {
        if (selectedDay) {
            try {
                return new Date(selectedDay + 'T00:00:00').toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
            } catch {
                return 'Invalid Date';
            }
        }
        if (reportGranularity === 'yearly') { return currentFilter; }
        try { return new Date(selectedMonth + '-02').toLocaleString('default', { month: 'long', year: 'numeric' });
        } catch { return 'Invalid Date'; }
    }, [reportGranularity, selectedMonth, selectedDay, currentFilter]);
    
    // Memos for SUMMARY CARDS and FINANCIAL BREAKDOWN (always use month/year)
    const filteredBookingsForSummary = useMemo(() => bookings.filter(b => b.bookingDate.startsWith(currentFilter)), [bookings, currentFilter]);
    const filteredExternalSalesForSummary = useMemo(() => externalSales.filter(s => s.date.startsWith(currentFilter)), [externalSales, currentFilter]);
    const filteredPlatformPaymentsForSummary = useMemo(() => platformPayments.filter(p => p.date.startsWith(currentFilter)), [platformPayments, currentFilter]);
    const filteredUtilityRecordsForSummary = useMemo(() => utilityRecords.filter(r => r.date.startsWith(currentFilter)), [utilityRecords, currentFilter]);
    const filteredSalaryAdvancesForSummary = useMemo(() => salaryAdvances.filter(a => a.date.startsWith(currentFilter)), [salaryAdvances, currentFilter]);
    const filteredBonusesForSummary = useMemo(() => bonuses.filter(b => b.date.startsWith(currentFilter)), [bonuses, currentFilter]);
    const filteredWalkInGuestsForSummary = useMemo(() => walkInGuests.filter(g => g.checkInDate.startsWith(currentFilter)), [walkInGuests, currentFilter]);
    const filteredAccommodationBookingsForSummary = useMemo(() => accommodationBookings.filter(b => b.checkInDate.startsWith(currentFilter)), [accommodationBookings, currentFilter]);

    // Memos for TABLES (use daily filter if available)
    // Fix: Made filterForTables generic to preserve the type of the array being filtered. This resolves numerous subsequent property access errors.
    const filterForTables = <T extends { date?: string; bookingDate?: string; checkInDate?: string }>(items: T[]): T[] => {
        if (!items || items.length === 0) {
            return [];
        }
        const key = 'bookingDate' in items[0] ? 'bookingDate' : ('checkInDate' in items[0] ? 'checkInDate' : 'date');
        if (selectedDay) {
            return items.filter(item => (item as any)[key] === selectedDay);
        }
        return items.filter(item => (item as any)[key]?.startsWith(currentFilter));
    };

    const bookingsForTables = useMemo(() => filterForTables(bookings), [bookings, currentFilter, selectedDay]);
    const externalSalesForTables = useMemo(() => filterForTables(externalSales), [externalSales, currentFilter, selectedDay]);
    const platformPaymentsForTables = useMemo(() => filterForTables(platformPayments), [platformPayments, currentFilter, selectedDay]);
    const allBookingsForTable = useMemo(() => filterForTables(bookings), [bookings, currentFilter, selectedDay]);


    const reportData = useMemo(() => {
        const totalActivityBookingRevenue = filteredBookingsForSummary.reduce((sum, b) => sum + b.customerPrice + (b.extrasTotal || 0) - (b.discount || 0), 0);
        const totalExtrasRevenue = filteredBookingsForSummary.reduce((sum, b) => {
            if (b.itemType === 'extra') {
                return sum + b.customerPrice - (b.discount || 0);
            }
            return sum + (b.extrasTotal || 0);
        }, 0);
        const totalExternalSales = filteredExternalSalesForSummary.reduce((sum, s) => sum + s.amount, 0);
        const totalWalkInRevenue = filteredWalkInGuestsForSummary.reduce((sum, g) => sum + g.amountPaid, 0);
        const totalBookingRevenue = filteredAccommodationBookingsForSummary.reduce((sum, b) => sum + b.amountPaid, 0);
        const totalPlatformPaymentsRevenue = filteredPlatformPaymentsForSummary.reduce((sum, p) => sum + p.amount, 0);
        const totalAccommodationRevenue = totalWalkInRevenue + totalBookingRevenue;
        const totalRevenue = totalActivityBookingRevenue + totalExternalSales + totalAccommodationRevenue + totalPlatformPaymentsRevenue;

        const totalAbsenceDeductions = (() => {
            if (reportGranularity === 'yearly') {
                let yearlyDeduction = 0;
                const year = parseInt(currentFilter);
                if (isNaN(year)) return 0;
                for (let month = 1; month <= 12; month++) {
                    const monthStr = `${currentFilter}-${String(month).padStart(2, '0')}`;
                    const daysInMonth = new Date(year, month, 0).getDate();
                    if (daysInMonth === 0) continue;
                    const monthlyAbsences = absences.filter(a => a.date.startsWith(monthStr));
                    staff.forEach(s => {
                        const dailyDeductionRate = s.salary / daysInMonth;
                        const staffAbsenceCount = monthlyAbsences.filter(a => a.staffId === s.id).length;
                        yearlyDeduction += staffAbsenceCount * dailyDeductionRate;
                    });
                }
                return yearlyDeduction;
            } else {
                let monthlyDeduction = 0;
                const [year, month] = currentFilter.split('-').map(Number);
                if (isNaN(year) || isNaN(month)) return 0;
                const daysInMonth = new Date(year, month, 0).getDate();
                if (daysInMonth === 0) return 0;
                const monthlyAbsences = absences.filter(a => a.date.startsWith(currentFilter));
                staff.forEach(s => {
                    const dailyDeductionRate = s.salary / daysInMonth;
                    const staffAbsenceCount = monthlyAbsences.filter(a => a.staffId === s.id).length;
                    monthlyDeduction += staffAbsenceCount * dailyDeductionRate;
                });
                return monthlyDeduction;
            }
        })();

        const totalUtilitiesCost = filteredUtilityRecordsForSummary.reduce((sum, r) => sum + r.cost, 0);
        const totalItemCosts = filteredBookingsForSummary.reduce((sum, b) => sum + (b.itemCost || 0), 0);
        const totalEmployeeCommissions = filteredBookingsForSummary.reduce((sum, b) => sum + (b.employeeCommission || 0), 0);
        const totalBonuses = filteredBonusesForSummary.reduce((sum, b) => sum + b.amount, 0);
        const totalSalaries = staff.reduce((sum, s) => sum + s.salary, 0);
        const totalCalculatedSalaries = reportGranularity === 'yearly' ? totalSalaries * 12 : totalSalaries;
        const netSalaryExpense = totalCalculatedSalaries + totalBonuses - totalAbsenceDeductions;
        const totalSalaryAdvances = filteredSalaryAdvancesForSummary.reduce((sum, a) => sum + a.amount, 0);
        const remainingSalaries = netSalaryExpense - totalSalaryAdvances;
        const totalExpenses = totalUtilitiesCost + totalItemCosts + netSalaryExpense + totalEmployeeCommissions;
        const expensesWithoutSalary = totalUtilitiesCost + totalItemCosts + totalEmployeeCommissions;
        const netProfit = totalRevenue - totalExpenses;

        const staffPerformance = staff.map(s => {
            const staffBookings = bookingsForTables.filter(b => b.staffId === s.id);
            return {
                staffId: s.id, staffName: s.name,
                bookingsCount: staffBookings.length,
                totalRevenue: staffBookings.reduce((sum, b) => sum + b.customerPrice + (b.extrasTotal || 0) - (b.discount || 0), 0),
                totalCommission: staffBookings.reduce((sum, b) => sum + (b.employeeCommission || 0), 0),
            };
        }).sort((a,b) => b.totalRevenue - a.totalRevenue);

        const companyDebts = bookingsForTables
            .filter(b => b.itemType === 'speedboat')
            .reduce((acc: Record<string, number>, booking) => {
                const trip = speedBoatTrips.find(t => t.id === booking.itemId);
                if (trip) { acc[trip.company] = (acc[trip.company] || 0) + (booking.itemCost || 0); }
                return acc;
            }, {});
    
        return { totalRevenue, totalAccommodationRevenue, totalWalkInRevenue, totalBookingRevenue, totalPlatformPaymentsRevenue, totalActivityBookingRevenue, totalExtrasRevenue, totalExternalSales, totalExpenses, totalMonthlySalaries: totalCalculatedSalaries, totalBonuses, totalUtilitiesCost, totalItemCosts, totalSalaryAdvances, remainingSalaries, totalEmployeeCommissions, expensesWithoutSalary, netProfit, staffPerformance, companyDebts, totalAbsenceDeductions };
    }, [filteredBookingsForSummary, filteredExternalSalesForSummary, filteredPlatformPaymentsForSummary, filteredUtilityRecordsForSummary, filteredSalaryAdvancesForSummary, filteredBonusesForSummary, filteredWalkInGuestsForSummary, filteredAccommodationBookingsForSummary, staff, speedBoatTrips, reportGranularity, absences, currentFilter, bookingsForTables]);
    
    // Memos for table totals
    const activityTotals = useMemo(() => {
        const filtered = bookingsForTables.filter(b => b.itemType === 'activity');
        const data = {
            totalPrice: filtered.reduce((sum, b) => sum + b.customerPrice + (b.extrasTotal || 0) - (b.discount || 0), 0),
            totalCost: filtered.reduce((sum, b) => sum + (b.itemCost || 0), 0),
            totalCommission: filtered.reduce((sum, b) => sum + (b.employeeCommission || 0), 0),
        };
        return { ...data, totalProfit: data.totalPrice - data.totalCost - data.totalCommission };
    }, [bookingsForTables]);

    const boatTotals = useMemo(() => {
        const filtered = bookingsForTables.filter(b => b.itemType === 'speedboat' || b.itemType === 'taxi_boat');
        const data = {
            totalPrice: filtered.reduce((sum, b) => sum + b.customerPrice - (b.discount || 0), 0),
            totalCost: filtered.reduce((sum, b) => sum + (b.itemCost || 0), 0),
            totalCommission: filtered.reduce((sum, b) => sum + (b.employeeCommission || 0), 0),
        };
        return { ...data, totalProfit: data.totalPrice - data.totalCost - data.totalCommission };
    }, [bookingsForTables]);

    const platformPaymentsTotal = useMemo(() => platformPaymentsForTables.reduce((sum, p) => sum + p.amount, 0), [platformPaymentsForTables]);
    const externalSalesTotal = useMemo(() => externalSalesForTables.reduce((sum, s) => sum + s.amount, 0), [externalSalesForTables]);
    const staffPerformanceTotals = useMemo(() => ({
        totalBookings: reportData.staffPerformance.reduce((sum, p) => sum + p.bookingsCount, 0),
        totalRevenue: reportData.staffPerformance.reduce((sum, p) => sum + p.totalRevenue, 0),
        totalCommission: reportData.staffPerformance.reduce((sum, p) => sum + p.totalCommission, 0),
    }), [reportData.staffPerformance]);


    return (
        <div className="space-y-6">
            <div className="bg-white p-4 rounded-lg shadow-sm flex flex-wrap items-center gap-x-6 gap-y-4">
                <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-slate-600">View Report By:</span>
                    <div className="flex items-center space-x-3">
                        <label className="flex items-center space-x-1 cursor-pointer"><input type="radio" name="granularity" value="monthly" checked={reportGranularity === 'monthly'} onChange={() => handleGranularityChange('monthly')} className="form-radio text-blue-600" /><span className="text-sm">Monthly</span></label>
                        <label className="flex items-center space-x-1 cursor-pointer"><input type="radio" name="granularity" value="yearly" checked={reportGranularity === 'yearly'} onChange={() => handleGranularityChange('yearly')} className="form-radio text-blue-600" /><span className="text-sm">Yearly</span></label>
                    </div>
                </div>
                {reportGranularity === 'monthly' && (<div><label htmlFor="month-filter" className="text-sm font-medium text-slate-600">Month:</label><input type="month" id="month-filter" value={selectedMonth} onChange={handleMonthChange} className="ml-2 rounded-md border-slate-300 shadow-sm text-sm py-1"/></div>)}
                {reportGranularity === 'yearly' && (<div><label htmlFor="year-filter" className="text-sm font-medium text-slate-600">Year:</label><input type="number" id="year-filter" value={selectedYear} onChange={handleYearChange} className="ml-2 rounded-md border-slate-300 shadow-sm text-sm py-1 w-24"/></div>)}
                <div>
                    <label htmlFor="day-filter" className="text-sm font-medium text-slate-600">Specific Day:</label>
                    <input type="date" id="day-filter" value={selectedDay} onChange={handleDayChange} className="ml-2 rounded-md border-slate-300 shadow-sm text-sm py-1"/>
                </div>
                {selectedDay && (<button onClick={() => setSelectedDay('')} className="text-sm text-blue-600 hover:underline">View Full Month</button>)}
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                <SummaryCard title="Total Revenue" value={currencyFormat(reportData.totalRevenue)} icon={<CurrencyDollarIcon />} />
                <SummaryCard title="Accommodation Revenue" value={currencyFormat(reportData.totalAccommodationRevenue)} icon={<BuildingOfficeIcon />} />
                <SummaryCard title="Total Expenses" value={currencyFormat(reportData.totalExpenses)} icon={<ReceiptPercentIcon />} />
                <SummaryCard title="Net Profit" value={currencyFormat(reportData.netProfit)} icon={<TrendingUpIcon />} />
            </div>

            {/* Financial Breakdown */}
            <div className="bg-white rounded-lg shadow-md overflow-x-auto"><h3 className="text-lg font-semibold text-slate-800 p-4 border-b">Financial Breakdown - {reportPeriodTitle}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-200">
                    <div className="bg-white p-4"><h4 className="font-semibold text-green-600 mb-2">Revenue Streams</h4>
                        <ul className="space-y-1 text-sm">
                            <li className="flex justify-between"><span>Accommodation Revenue:</span> <span className="font-medium">{currencyFormat(reportData.totalAccommodationRevenue)}</span></li>
                            <li className="flex justify-between pl-4 text-slate-500"><span>↳ from Walk-ins:</span><span className="font-medium">{currencyFormat(reportData.totalWalkInRevenue)}</span></li>
                            <li className="flex justify-between pl-4 text-slate-500"><span>↳ from Bookings:</span><span className="font-medium">{currencyFormat(reportData.totalBookingRevenue)}</span></li>
                            <li className="flex justify-between"><span>Platform Bulk Payments:</span> <span className="font-medium">{currencyFormat(reportData.totalPlatformPaymentsRevenue)}</span></li>
                            <li className="flex justify-between"><span>Activity Booking Revenue:</span> <span className="font-medium">{currencyFormat(reportData.totalActivityBookingRevenue)}</span></li>
                             <li className="flex justify-between pl-4 text-slate-500">
                                <span>↳ from Extras:</span>
                                <span className="font-medium">{currencyFormat(reportData.totalExtrasRevenue)}</span>
                            </li>
                            <li className="flex justify-between"><span>External POS Sales:</span> <span className="font-medium">{currencyFormat(reportData.totalExternalSales)}</span></li>
                            <li className="flex justify-between font-bold border-t mt-2 pt-2"><span>Total Revenue:</span> <span>{currencyFormat(reportData.totalRevenue)}</span></li>
                        </ul>
                    </div>
                    <div className="bg-white p-4"><h4 className="font-semibold text-red-600 mb-2">Expense Streams</h4>
                        <ul className="space-y-1 text-sm">
                            <li className="flex justify-between"><span>Staff Salaries ({reportGranularity === 'yearly' ? 'Annual' : 'Monthly'} Est.):</span> <span className="font-medium">{currencyFormat(reportData.totalMonthlySalaries)}</span></li>
                            <li className="flex justify-between pl-4 text-emerald-600 font-medium">
                                <span>↳ Plus: Staff Bonuses:</span>
                                <span>+{currencyFormat(reportData.totalBonuses)}</span>
                            </li>
                            <li className="flex justify-between pl-4 text-slate-500">
                                <span>↳ Less: Salary Advances Paid:</span>
                                <span className="font-medium">({currencyFormat(reportData.totalSalaryAdvances)})</span>
                            </li>
                            <li className="flex justify-between pl-4 text-slate-500">
                                <span>↳ Less: Absence Deductions:</span>
                                <span className="font-medium">({currencyFormat(reportData.totalAbsenceDeductions)})</span>
                            </li>
                            <li className="flex justify-between pl-4 text-slate-600 font-semibold">
                                <span>↳ Remaining Salaries Payable:</span>
                                <span className="font-medium">{currencyFormat(reportData.remainingSalaries)}</span>
                            </li>
                            <li className="flex justify-between"><span>Utility Bills:</span> <span className="font-medium">{currencyFormat(reportData.totalUtilitiesCost)}</span></li>
                            <li className="flex justify-between"><span>Activity Item Costs:</span> <span className="font-medium">{currencyFormat(reportData.totalItemCosts)}</span></li>
                            <li className="flex justify-between">
                                <span>Employee Commissions:</span>
                                <span className="font-medium">{currencyFormat(reportData.totalEmployeeCommissions)}</span>
                            </li>
                            <li className="flex justify-between font-bold border-t mt-2 pt-2"><span>Total Expenses:</span> <span>{currencyFormat(reportData.totalExpenses)}</span></li>
                            <li className="flex justify-between font-bold text-blue-700 mt-2 pt-2 border-t border-dashed">
                                <span> Expenses without salary:</span>
                                <span>{currencyFormat(reportData.expensesWithoutSalary)}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                <h3 className="text-lg font-semibold text-slate-800 p-4 border-b">Activity Trip Financial Details - {reportPeriodTitle}</h3>
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
                        {bookingsForTables
                            .filter(b => b.itemType === 'activity')
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
                        {bookingsForTables.filter(b => b.itemType === 'activity').length === 0 && (
                            <tr>
                                <td colSpan={8} className="text-center p-4 text-slate-500">
                                    No activity bookings for this period.
                                </td>
                            </tr>
                        )}
                    </tbody>
                    <tfoot>
                        <tr className="font-bold bg-slate-100 text-slate-800">
                            <td colSpan="3" className="px-6 py-3 text-right">Total:</td>
                            <td className="px-6 py-3">{currencyFormat(activityTotals.totalPrice)}</td>
                            <td className="px-6 py-3 text-red-700">{currencyFormat(activityTotals.totalCost)}</td>
                            <td className="px-6 py-3 text-orange-700">{currencyFormat(activityTotals.totalCommission)}</td>
                            <td className="px-6 py-3 text-green-700">{currencyFormat(activityTotals.totalProfit)}</td>
                            <td className="px-6 py-3"></td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-x-auto"><h3 className="text-lg font-semibold text-slate-800 p-4 border-b">Boat Company Payments Due - {reportPeriodTitle}</h3>
                <table className="w-full text-sm">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50"><tr><th className="px-6 py-3">Company Name</th><th className="px-6 py-3">Amount to Pay</th></tr></thead>
                    <tbody>
                        {Object.entries(reportData.companyDebts).map(([c, a]) => <tr key={c} className="bg-white border-b"><td className="px-6 py-4 font-medium">{c}</td><td className="px-6 py-4 font-bold text-red-600">{currencyFormat(a as number)}</td></tr>)}
                        {Object.keys(reportData.companyDebts).length === 0 && (<tr><td colSpan={2} className="text-center p-4">No payments due for this period.</td></tr>)}
                    </tbody>
                </table>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                <h3 className="text-lg font-semibold text-slate-800 p-4 border-b">Boat Ticket Financial Details - {reportPeriodTitle}</h3>
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
                        {bookingsForTables
                            .filter(b => b.itemType === 'speedboat' || b.itemType === 'taxi_boat')
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
                        {bookingsForTables.filter(b => b.itemType === 'speedboat' || b.itemType === 'taxi_boat').length === 0 && (
                            <tr>
                                <td colSpan={8} className="text-center p-4 text-slate-500">
                                    No boat ticket bookings for this period.
                                </td>
                            </tr>
                        )}
                    </tbody>
                    <tfoot>
                        <tr className="font-bold bg-slate-100 text-slate-800">
                            <td colSpan="3" className="px-6 py-3 text-right">Total:</td>
                            <td className="px-6 py-3">{currencyFormat(boatTotals.totalPrice)}</td>
                            <td className="px-6 py-3 text-red-700">{currencyFormat(boatTotals.totalCost)}</td>
                            <td className="px-6 py-3 text-orange-700">{currencyFormat(boatTotals.totalCommission)}</td>
                            <td className="px-6 py-3 text-green-700">{currencyFormat(boatTotals.totalProfit)}</td>
                            <td className="px-6 py-3"></td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                <div className="flex justify-between items-center p-4 border-b"><h3 className="text-lg font-semibold">Platform Payments - {reportPeriodTitle}</h3><button onClick={() => handleOpenPlatformPaymentModal()} className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm"><PlusIcon className="w-4 h-4 mr-2" /> Add</button></div>
                <table className="w-full text-sm">
                     <thead className="text-xs text-slate-700 uppercase bg-slate-50"><tr><th className="px-6 py-3">Date</th><th className="px-6 py-3">Platform</th><th className="px-6 py-3">Amount</th><th className="px-6 py-3">Reference</th><th className="px-6 py-3 text-right">Actions</th></tr></thead>
                     <tbody>
                        {platformPaymentsForTables.map(p => <tr key={p.id} className="border-b"><td className="px-6 py-4">{p.date}</td><td className="px-6 py-4 font-medium">{p.platform}</td><td className="px-6 py-4">{currencyFormat(p.amount)}</td><td className="px-6 py-4">{p.bookingReference||'N/A'}</td><td className="px-6 py-4 text-right"><div className="flex justify-end space-x-3"><button onClick={() => handleOpenPlatformPaymentModal(p)}><EditIcon /></button><button onClick={() => onDeletePlatformPayment(p.id)}><TrashIcon /></button></div></td></tr>)}
                        {platformPaymentsForTables.length === 0 && (<tr><td colSpan={5} className="text-center p-4">No platform payments for this period.</td></tr>)}
                     </tbody>
                     <tfoot>
                         <tr className="font-bold bg-slate-100 text-slate-800">
                             <td colSpan="2" className="px-6 py-3 text-right">Total:</td>
                             <td className="px-6 py-3">{currencyFormat(platformPaymentsTotal)}</td>
                             <td colSpan="2"></td>
                         </tr>
                     </tfoot>
                </table>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                <div className="flex justify-between items-center p-4 border-b"><h3 className="text-lg font-semibold">External POS Sales - {reportPeriodTitle}</h3><button onClick={() => handleOpenExternalSaleModal()} className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm"><PlusIcon className="w-4 h-4 mr-2" /> Add</button></div>
                <table className="w-full text-sm">
                     <thead className="text-xs text-slate-700 uppercase bg-slate-50"><tr><th className="px-6 py-3">Date</th><th className="px-6 py-3">Amount</th><th className="px-6 py-3">Description</th><th className="px-6 py-3 text-right">Actions</th></tr></thead>
                     <tbody>
                        {externalSalesForTables.map(s => <tr key={s.id} className="border-b"><td className="px-6 py-4">{s.date}</td><td className="px-6 py-4">{currencyFormat(s.amount)}</td><td className="px-6 py-4">{s.description||'N/A'}</td><td className="px-6 py-4 text-right"><div className="flex justify-end space-x-3"><button onClick={() => handleOpenExternalSaleModal(s)}><EditIcon /></button><button onClick={() => onDeleteExternalSale(s.id)}><TrashIcon /></button></div></td></tr>)}
                        {externalSalesForTables.length === 0 && (<tr><td colSpan={4} className="text-center p-4">No external sales for this period.</td></tr>)}
                     </tbody>
                     <tfoot>
                         <tr className="font-bold bg-slate-100 text-slate-800">
                             <td className="px-6 py-3 text-right">Total:</td>
                             <td className="px-6 py-3">{currencyFormat(externalSalesTotal)}</td>
                             <td colSpan="2"></td>
                         </tr>
                     </tfoot>
                </table>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-x-auto"><h3 className="text-lg font-semibold p-4 border-b">Staff Performance - {reportPeriodTitle}</h3>
                <table className="w-full text-sm">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50"><tr><th className="px-6 py-3">Staff Name</th><th className="px-6 py-3">Bookings</th><th className="px-6 py-3">Revenue Generated</th><th className="px-6 py-3">Commission Earned</th></tr></thead>
                    <tbody>{reportData.staffPerformance.map(p => <tr key={p.staffId} className="border-b"><td className="px-6 py-4 font-medium">{p.staffName}</td><td className="px-6 py-4">{p.bookingsCount}</td><td className="px-6 py-4">{currencyFormat(p.totalRevenue)}</td><td className="px-6 py-4 font-semibold text-green-600">{currencyFormat(p.totalCommission)}</td></tr>)}</tbody>
                    <tfoot>
                        <tr className="font-bold bg-slate-100 text-slate-800">
                            <td className="px-6 py-3 text-right">Total:</td>
                            <td className="px-6 py-3">{staffPerformanceTotals.totalBookings}</td>
                            <td className="px-6 py-3">{currencyFormat(staffPerformanceTotals.totalRevenue)}</td>
                            <td className="px-6 py-3 text-green-700">{currencyFormat(staffPerformanceTotals.totalCommission)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-x-auto"><h3 className="text-lg font-semibold p-4 border-b">All Bookings - {reportPeriodTitle}</h3>
                <table className="w-full text-sm">
                     <thead className="text-xs text-slate-700 uppercase bg-slate-50"><tr><th className="px-6 py-3">ID</th><th className="px-6 py-3">Date</th><th className="px-6 py-3">Item</th><th className="px-6 py-3">Staff</th><th className="px-6 py-3">Price</th><th className="px-6 py-3">Hostel C.</th><th className="px-6 py-3">Employee C.</th><th className="px-6 py-3">Receipt</th><th className="px-6 py-3 text-right">Actions</th></tr></thead>
                     <tbody>
                        {allBookingsForTable.map(b => <tr key={b.id} className="border-b"><td className="px-6 py-4 font-mono text-xs">{b.id.slice(-6)}</td><td className="px-6 py-4">{b.bookingDate}</td><td className="px-6 py-4 font-medium">{b.itemName}</td><td className="px-6 py-4">{staffMap.get(b.staffId)||'N/A'}</td><td className="px-6 py-4">{currencyFormat(b.customerPrice + (b.extrasTotal||0) - (b.discount||0))}</td><td className="px-6 py-4">{b.hostelCommission ? currencyFormat(b.hostelCommission) : 'N/A'}</td><td className="px-6 py-4">{b.employeeCommission ? currencyFormat(b.employeeCommission) : 'N/A'}</td><td className="px-6 py-4">{b.receiptImage ? <button onClick={() => setViewingReceipt(b.receiptImage)}><EyeIcon/></button>:'N/A'}</td><td className="px-6 py-4 text-right"><div className="flex justify-end space-x-3"><button onClick={() => handleOpenEditBookingModal(b)} className="text-slate-500 hover:text-blue-600"><EditIcon/></button><button onClick={() => handleDeleteBookingPrompt(b)} className="text-slate-500 hover:text-red-600"><TrashIcon/></button></div></td></tr>)}
                        {allBookingsForTable.length === 0 && (<tr><td colSpan={9} className="text-center p-4">No bookings for this period.</td></tr>)}
                     </tbody>
                </table>
            </div>

            {/* Modals */}
            <Modal isOpen={isExternalSaleModalOpen} onClose={handleCloseModals} title={editingExternalSale ? 'Edit POS Sale' : 'Add POS Sale'}>
                <ExternalSaleForm onSave={handleSaveExternalSale} onClose={handleCloseModals} initialData={editingExternalSale} />
            </Modal>
            <Modal isOpen={isPlatformPaymentModalOpen} onClose={handleCloseModals} title={editingPlatformPayment ? 'Edit Platform Payment' : 'Add Platform Payment'}>
                <PlatformPaymentForm onSave={handleSavePlatformPayment} onClose={handleCloseModals} initialData={editingPlatformPayment} />
            </Modal>
            <Modal isOpen={!!viewingReceipt} onClose={() => setViewingReceipt(null)} title="View Receipt">
                {viewingReceipt && <img src={viewingReceipt} alt="Receipt" className="w-full h-auto rounded-md" />}
            </Modal>
            <Modal isOpen={isEditBookingModalOpen} onClose={handleCloseModals} title="Edit Full Booking Details">
                {editingBooking && <FullEditBookingForm
                    booking={editingBooking}
                    staff={staff}
                    paymentTypes={paymentTypes}
                    activities={activities}
                    speedBoatTrips={speedBoatTrips}
                    taxiBoatOptions={taxiBoatOptions}
                    extras={extras}
                    onSave={onUpdateBooking}
                    onClose={handleCloseModals}
                    onDelete={handleDeleteBookingPrompt}
                />}
            </Modal>
            <style>{`.input-field{padding:0.5rem 0.75rem;background-color:white;border:1px solid #cbd5e1;border-radius:0.375rem;box-shadow:0 1px 2px 0 rgb(0 0 0 / 0.05);outline:none;color:#1e293b;}.input-field:focus{ring:1px solid #3b82f6;border-color:#3b82f6;}`}</style>
        </div>
    );
};

export default BookingsReport;