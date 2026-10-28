import React, { useState, useMemo, useEffect } from 'react';
import type { Activity, SpeedBoatTrip, Staff, Booking, Extra, TaxiBoatOption, ExternalSale, PlatformPayment, UtilityRecord, SalaryAdvance, WalkInGuest, AccommodationBooking, Room, PaymentType, Absence, Bonus } from '../../types';
import { Role } from '../../types';
import ToursActivities from './ToursActivities';
import BoatTickets from './BoatTickets';
import SellExtras from './SellExtras';
import BookingsReport from './BookingsReport';
import ManagePrices from './ManagePrices';


// --- SVG Icons for UI Enhancement ---
const CurrencyDollarIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 11.21 12.77 11 12 11c-.77 0-1.536.21-2.121.659L9 12.25m6-3.25l-2.121.659-2.121-.659m0 0l2.121-.659 2.121.659M9 12.25l2.121.659 2.121.659M15 12.25l-2.121.659-2.121-.659" />
    </svg>
);
const RocketLaunchIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.63 2.18a14.98 14.98 0 00-1.34 2.18m11.39 10.12a14.98 14.98 0 00-6.16-12.12" />
    </svg>
);
const ShipIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 18.75h16.5m-16.5 0a3 3 0 013-3h10.5a3 3 0 013 3m-13.5 0V15m10.5 3.75V15m-10.5-9L12 3m0 0l3.75 5.25M12 3v12.75" />
    </svg>
);
const ChartBarIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
);
const TagIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
    </svg>
);


interface ActivitiesManagementProps {
  activities: Activity[];
  speedBoatTrips: SpeedBoatTrip[];
  taxiBoatOptions: TaxiBoatOption[];
  extras: Extra[];
  staff: Staff[];
  bookings: Booking[];
  externalSales: ExternalSale[];
  platformPayments: PlatformPayment[];
  utilityRecords: UtilityRecord[];
  salaryAdvances: SalaryAdvance[];
  bonuses: Bonus[];
  absences: Absence[];
  walkInGuests: WalkInGuest[];
  accommodationBookings: AccommodationBooking[];
  rooms: Room[];
  paymentTypes: PaymentType[];
  onBookActivity: (activityId: string, staffId: string, numberOfPeople: number, discount: number, extras: Omit<Extra, 'id' | 'commission'>[], paymentMethod: string, bookingDate: string, receiptImage?: string, fuelCost?: number, captainCost?: number, employeeCommission?: number) => void;
  onBookSpeedBoat: (tripId: string, staffId: string, numberOfPeople: number, paymentMethod: string, bookingDate: string, receiptImage?: string, employeeCommission?: number) => void;
  onBookPrivateTour: (tourType: 'Half Day' | 'Full Day', price: number, numberOfPeople: number, staffId: string, paymentMethod: string, bookingDate: string, receiptImage?: string, fuelCost?: number, captainCost?: number, employeeCommission?: number, hostelCommission?: number) => void;
  onBookStandaloneExtra: (extra: Extra, staffId: string, paymentMethod: string, bookingDate: string, receiptImage?: string, quantity?: number, employeeCommission?: number) => void;
  onBookTaxiBoat: (taxiOptionId: string, staffId: string, numberOfPeople: number, paymentMethod: string, bookingDate: string, receiptImage?: string, employeeCommission?: number) => void;
  onUpdateBooking: (updatedBooking: Booking) => void;
  onDeleteBooking: (bookingId: string) => void;
  onAddExternalSale: (newSale: Omit<ExternalSale, 'id'>) => void;
  onUpdateExternalSale: (updatedSale: ExternalSale) => void;
  onDeleteExternalSale: (saleId: string) => void;
  onAddPlatformPayment: (newPayment: Omit<PlatformPayment, 'id'>) => void;
  onUpdatePlatformPayment: (updatedPayment: PlatformPayment) => void;
  onDeletePlatformPayment: (paymentId: string) => void;
  onAddSpeedBoatTrip: (newTrip: Omit<SpeedBoatTrip, 'id'>) => void;
  onUpdateSpeedBoatTrip: (updatedTrip: SpeedBoatTrip) => void;
  onDeleteSpeedBoatTrip: (tripId: string) => void;
  onAddActivity: (newActivity: Omit<Activity, 'id'>) => void;
  onUpdateActivity: (updatedActivity: Activity) => void;
  onDeleteActivity: (activityId: string) => void;
  onAddTaxiBoatOption: (newOption: Omit<TaxiBoatOption, 'id'>) => void;
  onUpdateTaxiBoatOption: (updatedOption: TaxiBoatOption) => void;
  onDeleteTaxiBoatOption: (optionId: string) => void;
  onAddExtra: (newExtra: Omit<Extra, 'id'>) => void;
  onUpdateExtra: (updatedExtra: Extra) => void;
  onDeleteExtra: (extraId: string) => void;
  onAddPaymentType: (newType: Omit<PaymentType, 'id'>) => void;
  onUpdatePaymentType: (updatedType: PaymentType) => void;
  onDeletePaymentType: (typeId: string) => void;
  currentUserRole: Role;
}

