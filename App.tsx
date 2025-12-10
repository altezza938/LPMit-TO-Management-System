
import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import ProjectList from './components/ProjectList';
import ProjectMap from './components/ProjectMap';
import ProjectTimeline from './components/ProjectTimeline';
import { MOCK_DATA } from './constants';
import { ProjectFeature } from './types';
import { LayoutDashboard, Mountain, Settings, Bell, ChevronDown, Map as MapIcon, CalendarRange } from 'lucide-react';

// Define available views
type View = 'dashboard' | 'list' | 'timeline';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedFeatureId, setSelectedFeatureId] = useState<string | null>(null);
  const [projects, setProjects] = useState<ProjectFeature[]>(MOCK_DATA);

  const handleFeatureSelect = (id: string) => {
    setSelectedFeatureId(id);
    // If we're on dashboard, switch to list to see details and map
    if (currentView === 'dashboard') {
      setCurrentView('list');
    }
  };

  const handleUpdateProject = (updatedProject: ProjectFeature) => {
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-[#0f172a] text-white flex-shrink-0 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-gray-800 flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
             <Mountain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight">GeoTrack</h1>
            <p className="text-xs text-gray-400">CE 47/2022 (GE)</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              currentView === 'dashboard' 
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' 
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </button>

          <button
            onClick={() => setCurrentView('list')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              currentView === 'list' 
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' 
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <MapIcon className="w-5 h-5" />
            <span className="font-medium">Map & Tasks</span>
          </button>

          <button
            onClick={() => setCurrentView('timeline')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              currentView === 'timeline' 
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' 
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <CalendarRange className="w-5 h-5" />
            <span className="font-medium">Timeline</span>
          </button>
        </nav>

        <div className="p-4 border-t border-gray-800">
           <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white transition-colors">
              <Settings className="w-5 h-5" />
              <span className="font-medium">Settings</span>
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-20">
          <div className="flex items-center gap-4">
             {/* Mobile Menu Button Placeholder */}
             <div className="md:hidden p-2 text-gray-600">
                <LayoutDashboard className="w-6 h-6" />
             </div>
             <h2 className="text-xl font-semibold text-gray-800">
                {currentView === 'dashboard' ? 'Project Overview' : currentView === 'timeline' ? 'Milestone Timeline' : 'Draft Task Orders Management'}
             </h2>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative text-gray-500 hover:text-gray-700 transition-colors">
               <Bell className="w-5 h-5" />
               <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
               <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm">
                  AE
               </div>
               <div className="hidden sm:block text-sm">
                  <p className="font-medium text-gray-700">AECOM Team</p>
                  <p className="text-xs text-gray-500">Project Manager</p>
               </div>
               <ChevronDown className="w-4 h-4 text-gray-400 cursor-pointer" />
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto bg-[#f8fafc]">
            {currentView === 'dashboard' && (
              <div className="p-6 max-w-7xl mx-auto">
                 <Dashboard data={projects} />
              </div>
            )}
            {currentView === 'list' && (
              <div className="flex flex-col h-full">
                {/* Map Section */}
                <div className="h-1/3 min-h-[300px] w-full border-b border-gray-200 shadow-sm relative z-0">
                  <ProjectMap 
                    data={projects} 
                    selectedId={selectedFeatureId}
                    onSelectFeature={handleFeatureSelect}
                  />
                </div>
                {/* List Section */}
                <div className="flex-1 overflow-hidden p-6 bg-[#f8fafc]">
                  <ProjectList 
                    data={projects} 
                    selectedId={selectedFeatureId}
                    onSelectFeature={handleFeatureSelect}
                    onUpdateFeature={handleUpdateProject}
                  />
                </div>
              </div>
            )}
            {currentView === 'timeline' && (
              <div className="p-6 h-full">
                 <ProjectTimeline 
                    data={projects} 
                    selectedId={selectedFeatureId} 
                    onSelectProject={setSelectedFeatureId}
                 />
              </div>
            )}
        </div>
      </main>
    </div>
  );
};

export default App;
