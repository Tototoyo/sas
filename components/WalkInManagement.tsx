import React, { useState, useMemo, useEffect } from 'react';
import type { WalkInGuest, Room, AccommodationBooking, PaymentType } from '../types';
import { PaymentStatus } from '../types';
import Modal from './Modal';
import Badge from './Badge';
import { PlusIcon, CalendarDaysIcon, CurrencyDollarIcon, BedIcon, GlobeAltIcon, UserPlusIcon, EditIcon, TrashIcon } from '../constants';

type GuestData = (WalkInGuest | AccommodationBooking) & { type: 'walk-in' | 'booking' };


// --- Unified Guest Form Component ---
interface GuestFormProps {
  rooms: Room[];
  paymentTypes: PaymentType[];
  onClose: () => void;
  onWalkInSubmit: (guest: Omit<WalkInGuest, 'id'> | WalkInGuest) => void;
  onBookingSubmit: (booking: Omit<AccommodationBooking, 'id'> | AccommodationBooking) => void;
  isWalkIn: boolean;
  initialData?: WalkInGuest | AccommodationBooking | null;
}

const GuestForm: React.FC<GuestFormProps> = ({ rooms, paymentTypes, onClose, onWalkInSubmit, onBookingSubmit, isWalkIn, initialData }) => {
  const isEditing = !!initialData;
  
  const getDefaultFormData = () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return {
        guestName: '',
        roomId: '',
        bedNumber: '',
        checkInDate: new Date().toISOString().split('T')[0],
        checkOutDate: tomorrow.toISOString().split('T')[0],
        totalPrice: '', // For booking
        pricePerNight: '', // For walk-in
        amountPaid: '',
        paymentMethod: paymentTypes[0]?.name || '',
        platform: 'Direct',
        notes: ''
      };
  };
  
  const [formData, setFormData] = useState(getDefaultFormData());

  useEffect(() => {
    if (initialData) {
        const bedNum = initialData.bedNumber ? String(initialData.bedNumber) : '';
        const checkIn = new Date(initialData.checkInDate + 'T00:00:00');
        const checkOut = new Date(checkIn);
        checkOut.setDate(checkOut.getDate() + initialData.numberOfNights);
        const checkOutStr = checkOut.toISOString().split('T')[0];

        if ('platform' in initialData) { // AccommodationBooking
            setFormData({
                guestName: initialData.guestName,
                roomId: initialData.roomId,
                bedNumber: bedNum,
                checkInDate: initialData.checkInDate,
                checkOutDate: checkOutStr,
                totalPrice: String(initialData.totalPrice),
                pricePerNight: '',
                amountPaid: String(initialData.amountPaid),
                paymentMethod: paymentTypes[0]?.name || '',
                platform: initialData.platform,
                notes: ''
            });
        } else { // WalkInGuest
            setFormData({
                guestName: initialData.guestName,
                roomId: initialData.roomId,
                bedNumber: bedNum,
                checkInDate: initialData.checkInDate,
                checkOutDate: checkOutStr,
                totalPrice: '',
                pricePerNight: String(initialData.pricePerNight),
                amountPaid: String(initialData.amountPaid),
                paymentMethod: initialData.paymentMethod,
                platform: '',
                notes: initialData.notes || ''
            });
        }
    } else {
        setFormData(getDefaultFormData());
    }
  }, [initialData, paymentTypes]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => {
        const newState = {...prev, [id]: value};
        if (id === 'checkInDate') {
            const checkIn = new Date(value);
            const checkOut = new Date(newState.checkOutDate);
            if (checkOut <= checkIn) {
                const nextDay = new Date(checkIn);
                nextDay.setDate(nextDay.getDate() + 1);
                newState.checkOutDate = nextDay.toISOString().split('T')[0];
            }
        }
        return newState;
    });
  };

  const selectedRoom = rooms.find(r => r.id === formData.roomId);
  const isDorm = selectedRoom && selectedRoom.beds.length > 1;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.roomId) {
        alert("Please select a room.");
        return;
    }
    if (!formData.checkOutDate) {
        alert("Please select a check-out date.");
        return;
    }

    const checkIn = new Date(formData.checkInDate + 'T00:00:00');
    const checkOut = new Date(formData.checkOutDate + 'T00:00:00');
    let nights = 1;
    if (checkOut > checkIn) {
        const diffTime = checkOut.getTime() - checkIn.getTime();
        nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    const bedNum = formData.bedNumber ? Number(formData.bedNumber) : undefined;
    const paidAmount = Number(formData.amountPaid) || 0;

    if (isWalkIn && onWalkInSubmit) {
        const pricePerNight = Number(formData.pricePerNight) || 0;
        const total = pricePerNight * nights;
        const finalStatus = paidAmount >= total ? PaymentStatus.Paid : (paidAmount > 0 ? PaymentStatus['Deposit Paid'] : PaymentStatus.Unpaid);

        const walkInData = {
            ...(isEditing && initialData ? {id: initialData.id} : {}),
            guestName: formData.guestName,
            roomId: formData.roomId,
            bedNumber: bedNum,
            checkInDate: formData.checkInDate,
            numberOfNights: nights,
            pricePerNight: pricePerNight,
            amountPaid: paidAmount,
            paymentMethod: formData.paymentMethod,
            status: finalStatus,
            notes: formData.notes,
        };
        onWalkInSubmit(walkInData as Omit<WalkInGuest, 'id'> | WalkInGuest);
    } else if (!isWalkIn && onBookingSubmit) {
        const total = Number(formData.totalPrice) || 0;
        const finalStatus = paidAmount >= total ? PaymentStatus.Paid : (paidAmount > 0 ? PaymentStatus['Deposit Paid'] : PaymentStatus.Unpaid);

        const bookingData = {
            ...(isEditing && initialData ? {id: initialData.id} : {}),
            guestName: formData.guestName,
            platform: formData.platform,
            roomId: formData.roomId,
            bedNumber: bedNum,
            checkInDate: formData.checkInDate,
            numberOfNights: nights,
            totalPrice: total,
            amountPaid: paidAmount,
            status: finalStatus,
        };
        onBookingSubmit(bookingData as Omit<AccommodationBooking, 'id'> | AccommodationBooking);
    }
    onClose();
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="guestName" className="block text-sm font-medium text-slate-700">Guest Name</label>
        <input type="text" id="guestName" value={formData.guestName} onChange={handleChange} required className="mt-1 block w-full input-field" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="roomId" className="block text-sm font-medium text-slate-700">Room</label>
          <select id="roomId" value={formData.roomId} onChange={handleChange} required className="mt-1 block w-full input-field">
            <option value="">Select a room...</option>
            {rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </div>
        {isDorm && (
          <div>
            <label htmlFor="bedNumber" className="block text-sm font-medium text-slate-700">Bed Number</label>
            <select id="bedNumber" value={formData.bedNumber || ''} onChange={handleChange} required className="mt-1 block w-full input-field">
              <option value="">Select a bed...</option>
              {selectedRoom.beds.map(b => <option key={b.id} value={b.number}>{b.number}</option>)}
            </select>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
            <label htmlFor="checkInDate" className="block text-sm font-medium text-slate-700">Check-in Date</label>
            <input type="date" id="checkInDate" value={formData.checkInDate} onChange={handleChange} required className="mt-1 block w-full input-field" />
        </div>
        <div>
            <label htmlFor="checkOutDate" className="block text-sm font-medium text-slate-700">Check-out Date</label>
            <input type="date" id="checkOutDate" value={formData.checkOutDate} onChange={handleChange} required min={formData.checkInDate} className="mt-1 block w-full input-field" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
       {isWalkIn ? (
          <div>
            <label htmlFor="pricePerNight" className="block text-sm font-medium text-slate-700">Price Per Night (THB)</label>
            <input type="number" id="pricePerNight" value={formData.pricePerNight} onChange={handleChange} required className="mt-1 block w-full input-field" />
          </div>
       ) : (
          <div>
           <label htmlFor="totalPrice" className="block text-sm font-medium text-slate-700">Total Price (THB)</label>
           <input type="number" id="totalPrice" value={formData.totalPrice} onChange={handleChange} required className="mt-1 block w-full input-field" />
         </div>
       )}
       <div>
            <label htmlFor="amountPaid" className="block text-sm font-medium text-slate-700">Amount Paid / Deposit (THB)</label>
            <input type="number" id="amountPaid" value={formData.amountPaid} onChange={handleChange} className="mt-1 block w-full input-field" />
        </div>
      </div>
      {isWalkIn ? (
        <>
            <div>
                <label htmlFor="paymentMethod" className="block text-sm font-medium text-slate-700">Payment Method</label>
                <select id="paymentMethod" value={formData.paymentMethod} onChange={handleChange} className="mt-1 block w-full input-field">
                    {paymentTypes.map(pt => <option key={pt.id} value={pt.name}>{pt.name}</option>)}
                </select>
            </div>
             <div>
                <label htmlFor="notes" className="block text-sm font-medium text-slate-700">Notes</label>
                <textarea id="notes" value={formData.notes} onChange={handleChange} rows={2} className="mt-1 block w-full input-field"></textarea>
            </div>
        </>
      ) : (
        <div>
            <label htmlFor="platform" className="block text-sm font-medium text-slate-700">Platform</label>
            <input type="text" id="platform" value={formData.platform} onChange={handleChange} required className="mt-1 block w-full input-field" />
        </div>
      )}
      <div className="flex justify-end space-x-2 pt-4">
        <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Cancel</button>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">{isEditing ? 'Save Changes' : (isWalkIn ? 'Check In Guest' : 'Add Booking')}</button>
      </div>
       <style>{`.input-field{padding:0.5rem 0.75rem;background-color:white;border:1px solid #cbd5e1;border-radius:0.375rem;box-shadow:0 1px 2px 0 rgb(0 0 0 / 0.05);outline:none;color:#1e293b;}.input-field:focus{ring:1px solid #3b82f6;border-color:#3b82f6;}`}</style>
    </form>
  );
};


// --- Payment Modal Component ---
interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    guestData: GuestData | null;
    onSave: (updatedGuest: WalkInGuest | AccommodationBooking) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, guestData, onSave }) => {
    const [amountToPay, setAmountToPay] = useState('');

    // Fix: Explicitly cast guestData to the correct type based on the 'type' property to resolve property access errors.
    const totalCost = guestData ? (guestData.type === 'walk-in' ? (guestData as WalkInGuest).pricePerNight * (guestData as WalkInGuest).numberOfNights : (guestData as AccommodationBooking).totalPrice) : 0;
    const remainingBalance = guestData ? totalCost - guestData.amountPaid : 0;

    useEffect(() => {
        if (isOpen && guestData) {
            setAmountToPay(String(remainingBalance));
        }
    }, [isOpen, guestData, remainingBalance]);

    const handleSave = () => {
        if (!guestData) return;

        const paymentAmount = Number(amountToPay) || 0;
        if (paymentAmount <= 0) {
            alert('Please enter a valid payment amount.');
            return;
        }
        if (paymentAmount > remainingBalance) {
            alert(`Payment amount (฿${paymentAmount.toLocaleString()}) cannot exceed the remaining balance (฿${remainingBalance.toLocaleString()}).`);
            return;
        }

        const newPaidAmount = guestData.amountPaid + paymentAmount;
        const newStatus = newPaidAmount >= totalCost ? PaymentStatus.Paid : PaymentStatus['Deposit Paid'];
        
        const updatedGuest = {
            ...guestData,
            amountPaid: newPaidAmount,
            status: newStatus,
        };
        delete (updatedGuest as any).type;
        onSave(updatedGuest as WalkInGuest | AccommodationBooking);
        handleClose();
    };

    const handleClose = () => {
        setAmountToPay('');
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title={`Collect Payment for ${guestData?.guestName}`}>
            <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm"><span className="text-slate-600">Total Cost:</span><span className="font-medium">฿{totalCost.toLocaleString()}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-slate-600">Already Paid:</span><span className="font-medium text-green-600">฿{guestData?.amountPaid.toLocaleString()}</span></div>
                    <div className="flex justify-between font-bold text-base border-t pt-2 mt-2"><span className="text-slate-800">Remaining Balance:</span><span className="text-red-600">฿{remainingBalance.toLocaleString()}</span></div>
                </div>
                <div>
                    <label htmlFor="amountToPay" className="block text-sm font-medium text-slate-700">Amount to Pay (THB)</label>
                    <input 
                        type="number" 
                        id="amountToPay" 
                        value={amountToPay} 
                        onChange={e => setAmountToPay(e.target.value)} 
                        placeholder={remainingBalance.toString()} 
                        className="mt-1 block w-full input-field"
                        max={remainingBalance}
                        min="0.01"
                        step="any"
                     />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                    <button type="button" onClick={handleClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Cancel</button>
                    <button 
                        onClick={handleSave} 
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-slate-400"
                        disabled={!amountToPay || Number(amountToPay) <= 0 || Number(amountToPay) > remainingBalance}
                    >
                        Confirm Payment
                    </button>
                </div>
            </div>
        </Modal>
    );
};

// --- Guest Card Component ---
interface GuestCardProps {
    guest: WalkInGuest | AccommodationBooking;
    type: 'walk-in' | 'booking';
    roomMap: Map<string, string>;
    onEdit: (guest: WalkInGuest | AccommodationBooking, type: 'walk-in' | 'booking') => void;
    onDelete: (guestId: string, type: 'walk-in' | 'booking') => void;
    onCollectPayment: (guest: WalkInGuest | AccommodationBooking, type: 'walk-in' | 'booking') => void;
}

const GuestCard: React.FC<GuestCardProps> = ({ guest, type, roomMap, onEdit, onDelete, onCollectPayment }) => {
    const totalCost = type === 'walk-in' ? (guest as WalkInGuest).pricePerNight * guest.numberOfNights : (guest as AccommodationBooking).totalPrice;
    const remainingBalance = totalCost - guest.amountPaid;

    const handleDeleteClick = () => {
        onDelete(guest.id, type);
    };

    return (
        <div className="bg-white rounded-lg shadow-md flex flex-col transition-all duration-300 hover:shadow-lg">
            <div className={`p-4 border-b flex justify-between items-start ${type === 'booking' ? 'bg-blue-50' : 'bg-green-50'}`}>
                <div>
                    <h3 className="text-lg font-semibold text-slate-800">{guest.guestName}</h3>
                    <div className="flex items-center text-sm text-slate-500 mt-1">
                        {type === 'booking' ? <><GlobeAltIcon className="w-4 h-4 mr-1.5"/> Pre-Booking: {(guest as AccommodationBooking).platform}</> : <><UserPlusIcon className="w-4 h-4 mr-1.5"/> Walk-in</>}
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Badge status={guest.status} />
                    <button onClick={() => onEdit(guest, type)} className="text-slate-500 hover:text-blue-600"><EditIcon className="w-4 h-4" /></button>
                    <button onClick={handleDeleteClick} className="text-slate-500 hover:text-red-600"><TrashIcon className="w-4 h-4" /></button>
                </div>
            </div>
            <div className="p-4 space-y-3 flex-grow text-sm">
                <div className="flex items-center">
                    <BedIcon className="w-4 h-4 mr-2 text-slate-400" />
                    <span className="font-semibold text-slate-600 mr-2">Room:</span>
                    <span>{roomMap.get(guest.roomId) || 'N/A'} {guest.bedNumber ? `(Bed ${guest.bedNumber})` : ''}</span>
                </div>
                <div className="flex items-center">
                    <CalendarDaysIcon className="w-4 h-4 mr-2 text-slate-400" />
                    <span className="font-semibold text-slate-600 mr-2">Stay:</span>
                    <span>{guest.checkInDate} for {guest.numberOfNights} night(s)</span>
                </div>
                <div className="pt-2 border-t mt-2 space-y-1 text-sm">
                    <div className="flex justify-between"><span className="text-slate-600">Total Cost:</span><span className="font-medium text-slate-800">฿{totalCost.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span className="text-slate-600">Amount Paid:</span><span className="font-medium text-green-600">฿{guest.amountPaid.toLocaleString()}</span></div>
                    <div className={`flex justify-between font-bold ${remainingBalance > 0 ? 'text-red-600' : 'text-slate-800'}`}><span>Balance:</span><span>฿{remainingBalance.toLocaleString()}</span></div>
                </div>
                 {'notes' in guest && guest.notes && (
                    <div className="pt-2 border-t mt-2">
                        <p className="font-semibold text-slate-600 text-xs">Notes:</p>
                        <p className="text-slate-700 text-sm whitespace-pre-wrap">{guest.notes}</p>
                    </div>
                )}
            </div>
            {remainingBalance > 0 && (
                <div className="p-2 bg-slate-50 border-t">
                    <button onClick={() => onCollectPayment(guest, type)} className="w-full px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">Collect Payment</button>
                </div>
            )}
        </div>
    );
};


// --- Main Component ---
interface BookingManagementProps {
  rooms: Room[];
  walkInGuests: WalkInGuest[];
  accommodationBookings: AccommodationBooking[];
  paymentTypes: PaymentType[];
  onAddWalkInGuest: (guest: Omit<WalkInGuest, 'id'>) => void;
  onUpdateWalkInGuest: (guest: WalkInGuest) => void;
  onDeleteWalkInGuest: (guestId: string) => void;
  onAddAccommodationBooking: (booking: Omit<AccommodationBooking, 'id'>) => void;
  onUpdateAccommodationBooking: (booking: AccommodationBooking) => void;
  onDeleteAccommodationBooking: (bookingId: string) => void;
}

const WalkInManagement: React.FC<BookingManagementProps> = ({ rooms, walkInGuests, accommodationBookings, paymentTypes, onAddWalkInGuest, onUpdateWalkInGuest, onDeleteWalkInGuest, onAddAccommodationBooking, onUpdateAccommodationBooking, onDeleteAccommodationBooking }) => {
  const [activeTab, setActiveTab] = useState<'bookings' | 'walkins'>('bookings');
  const [searchQuery, setSearchQuery] = useState('');
  const [isWalkInModalOpen, setIsWalkInModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<GuestData | null>(null);

  const roomMap = useMemo(() => new Map(rooms.map(r => [r.id, r.name])), [rooms]);

  const filteredBookings = useMemo(() => 
    accommodationBookings.filter(b => b.guestName.toLowerCase().includes(searchQuery.toLowerCase())),
    [accommodationBookings, searchQuery]
  );
  
  const filteredWalkIns = useMemo(() =>
    walkInGuests.filter(g => g.guestName.toLowerCase().includes(searchQuery.toLowerCase())),
    [walkInGuests, searchQuery]
  );

  const openPaymentModal = (guest: WalkInGuest | AccommodationBooking, type: 'walk-in' | 'booking') => {
      setSelectedGuest({ ...guest, type });
      setIsPaymentModalOpen(true);
  };
  
  const handleSavePayment = (updatedGuest: WalkInGuest | AccommodationBooking) => {
    if ('platform' in updatedGuest) {
        onUpdateAccommodationBooking(updatedGuest as AccommodationBooking);
    } else {
        onUpdateWalkInGuest(updatedGuest as WalkInGuest);
    }
  }

  const handleEdit = (guest: WalkInGuest | AccommodationBooking, type: 'walk-in' | 'booking') => {
    setSelectedGuest({ ...guest, type });
    if (type === 'walk-in') {
        setIsWalkInModalOpen(true);
    } else {
        setIsBookingModalOpen(true);
    }
  };

  const handleDelete = (guestId: string, type: 'walk-in' | 'booking') => {
    if (type === 'walk-in') {
      onDeleteWalkInGuest(guestId);
    } else {
      onDeleteAccommodationBooking(guestId);
    }
  };

  const handleWalkInSubmit = (guestData: Omit<WalkInGuest, 'id'> | WalkInGuest) => {
    if ('id' in guestData) {
        onUpdateWalkInGuest(guestData as WalkInGuest);
    } else {
        onAddWalkInGuest(guestData as Omit<WalkInGuest, 'id'>);
    }
  };

  const handleBookingSubmit = (bookingData: Omit<AccommodationBooking, 'id'> | AccommodationBooking) => {
      if ('id' in bookingData) {
          onUpdateAccommodationBooking(bookingData as AccommodationBooking);
      } else {
          onAddAccommodationBooking(bookingData as Omit<AccommodationBooking, 'id'>);
      }
  };

  const handleCloseGuestModals = () => {
      setIsWalkInModalOpen(false);
      setIsBookingModalOpen(false);
      setSelectedGuest(null);
  };

  const renderAddButton = () => {
    if (activeTab === 'bookings') {
      return (
        <button onClick={() => { setSelectedGuest(null); setIsBookingModalOpen(true); }} className="flex items-center justify-center sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 transition-colors">
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Booking
        </button>
      );
    }
    if (activeTab === 'walkins') {
      return (
        <button onClick={() => { setSelectedGuest(null); setIsWalkInModalOpen(true); }} className="flex items-center justify-center sm:w-auto px-4 py-2 bg-green-600 text-white rounded-md shadow-sm hover:bg-green-700 transition-colors">
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Walk-in
        </button>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Direct Payment</h1>
            {renderAddButton()}
        </div>

        <div className="sticky top-[113px] bg-slate-50 py-3 z-10">
            <div className="border-b border-slate-200 mb-4">
                <nav className="flex space-x-2 sm:space-x-4 -mb-px" aria-label="Tabs">
                    <button onClick={() => setActiveTab('bookings')} className={`${activeTab === 'bookings' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors`}>Bookings</button>
                    <button onClick={() => setActiveTab('walkins')} className={`${activeTab === 'walkins' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors`}>Walk-ins</button>
                </nav>
            </div>
            <div>
                 <input type="text" placeholder="Search by guest name..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
            </div>
        </div>

        <div>
            {activeTab === 'bookings' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredBookings.map(booking => <GuestCard 
                        key={booking.id} 
                        guest={booking} 
                        type="booking" 
                        roomMap={roomMap} 
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onCollectPayment={openPaymentModal}/>
                    )}
                </div>
            )}
            {activeTab === 'walkins' && (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredWalkIns.map(guest => <GuestCard 
                        key={guest.id} 
                        guest={guest} 
                        type="walk-in" 
                        roomMap={roomMap} 
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onCollectPayment={openPaymentModal} />
                    )}
                </div>
            )}
        </div>

        <Modal isOpen={isWalkInModalOpen} onClose={handleCloseGuestModals} title={selectedGuest ? 'Edit Walk-in Guest' : 'Add New Walk-in Guest'}>
            <GuestForm 
                rooms={rooms} 
                paymentTypes={paymentTypes}
                onClose={handleCloseGuestModals}
                onWalkInSubmit={handleWalkInSubmit}
                onBookingSubmit={handleBookingSubmit}
                isWalkIn={true}
                initialData={selectedGuest}
            />
        </Modal>
        
        <Modal isOpen={isBookingModalOpen} onClose={handleCloseGuestModals} title={selectedGuest ? 'Edit Direct Booking' : 'Add New Direct Booking'}>
            <GuestForm 
                rooms={rooms} 
                paymentTypes={paymentTypes}
                onClose={handleCloseGuestModals}
                onWalkInSubmit={handleWalkInSubmit}
                onBookingSubmit={handleBookingSubmit}
                isWalkIn={false}
                initialData={selectedGuest}
            />
        </Modal>

        <PaymentModal 
            isOpen={isPaymentModalOpen}
            onClose={() => setIsPaymentModalOpen(false)}
            guestData={selectedGuest}
            onSave={handleSavePayment}
        />
    </div>
  );
};

export default WalkInManagement;