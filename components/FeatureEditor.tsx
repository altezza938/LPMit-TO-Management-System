import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../AppContext';
import { ProjectFeature, StatusCategory } from '../types';
import { ArrowLeft, Save, UploadCloud, FileText, Trash2, CheckCircle } from 'lucide-react';

const STATUS_CATEGORIES: StatusCategory[] = ['draft', 'pending', 'submitted', 'approved', 'rejected', 'not-applicable'];

const FeatureEditor: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { state, updateFeature, pushHistory } = useAppContext();

    const [feature, setFeature] = useState<ProjectFeature | null>(null);
    const [saveSuccess, setSaveSuccess] = useState(false);

    useEffect(() => {
        const found = state.features.find(f => f.id === id);
        if (found) {
            setFeature({ ...found }); // Create a working copy
        } else {
            navigate('/table');
        }
    }, [id, state.features, navigate]);

    if (!feature) return <div className="p-8 text-center">Loading feature...</div>;

    const handleChange = (field: keyof ProjectFeature, value: any) => {
        setFeature(prev => prev ? { ...prev, [field]: value } : null);
    };

    const handleSave = () => {
        if (feature) {
            pushHistory();
            updateFeature(feature);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && feature) {
            // Create a mock URL for demonstration since we don't have a real backend
            const newDoc = {
                name: file.name,
                url: URL.createObjectURL(file), // Creates a temporary blob URL
                date: new Date().toISOString().split('T')[0]
            };

            const updatedDocs = [...(feature.documents || []), newDoc];
            handleChange('documents', updatedDocs);
        }
    };

    const removeDocument = (index: number) => {
        if (feature && feature.documents) {
            const updatedDocs = [...feature.documents];
            updatedDocs.splice(index, 1);
            handleChange('documents', updatedDocs);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-20">

            {/* Header */}
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-gray-100 sticky top-4 z-20">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                            Feature Data Entry
                            <span className="bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-md text-sm border border-indigo-100">{feature.featureNo}</span>
                        </h1>
                        <p className="text-xs text-gray-500 mt-0.5">{feature.location} • {feature.agreement}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {saveSuccess && (
                        <span className="text-emerald-600 text-sm font-bold flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 rounded-lg border border-emerald-100">
                            <CheckCircle className="w-4 h-4" /> Saved Successfully
                        </span>
                    )}
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition-colors text-sm"
                    >
                        <Save className="w-4 h-4" />
                        Save Changes
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Core Data */}
                <div className="lg:col-span-2 space-y-6">

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="border-b border-gray-100 bg-gray-50/50 px-5 py-4">
                            <h2 className="font-bold text-gray-900">Task Information</h2>
                        </div>
                        <div className="p-5 grid grid-cols-2 gap-5">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Feature No.</label>
                                <input type="text" value={feature.featureNo} onChange={e => handleChange('featureNo', e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Location</label>
                                <input type="text" value={feature.location} onChange={e => handleChange('location', e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Remarks / Notes</label>
                                <textarea rows={3} value={feature.remarks || ''} onChange={e => handleChange('remarks', e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-y" placeholder="Add engineering remarks here..."></textarea>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="border-b border-gray-100 bg-gray-50/50 px-5 py-4">
                            <h2 className="font-bold text-gray-900">Compliance & Approvals</h2>
                        </div>

                        <div className="p-5 divide-y divide-gray-100">

                            {/* S3R Row */}
                            <div className="py-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                <div className="font-medium text-sm text-gray-700">S3R Assessment</div>
                                <div className="md:col-span-2 flex gap-3">
                                    <select value={feature.s3rCategory} onChange={e => handleChange('s3rCategory', e.target.value)} className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-1/3 font-medium">
                                        {STATUS_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat.toUpperCase()}</option>)}
                                    </select>
                                    <input type="text" value={feature.s3rStatus} onChange={e => handleChange('s3rStatus', e.target.value)} placeholder="Reference / Note" className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                                </div>
                            </div>

                            {/* STLA Row */}
                            <div className="py-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                <div className="font-medium text-sm text-gray-700">STLA / XP</div>
                                <div className="md:col-span-2 flex gap-3">
                                    <select value={feature.stlaCategory} onChange={e => handleChange('stlaCategory', e.target.value)} className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-1/3 font-medium">
                                        {STATUS_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat.toUpperCase()}</option>)}
                                    </select>
                                    <input type="text" value={feature.stlaXpStatus} onChange={e => handleChange('stlaXpStatus', e.target.value)} placeholder="Reference / Note" className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                                </div>
                            </div>

                            {/* Access Row */}
                            <div className="py-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                <div className="font-medium text-sm text-gray-700">Site Access</div>
                                <div className="md:col-span-2 flex gap-3">
                                    <select value={feature.accessCategory} onChange={e => handleChange('accessCategory', e.target.value)} className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-1/3 font-medium">
                                        {STATUS_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat.toUpperCase()}</option>)}
                                    </select>
                                    <input type="text" value={feature.accessPermission} onChange={e => handleChange('accessPermission', e.target.value)} placeholder="Reference / Note" className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                                </div>
                            </div>

                        </div>
                    </div>

                </div>

                {/* Right Column: Documents */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-lg border border-slate-700 overflow-hidden text-white">
                        <div className="border-b border-slate-700/50 bg-white/5 px-5 py-4">
                            <h2 className="font-bold flex items-center gap-2">
                                <FileText className="w-4 h-4 text-indigo-400" /> Document Vault
                            </h2>
                        </div>

                        <div className="p-5">

                            {/* Upload Dropzone */}
                            <label className="border-2 border-dashed border-slate-600 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 hover:border-indigo-500 transition-colors group text-center mb-6">
                                <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-indigo-400 mb-2 transition-colors" />
                                <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">Click to upload files</span>
                                <span className="text-xs text-slate-500 mt-1">PDF, DOCX, XLSX up to 50MB</span>
                                <input type="file" className="hidden" onChange={handleFileUpload} accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg" />
                            </label>

                            {/* Document List */}
                            <div className="space-y-3">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Attached Files</h3>

                                {(!feature.documents || feature.documents.length === 0) && (
                                    <div className="text-center py-4 text-sm text-slate-500 italic">No documents uploaded yet.</div>
                                )}

                                {feature.documents?.map((doc, idx) => (
                                    <div key={idx} className="bg-white/10 rounded-lg p-3 flex items-center gap-3 border border-white/5 hover:bg-white/15 transition-colors">
                                        <div className="w-8 h-8 rounded bg-indigo-500/20 flex items-center justify-center text-indigo-300">
                                            <FileText className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <a href={doc.url} target="_blank" rel="noreferrer" className="text-sm font-medium truncate block hover:text-indigo-300 transition-colors">{doc.name}</a>
                                            <span className="text-xs text-slate-400">{doc.date}</span>
                                        </div>
                                        <button onClick={() => removeDocument(idx)} className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default FeatureEditor;
