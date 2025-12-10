
import React, { useState, useEffect, useRef } from 'react';
import { ProjectFeature, StatusCategory } from '../types';
import StatusBadge from './StatusBadge';
import { Search, Filter, Download, MapPin, Edit2, Save, X, Check } from 'lucide-react';

interface ProjectListProps {
  data: ProjectFeature[];
  selectedId: string | null;
  onSelectFeature: (id: string) => void;
  onUpdateFeature: (feature: ProjectFeature) => void;
}

const STATUS_OPTIONS: StatusCategory[] = ['approved', 'submitted', 'pending', 'rejected', 'draft', 'not-applicable'];

const ProjectList: React.FC<ProjectListProps> = ({ data, selectedId, onSelectFeature, onUpdateFeature }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<ProjectFeature | null>(null);
  const rowRefs = useRef<{ [key: string]: HTMLTableRowElement | null }>({});

  const filteredData = data.filter(item => {
    const matchesSearch = 
      item.featureNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || item.s3rCategory === filterStatus;

    return matchesSearch && matchesFilter;
  });

  // Scroll to selected item
  useEffect(() => {
    if (selectedId && rowRefs.current[selectedId] && !editingId) {
      rowRefs.current[selectedId]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [selectedId, editingId]);

  const handleEditClick = (e: React.MouseEvent, feature: ProjectFeature) => {
    e.stopPropagation();
    setEditingId(feature.id);
    setEditForm({ ...feature });
  };

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (editForm) {
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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
      {/* Header Controls */}
      <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white rounded-t-xl">
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition duration-150 ease-in-out"
            placeholder="Search Feature No. or Location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-4 w-4 text-gray-500" />
             </div>
             <select 
                className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
             >
                <option value="all">All S3R Status</option>
                <option value="approved">Approved</option>
                <option value="submitted">Submitted</option>
                <option value="pending">Pending</option>
                <option value="draft">Draft</option>
             </select>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Table Area */}
      <div className="overflow-auto flex-1 custom-scrollbar">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Actions</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">No.</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">Feature No.</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[300px]">Location</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-64">S3R Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-64">STLA / XP</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">Access</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">Eng. Plan</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">TPRP</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.map((row) => {
              const isEditing = editingId === row.id;

              return (
                <tr 
                  key={row.id} 
                  ref={(el) => { rowRefs.current[row.id] = el; }}
                  onClick={() => !isEditing && onSelectFeature(row.id)}
                  className={`transition-colors ${
                    isEditing ? 'bg-amber-50' : 
                    selectedId === row.id ? 'bg-emerald-50 ring-1 ring-inset ring-emerald-200 cursor-pointer' : 'hover:bg-gray-50 cursor-pointer'
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    {isEditing ? (
                      <div className="flex gap-2">
                        <button 
                          onClick={handleSaveClick}
                          className="p-1.5 rounded-full bg-emerald-100 text-emerald-600 hover:bg-emerald-200"
                          title="Save"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={handleCancelClick}
                          className="p-1.5 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                          title="Cancel"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        {selectedId === row.id && <MapPin className="w-4 h-4 text-emerald-600" />}
                        <button 
                          onClick={(e) => handleEditClick(e, row)}
                          className="p-1.5 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors opacity-0 group-hover:opacity-100 row-hover-btn"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                    {row.no}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    {isEditing ? (
                      <input 
                        type="text" 
                        className="w-full text-sm border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                        value={editForm?.featureNo || ''}
                        onChange={(e) => handleInputChange('featureNo', e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <span className="text-sm font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded">
                        {row.featureNo}
                      </span>
                    )}
                  </td>
                  
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {isEditing ? (
                      <textarea 
                        className="w-full text-sm border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                        rows={2}
                        value={editForm?.location || ''}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <div className="line-clamp-2" title={row.location}>
                        {row.location}
                      </div>
                    )}
                  </td>
                  
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {isEditing ? (
                      <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                        <select 
                          className="w-full text-xs border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500 mb-1"
                          value={editForm?.s3rCategory || 'draft'}
                          onChange={(e) => handleInputChange('s3rCategory', e.target.value as any)}
                        >
                          {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                        <input 
                          type="text"
                          className="w-full text-xs border-gray-300 rounded-md"
                          value={editForm?.s3rStatus || ''}
                          onChange={(e) => handleInputChange('s3rStatus', e.target.value)}
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col items-start gap-1">
                        <StatusBadge status={row.s3rCategory} />
                        <span className="text-xs text-gray-500 mt-1">{row.s3rStatus}</span>
                      </div>
                    )}
                  </td>
                  
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {isEditing ? (
                       <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                        <select 
                          className="w-full text-xs border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500 mb-1"
                          value={editForm?.stlaCategory || 'draft'}
                          onChange={(e) => handleInputChange('stlaCategory', e.target.value as any)}
                        >
                          {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                        <input 
                          type="text"
                          className="w-full text-xs border-gray-300 rounded-md"
                          value={editForm?.stlaXpStatus || ''}
                          onChange={(e) => handleInputChange('stlaXpStatus', e.target.value)}
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col items-start gap-1">
                        <StatusBadge status={row.stlaCategory} />
                        <span className="text-xs text-gray-500 mt-1">{row.stlaXpStatus}</span>
                      </div>
                    )}
                  </td>
                  
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {isEditing ? (
                      <textarea
                        className="w-full text-xs border-gray-300 rounded-md"
                        rows={2}
                        value={editForm?.accessPermission || ''}
                        onChange={(e) => handleInputChange('accessPermission', e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <span className="block min-w-[150px]">{row.accessPermission}</span>
                    )}
                  </td>
                  
                  <td className="px-6 py-4 text-sm text-gray-600">
                     {isEditing ? (
                       <input 
                        type="text"
                        className="w-full text-xs border-gray-300 rounded-md"
                        value={editForm?.engineeringPlan || ''}
                        onChange={(e) => handleInputChange('engineeringPlan', e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                       />
                     ) : (
                        row.engineeringPlan
                     )}
                  </td>
                  
                  <td className="px-6 py-4 text-sm text-gray-600">
                     {isEditing ? (
                       <input 
                        type="text"
                        className="w-full text-xs border-gray-300 rounded-md"
                        value={editForm?.tprpStatus || ''}
                        onChange={(e) => handleInputChange('tprpStatus', e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                       />
                     ) : (
                        row.tprpStatus
                     )}
                  </td>
                </tr>
              );
            })}
            {filteredData.length === 0 && (
                <tr>
                    <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                        No features found matching your search.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Footer / Pagination Placeholder */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl flex justify-between items-center text-xs text-gray-500">
        <span>Showing {filteredData.length} of {data.length} entries</span>
        <div className="flex gap-2">
            <button disabled className="px-3 py-1 border rounded bg-white text-gray-300 cursor-not-allowed">Previous</button>
            <button disabled className="px-3 py-1 border rounded bg-white text-gray-300 cursor-not-allowed">Next</button>
        </div>
      </div>
      
      <style>{`
        tr:hover .row-hover-btn {
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default ProjectList;
