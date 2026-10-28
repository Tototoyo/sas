

// Fix: Create the UtilitiesManagement component.
import React, { useState, useMemo, useEffect, useRef } from 'react';
import type { UtilityRecord } from '../types';
import { Role } from '../types';
import Modal from './Modal';
import SimpleBarChart from './SimpleBarChart';
import { PlusIcon, EditIcon, TrashIcon, UtilityIcon, EyeIcon, CurrencyDollarIcon, CalendarDaysIcon, ChartPieIcon } from '../constants';

// --- Form ---
interface UtilityFormProps {
  onSubmit: (record: Omit<UtilityRecord, 'id'> | UtilityRecord) => void;
  onClose: () => void;
  initialData?: UtilityRecord | null;
  utilityCategories: string[];
}

const UtilityForm: React.FC<UtilityFormProps> = ({ onSubmit, onClose, initialData, utilityCategories }) => {
  const [category, setCategory] = useState('');
  const [otherType, setOtherType] = useState('');
  const [date, setDate] = useState('');
  const [cost, setCost] = useState('');
  const [billImage, setBillImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      if (utilityCategories.includes(initialData.utilityType)) {
        setCategory(initialData.utilityType);
        setOtherType('');
      } else {
        setCategory('Other');
        setOtherType(initialData.utilityType);
      }
      setDate(initialData.date);
      setCost(String(initialData.cost));
      setBillImage(initialData.billImage || null);
    } else {
      setCategory('');
      setOtherType('');
      setDate('');
      setCost('');
      setBillImage(null);
    }
  }, [initialData, utilityCategories]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setBillImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalUtilityType = category === 'Other' ? otherType : category;
    if (!finalUtilityType) {
        alert("Please specify a category or name for the utility.");
        return;
    }

    const recordData = {
        utilityType: finalUtilityType,
        date,
        cost: Number(cost),
        billImage: billImage || '',
    };

    if (initialData) {
      onSubmit({ ...initialData, ...recordData });
    } else {
      onSubmit(recordData);
    }
    onClose();
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
        <div>
            <label htmlFor="category" className="block text-sm font-medium text-slate-700">Category</label>
            <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} required className="mt-1 block w-full input-field">
                <option value="">Select a category...</option>
                {utilityCategories.map(c => <option key={c} value={c}>{c}</option>)}
                <option value="Other">Other</option>
            </select>
        </div>

        {category === 'Other' && (
            <div>
                <label htmlFor="otherType" className="block text-sm font-medium text-slate-700">Specify Name</label>
                <input 
                    type="text" 
                    id="otherType" 
                    value={otherType} 
                    onChange={(e) => setOtherType(e.target.value)} 
                    placeholder="e.g., Office Supplies" 
                    required 
                    className="mt-1 block w-full input-field" 
                />
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="date" className="block text-sm font-medium text-slate-700">Date</label>
                <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} required className="mt-1 block w-full input-field" />
            </div>
             <div>
                <label htmlFor="cost" className="block text-sm font-medium text-slate-700">Price (THB)</label>
                <input type="number" step="0.01" id="cost" value={cost} onChange={(e) => setCost(e.target.value)} required className="mt-1 block w-full input-field" />
            </div>
        </div>

        <div>
            <label className="block text-sm font-medium text-slate-700">Bill Image (Optional)</label>
            <div className="mt-1 flex items-center justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                    {billImage ? (
                        <>
                            <img src={billImage} alt="Bill preview" className="mx-auto h-24 w-auto rounded-md" />
                            <button type="button" onClick={() => setBillImage(null)} className="text-xs text-red-500 hover:text-red-700">Remove image</button>
                        </>
                    ) : (
                        <>
                            <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <div className="flex text-sm text-slate-600">
                                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                                    <span>Upload a file</span>
                                    <input id="file-upload" name="file-upload" type="file" accept="image/*" className="sr-only" onChange={handleFileChange} ref={fileInputRef} />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-slate-500">PNG, JPG, GIF up to 10MB</p>
                        </>
                    )}
                </div>
            </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">{initialData ? 'Update Record' : 'Add Record'}</button>
        </div>
        <style>{`.input-field{padding:0.5rem 0.75rem;background-color:white;border:1px solid #cbd5e1;border-radius:0.375rem;box-shadow:0 1px 2px 0 rgb(0 0 0 / 0.05);outline:none;color:#1e293b;}.input-field:focus{ring:1px solid #3b82f6;border-color:#3b82f6;}`}</style>
    </form>
  )
}

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


// --- Main Component ---
interface UtilitiesManagementProps {
  records: UtilityRecord[];
  onAddRecord: (newRecord: Omit<UtilityRecord, 'id'>) => void;
  onUpdateRecord: (updatedRecord: UtilityRecord) => void;
  onDeleteRecord: (recordId: string) => void;
  utilityCategories: string[];
  onAddCategory: (category: string) => void;
  onDeleteCategory: (category: string) => void;
  currentUserRole: Role;
}