type SubView = 'tours' | 'boats' | 'extras' | 'report' | 'pricing';

export const ActivitiesManagement: React.FC<ActivitiesManagementProps> = (props) => {
  const [activeTab, setActiveTab] = useState<SubView>('tours');
  
  const TABS: { id: SubView; label: string; icon: React.ReactNode; }[] = [
    { id: 'tours', label: 'Tours & Activities', icon: <RocketLaunchIcon className="w-5 h-5" /> },
    { id: 'boats', label: 'Boat Tickets', icon: <ShipIcon className="w-5 h-5" /> },
    { id: 'extras', label: 'Sell Extras', icon: <TagIcon className="w-5 h-5" /> },
    { id: 'report', label: 'Bookings Report', icon: <ChartBarIcon className="w-5 h-5" /> },
    { id: 'pricing', label: 'Manage Prices', icon: <CurrencyDollarIcon className="w-5 h-5" /> },
  ];

  const visibleTabs = useMemo(() => {
    if (props.currentUserRole === Role.Admin) {
      return TABS;
    }
    return TABS.filter(tab => tab.id !== 'report' && tab.id !== 'pricing');
  }, [props.currentUserRole]);

  useEffect(() => {
    const isCurrentTabVisible = visibleTabs.some(tab => tab.id === activeTab);
    if (!isCurrentTabVisible) {
        setActiveTab(visibleTabs[0]?.id || 'tours');
    }
  }, [props.currentUserRole, activeTab, visibleTabs]);


  const renderContent = () => {
      switch (activeTab) {
          case 'tours':
              return <ToursActivities 
                        activities={props.activities}
                        staff={props.staff}
                        extras={props.extras}
                        paymentTypes={props.paymentTypes}
                        bookings={props.bookings}
                        onBookActivity={props.onBookActivity}
                        onBookPrivateTour={props.onBookPrivateTour}
                        onAddActivity={props.onAddActivity}
                        onUpdateActivity={props.onUpdateActivity}
                        onDeleteActivity={props.onDeleteActivity}
                        currentUserRole={props.currentUserRole}
                     />;
          case 'boats':
              return <BoatTickets 
                        speedBoatTrips={props.speedBoatTrips}
                        taxiBoatOptions={props.taxiBoatOptions}
                        staff={props.staff}
                        paymentTypes={props.paymentTypes}
                        bookings={props.bookings}
                        onBookSpeedBoat={props.onBookSpeedBoat}
                        onBookTaxiBoat={props.onBookTaxiBoat}
                        onAddSpeedBoatTrip={props.onAddSpeedBoatTrip}
                        onUpdateSpeedBoatTrip={props.onUpdateSpeedBoatTrip}
                        onDeleteSpeedBoatTrip={props.onDeleteSpeedBoatTrip}
                        onAddTaxiBoatOption={props.onAddTaxiBoatOption}
                        onUpdateTaxiBoatOption={props.onUpdateTaxiBoatOption}
                        onDeleteTaxiBoatOption={props.onDeleteTaxiBoatOption}
                        currentUserRole={props.currentUserRole}
                     />;
          case 'extras':
              return <SellExtras 
                        extras={props.extras}
                        staff={props.staff}
                        paymentTypes={props.paymentTypes}
                        onBookStandaloneExtra={props.onBookStandaloneExtra}
                        onAddExtra={props.onAddExtra}
                        onUpdateExtra={props.onUpdateExtra}
                        onDeleteExtra={props.onDeleteExtra}
                        currentUserRole={props.currentUserRole}
                     />;
          case 'report':
              return props.currentUserRole === Role.Admin ? 
                     <BookingsReport 
                        bookings={props.bookings}
                        externalSales={props.externalSales}
                        platformPayments={props.platformPayments}
                        utilityRecords={props.utilityRecords}
                        salaryAdvances={props.salaryAdvances}
                        bonuses={props.bonuses}
                        absences={props.absences}
                        walkInGuests={props.walkInGuests}
                        accommodationBookings={props.accommodationBookings}
                        staff={props.staff}
                        speedBoatTrips={props.speedBoatTrips}
                        activities={props.activities}
                        taxiBoatOptions={props.taxiBoatOptions}
                        extras={props.extras}
                        rooms={props.rooms}
                        paymentTypes={props.paymentTypes}
                        onUpdateBooking={props.onUpdateBooking}
                        onDeleteBooking={props.onDeleteBooking}
                        onAddExternalSale={props.onAddExternalSale}
                        onUpdateExternalSale={props.onUpdateExternalSale}
                        onDeleteExternalSale={props.onDeleteExternalSale}
                        onAddPlatformPayment={props.onAddPlatformPayment}
                        onUpdatePlatformPayment={props.onUpdatePlatformPayment}
                        onDeletePlatformPayment={props.onDeletePlatformPayment}
                     /> : null;
          case 'pricing':
              return props.currentUserRole === Role.Admin ?
                     <ManagePrices
                        activities={props.activities}
                        speedBoatTrips={props.speedBoatTrips}
                        taxiBoatOptions={props.taxiBoatOptions}
                        extras={props.extras}
                        paymentTypes={props.paymentTypes}
                        onAddActivity={props.onAddActivity}
                        onUpdateActivity={props.onUpdateActivity}
                        onDeleteActivity={props.onDeleteActivity}
                        onAddSpeedBoatTrip={props.onAddSpeedBoatTrip}
                        onUpdateSpeedBoatTrip={props.onUpdateSpeedBoatTrip}
                        onDeleteSpeedBoatTrip={props.onDeleteSpeedBoatTrip}
                        onAddTaxiBoatOption={props.onAddTaxiBoatOption}
                        onUpdateTaxiBoatOption={props.onUpdateTaxiBoatOption}
                        onDeleteTaxiBoatOption={props.onDeleteTaxiBoatOption}
                        onAddExtra={props.onAddExtra}
                        onUpdateExtra={props.onUpdateExtra}
                        onDeleteExtra={props.onDeleteExtra}
                        onAddPaymentType={props.onAddPaymentType}
                        onUpdatePaymentType={props.onUpdatePaymentType}
                        onDeletePaymentType={props.onDeletePaymentType}
                     /> : null;
          default:
              return null;
      }
  };

  return (
    <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-6">Activities & Bookings</h1>
        <div className="border-b border-slate-200">
             <nav className="flex space-x-2 sm:space-x-6 overflow-x-auto -mb-px" aria-label="Tabs">
                {visibleTabs.map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                        className={`${
                            activeTab === tab.id
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                        } whitespace-nowrap py-4 px-2 border-b-2 font-medium text-sm transition-colors flex items-center`}
                    >
                        {tab.icon}
                        <span className="ml-2">{tab.label}</span>
                    </button>
                ))}
            </nav>
        </div>

        <div className="mt-6">
            {renderContent()}
        </div>
    </div>
  );
};