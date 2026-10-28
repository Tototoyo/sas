import React, { useState, useMemo } from 'react';
import type { Staff, Shift, Task, Absence, SalaryAdvance, Booking, Bonus } from '../types';
// Fix: Import Role enum to be used in the StaffForm.
import { TaskStatus, Role } from '../types';
import Modal from './Modal';
import Badge from './Badge';
import { PlusIcon, EditIcon, TrashIcon, KeyIcon, EyeIcon, EyeSlashIcon, LockClosedIcon } from '../constants';

// --- Staff Form ---
interface StaffFormProps {
  onSubmit: (staff: Omit<Staff, 'id'> | Staff) => void;
  onClose: () => void;
  initialData?: Staff | null;
}

const StaffForm: React.FC<StaffFormProps> = ({ onSubmit, onClose, initialData }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    role: initialData?.role || Role.Staff,
    salary: initialData?.salary?.toString() || '',
    contact: initialData?.contact || '',
    employeeId: initialData?.employeeId || '',
    loginId: initialData?.loginId || (initialData?.employeeId ? initialData.employeeId.toLowerCase() : ''),
    password: initialData?.password || 'staff123',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [id]: value };
      // If employeeId changes and loginId is empty or was matching old employeeId, suggest new loginId
      if (id === 'employeeId' && (!prev.loginId || prev.loginId === prev.employeeId.toLowerCase())) {
        updated.loginId = value.toLowerCase().replace(/\s+/g, '');
      }
      return updated;
    });
  };

  const handleGeneratePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let res = '';
    for (let i = 0; i < 8; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, password: res }));
    setShowPassword(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const effectiveLoginId = (formData.loginId.trim() || formData.employeeId.trim().toLowerCase()).replace(/\s+/g, '');
    const effectivePassword = formData.password.trim() || 'staff123';
    
    const staffData = {
        ...formData,
        role: formData.role as Role,
        salary: Number(formData.salary),
        loginId: effectiveLoginId,
        password: effectivePassword,
    };
    if (initialData) {
      onSubmit({ ...initialData, ...staffData });
    } else {
      onSubmit(staffData);
    }
    onClose();
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700">Full Name</label>
                <input type="text" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full input-field" />
            </div>
            <div>
                <label htmlFor="role" className="block text-sm font-medium text-slate-700">Role</label>
                <select id="role" value={formData.role} onChange={handleChange} required className="mt-1 block w-full input-field">
                    {Object.values(Role).map(roleValue => (
                        <option key={roleValue} value={roleValue}>{roleValue}</option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="salary" className="block text-sm font-medium text-slate-700">Salary (Monthly)</label>
                <input type="number" id="salary" value={formData.salary} onChange={handleChange} required className="mt-1 block w-full input-field" />
            </div>
            <div>
                <label htmlFor="contact" className="block text-sm font-medium text-slate-700">Contact</label>
                <input type="text" id="contact" value={formData.contact} onChange={handleChange} required className="mt-1 block w-full input-field" />
            </div>
            <div className="md:col-span-2">
                <label htmlFor="employeeId" className="block text-sm font-medium text-slate-700">Employee ID</label>
                <input type="text" id="employeeId" value={formData.employeeId} onChange={handleChange} required placeholder="e.g. EMP1001" className="mt-1 block w-full input-field" />
            </div>
        </div>

        {/* Staff Login Credentials Section (Controlled by Admin) */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mt-2">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                    <KeyIcon className="w-5 h-5 text-indigo-600" />
                    <span className="font-semibold text-slate-800 text-sm">Staff Login Credentials (Controlled by Admin)</span>
                </div>
                <button
                    type="button"
                    onClick={handleGeneratePassword}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-medium underline"
                >
                    Auto-Generate Password
                </button>
            </div>
            <p className="text-xs text-slate-500 mb-3">
                This staff member can use these credentials to log into the staff portal and access operations.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="loginId" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                        Staff Login ID / Username
                    </label>
                    <input
                        type="text"
                        id="loginId"
                        value={formData.loginId}
                        onChange={handleChange}
                        required
                        placeholder="e.g. emp1002 or jane"
                        className="w-full input-field font-mono text-sm"
                    />
                    <span className="text-[11px] text-slate-400 mt-1 block">Staff can use this or their Employee ID to log in</span>
                </div>
                <div>
                    <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                        Staff Password
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Enter password"
                            className="w-full input-field font-mono text-sm pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                        >
                            {showPassword ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                        </button>
                    </div>
                    <span className="text-[11px] text-slate-400 mt-1 block">Admin can change or reset this at any time</span>
                </div>
            </div>
        </div>

         <div className="flex justify-end space-x-2 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">{initialData ? 'Update Employee' : 'Add Employee'}</button>
        </div>
        <style>{`.input-field{padding:0.5rem 0.75rem;background-color:white;border:1px solid #cbd5e1;border-radius:0.375rem;box-shadow:0 1px 2px 0 rgb(0 0 0 / 0.05);outline:none;color:#1e293b;}.input-field:focus{ring:1px solid #3b82f6;border-color:#3b82f6;}`}</style>
    </form>
  );
};

// --- Task Form ---
interface TaskFormProps {
    onSubmit: (task: Omit<Task, 'id'> | Task) => void;
    onClose: () => void;
    staffList: Staff[];
    initialData?: Task | null;
}

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, onClose, staffList, initialData }) => {
    const [formData, setFormData] = useState({
        description: initialData?.description || '',
        assignedTo: initialData?.assignedTo || '',
        dueDate: initialData?.dueDate || '',
        status: initialData?.status || TaskStatus.Pending,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({...prev, [id]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (initialData) {
            onSubmit({...initialData, ...formData});
        } else {
            onSubmit(formData);
        }
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-700">Task Description</label>
                <textarea id="description" value={formData.description} onChange={handleChange} required rows={3} className="mt-1 block w-full input-field" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="assignedTo" className="block text-sm font-medium text-slate-700">Assign To</label>
                    <select id="assignedTo" value={formData.assignedTo} onChange={handleChange} required className="mt-1 block w-full input-field">
                        <option value="">Select Staff</option>
                        {staffList.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="dueDate" className="block text-sm font-medium text-slate-700">Due Date</label>
                    <input type="date" id="dueDate" value={formData.dueDate} onChange={handleChange} required className="mt-1 block w-full input-field" />
                </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">{initialData ? 'Update Task' : 'Add Task'}</button>
            </div>
            <style>{`.input-field{padding:0.5rem 0.75rem;background-color:white;border:1px solid #cbd5e1;border-radius:0.375rem;box-shadow:0 1px 2px 0 rgb(0 0 0 / 0.05);outline:none;color:#1e293b;}.input-field:focus{ring:1px solid #3b82f6;border-color:#3b82f6;}`}</style>
    </form>
    )
}

// --- Absence Form ---
interface AbsenceFormProps {
    onSubmit: (absence: Omit<Absence, 'id'> | Absence) => void;
    onClose: () => void;
    staffList: Staff[];
    initialData?: Absence | null;
}

const AbsenceForm: React.FC<AbsenceFormProps> = ({ onSubmit, onClose, staffList, initialData }) => {
    const [formData, setFormData] = useState({
        staffId: initialData?.staffId || '',
        date: initialData?.date || '',
        reason: initialData?.reason || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({...prev, [id]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.staffId) {
            alert('Please select an employee.');
            return;
        }
        if (initialData) {
            onSubmit({...initialData, ...formData});
        } else {
            onSubmit(formData);
        }
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label htmlFor="staffId" className="block text-sm font-medium text-slate-700">Employee</label>
                    <select id="staffId" value={formData.staffId} onChange={handleChange} required className="mt-1 block w-full input-field">
                        <option value="">Select Employee</option>
                        {staffList.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-slate-700">Date of Absence</label>
                    <input type="date" id="date" value={formData.date} onChange={handleChange} required className="mt-1 block w-full input-field" />
                </div>
            </div>
            <div>
                <label htmlFor="reason" className="block text-sm font-medium text-slate-700">Reason (Optional)</label>
                <textarea id="reason" value={formData.reason} onChange={handleChange} rows={3} className="mt-1 block w-full input-field" />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">{initialData ? 'Update Absence' : 'Record Absence'}</button>
            </div>
            <style>{`.input-field{padding:0.5rem 0.75rem;background-color:white;border:1px solid #cbd5e1;border-radius:0.375rem;box-shadow:0 1px 2px 0 rgb(0 0 0 / 0.05);outline:none;color:#1e293b;}.input-field:focus{ring:1px solid #3b82f6;border-color:#3b82f6;}`}</style>
        </form>
    )
}

// --- Salary Advance Form ---
interface SalaryAdvanceFormProps {
    onSubmit: (advance: Omit<SalaryAdvance, 'id'> | SalaryAdvance) => void;
    onClose: () => void;
    staffList: Staff[];
    initialData?: SalaryAdvance | null;
}

const SalaryAdvanceForm: React.FC<SalaryAdvanceFormProps> = ({ onSubmit, onClose, staffList, initialData }) => {
    const [formData, setFormData] = useState({
        staffId: initialData?.staffId || '',
        date: initialData?.date || '',
        amount: initialData?.amount || '',
        reason: initialData?.reason || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({...prev, [id]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.staffId) {
            alert('Please select an employee.');
            return;
        }
        const advanceData = {
            ...formData,
            amount: Number(formData.amount),
        };
        if (initialData) {
            onSubmit({...initialData, ...advanceData});
        } else {
            onSubmit(advanceData);
        }
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label htmlFor="staffId" className="block text-sm font-medium text-slate-700">Employee</label>
                    <select id="staffId" value={formData.staffId} onChange={handleChange} required className="mt-1 block w-full input-field">
                        <option value="">Select Employee</option>
                        {staffList.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-slate-700">Date of Advance</label>
                    <input type="date" id="date" value={formData.date} onChange={handleChange} required className="mt-1 block w-full input-field" />
                </div>
            </div>
             <div>
                <label htmlFor="amount" className="block text-sm font-medium text-slate-700">Amount (THB)</label>
                <input type="number" step="0.01" id="amount" value={formData.amount} onChange={handleChange} required className="mt-1 block w-full input-field" />
            </div>
            <div>
                <label htmlFor="reason" className="block text-sm font-medium text-slate-700">Reason (Optional)</label>
                <textarea id="reason" value={formData.reason} onChange={handleChange} rows={3} className="mt-1 block w-full input-field" />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">{initialData ? 'Update Advance' : 'Record Advance'}</button>
            </div>
            <style>{`.input-field{padding:0.5rem 0.75rem;background-color:white;border:1px solid #cbd5e1;border-radius:0.375rem;box-shadow:0 1px 2px 0 rgb(0 0 0 / 0.05);outline:none;color:#1e293b;}.input-field:focus{ring:1px solid #3b82f6;border-color:#3b82f6;}`}</style>
        </form>
    )
}

// --- Bonus Form ---
interface BonusFormProps {
    onSubmit: (bonus: Omit<Bonus, 'id'> | Bonus) => void;
    onClose: () => void;
    staffList: Staff[];
    initialData?: Bonus | null;
}

const BonusForm: React.FC<BonusFormProps> = ({ onSubmit, onClose, staffList, initialData }) => {
    const [formData, setFormData] = useState({
        staffId: initialData?.staffId || '',
        date: initialData?.date || new Date().toISOString().split('T')[0],
        amount: initialData?.amount !== undefined ? String(initialData.amount) : '',
        reason: initialData?.reason || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({...prev, [id]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.staffId) {
            alert('Please select an employee.');
            return;
        }
        const bonusData = {
            ...formData,
            amount: Number(formData.amount),
        };
        if (initialData) {
            onSubmit({...initialData, ...bonusData});
        } else {
            onSubmit(bonusData);
        }
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label htmlFor="staffId" className="block text-sm font-medium text-slate-700">Employee</label>
                    <select id="staffId" value={formData.staffId} onChange={handleChange} required className="mt-1 block w-full input-field">
                        <option value="">Select Employee</option>
                        {staffList.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-slate-700">Date Awarded</label>
                    <input type="date" id="date" value={formData.date} onChange={handleChange} required className="mt-1 block w-full input-field" />
                </div>
            </div>
             <div>
                <label htmlFor="amount" className="block text-sm font-medium text-slate-700">Bonus Amount (THB)</label>
                <input type="number" step="0.01" min="0" id="amount" value={formData.amount} onChange={handleChange} required className="mt-1 block w-full input-field" />
            </div>
            <div>
                <label htmlFor="reason" className="block text-sm font-medium text-slate-700">Reason / Milestone (Optional)</label>
                <textarea id="reason" placeholder="e.g. High Season Bonus, Outstanding Performance, Customer Service Excellence" value={formData.reason} onChange={handleChange} rows={3} className="mt-1 block w-full input-field" />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">{initialData ? 'Update Bonus' : 'Award Bonus'}</button>
            </div>
            <style>{`.input-field{padding:0.5rem 0.75rem;background-color:white;border:1px solid #cbd5e1;border-radius:0.375rem;box-shadow:0 1px 2px 0 rgb(0 0 0 / 0.05);outline:none;color:#1e293b;}.input-field:focus{ring:1px solid #3b82f6;border-color:#3b82f6;}`}</style>
        </form>
    );
};



type StaffSubView = 'employees' | 'shifts' | 'tasks' | 'absences' | 'advances' | 'bonuses';

interface StaffManagementProps {
  staff: Staff[];
  shifts: Shift[];
  tasks: Task[];
  absences: Absence[];
  salaryAdvances: SalaryAdvance[];
  bonuses: Bonus[];
  bookings: Booking[];
  onAddStaff: (newStaff: Omit<Staff, 'id'>) => void;
  onUpdateStaff: (updatedStaff: Staff) => void;
  onDeleteStaff: (staffId: string) => void;
  onAddTask: (newTask: Omit<Task, 'id'>) => void;
  onUpdateTask: (updatedTask: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onAddAbsence: (newAbsence: Omit<Absence, 'id'>) => void;
  onUpdateAbsence: (updatedAbsence: Absence) => void;
  onDeleteAbsence: (absenceId: string) => void;
  onAddSalaryAdvance: (newAdvance: Omit<SalaryAdvance, 'id'>) => void;
  onUpdateSalaryAdvance: (updatedAdvance: SalaryAdvance) => void;
  onDeleteSalaryAdvance: (advanceId: string) => void;
  onAddBonus: (newBonus: Omit<Bonus, 'id'>) => void;
  onUpdateBonus: (updatedBonus: Bonus) => void;
  onDeleteBonus: (bonusId: string) => void;
}

export const StaffManagement: React.FC<StaffManagementProps> = (props) => {
    const { staff, shifts, tasks, absences, salaryAdvances, bonuses, bookings, onAddStaff, onUpdateStaff, onDeleteStaff, onAddTask, onUpdateTask, onDeleteTask, onAddAbsence, onUpdateAbsence, onDeleteAbsence, onAddSalaryAdvance, onUpdateSalaryAdvance, onDeleteSalaryAdvance, onAddBonus, onUpdateBonus, onDeleteBonus } = props;
    const [activeTab, setActiveTab] = useState<StaffSubView>('employees');
    
    // State for modals
    const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [isAbsenceModalOpen, setIsAbsenceModalOpen] = useState(false);
    const [editingAbsence, setEditingAbsence] = useState<Absence | null>(null);
    const [isAdvanceModalOpen, setIsAdvanceModalOpen] = useState(false);
    const [editingAdvance, setEditingAdvance] = useState<SalaryAdvance | null>(null);
    const [isBonusModalOpen, setIsBonusModalOpen] = useState(false);
    const [editingBonus, setEditingBonus] = useState<Bonus | null>(null);
    const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().slice(0, 7)); // YYYY-MM
    const [revealedPasswords, setRevealedPasswords] = useState<Record<string, boolean>>({});

    const togglePasswordVisibility = (staffId: string) => {
        setRevealedPasswords(prev => ({ ...prev, [staffId]: !prev[staffId] }));
    };

    const staffMap = useMemo(() => new Map(staff.map(s => [s.id, s.name])), [staff]);
    
    const monthlyAdvancesByStaff = useMemo(() => {
        const advancesMap = new Map<string, number>();
        const monthlyAdvances = salaryAdvances.filter(a => a.date.startsWith(selectedMonth));
        monthlyAdvances.forEach(advance => {
            advancesMap.set(advance.staffId, (advancesMap.get(advance.staffId) || 0) + advance.amount);
        });
        return advancesMap;
    }, [salaryAdvances, selectedMonth]);

    const monthlyCommissionsByStaff = useMemo(() => {
        const commissionsMap = new Map<string, number>();
        const monthlyBookings = bookings.filter(b => b.bookingDate.startsWith(selectedMonth));
        monthlyBookings.forEach(booking => {
            if (booking.employeeCommission) {
                commissionsMap.set(booking.staffId, (commissionsMap.get(booking.staffId) || 0) + booking.employeeCommission);
            }
        });
        return commissionsMap;
    }, [bookings, selectedMonth]);

    const monthlyBonusesByStaff = useMemo(() => {
        const bonusesMap = new Map<string, number>();
        const monthlyBonuses = bonuses.filter(b => b.date.startsWith(selectedMonth));
        monthlyBonuses.forEach(bonus => {
            bonusesMap.set(bonus.staffId, (bonusesMap.get(bonus.staffId) || 0) + bonus.amount);
        });
        return bonusesMap;
    }, [bonuses, selectedMonth]);

    const monthlyAbsenceDeductionsByStaff = useMemo(() => {
        const deductionsMap = new Map<string, number>();
        if (!selectedMonth) return deductionsMap;

        // Standardize to 30 days per month for consistent salary and deduction rates
        const daysInMonth = 30;

        const monthlyAbsences = absences.filter(a => a.date.startsWith(selectedMonth));
        
        staff.forEach(s => {
            const monthlySalary = s.salary;
            const dailyDeductionRate = monthlySalary / daysInMonth;
            const staffAbsenceCount = monthlyAbsences.filter(a => a.staffId === s.id).length;
            const totalDeduction = staffAbsenceCount * dailyDeductionRate;
            deductionsMap.set(s.id, totalDeduction);
        });

        return deductionsMap;
    }, [staff, absences, selectedMonth]);

    const groupedShifts = useMemo(() => {
        return shifts.reduce((acc, shift) => {
            (acc[shift.date] = acc[shift.date] || []).push(shift);
            return acc;
        }, {} as Record<string, Shift[]>);
    }, [shifts]);

    const filteredAbsences = useMemo(() => {
        if (!selectedMonth) return absences;
        return absences.filter(a => a.date.startsWith(selectedMonth));
    }, [absences, selectedMonth]);

    const absenceSummary = useMemo(() => {
        const summary = staff.map(s => {
            const count = filteredAbsences.filter(a => a.staffId === s.id).length;
            return {
                staffId: s.id,
                staffName: s.name,
                absenceCount: count,
            };
        });
        return summary.filter(s => s.absenceCount > 0).sort((a, b) => b.absenceCount - a.absenceCount);
    }, [staff, filteredAbsences]);


    // Handlers for Staff Modal
    const handleOpenStaffModal = (staffMember?: Staff) => {
        setEditingStaff(staffMember || null);
        setIsStaffModalOpen(true);
    };
    const handleCloseStaffModal = () => setIsStaffModalOpen(false);
    const handleStaffSubmit = (staffData: Omit<Staff, 'id'> | Staff) => {
        if ('id' in staffData) onUpdateStaff(staffData); else onAddStaff(staffData);
    };
    
    // Handlers for Task Modal
    const handleOpenTaskModal = (task?: Task) => {
        setEditingTask(task || null);
        setIsTaskModalOpen(true);
    };
    const handleCloseTaskModal = () => setIsTaskModalOpen(false);
    const handleTaskSubmit = (taskData: Omit<Task, 'id'> | Task) => {
        if ('id' in taskData) onUpdateTask(taskData); else onAddTask(taskData);
    };
    const handleTaskStatusChange = (task: Task, newStatus: TaskStatus) => {
        onUpdateTask({ ...task, status: newStatus });
    }

    // Handlers for Absence Modal
    const handleOpenAbsenceModal = (absence?: Absence) => {
        setEditingAbsence(absence || null);
        setIsAbsenceModalOpen(true);
    };
    const handleCloseAbsenceModal = () => setIsAbsenceModalOpen(false);
    const handleAbsenceSubmit = (absenceData: Omit<Absence, 'id'> | Absence) => {
        if ('id' in absenceData) onUpdateAbsence(absenceData); else onAddAbsence(absenceData);
    };

    // Handlers for Salary Advance Modal
    const handleOpenAdvanceModal = (advance?: SalaryAdvance) => {
        setEditingAdvance(advance || null);
        setIsAdvanceModalOpen(true);
    };
    const handleCloseAdvanceModal = () => setIsAdvanceModalOpen(false);
    const handleAdvanceSubmit = (advanceData: Omit<SalaryAdvance, 'id'> | SalaryAdvance) => {
        if ('id' in advanceData) onUpdateSalaryAdvance(advanceData); else onAddSalaryAdvance(advanceData);
    };

    // Handlers for Bonus Modal
    const handleOpenBonusModal = (bonus?: Bonus) => {
        setEditingBonus(bonus || null);
        setIsBonusModalOpen(true);
    };
    const handleCloseBonusModal = () => setIsBonusModalOpen(false);
    const handleBonusSubmit = (bonusData: Omit<Bonus, 'id'> | Bonus) => {
        if ('id' in bonusData) onUpdateBonus(bonusData); else onAddBonus(bonusData);
    };


    const TABS: { id: StaffSubView; label: string }[] = [
        { id: 'employees', label: 'Employees' },
        { id: 'shifts', label: 'Shift Schedule' },
        { id: 'tasks', label: 'Task Board' },
        { id: 'absences', label: 'Absence Tracking' },
        { id: 'advances', label: 'Salary Advances' },
        { id: 'bonuses', label: 'Staff Bonuses' },
    ];

  return (
    <div>
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Staff & HR</h1>
        </div>
        
        <div className="border-b border-slate-200">
             <nav className="flex space-x-2 sm:space-x-6 overflow-x-auto -mb-px" aria-label="Tabs">
                {TABS.map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                        className={`${
                            activeTab === tab.id
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                    >
                        {tab.label}
                    </button>
                ))}
            </nav>
        </div>

        <div className="mt-6">
            {activeTab === 'employees' && (
                <div>
                    <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between mb-6">
                         <div>
                            <label htmlFor="month-filter-employees" className="text-sm font-medium text-slate-600">View salary details for month:</label>
                            <input 
                                type="month" 
                                id="month-filter-employees"
                                value={selectedMonth}
                                onChange={e => setSelectedMonth(e.target.value)}
                                className="ml-2 rounded-md border-slate-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-sm py-1"
                            />
                        </div>
                        <button onClick={() => handleOpenStaffModal()} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700">
                           <PlusIcon className="w-5 h-5 mr-2" /> Add Employee
                        </button>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4">
                        {staff.map(s => {
                            const totalAdvances = monthlyAdvancesByStaff.get(s.id) || 0;
                            const totalDeductions = monthlyAbsenceDeductionsByStaff.get(s.id) || 0;
                            const totalCommissions = monthlyCommissionsByStaff.get(s.id) || 0;
                            const totalBonuses = monthlyBonusesByStaff.get(s.id) || 0;
                            const netMonthlySalary = s.salary + totalCommissions + totalBonuses - totalAdvances - totalDeductions;
                            const isPwRevealed = !!revealedPasswords[s.id];
                            return (
                                <div key={s.id} className="bg-white rounded-lg shadow-md p-4 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-slate-800">{s.name}</h3>
                                            <p className="text-sm text-slate-600">{s.role}</p>
                                        </div>
                                        <div className="flex space-x-3">
                                            <button onClick={() => handleOpenStaffModal(s)} className="text-slate-500 hover:text-blue-600"><EditIcon /></button>
                                            <button onClick={() => onDeleteStaff(s.id)} className="text-slate-500 hover:text-red-600"><TrashIcon /></button>
                                        </div>
                                    </div>

                                    {/* Login Credentials Box */}
                                    <div className="bg-slate-50 rounded p-2.5 border border-slate-200 space-y-1.5">
                                        <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                                            <span className="flex items-center space-x-1.5">
                                                <KeyIcon className="w-3.5 h-3.5 text-indigo-600" />
                                                <span>Staff Portal Credentials</span>
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => togglePasswordVisibility(s.id)}
                                                className="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium flex items-center space-x-1"
                                            >
                                                {isPwRevealed ? <EyeSlashIcon className="w-3 h-3 mr-0.5" /> : <EyeIcon className="w-3 h-3 mr-0.5" />}
                                                <span>{isPwRevealed ? 'Hide' : 'Show'}</span>
                                            </button>
                                        </div>
                                        <div className="text-xs text-slate-600 flex justify-between items-center">
                                            <span className="text-slate-500">Login ID:</span>
                                            <span className="font-mono font-medium text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                                                {s.loginId || s.employeeId.toLowerCase()}
                                            </span>
                                        </div>
                                        <div className="text-xs text-slate-600 flex justify-between items-center">
                                            <span className="text-slate-500">Password:</span>
                                            <span className="font-mono font-medium text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                                                {isPwRevealed ? (s.password || 'staff123') : '••••••••'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="text-sm text-slate-600 border-t pt-3 space-y-1">
                                         <p><span className="font-semibold">ID:</span> {s.employeeId}</p>
                                         <p><span className="font-semibold">Contact:</span> {s.contact}</p>
                                         <p><span className="font-semibold">Salary (Monthly):</span> ฿{s.salary.toLocaleString()}</p>
                                         <p><span className="font-semibold text-sky-600">Monthly Commissions:</span> ฿{totalCommissions.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                         <p><span className="font-semibold text-emerald-600">Monthly Bonuses:</span> +฿{totalBonuses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                         <p><span className="font-semibold text-red-600">Monthly Advances:</span> ฿{totalAdvances.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                         <p><span className="font-semibold text-orange-600">Absence Deductions:</span> ฿{totalDeductions.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                         <p className="font-bold text-green-600 pt-1 border-t mt-1"><span className="font-semibold">Net Monthly Salary:</span> ฿{netMonthlySalary.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden md:block bg-white rounded-lg shadow-md overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-500">
                            <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                                <tr>
                                    <th className="px-6 py-3">Name</th>
                                    <th className="px-6 py-3">Role</th>
                                    <th className="px-6 py-3">Employee ID</th>
                                    <th className="px-6 py-3">Login Credentials</th>
                                    <th className="px-6 py-3">Salary (Monthly)</th>
                                    <th className="px-6 py-3">Monthly Commissions</th>
                                    <th className="px-6 py-3">Monthly Bonuses</th>
                                    <th className="px-6 py-3">Monthly Advances</th>
                                    <th className="px-6 py-3">Absence Deductions</th>
                                    <th className="px-6 py-3">Net Monthly Salary</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {staff.map(s => {
                                    const totalAdvances = monthlyAdvancesByStaff.get(s.id) || 0;
                                    const totalDeductions = monthlyAbsenceDeductionsByStaff.get(s.id) || 0;
                                    const totalCommissions = monthlyCommissionsByStaff.get(s.id) || 0;
                                    const totalBonuses = monthlyBonusesByStaff.get(s.id) || 0;
                                    const netMonthlySalary = s.salary + totalCommissions + totalBonuses - totalAdvances - totalDeductions;
                                    const isPwRevealed = !!revealedPasswords[s.id];
                                    return (
                                        <tr key={s.id} className="bg-white border-b hover:bg-slate-50">
                                            <td className="px-6 py-4 font-medium text-slate-900">{s.name}</td>
                                            <td className="px-6 py-4">{s.role}</td>
                                            <td className="px-6 py-4">{s.employeeId}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col space-y-1">
                                                    <div className="flex items-center space-x-1.5">
                                                        <span className="text-[10px] uppercase font-bold text-slate-400">User:</span>
                                                        <span className="font-mono text-xs bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded border border-slate-200 font-semibold">
                                                            {s.loginId || s.employeeId.toLowerCase()}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center space-x-1.5">
                                                        <span className="text-[10px] uppercase font-bold text-slate-400">Pass:</span>
                                                        <span className="font-mono text-xs text-slate-700 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                                                            {isPwRevealed ? (s.password || 'staff123') : '••••••••'}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => togglePasswordVisibility(s.id)}
                                                            title={isPwRevealed ? 'Hide password' : 'Show password'}
                                                            className="text-slate-400 hover:text-indigo-600 transition-colors p-0.5"
                                                        >
                                                            {isPwRevealed ? <EyeSlashIcon className="w-3.5 h-3.5" /> : <EyeIcon className="w-3.5 h-3.5" />}
                                                        </button>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">฿{s.salary.toLocaleString()}</td>
                                            <td className="px-6 py-4 text-sky-600 font-medium">฿{totalCommissions.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                            <td className="px-6 py-4 text-emerald-600 font-medium">+฿{totalBonuses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                            <td className="px-6 py-4 text-red-600 font-medium">฿{totalAdvances.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                            <td className="px-6 py-4 text-orange-600 font-medium">฿{totalDeductions.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                            <td className="px-6 py-4 text-green-600 font-bold">฿{netMonthlySalary.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end space-x-3">
                                                    <button onClick={() => handleOpenStaffModal(s)} className="text-slate-500 hover:text-blue-600"><EditIcon /></button>
                                                    <button onClick={() => onDeleteStaff(s.id)} className="text-slate-500 hover:text-red-600"><TrashIcon /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            
            {activeTab === 'shifts' && (
                 <div className="space-y-6">
                    {Object.keys(groupedShifts).sort().map(date => (
                        <div key={date} className="bg-white p-4 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold text-slate-800 mb-3 border-b pb-2">
                                {new Date(date + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </h3>
                            <div className="space-y-2">
                                {groupedShifts[date].map(shift => (
                                    <div key={shift.id} className="flex items-center justify-between p-2 rounded-md hover:bg-slate-50">
                                        <span className="font-medium text-slate-700">{shift.staffName}</span>
                                        <span className="text-sm text-slate-500">{shift.startTime} - {shift.endTime}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'tasks' && (
                <div>
                     <div className="flex justify-end mb-4">
                        <button onClick={() => handleOpenTaskModal()} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700">
                           <PlusIcon className="w-5 h-5 mr-2" /> Add Task
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {Object.values(TaskStatus).map(status => (
                            <div key={status} className="bg-slate-50 rounded-lg p-4">
                                <h3 className="font-semibold text-slate-700 mb-4">{status}</h3>
                                <div className="space-y-4">
                                    {tasks.filter(t => t.status === status).map(task => (
                                        <div key={task.id} className="bg-white p-4 rounded-md shadow-sm border">
                                            <p className="font-medium text-slate-800">{task.description}</p>
                                            <div className="text-sm text-slate-500 mt-2">
                                                <p>To: {staffMap.get(task.assignedTo) || 'Unassigned'}</p>
                                                <p>Due: {task.dueDate}</p>
                                            </div>
                                            <div className="flex items-center justify-between mt-3">
                                                 <select value={task.status} onChange={(e) => handleTaskStatusChange(task, e.target.value as TaskStatus)} className="text-xs border-slate-200 rounded">
                                                     {Object.values(TaskStatus).map(s => <option key={s} value={s}>{s}</option>)}
                                                 </select>
                                                <div className="flex space-x-2">
                                                   <button onClick={() => handleOpenTaskModal(task)} className="text-slate-400 hover:text-blue-600"><EditIcon className="w-4 h-4" /></button>
                                                   <button onClick={() => onDeleteTask(task.id)} className="text-slate-400 hover:text-red-600"><TrashIcon className="w-4 h-4" /></button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'absences' && (
                <div>
                    <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between mb-6">
                        <div>
                            <label htmlFor="month-filter-absences" className="text-sm font-medium text-slate-600">Filter by Month:</label>
                            <input 
                                type="month" 
                                id="month-filter-absences"
                                value={selectedMonth}
                                onChange={e => setSelectedMonth(e.target.value)}
                                className="ml-2 rounded-md border-slate-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-sm py-1"
                            />
                        </div>
                        <button onClick={() => handleOpenAbsenceModal()} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700">
                           <PlusIcon className="w-5 h-5 mr-2" /> Record Absence
                        </button>
                    </div>

                    {absenceSummary.length > 0 && (
                        <div className="bg-white rounded-lg shadow-md overflow-x-auto mb-6">
                             <h3 className="text-lg font-semibold text-slate-800 p-4 border-b">Monthly Absence Summary - {new Date(selectedMonth+'-02').toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
                            <table className="w-full text-sm text-left text-slate-500">
                                <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-3">Employee</th>
                                        <th className="px-6 py-3">Total Absences This Month</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {absenceSummary.map(summary => (
                                        <tr key={summary.staffId} className="bg-white border-b hover:bg-slate-50">
                                            <td className="px-6 py-4 font-medium text-slate-900">{summary.staffName}</td>
                                            <td className="px-6 py-4">{summary.absenceCount}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}


                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4">
                        {filteredAbsences.map(a => (
                            <div key={a.id} className="bg-white rounded-lg shadow-md p-4 space-y-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-slate-800">{staffMap.get(a.staffId) || 'Unknown Staff'}</h3>
                                        <p className="text-sm text-slate-600">{a.date}</p>
                                    </div>
                                    <div className="flex space-x-3">
                                        <button onClick={() => handleOpenAbsenceModal(a)} className="text-slate-500 hover:text-blue-600"><EditIcon /></button>
                                        <button onClick={() => onDeleteAbsence(a.id)} className="text-slate-500 hover:text-red-600"><TrashIcon /></button>
                                    </div>
                                </div>
                                {a.reason && (
                                <div className="text-sm text-slate-600 border-t pt-2">
                                     <p><span className="font-semibold">Reason:</span> {a.reason}</p>
                                </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden md:block bg-white rounded-lg shadow-md overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-500">
                            <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                                <tr>
                                    <th className="px-6 py-3">Employee</th>
                                    <th className="px-6 py-3">Date</th>
                                    <th className="px-6 py-3">Reason</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAbsences.map(a => (
                                    <tr key={a.id} className="bg-white border-b hover:bg-slate-50">
                                        <td className="px-6 py-4 font-medium text-slate-900">{staffMap.get(a.staffId) || 'Unknown Staff'}</td>
                                        <td className="px-6 py-4">{a.date}</td>
                                        <td className="px-6 py-4">{a.reason || 'N/A'}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end space-x-3">
                                                <button onClick={() => handleOpenAbsenceModal(a)} className="text-slate-500 hover:text-blue-600"><EditIcon /></button>
                                                <button onClick={() => onDeleteAbsence(a.id)} className="text-slate-500 hover:text-red-600"><TrashIcon /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'advances' && (
                <div>
                    <div className="flex justify-end mb-4">
                        <button onClick={() => handleOpenAdvanceModal()} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700">
                           <PlusIcon className="w-5 h-5 mr-2" /> Record Advance
                        </button>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4">
                        {salaryAdvances.map(a => (
                            <div key={a.id} className="bg-white rounded-lg shadow-md p-4 space-y-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-slate-800">{staffMap.get(a.staffId) || 'Unknown Staff'}</h3>
                                        <p className="text-sm text-slate-600">{a.date}</p>
                                    </div>
                                    <div className="flex space-x-3">
                                        <button onClick={() => handleOpenAdvanceModal(a)} className="text-slate-500 hover:text-blue-600"><EditIcon /></button>
                                        <button onClick={() => onDeleteSalaryAdvance(a.id)} className="text-slate-500 hover:text-red-600"><TrashIcon /></button>
                                    </div>
                                </div>
                                <div className="text-sm text-slate-600 border-t pt-2">
                                    <p><span className="font-semibold">Amount:</span> ฿{a.amount.toFixed(2)}</p>
                                    {a.reason && <p><span className="font-semibold">Reason:</span> {a.reason}</p>}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden md:block bg-white rounded-lg shadow-md overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-500">
                            <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                                <tr>
                                    <th className="px-6 py-3">Employee</th>
                                    <th className="px-6 py-3">Date</th>
                                    <th className="px-6 py-3">Amount</th>
                                    <th className="px-6 py-3">Reason</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {salaryAdvances.map(a => (
                                    <tr key={a.id} className="bg-white border-b hover:bg-slate-50">
                                        <td className="px-6 py-4 font-medium text-slate-900">{staffMap.get(a.staffId) || 'Unknown Staff'}</td>
                                        <td className="px-6 py-4">{a.date}</td>
                                        <td className="px-6 py-4">฿{a.amount.toFixed(2)}</td>
                                        <td className="px-6 py-4">{a.reason || 'N/A'}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end space-x-3">
                                                <button onClick={() => handleOpenAdvanceModal(a)} className="text-slate-500 hover:text-blue-600"><EditIcon /></button>
                                                <button onClick={() => onDeleteSalaryAdvance(a.id)} className="text-slate-500 hover:text-red-600"><TrashIcon /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'bonuses' && (
                <div>
                    <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between mb-6">
                        <div>
                            <label htmlFor="month-filter-bonuses" className="text-sm font-medium text-slate-600">Filter by Month:</label>
                            <input 
                                type="month" 
                                id="month-filter-bonuses"
                                value={selectedMonth}
                                onChange={e => setSelectedMonth(e.target.value)}
                                className="ml-2 rounded-md border-slate-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-sm py-1"
                            />
                        </div>
                        <button onClick={() => handleOpenBonusModal()} className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md shadow-sm hover:bg-emerald-700">
                           <PlusIcon className="w-5 h-5 mr-2" /> Award Bonus
                        </button>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4">
                        {bonuses.filter(b => !selectedMonth || b.date.startsWith(selectedMonth)).map(b => (
                            <div key={b.id} className="bg-white rounded-lg shadow-md p-4 space-y-2 border-l-4 border-emerald-500">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-slate-800">{staffMap.get(b.staffId) || 'Unknown Staff'}</h3>
                                        <p className="text-sm text-slate-600">{b.date}</p>
                                    </div>
                                    <div className="flex space-x-3">
                                        <button onClick={() => handleOpenBonusModal(b)} className="text-slate-500 hover:text-blue-600"><EditIcon /></button>
                                        <button onClick={() => onDeleteBonus(b.id)} className="text-slate-500 hover:text-red-600"><TrashIcon /></button>
                                    </div>
                                </div>
                                <div className="text-sm text-slate-600 border-t pt-2">
                                    <p className="text-emerald-700 font-semibold"><span className="text-slate-600 font-medium">Bonus:</span> ฿{b.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                    {b.reason && <p><span className="font-semibold">Reason:</span> {b.reason}</p>}
                                </div>
                            </div>
                        ))}
                        {bonuses.filter(b => !selectedMonth || b.date.startsWith(selectedMonth)).length === 0 && (
                            <div className="bg-white p-6 rounded-lg text-center text-slate-500">
                                No bonuses recorded for this period. Click "Award Bonus" to add one.
                            </div>
                        )}
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden md:block bg-white rounded-lg shadow-md overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-500">
                            <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                                <tr>
                                    <th className="px-6 py-3">Employee</th>
                                    <th className="px-6 py-3">Date</th>
                                    <th className="px-6 py-3">Bonus Amount</th>
                                    <th className="px-6 py-3">Reason / Milestone</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bonuses.filter(b => !selectedMonth || b.date.startsWith(selectedMonth)).map(b => (
                                    <tr key={b.id} className="bg-white border-b hover:bg-slate-50">
                                        <td className="px-6 py-4 font-medium text-slate-900">{staffMap.get(b.staffId) || 'Unknown Staff'}</td>
                                        <td className="px-6 py-4">{b.date}</td>
                                        <td className="px-6 py-4 font-bold text-emerald-600">฿{b.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                        <td className="px-6 py-4">{b.reason || 'N/A'}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end space-x-3">
                                                <button onClick={() => handleOpenBonusModal(b)} className="text-slate-500 hover:text-blue-600"><EditIcon /></button>
                                                <button onClick={() => onDeleteBonus(b.id)} className="text-slate-500 hover:text-red-600"><TrashIcon /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {bonuses.filter(b => !selectedMonth || b.date.startsWith(selectedMonth)).length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                            No bonuses recorded for this period. Click "Award Bonus" to reward staff.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
        
        <Modal isOpen={isStaffModalOpen} onClose={handleCloseStaffModal} title={editingStaff ? 'Edit Employee' : 'Add New Employee'}>
            <StaffForm onSubmit={handleStaffSubmit} onClose={handleCloseStaffModal} initialData={editingStaff}/>
        </Modal>

        <Modal isOpen={isTaskModalOpen} onClose={handleCloseTaskModal} title={editingTask ? 'Edit Task' : 'Add New Task'}>
            <TaskForm onSubmit={handleTaskSubmit} onClose={handleCloseTaskModal} initialData={editingTask} staffList={staff} />
        </Modal>

        <Modal isOpen={isAbsenceModalOpen} onClose={handleCloseAbsenceModal} title={editingAbsence ? 'Edit Absence Record' : 'Record New Absence'}>
            <AbsenceForm onSubmit={handleAbsenceSubmit} onClose={handleCloseAbsenceModal} initialData={editingAbsence} staffList={staff} />
        </Modal>

        <Modal isOpen={isAdvanceModalOpen} onClose={handleCloseAdvanceModal} title={editingAdvance ? 'Edit Salary Advance' : 'Record New Salary Advance'}>
            <SalaryAdvanceForm onSubmit={handleAdvanceSubmit} onClose={handleCloseAdvanceModal} initialData={editingAdvance} staffList={staff} />
        </Modal>

        <Modal isOpen={isBonusModalOpen} onClose={handleCloseBonusModal} title={editingBonus ? 'Edit Staff Bonus' : 'Award Staff Bonus'}>
            <BonusForm onSubmit={handleBonusSubmit} onClose={handleCloseBonusModal} initialData={editingBonus} staffList={staff} />
        </Modal>
    </div>
  );
};