const UtilitiesManagement: React.FC<UtilitiesManagementProps> = ({ records, onAddRecord, onUpdateRecord, onDeleteRecord, utilityCategories, onAddCategory, onDeleteCategory, currentUserRole }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<UtilityRecord | null>(null);
    const [viewingBill, setViewingBill] = useState<string | null>(null);
    const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().slice(0, 7)); // YYYY-MM
    const [selectedDay, setSelectedDay] = useState<string>(''); // YYYY-MM-DD
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [newCategory, setNewCategory] = useState('');

    const isAdmin = currentUserRole === Role.Admin;

    const handleOpenModal = (record?: UtilityRecord) => {
        setEditingRecord(record || null);
        setIsModalOpen(true);
    };
    const handleCloseModal = () => setIsModalOpen(false);

    const handleSubmit = (recordData: Omit<UtilityRecord, 'id'> | UtilityRecord) => {
        if ('id' in recordData) {
            onUpdateRecord(recordData);
        } else {
            onAddRecord(recordData);
        }
    };
    
    const handleAddCategory = () => {
        if (newCategory.trim()) {
            onAddCategory(newCategory.trim());
            setNewCategory('');
        }
    };

    const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const day = e.target.value;
        setSelectedDay(day);
        if (day) {
            setSelectedMonth(day.substring(0, 7));
        }
    };

    useEffect(() => {
        // When month is changed manually by the month picker, clear the specific day filter.
        setSelectedDay('');
    }, [selectedMonth]);


    const filteredRecords = useMemo(() => {
        if (selectedDay) {
            return records.filter(r => r.date === selectedDay);
        }
        if (!selectedMonth) return records;
        return records.filter(r => r.date.startsWith(selectedMonth));
    }, [records, selectedMonth, selectedDay]);
    
    const reportPeriodTitle = useMemo(() => {
        if (selectedDay) {
            try {
                return new Date(selectedDay + 'T00:00:00').toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
            } catch {
                return 'Invalid Date';
            }
        }
        try {
            return new Date(selectedMonth + '-02').toLocaleString('default', { month: 'long', year: 'numeric' });
        } catch {
            return 'Invalid Date';
        }
    }, [selectedMonth, selectedDay]);

    const analyticsData = useMemo(() => {
        const totalExpenses = filteredRecords.reduce((sum, r) => sum + r.cost, 0);

        const dailyTotals = filteredRecords.reduce((acc, r) => {
            const day = r.date.split('-')[2];
            acc[day] = (acc[day] || 0) + r.cost;
            return acc;
        }, {} as Record<string, number>);

        const categoryTotals = filteredRecords.reduce((acc, r) => {
            acc[r.utilityType] = (acc[r.utilityType] || 0) + r.cost;
            return acc;
        }, {} as Record<string, number>);

        const dailyChartData = Object.entries(dailyTotals).map(([day, total]) => ({
            label: day,
            value: total
        })).sort((a, b) => parseInt(a.label) - parseInt(b.label));

        const categoryChartData = Object.entries(categoryTotals).map(([category, total]) => ({
            label: category,
            value: total
        })).sort((a, b) => Number(b.value) - Number(a.value));

        const topCategory = categoryChartData[0] ? `${categoryChartData[0].label}` : 'N/A';
        
        const highestDayEntry = Object.entries(dailyTotals).sort((a, b) => Number(b[1]) - Number(a[1]))[0];
        
        let highestDay: string;
        if (selectedDay) {
            highestDay = selectedDay;
        } else {
             highestDay = highestDayEntry ? `${selectedMonth}-${String(highestDayEntry[0]).padStart(2, '0')}` : 'N/A';
        }


        return { totalExpenses, dailyChartData, categoryChartData, topCategory, highestDay };
    }, [filteredRecords, selectedMonth, selectedDay]);

    const currencyFormat = (value: number) => `฿${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Utilities Tracking</h1>
                 <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    {isAdmin && (
                        <button onClick={() => setIsCategoryModalOpen(true)} className="flex items-center justify-center sm:w-auto px-4 py-2 bg-slate-600 text-white rounded-md shadow-sm hover:bg-slate-700 transition-colors">
                            Manage Categories
                        </button>
                    )}
                    <button onClick={() => handleOpenModal()} className="flex items-center justify-center sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 transition-colors">
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Add Record
                    </button>
                </div>
            </div>

            {/* Filters & Analytics */}
            <div className="space-y-6">
                <div className="bg-white p-4 rounded-lg shadow-sm flex flex-wrap items-center gap-x-6 gap-y-4">
                    <div>
                        <label htmlFor="month-filter" className="text-sm font-medium text-slate-600">Month:</label>
                        <input 
                            type="month" 
                            id="month-filter"
                            value={selectedMonth}
                            onChange={e => setSelectedMonth(e.target.value)}
                            className="ml-2 rounded-md border-slate-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-sm py-1"
                        />
                    </div>
                    <div>
                        <label htmlFor="day-filter" className="text-sm font-medium text-slate-600">Specific Day:</label>
                        <input 
                            type="date" 
                            id="day-filter"
                            value={selectedDay}
                            onChange={handleDayChange}
                            className="ml-2 rounded-md border-slate-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-sm py-1"
                        />
                    </div>
                    {selectedDay && (
                        <button onClick={() => setSelectedDay('')} className="text-sm text-blue-600 hover:underline">
                            View Full Month
                        </button>
                    )}
                </div>

                {isAdmin && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <SummaryCard title="Total Expenses" value={currencyFormat(analyticsData.totalExpenses)} icon={<CurrencyDollarIcon />} />
                            <SummaryCard title="Highest Spending Day" value={analyticsData.highestDay} icon={<CalendarDaysIcon />} />
                            <SummaryCard title="Top Category" value={analyticsData.topCategory} icon={<ChartPieIcon />} />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                                <SimpleBarChart data={analyticsData.dailyChartData} title={`Daily Expenses for ${reportPeriodTitle}`} color="#3b82f6" />
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                                <h3 className="text-center font-semibold text-slate-600 mb-2">Expenses by Category</h3>
                                <div className="overflow-y-auto max-h-72">
                                    <table className="w-full text-sm text-left">
                                        <thead className="text-xs text-slate-700 uppercase bg-slate-50 sticky top-0">
                                            <tr>
                                                <th className="px-4 py-2">Category</th>
                                                <th className="px-4 py-2 text-right">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {analyticsData.categoryChartData.map(cat => (
                                                <tr key={cat.label} className="border-b">
                                                    <td className="px-4 py-2 font-medium text-slate-800">{cat.label}</td>
                                                    <td className="px-4 py-2 text-right">{currencyFormat(cat.value)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                <h3 className="text-lg font-semibold text-slate-800 p-4 border-b">Expense Records for {reportPeriodTitle}</h3>
                <table className="w-full text-sm text-left text-slate-500">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Category / Name</th>
                            <th scope="col" className="px-6 py-3">Date</th>
                            <th scope="col" className="px-6 py-3">Price</th>
                            <th scope="col" className="px-6 py-3">Bill</th>
                            {isAdmin && (
                                <th scope="col" className="px-6 py-3 text-right">Actions</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRecords.map((record) => (
                        <tr key={record.id} className="bg-white border-b hover:bg-slate-50">
                            <td className="px-6 py-4 font-medium text-slate-900 flex items-center">
                                <UtilityIcon className="w-4 h-4 mr-2 text-slate-400" />
                                {record.utilityType}
                            </td>
                            <td className="px-6 py-4">{record.date}</td>
                            <td className="px-6 py-4">{currencyFormat(record.cost)}</td>
                            <td className="px-6 py-4">
                                {record.billImage ? (
                                    <button onClick={() => setViewingBill(record.billImage)} className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium">
                                        <EyeIcon className="w-4 h-4 mr-1" />
                                        View
                                    </button>
                                ) : (
                                    <span className="text-xs text-slate-400">N/A</span>
                                )}
                            </td>
                            {isAdmin && (
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end space-x-3">
                                        <button onClick={() => handleOpenModal(record)} className="text-slate-500 hover:text-blue-600"><EditIcon /></button>
                                        <button onClick={() => onDeleteRecord(record.id)} className="text-slate-500 hover:text-red-600"><TrashIcon /></button>
                                    </div>
                                </td>
                            )}
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingRecord && isAdmin ? 'Edit Record' : 'Add New Record'}>
                <UtilityForm onSubmit={handleSubmit} onClose={handleCloseModal} initialData={editingRecord} utilityCategories={utilityCategories} />
            </Modal>
            
            <Modal isOpen={!!viewingBill} onClose={() => setViewingBill(null)} title="View Bill">
                {viewingBill && <img src={viewingBill} alt="Utility bill" className="w-full h-auto rounded-md" />}
            </Modal>

            {isAdmin && (
                <Modal isOpen={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)} title="Manage Utility Categories">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="newCategory" className="block text-sm font-medium text-slate-700">Add New Category</label>
                            <div className="mt-1 flex space-x-2">
                                <input
                                    type="text"
                                    id="newCategory"
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCategory(); } }}
                                    placeholder="e.g., Maintenance"
                                    className="flex-grow input-field"
                                />
                                <button onClick={handleAddCategory} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-semibold">Add</button>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-slate-700 mb-2">Existing Categories</h4>
                            <div className="space-y-2 max-h-60 overflow-y-auto p-2 border rounded-md bg-slate-50">
                                {utilityCategories.map(category => (
                                    <div key={category} className="flex justify-between items-center p-2 bg-white rounded-md shadow-sm">
                                        <span className="text-sm font-medium text-slate-800">{category}</span>
                                        <button onClick={() => onDeleteCategory(category)} className="text-slate-400 hover:text-red-500 transition-colors">
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default UtilitiesManagement;