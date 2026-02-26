import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { ProjectFeature, StatusCategory } from '../types';
import StatusBadge from './StatusBadge';
import { Search, Filter, Download, MapPin, Edit2, X, Check, CheckSquare, Square, Undo2, Redo2, GripVertical, GripHorizontal, FileStack, LayoutPanelLeft } from 'lucide-react';
import { useAppContext } from '../AppContext';
import { useNavigate } from 'react-router-dom';

import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    DragOverlay
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    horizontalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ProjectListProps {
    data: ProjectFeature[];
    selectedId: string | null;
    onSelectFeature: (id: string) => void;
    onUpdateFeature: (feature: ProjectFeature) => void;
    onToggleAccepted: (id: string) => void;
    fullTable?: boolean;
}

const STATUS_OPTIONS: StatusCategory[] = ['approved', 'submitted', 'pending', 'rejected', 'draft', 'not-applicable'];

const DEFAULT_COLUMNS = [
    { id: 'featureNo', label: 'Feature No.', width: 'w-32', isSticky: true },
    { id: 'accepted', label: 'Accepted', width: 'w-24', isSticky: false },
    { id: 'taskOrder', label: 'Task Order', width: 'w-28', isSticky: false },
    { id: 'location', label: 'Location', width: 'min-w-[200px]', isSticky: false },
    { id: 's3r', label: 'S3R', width: 'w-48', isSticky: false },
    { id: 'stla', label: 'STLA / XP', width: 'w-48', isSticky: false },
    { id: 'access', label: 'Access', width: 'w-48', isSticky: false },
    { id: 'engPlan', label: 'Eng. Plan', width: 'w-40', isSticky: false },
    { id: 'tprp', label: 'TPRP TWVP', width: 'w-40', isSticky: false },
    { id: 'tprpMr', label: 'TPRP MR', width: 'w-36', isSticky: false },
    { id: 'hssp', label: 'HSSP', width: 'w-36', isSticky: false }
];

// --- Sortable Header Component ---
const SortableHeader: React.FC<{ col: any }> = ({ col }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: col.id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
        zIndex: isDragging ? 50 : (col.isSticky ? 20 : 10),
    };
    return (
        <th
            ref={setNodeRef}
            style={style}
            className={`px-3 py-3 text-left text-[11px] font-bold text-slate-600 uppercase tracking-wider ${col.width} bg-slate-50 border-b border-slate-200 ${col.isSticky ? 'sticky left-12 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]' : ''}`}
        >
            <div className="flex items-center gap-2">
                <button {...attributes} {...listeners} className="cursor-grab hover:text-indigo-500 text-slate-400 P-0.5 rounded touch-none">
                    <GripHorizontal className="w-3.5 h-3.5" />
                </button>
                {col.label}
            </div>
        </th>
    );
};

