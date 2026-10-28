
import React, { useState, useEffect, useMemo } from 'react';
import type { Room, Bed } from '../types';
import { BedStatus, EntityCondition, Role } from '../types';
import Modal from './Modal';
import Badge from './Badge';
import { PlusIcon, EditIcon, TrashIcon, BedIcon, ClipboardDocumentCheckIcon, PrinterIcon, ArrowDownTrayIcon, PhotoIcon } from '../constants';

declare global {
  interface Window {
    html2canvas: any;
  }
}

interface RoomFormProps {
  onSubmit: (room: Omit<Room, 'id'> | Room) => void;
  onClose: () => void;
  initialData?: Room | null;
}

const RoomForm: React.FC<RoomFormProps> = ({ onSubmit, onClose, initialData }) => {
  const isEditing = !!initialData;

  // State for the form fields
  const [name, setName] = useState('');
  const [condition, setCondition] = useState<EntityCondition>(EntityCondition.Excellent);
  const [maintenanceNotes, setMaintenanceNotes] = useState('');

  useEffect(() => {
    if (initialData) {
      // We are editing, so set the condition and notes from the existing room data.
      setCondition(initialData.condition);
      setMaintenanceNotes(initialData.maintenanceNotes);
    } else {
      // We are adding, so reset the form to its default state.
      setName('');
      setCondition(EntityCondition.Excellent);
      setMaintenanceNotes('');
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      // If editing, create an updated room object using the initial data
      // and overwriting only the fields that were edited.
      const updatedRoomData = {
          ...initialData,
          condition: condition,
          maintenanceNotes: maintenanceNotes,
      };
      onSubmit(updatedRoomData);
    } else {
      // If adding, create a new room object. The number of beds is not
      // handled by this form and defaults to zero.
      onSubmit({ name, condition, maintenanceNotes, beds: [] });
    }
    onClose();
  };

  // When editing, only "Excellent" and "Needs Repair" are valid conditions.
  // When adding, all conditions are available.
  const conditionOptions = isEditing
    ? [EntityCondition.Excellent, EntityCondition['Needs Repair']]
    : Object.values(EntityCondition);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isEditing ? (
        // When editing, display the name of the room being updated instead of an input field.
        <p className="text-sm font-medium text-slate-700">
          Updating maintenance for: <span className="font-bold">{initialData.name}</span>
        </p>
      ) : (
        // When adding a new room, show the name input field.
        <div>
          <label htmlFor="roomName" className="block text-sm font-medium text-slate-700">Room Name</label>
          <input type="text" id="roomName" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-slate-900" />
        </div>
      )}
      
      <div>
        <label htmlFor="condition" className="block text-sm font-medium text-slate-700">Condition</label>
        <select id="condition" value={condition} onChange={(e) => setCondition(e.target.value as EntityCondition)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md text-slate-900">
          {conditionOptions.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="maintenanceNotes" className="block text-sm font-medium text-slate-700">Maintenance Notes</label>
        <textarea id="maintenanceNotes" value={maintenanceNotes} onChange={(e) => setMaintenanceNotes(e.target.value)} rows={3} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-slate-900"></textarea>
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Cancel</button>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">{isEditing ? 'Update' : 'Add Room'}</button>
      </div>
    </form>
  );
};

interface BedToClean {
    roomId: string;
    roomName: string;
    bedId: string;
    bedNumber: number;
}

interface CleaningChecklistProps {
  beds: BedToClean[];
  onMarkAsClean: (roomId: string, bedId: string) => void;
  onPrint: () => void;
  onDownloadCSV: () => void;
  onDownloadImage: () => void;
}

const CleaningChecklist: React.FC<CleaningChecklistProps> = ({ beds, onMarkAsClean, onPrint, onDownloadCSV, onDownloadImage }) => {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg shadow-sm p-4 mb-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-3 gap-y-3">
        <div className="flex items-center space-x-2">
            <ClipboardDocumentCheckIcon className="w-6 h-6 text-amber-700"/>
            <h2 className="text-xl font-bold text-amber-800">Cleaning Checklist ({beds.length})</h2>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
            <button onClick={onDownloadImage} className="flex items-center justify-center sm:w-auto w-full px-3 py-1.5 bg-slate-600 text-white rounded-md text-sm hover:bg-slate-700 transition-colors">
                <PhotoIcon className="w-4 h-4 mr-2"/> Download as Image
            </button>
            <button onClick={onDownloadCSV} className="flex items-center justify-center sm:w-auto w-full px-3 py-1.5 bg-slate-600 text-white rounded-md text-sm hover:bg-slate-700 transition-colors">
                <ArrowDownTrayIcon className="w-4 h-4 mr-2"/> Download List (CSV)
            </button>
            <button onClick={onPrint} className="flex items-center justify-center sm:w-auto w-full px-3 py-1.5 bg-slate-600 text-white rounded-md text-sm hover:bg-slate-700 transition-colors">
                <PrinterIcon className="w-4 h-4 mr-2"/> Print List for Staff
            </button>
        </div>
      </div>
      <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
        {beds.map(bed => (
          <div key={bed.bedId} className="flex justify-between items-center p-2 bg-white rounded-md shadow-sm">
            <div>
              <span className="font-semibold text-slate-800">{bed.roomName}</span> - <span className="text-slate-600">Bed {bed.bedNumber}</span>
            </div>
            <button
              onClick={() => onMarkAsClean(bed.roomId, bed.bedId)}
              className="px-2 py-1 text-xs font-semibold text-white bg-green-500 rounded-md hover:bg-green-600"
            >
              Cleaned
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const PrintableCleaningList: React.FC<{ beds: BedToClean[] }> = ({ beds }) => (
    <div className="hidden printable-area bg-white p-4">
        <h1 className="text-2xl font-bold mb-4 text-slate-800">The Hideaway: Cleaning List</h1>
        <p className="mb-4 text-slate-600">Generated on: {new Date().toLocaleString()}</p>
        <table className="w-full text-base border-collapse border border-slate-400">
            <thead>
                <tr>
                    <th className="p-2 text-left border border-slate-300 bg-slate-100">Room Name</th>
                    <th className="p-2 text-left border border-slate-300 bg-slate-100">Bed</th>
                    <th className="p-2 text-left border border-slate-300 bg-slate-100">Cleaned (✓)</th>
                </tr>
            </thead>
            <tbody>
                {beds.map(bed => (
                    <tr key={bed.bedId}>
                        <td className="p-2 border border-slate-300">{bed.roomName}</td>
                        <td className="p-2 border border-slate-300">{bed.bedNumber}</td>
                        <td className="p-2 h-12 w-32 border border-slate-300"></td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);


interface RoomManagementProps {
  rooms: Room[];
  onAddRoom: (newRoom: Omit<Room, 'id'>) => void;
  onUpdateRoom: (updatedRoom: Room) => void;
  onDeleteRoom: (roomId: string) => void;
  currentUserRole: Role;
}

const RoomManagement: React.FC<RoomManagementProps> = ({ rooms, onAddRoom, onUpdateRoom, onDeleteRoom, currentUserRole }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  const handleOpenModal = (room?: Room) => {
    setEditingRoom(room || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingRoom(null);
    setIsModalOpen(false);
  };

  const handleSubmit = (roomData: Omit<Room, 'id'> | Room) => {
    if ('id' in roomData) {
      onUpdateRoom(roomData);
    } else {
      onAddRoom(roomData);
    }
  };

  const handleBedStatusChange = (roomId: string, bedId: string, newStatus: BedStatus) => {
    const roomToUpdate = rooms.find(r => r.id === roomId);
    if (!roomToUpdate) return;

    const updatedBeds = roomToUpdate.beds.map(bed => {
      if (bed.id === bedId) {
        return { ...bed, status: newStatus };
      }
      return bed;
    });

    onUpdateRoom({ ...roomToUpdate, beds: updatedBeds });
  };

  const handleMarkAsFixed = (roomId: string) => {
    const roomToUpdate = rooms.find(r => r.id === roomId);
    if (!roomToUpdate) return;

    onUpdateRoom({ 
      ...roomToUpdate, 
      condition: EntityCondition.Good, 
      maintenanceNotes: '' 
    });
  };

  const bedsToClean = useMemo(() => {
    const list: BedToClean[] = [];
    rooms.forEach(room => {
        room.beds.forEach(bed => {
            if (bed.status === BedStatus['Needs Cleaning']) {
                list.push({ roomId: room.id, roomName: room.name, bedId: bed.id, bedNumber: bed.number });
            }
        });
    });
    return list;
  }, [rooms]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCSV = () => {
    if (bedsToClean.length === 0) return;

    const headers = ['Room Name', 'Bed Number'];
    const csvContent = [
      headers.join(','),
      ...bedsToClean.map(bed => `"${bed.roomName.replace(/"/g, '""')}",${bed.bedNumber}`)
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      const today = new Date().toISOString().split('T')[0];
      link.setAttribute('download', `cleaning-list-${today}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleDownloadImage = () => {
    const printableArea = document.querySelector('.printable-area') as HTMLElement;
    if (!printableArea || !window.html2canvas) {
        alert("Could not generate image. The 'html2canvas' library might be missing.");
        return;
    }

    // Temporarily make it visible for capture
    printableArea.classList.remove('hidden');
    printableArea.classList.add('capture-me');

    window.html2canvas(printableArea, {
        scale: 2, // for better quality
        useCORS: true,
        backgroundColor: '#ffffff',
    }).then((canvas: HTMLCanvasElement) => {
        const link = document.createElement('a');
        link.download = `cleaning-list-${new Date().toISOString().split('T')[0]}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();

        // Hide it again
        printableArea.classList.add('hidden');
        printableArea.classList.remove('capture-me');
    }).catch((error: any) => {
        console.error("Error generating image:", error);
        alert("An error occurred while generating the image.");
        // Ensure it's hidden even if there's an error
        printableArea.classList.add('hidden');
        printableArea.classList.remove('capture-me');
    });
  };


  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Rooms & Beds</h1>
        {currentUserRole === Role.Admin && (
            <button onClick={() => handleOpenModal()} className="flex items-center justify-center sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 transition-colors">
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Room
            </button>
        )}
      </div>

      {bedsToClean.length > 0 && (
        <CleaningChecklist
          beds={bedsToClean}
          onMarkAsClean={(roomId, bedId) => handleBedStatusChange(roomId, bedId, BedStatus.Ready)}
          onPrint={handlePrint}
          onDownloadCSV={handleDownloadCSV}
          onDownloadImage={handleDownloadImage}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <div key={room.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
            <div className="p-4 border-b">
              <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">{room.name}</h3>
                    <Badge status={room.condition} />
                  </div>
                  <div className="flex space-x-2 flex-shrink-0">
                      <button onClick={() => handleOpenModal(room)} className="text-slate-500 hover:text-blue-600"><EditIcon /></button>
                      {currentUserRole === Role.Admin && (
                        <button onClick={() => onDeleteRoom(room.id)} className="text-slate-500 hover:text-red-600"><TrashIcon /></button>
                      )}
                  </div>
              </div>
            </div>
            <div className="p-4 space-y-3 flex-grow">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                   {room.beds.map(bed => (
                       <div key={bed.id} className={`flex items-center justify-between p-2 rounded-md border transition-colors ${bed.status === BedStatus['Needs Cleaning'] ? 'bg-yellow-100 border-yellow-300' : 'bg-slate-50'}`}>
                           <div className="flex items-center space-x-2">
                               <BedIcon className={`w-5 h-5 flex-shrink-0 transition-colors ${bed.status === BedStatus['Needs Cleaning'] ? 'text-yellow-600' : 'text-slate-400'}`}/>
                               <span className="text-sm font-semibold text-slate-800">Bed {bed.number}</span>
                           </div>
                           {bed.status === BedStatus.Ready ? (
                                currentUserRole === Role.Admin && (
                                   <button 
                                       onClick={() => handleBedStatusChange(room.id, bed.id, BedStatus['Needs Cleaning'])}
                                       className="px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors"
                                   >
                                       Check Out
                                   </button>
                                )
                           ) : (
                               <button 
                                   onClick={() => handleBedStatusChange(room.id, bed.id, BedStatus.Ready)}
                                   className="px-2 py-1 text-xs font-semibold text-white bg-green-500 rounded-md hover:bg-green-600 transition-colors"
                               >
                                   Mark as Clean
                               </button>
                           )}
                       </div>
                   ))}
               </div>
            </div>
            {room.maintenanceNotes && (
                <div className="p-4 bg-yellow-50 border-t space-y-2">
                    <div>
                        <p className="text-sm font-semibold text-yellow-800">Maintenance Notes:</p>
                        <p className="text-sm text-yellow-700 mt-1">{room.maintenanceNotes}</p>
                    </div>
                    <button
                        onClick={() => handleMarkAsFixed(room.id)}
                        className="w-full px-3 py-1.5 text-xs font-semibold text-white bg-green-500 rounded-md hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        Mark as Fixed
                    </button>
                </div>
            )}
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingRoom ? 'Edit Room' : 'Add New Room'}>
        <RoomForm onSubmit={handleSubmit} onClose={handleCloseModal} initialData={editingRoom} />
      </Modal>

      <PrintableCleaningList beds={bedsToClean} />
    </div>
  );
};

export default RoomManagement;