// --- Sortable Row Component ---
const SortableRow: React.FC<{
    row: ProjectFeature;
    index: number;
    columns: any[];
    isEditing: boolean;
    selectedId: string | null;
    onSelectFeature: (id: string) => void;
    onEditClick: (e: React.MouseEvent, row: ProjectFeature) => void;
    onSaveClick: (e: React.MouseEvent) => void;
    onCancelClick: (e: React.MouseEvent) => void;
    onToggleAccepted: (id: string) => void;
    editForm: ProjectFeature | null;
    handleInputChange: (field: keyof ProjectFeature, value: string) => void;
    relevantTaskOrders: any[];
    navigate: ReturnType<typeof useNavigate>;
}> = (props) => {
    const { row, index, columns, isEditing, selectedId, onSelectFeature, onEditClick, onSaveClick, onCancelClick, onToggleAccepted, editForm, handleInputChange, relevantTaskOrders, navigate } = props;

    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: row.id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 40 : 1,
    };

    const toObj = relevantTaskOrders.find(t => t.id === row.taskOrderId);

    const StatusCell: React.FC<{ category: StatusCategory; text: string }> = ({ category, text }) => (
        <div className="flex flex-col items-start gap-1">
            <StatusBadge status={category} />
            <span className="text-[11px] text-slate-500 leading-tight block truncate max-w-full" title={text}>{text || '-'}</span>
        </div>
    );

    const EditStatusCell: React.FC<{ categoryField: keyof ProjectFeature; textField: keyof ProjectFeature }> = ({ categoryField, textField }) => (
        <div className="space-y-1.5" onClick={(e) => e.stopPropagation()}>
            <select className="w-full text-xs border border-indigo-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-indigo-500 outline-none bg-white shadow-sm" value={(editForm as any)?.[categoryField] || 'draft'} onChange={(e) => handleInputChange(categoryField, e.target.value)}>
                {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt.toUpperCase()}</option>)}
            </select>
            <input type="text" className="w-full text-xs border border-indigo-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-indigo-500 outline-none bg-white shadow-sm" value={(editForm as any)?.[textField] || ''} onChange={(e) => handleInputChange(textField, e.target.value)} placeholder="Notes..." />
        </div>
    );

    return (
        <tr
            ref={setNodeRef}
            style={style}
            onClick={() => !isEditing && onSelectFeature(row.id)}
            className={`transition-colors group ${isEditing ? 'bg-indigo-50/60' : selectedId === row.id ? 'bg-emerald-50' : index % 2 === 0 ? 'bg-white hover:bg-slate-50' : 'bg-slate-50/50 hover:bg-slate-50'} cursor-default`}
        >
            <td className="px-2 py-3 border-b border-slate-100 bg-inherit sticky left-0 z-20 w-12 text-center" onClick={e => e.stopPropagation()}>
                <div className="flex flex-col items-center gap-2">
                    <button {...attributes} {...listeners} className="cursor-grab text-slate-300 hover:text-indigo-500 touch-none">
                        <GripVertical className="w-4 h-4" />
                    </button>
                    <div className="text-[10px] text-slate-400 font-bold">{row.no}</div>
                </div>
            </td>

            {columns.map(col => {
                let content = null;

                switch (col.id) {
                    case 'featureNo':
                        content = (
                            <div className="flex items-center gap-2 justify-between">
                                <span className="text-sm font-black text-slate-800 bg-slate-100 px-2 py-1 rounded shadow-sm border border-slate-200">{row.featureNo}</span>
                                {isEditing ? (
                                    <div className="flex gap-1">
                                        <button onClick={onSaveClick} className="p-1.5 bg-emerald-500 text-white rounded shadow hover:bg-emerald-600 transition-colors"><Check className="w-3.5 h-3.5" /></button>
                                        <button onClick={onCancelClick} className="p-1.5 bg-rose-500 text-white rounded shadow hover:bg-rose-600 transition-colors"><X className="w-3.5 h-3.5" /></button>
                                    </div>
                                ) : (
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={(e) => onEditClick(e, row)} className="p-1.5 bg-white border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 rounded text-slate-500 shadow-sm"><Edit2 className="w-3.5 h-3.5" /></button>
                                        <button onClick={(e) => { e.stopPropagation(); navigate(`/feature/${row.id}/edit`); }} className="p-1.5 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-600 rounded shadow-sm" title="Open Detailed Editor"><FileStack className="w-3.5 h-3.5" /></button>
                                    </div>
                                )}
                            </div>
                        );
                        break;
                    case 'accepted':
                        content = (
                            <div className="flex flex-col items-center">
                                <button onClick={(e) => { e.stopPropagation(); onToggleAccepted(row.id); }} className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${row.accepted ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30' : 'bg-slate-100 text-slate-400 border border-slate-200 hover:bg-slate-200'}`}>
                                    {row.accepted ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                                </button>
                                {row.accepted && row.acceptedDate && <span className="text-[9px] text-emerald-600 font-bold mt-1">{row.acceptedDate}</span>}
                            </div>
                        );
                        break;
                    case 'taskOrder':
                        content = isEditing ? (
                            <select className="w-full text-xs border border-indigo-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-indigo-500 bg-white" value={editForm?.taskOrderId || ''} onChange={(e) => handleInputChange('taskOrderId', e.target.value)} onClick={e => e.stopPropagation()}>
                                <option value="">Unassigned</option>
                                {relevantTaskOrders.map(t => <option key={t.id} value={t.id}>{t.toNo}</option>)}
                            </select>
                        ) : toObj ? (
                            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-1 rounded break-words">{toObj.toNo}</span>
                        ) : <span className="text-xs text-slate-400 italic">Unassigned</span>;
                        break;
                    case 'location':
                        content = isEditing ? (
                            <textarea className="w-full text-xs border border-indigo-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-indigo-500 bg-white" rows={2} value={editForm?.location || ''} onChange={(e) => handleInputChange('location', e.target.value)} onClick={e => e.stopPropagation()} />
                        ) : <div className="text-xs text-slate-600 line-clamp-2 leading-relaxed" title={row.location}>{row.location}</div>;
                        break;
                    case 's3r':
                        content = isEditing ? <EditStatusCell categoryField="s3rCategory" textField="s3rStatus" /> : <StatusCell category={row.s3rCategory} text={row.s3rStatus} />;
                        break;
                    case 'stla':
                        content = isEditing ? <EditStatusCell categoryField="stlaCategory" textField="stlaXpStatus" /> : <StatusCell category={row.stlaCategory} text={row.stlaXpStatus} />;
                        break;
                    case 'access':
                        content = isEditing ? <EditStatusCell categoryField="accessCategory" textField="accessPermission" /> : <StatusCell category={row.accessCategory} text={row.accessPermission} />;
                        break;
                    case 'engPlan':
                        content = isEditing ? <EditStatusCell categoryField="engineeringPlanCategory" textField="engineeringPlan" /> : <StatusCell category={row.engineeringPlanCategory} text={row.engineeringPlan} />;
                        break;
                    case 'tprp':
                        content = isEditing ? <EditStatusCell categoryField="tprpTwvpCategory" textField="tprpTwvp" /> : <StatusCell category={row.tprpTwvpCategory} text={row.tprpTwvp} />;
                        break;
                    case 'tprpMr':
                        content = isEditing ? <EditStatusCell categoryField="tprpMrCategory" textField="tprpMr" /> : <StatusCell category={row.tprpMrCategory} text={row.tprpMr} />;
                        break;
                    case 'hssp':
                        content = isEditing ? <EditStatusCell categoryField="hsspCategory" textField="hsspStatus" /> : <StatusCell category={row.hsspCategory} text={row.hsspStatus} />;
                        break;
                }

                return (
                    <td key={col.id} className={`px-3 py-3 border-b border-slate-100 ${col.isSticky ? 'sticky left-12 bg-inherit shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] z-10' : ''}`}>
                        {content}
                    </td>
                );
            })}
        </tr>
    );
};


const ProjectList: React.FC<ProjectListProps> = ({ data, selectedId, onSelectFeature, onUpdateFeature, onToggleAccepted, fullTable }) => {
    const { state, undoStack, redoStack, undo, redo, pushHistory } = useAppContext();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [filterAccepted, setFilterAccepted] = useState<string>('all');
    const [filterTaskOrder, setFilterTaskOrder] = useState<string>('all');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<ProjectFeature | null>(null);

    // Local state for drag and drop ordering
    const [columns, setColumns] = useState(DEFAULT_COLUMNS);
    const [orderedData, setOrderedData] = useState<ProjectFeature[]>(data);

    // Sync orderedData when source data changes
    useEffect(() => {
        setOrderedData(data);
    }, [data]);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const relevantTaskOrders = state.activeAgreementId
        ? state.taskOrders.filter(to => to.agreementId === state.activeAgreementId)
        : state.taskOrders;

    const filteredData = orderedData.filter(item => {
        const matchesSearch =
            item.featureNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || item.s3rCategory === filterStatus;
        const matchesAccepted = filterAccepted === 'all' ||
            (filterAccepted === 'accepted' && item.accepted) ||
            (filterAccepted === 'not-accepted' && !item.accepted);
        const matchesTaskOrder = filterTaskOrder === 'all' || item.taskOrderId === filterTaskOrder || (!item.taskOrderId && filterTaskOrder === 'unassigned');

        return matchesSearch && matchesStatus && matchesAccepted && matchesTaskOrder;
    });

    const handleEditClick = (e: React.MouseEvent, feature: ProjectFeature) => {
        e.stopPropagation();
        setEditingId(feature.id);
        setEditForm({ ...feature });
    };

    const handleSaveClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (editForm) {
            pushHistory(); // Record state before saving
            onUpdateFeature(editForm);
            setEditingId(null);
            setEditForm(null);
        }
    };

    const handleCancelClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingId(null);
        setEditForm(null);
    };

    const handleInputChange = (field: keyof ProjectFeature, value: string) => {
        if (editForm) {
            setEditForm({ ...editForm, [field]: value });
        }
    };

    const handleDragEndRow = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setOrderedData((items) => {
                const oldIndex = items.findIndex(i => i.id === active.id);
                const newIndex = items.findIndex(i => i.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const handleDragEndCol = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setColumns((items) => {
                const oldIndex = items.findIndex(i => i.id === active.id);
                const newIndex = items.findIndex(i => i.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const exportCSV = useCallback(() => {
        // Basic CSV export logic retained
        const headers = columns.map(c => c.label);
        const rows = filteredData.map(d => {
            return columns.map(c => {
                if (c.id === 'taskOrder') {
                    const toObj = relevantTaskOrders.find(t => t.id === d.taskOrderId);
                    return toObj ? `"${toObj.toNo}"` : 'Unassigned';
                }
                if (c.id === 'featureNo') return d.featureNo;
                if (c.id === 'location') return `"${d.location}"`;
                if (c.id === 'accepted') return d.accepted ? 'Yes' : 'No';
                if (c.id === 's3r') return `"${d.s3rStatus}"`;
                if (c.id === 'stla') return `"${d.stlaXpStatus}"`;
                if (c.id === 'access') return `"${d.accessPermission}"`;
                if (c.id === 'engPlan') return `"${d.engineeringPlan}"`;
                if (c.id === 'tprp') return `"${d.tprpTwvp}"`;
                if (c.id === 'tprpMr') return `"${d.tprpMr}"`;
                if (c.id === 'hssp') return `"${d.hsspStatus}"`;
                return '';
            })
        });
        const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'LPMit_TOMS_Features_Export.csv';
        a.click();
        URL.revokeObjectURL(url);
    }, [filteredData, columns, relevantTaskOrders]);

    const acceptedCount = data.filter(d => d.accepted).length;

    return (
        <div className={`bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col ${fullTable ? 'h-full' : 'h-full'}`}>

            {/* Action / History Bar */}
            <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 rounded-t-2xl flex items-center justify-between no-print">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-slate-800 rounded-lg p-1 border border-slate-700">
                        <button
                            onClick={undo}
                            disabled={undoStack.length === 0}
                            className="p-1.5 rounded text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                            title="Undo Edit"
                        >
                            <Undo2 className="w-4 h-4" />
                        </button>
                        <div className="w-px h-4 bg-slate-700"></div>
                        <button
                            onClick={redo}
                            disabled={redoStack.length === 0}
                            className="p-1.5 rounded text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                            title="Redo Edit"
                        >
                            <Redo2 className="w-4 h-4" />
                        </button>
                    </div>
                    {undoStack.length > 0 && (
                        <span className="text-xs font-medium text-emerald-400">Unsaved changes tracked in session history</span>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium border border-slate-700 transition-colors">
                        <LayoutPanelLeft className="w-4 h-4" /> Reset Layout
                    </button>
                </div>
            </div>

            {/* Filter Header */}
            <div className="p-3 border-b border-slate-100 flex flex-col lg:flex-row gap-3 justify-between items-center bg-white no-print">
                <div className="relative w-full lg:w-72">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 text-sm transition duration-150"
                        placeholder="Search Feature No. or Location..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex gap-2 w-full lg:w-auto flex-wrap items-center">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                            <Filter className="h-3.5 w-3.5 text-slate-500" />
                        </div>
                        <select className="pl-8 pr-6 py-2 border border-slate-200 rounded-xl bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer" value={filterTaskOrder} onChange={(e) => setFilterTaskOrder(e.target.value)}>
                            <option value="all">All Task Orders</option>
                            <option value="unassigned">Unassigned</option>
                            {relevantTaskOrders.map(to => <option key={to.id} value={to.id}>{to.toNo}</option>)}
                        </select>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                            <Filter className="h-3.5 w-3.5 text-slate-500" />
                        </div>
                        <select className="pl-8 pr-6 py-2 border border-slate-200 rounded-xl bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                            <option value="all">All S3R Status</option>
                            <option value="approved">Approved</option>
                            <option value="pending">Pending</option>
                        </select>
                    </div>
                    <button onClick={exportCSV} className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-sm font-semibold rounded-xl transition-all shadow-sm ml-auto lg:ml-0">
                        <Download className="h-3.5 w-3.5" /> Export
                    </button>
                </div>
            </div>

            {/* Presentation Table */}
            <div className="overflow-x-auto flex-1 custom-scrollbar w-full">
                <table className="w-max min-w-full text-left border-collapse">
                    <thead>
                        <tr>
                            <th className="px-2 py-3 bg-slate-50 border-b border-slate-200 sticky left-0 z-30 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] w-12">
                                {/* Reorder Handle Column */}
                            </th>
                            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEndCol}>
                                <SortableContext items={columns.map(c => c.id)} strategy={horizontalListSortingStrategy}>
                                    {columns.map(col => (
                                        <SortableHeader key={col.id} col={col} />
                                    ))}
                                </SortableContext>
                            </DndContext>
                        </tr>
                    </thead>
                    <tbody>
                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEndRow}>
                            <SortableContext items={filteredData.map(f => f.id)} strategy={verticalListSortingStrategy}>
                                {filteredData.map((row, index) => (
                                    <SortableRow
                                        key={row.id}
                                        row={row}
                                        index={index}
                                        columns={columns}
                                        isEditing={editingId === row.id}
                                        selectedId={selectedId}
                                        onSelectFeature={onSelectFeature}
                                        onEditClick={handleEditClick}
                                        onSaveClick={handleSaveClick}
                                        onCancelClick={handleCancelClick}
                                        onToggleAccepted={onToggleAccepted}
                                        editForm={editForm}
                                        handleInputChange={handleInputChange}
                                        relevantTaskOrders={relevantTaskOrders}
                                        navigate={navigate}
                                    />
                                ))}
                                {filteredData.length === 0 && (
                                    <tr>
                                        <td colSpan={columns.length + 1} className="px-6 py-12 text-center text-slate-400">
                                            No features found matching current constraints.
                                        </td>
                                    </tr>
                                )}
                            </SortableContext>
                        </DndContext>
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default ProjectList;
