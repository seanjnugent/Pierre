
import timelineData from './data/timelineData.json';
import charactersData from './data/charactersData.js';
import { useState, useMemo, useEffect, useRef } from 'react';
import { Calendar, User, Book, Filter, X, ChevronLeft, ChevronRight, Search, ZoomIn, ZoomOut, Play, Maximize2, Minimize2, Clock, BookOpen, Users } from 'lucide-react';


const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('timeline');
  const [selectedCharacter, setSelectedCharacter] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentCharacter, setCurrentCharacter] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [timelineZoom, setTimelineZoom] = useState(2);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const [timelinePosition, setTimelinePosition] = useState(0);
  const timelineRef = useRef(null);

  // Enrich characters with their timeline events
  const enrichedCharactersData = useMemo(() => {
    return charactersData.map(character => {
      const characterEvents = timelineData.filter(event =>
        event.characters.some(charId => charId.toLowerCase() === character.id.toLowerCase())
      );
      return { ...character, timeline: characterEvents };
    });
  }, []);

  const filteredEvents = useMemo(() => {
    if (!selectedCharacter) return timelineData;
    return timelineData.filter(event =>
      event.characters.some(charId => charId.toLowerCase() === selectedCharacter.toLowerCase())
    );
  }, [selectedCharacter]);

  const filteredCharacters = useMemo(() => {
    if (!searchTerm) return enrichedCharactersData;
    return enrichedCharactersData.filter(char =>
      char.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      char.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, enrichedCharactersData]);

  // Calculate timeline dimensions
  const minDate = useMemo(() => {
    if (filteredEvents.length === 0) return new Date();
    return new Date(Math.min(...filteredEvents.map(e => new Date(e.date).getTime())));
  }, [filteredEvents]);

  const maxDate = useMemo(() => {
    if (filteredEvents.length === 0) return new Date();
    return new Date(Math.max(...filteredEvents.map(e => new Date(e.date).getTime())));
  }, [filteredEvents]);

  const totalMs = maxDate - minDate;

  const unitMs = {
    1: 365.25 * 24 * 60 * 60 * 1000, // Year
    2: (365.25 * 24 * 60 * 60 * 1000) / 12, // Month
    3: 24 * 60 * 60 * 1000, // Day
    4: 60 * 60 * 1000 // Hour
  };

  const spacingPerUnit = {
    1: 300,
    2: 180,
    3: 100,
    4: 60
  };

  const height = useMemo(() => {
    if (totalMs <= 0) return 0;
    const units = totalMs / unitMs[timelineZoom];
    return Math.max(units * spacingPerUnit[timelineZoom], window.innerHeight);
  }, [totalMs, timelineZoom]);

  const scaleDates = useMemo(() => {
    if (totalMs <= 0) return [];
    const dates = [];
    let current = new Date(minDate);
    
    if (timelineZoom === 1) {
      current.setMonth(0, 1);
      while (current <= maxDate) {
        dates.push(new Date(current));
        current.setFullYear(current.getFullYear() + 1);
      }
    } else if (timelineZoom === 2) {
      current.setDate(1);
      while (current <= maxDate) {
        dates.push(new Date(current));
        current.setMonth(current.getMonth() + 1);
      }
    } else if (timelineZoom === 3) {
      while (current <= maxDate) {
        dates.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
    } else {
      while (current <= maxDate) {
        dates.push(new Date(current));
        current.setHours(current.getHours() + 1);
      }
    }
    return dates;
  }, [minDate, maxDate, timelineZoom]);

  const formatTimelineDate = (date) => {
    if (timelineZoom === 1) return date.getFullYear().toString();
    if (timelineZoom === 2) return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    if (timelineZoom === 3) return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const getZoomLabel = () => {
    const labels = { 1: 'Years', 2: 'Months', 3: 'Days', 4: 'Hours' };
    return labels[timelineZoom];
  };

  const handleScroll = (e) => {
    const scrollTop = e.target.scrollTop;
    const scrollHeight = e.target.scrollHeight;
    const clientHeight = e.target.clientHeight;
    setTimelinePosition(scrollTop / (scrollHeight - clientHeight));
  };

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50' : 'min-h-screen'} bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white transition-all duration-700`}>
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(120,119,198,0.1),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(59,130,246,0.1),transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_30%,rgba(255,255,255,0.02)_50%,transparent_70%)]" />
      </div>

      {/* Header */}
      <header className="relative bg-black/20 backdrop-blur-2xl border-b border-white/10 sticky top-0 z-40">
        <div className="container mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-xl">
                  <Book className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-thin tracking-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Pierre Story Manager
                </h1>
                <p className="text-sm text-white/60 mt-1">Plot and Character tracker</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <nav className="flex space-x-1 bg-white/5 backdrop-blur-sm rounded-2xl p-1 border border-white/10">
                <button
                  onClick={() => {
                    setActiveTab('timeline');
                    setSelectedEvent(null);
                  }}
                  className={`px-8 py-3 text-sm font-medium transition-all duration-500 rounded-xl relative overflow-hidden group ${
                    activeTab === 'timeline'
                      ? 'text-white bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg shadow-blue-500/25'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className="relative z-10 flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Timeline
                  </span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('characters');
                    setCurrentCharacter(null);
                  }}
                  className={`px-8 py-3 text-sm font-medium transition-all duration-500 rounded-xl relative overflow-hidden group ${
                    activeTab === 'characters'
                      ? 'text-white bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg shadow-blue-500/25'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className="relative z-10 flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    Characters
                  </span>
                </button>
              </nav>
              
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-3 text-white/60 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-300 border border-white/10"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative flex-1">
        {activeTab === 'timeline' && (
          <div className="h-full">
            {/* Timeline Controls */}
            <div className="sticky top-0 z-30 bg-black/20 backdrop-blur-2xl border-b border-white/10 p-6">
              <div className="container mx-auto flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="relative group">
                    <select
                      value={selectedCharacter}
                      onChange={(e) => setSelectedCharacter(e.target.value)}
                      className="appearance-none bg-black/30 backdrop-blur-sm border border-white/20 text-sm rounded-2xl px-6 py-4 pr-12 focus:outline-none focus:border-blue-500/50 focus:bg-black/50 transition-all duration-300 min-w-[200px]"
                    >
                      <option value="" className="bg-slate-900">All Characters</option>
                      {enrichedCharactersData.map(char => (
                        <option key={char.id} value={char.id} className="bg-slate-900">{char.name}</option>
                      ))}
                    </select>
                    <Filter className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
                  </div>
                  {selectedCharacter && (
                    <button
                      onClick={() => setSelectedCharacter('')}
                      className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-4 bg-black/30 backdrop-blur-sm rounded-2xl p-2 border border-white/20">
                    <button
                      onClick={() => setTimelineZoom(Math.max(1, timelineZoom - 1))}
                      className={`p-3 rounded-xl transition-all duration-300 ${
                        timelineZoom === 1 
                          ? 'text-white/30 cursor-not-allowed' 
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                      disabled={timelineZoom === 1}
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    <span className="text-sm text-white/90 min-w-[80px] text-center font-medium px-4">
                      {getZoomLabel()}
                    </span>
                    <button
                      onClick={() => setTimelineZoom(Math.min(4, timelineZoom + 1))}
                      className={`p-3 rounded-xl transition-all duration-300 ${
                        timelineZoom === 4 
                          ? 'text-white/30 cursor-not-allowed' 
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                      disabled={timelineZoom === 4}
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-xs text-white/60">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-4 h-4" />
                      <span>{filteredEvents.length} chapters</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline and Details */}
            <div className={`grid ${selectedEvent ? 'grid-cols-2' : 'grid-cols-1'} transition-all duration-700 ease-in-out`}>
              {/* Timeline */}
              <div className="relative">
                <div 
                  ref={timelineRef}
                  className="h-[calc(100vh-200px)] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
                  onScroll={handleScroll}
                >
                  <div className="relative px-16 py-12" style={{ height: `${Math.max(height, 800)}px` }}>
                    {/* Timeline Background Effect */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent opacity-50" />
                    
                    {/* Scale Marks */}
                    {scaleDates.map((date, index) => {
                      const position = ((date - minDate) / totalMs) * height;
                      return (
                        <div
                          key={index}
                          className="absolute left-8 text-xs text-white/60 font-medium tracking-wide"
                          style={{ top: `${position}px` }}
                        >
                          {formatTimelineDate(date)}
                        </div>
                      );
                    })}
                    
                    {/* Main Timeline Line */}
                    <div className="absolute left-24 top-0 w-0.5 bg-gradient-to-b from-blue-500/60 via-purple-500/60 to-blue-500/60" style={{ height: '100%' }} />
                    
                    {/* Timeline Glow Effect */}
                    <div className="absolute left-24 top-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-blue-500 blur-sm opacity-50" style={{ height: '100%' }} />
                    
                    {/* Events */}
                    {filteredEvents.map((event, index) => {
                      const eventDate = new Date(event.date);
                      const position = ((eventDate - minDate) / totalMs) * height;
                      const isSelected = selectedEvent?.id === event.id;
                      const isHovered = hoveredEvent?.id === event.id;
                      
                      return (
                        <div
                          key={event.id}
                          className="absolute left-24 transition-all duration-500"
                          style={{ top: `${position}px` }}
                          onMouseEnter={() => setHoveredEvent(event)}
                          onMouseLeave={() => setHoveredEvent(null)}
                        >
                          <div className="relative flex items-center group">
                            {/* Event Node */}
                            <div className={`absolute -left-3 w-6 h-6 rounded-full border-2 border-slate-900 z-20 transition-all duration-500 cursor-pointer ${
                              isSelected 
                                ? 'bg-gradient-to-r from-blue-500 to-purple-500 scale-150 shadow-lg shadow-blue-500/50' 
                                : isHovered
                                ? 'bg-gradient-to-r from-blue-400 to-purple-400 scale-125 shadow-md shadow-blue-400/50'
                                : 'bg-gradient-to-r from-blue-500/80 to-purple-500/80 hover:scale-110 hover:shadow-md hover:shadow-blue-500/30'
                            }`} />
                            
                            {/* Event Card */}
                            <div
                              className={`ml-8 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl cursor-pointer transition-all duration-700 hover:border-white/30 hover:bg-black/50 overflow-hidden ${
                                isSelected 
                                  ? 'border-blue-500/50 bg-black/60 shadow-xl shadow-blue-500/20 scale-105' 
                                  : isHovered
                                  ? 'border-white/30 bg-black/50 shadow-lg scale-102'
                                  : 'hover:scale-102'
                              }`}
                              onClick={() => setSelectedEvent(event)}
                            >
                              <div className="p-6">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-3">
                                      <span className="text-xs text-blue-400 font-medium bg-blue-500/10 px-3 py-1 rounded-full">
                                        Chapter {event.chapterNumber}
                                      </span>
                                      <span className="text-xs text-white/60">
                                        {eventDate.toLocaleDateString()}
                                      </span>
                                    </div>
                                    <h3 className="font-medium text-white mb-2 text-lg">{event.chapterTitle}</h3>
                                    {(isHovered || isSelected) && (
                                      <p className="text-sm text-white/80 leading-relaxed animate-in fade-in duration-300">
                                        {event.story.substring(0, 120)}...
                                      </p>
                                    )}
                                  </div>
                                  <div className="flex flex-col items-end space-y-2">
                                    <Play className={`w-5 h-5 text-white/40 transition-all duration-300 ${
                                      isHovered || isSelected ? 'text-blue-400 scale-110' : 'group-hover:text-white/70'
                                    }`} />
                                    <div className="flex -space-x-2">
                                      {event.characters.slice(0, 3).map((charId, i) => {
                                        const char = enrichedCharactersData.find(c => c.id === charId);
                                        return char ? (
                                          <div key={i} className="w-6 h-6 bg-white/10 rounded-full border border-white/20 overflow-hidden">
                                            <img src={char.images[0]} alt={char.name} className="w-full h-full object-cover" />
                                          </div>
                                        ) : null;
                                      })}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {/* Timeline Progress Indicator */}
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 w-1 h-32 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="w-full bg-gradient-to-b from-blue-500 to-purple-500 rounded-full transition-all duration-300"
                    style={{ height: `${timelinePosition * 100}%` }}
                  />
                </div>
              </div>
              
              {/* Event Details */}
              {selectedEvent && (
                <div className="border-l border-white/10 bg-black/20 backdrop-blur-xl animate-in slide-in-from-right duration-700">
                  <div className="sticky top-0 h-[calc(100vh-200px)] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                    <div className="p-12">
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center space-x-4">
                          <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                          <span className="text-sm text-white/60 uppercase tracking-wider">Chapter Details</span>
                        </div>
                        <button
                          onClick={() => setSelectedEvent(null)}
                          className="text-white/50 hover:text-white p-2 hover:bg-white/10 rounded-xl transition-all duration-300"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      
                      <div className="space-y-8">
                        <div className="space-y-4">
                          <div className="flex items-center space-x-4">
                            <h2 className="text-4xl font-light bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                              Chapter {selectedEvent.chapterNumber}
                            </h2>
                            <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent" />
                          </div>
                          <h3 className="text-2xl text-white/90 font-light mb-6">{selectedEvent.chapterTitle}</h3>
                          <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                            <p className="text-white/80 leading-relaxed text-lg">{selectedEvent.story}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-6">
                          <div className="flex items-center space-x-4">
                            <h4 className="text-lg font-medium text-white/90">Characters</h4>
                            <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent" />
                          </div>
                          <div className="grid gap-4">
                            {selectedEvent.characters.map(charId => {
                              const character = enrichedCharactersData.find(c => c.id.toLowerCase() === charId.toLowerCase());
                              if (!character) return null;
                              return (
                                <div
                                  key={character.id}
                                  className="group flex items-center space-x-6 p-6 bg-white/5 rounded-2xl cursor-pointer hover:bg-white/10 transition-all duration-500 border border-white/10 hover:border-white/20"
                                  onClick={() => {
                                    setActiveTab('characters');
                                    setCurrentCharacter(character);
                                  }}
                                >
                                  <div className="w-16 h-16 bg-white/10 rounded-2xl overflow-hidden flex-shrink-0 relative">
                                    <img
                                      src={character.images[0]}
                                      alt={character.name}
                                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h5 className="font-medium text-white text-lg">{character.name}</h5>
                                    <p className="text-sm text-white/70 mt-1">{character.description}</p>
                                  </div>
                                  <ChevronRight className="w-6 h-6 text-white/40 group-hover:text-white/70 transition-all duration-300 group-hover:translate-x-1" />
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'characters' && (
          <div className="p-8">
            {!currentCharacter ? (
              <div className="space-y-8">
                <div className="relative max-w-md">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                  <input
                    type="text"
                    placeholder="Search characters..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-black/30 backdrop-blur-sm border border-white/20 rounded-2xl pl-12 pr-6 py-4 text-sm focus:outline-none focus:border-blue-500/50 focus:bg-black/50 transition-all duration-300"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {filteredCharacters.map(character => (
                    <div
                      key={character.id}
                      className="group cursor-pointer"
                      onClick={() => {
                        setCurrentCharacter(character);
                        setCurrentImageIndex(0);
                      }}
                    >
                      <div className="relative aspect-[3/4] bg-black/30 backdrop-blur-sm border border-white/20 rounded-3xl overflow-hidden mb-6 transition-all duration-700 group-hover:border-white/40 group-hover:shadow-2xl group-hover:shadow-blue-500/20 group-hover:scale-105">
                        <img
                          src={character.images[0]}
                          alt={character.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                            <h3 className="font-medium text-white text-lg mb-2">{character.name}</h3>
                            <p className="text-sm text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                              {character.description}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-white/60">
                            {character.timeline.length} appearances
                          </span>
                          <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-white/70 transition-colors duration-300" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <button
                  onClick={() => setCurrentCharacter(null)}
                  className="flex items-center text-white/60 hover:text-white transition-all duration-300 group bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl"
                >
                  <ChevronLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                  Back to characters
                </button>
                
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                  <div className="lg:col-span-2">
                    <div className="sticky top-32 space-y-6">
                      <div className="aspect-[3/4] bg-black/30 backdrop-blur-sm border border-white/20 rounded-3xl overflow-hidden">
                        <img
                          src={currentCharacter.images[currentImageIndex]}
                          alt={currentCharacter.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {currentCharacter.images.length > 1 && (
                        <div className="flex justify-center items-center space-x-6">
                          <button
                            onClick={() => setCurrentImageIndex(prev =>
                              prev === 0 ? currentCharacter.images.length - 1 : prev - 1
                            )}
                            className="p-3 text-white/60 hover:text-white hover:bg-white/10 rounded-2xl transition-all duration-300"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                          <div className="flex space-x-2">
                            {currentCharacter.images.map((_, index) => (
                              <button
                                key={index}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                  index === currentImageIndex ? 'bg-blue-500 scale-125' : 'bg-white/40 hover:bg-white/70'
                                }`}
                              />
                            ))}
                          </div>
                          <button
                            onClick={() => setCurrentImageIndex(prev =>
                              prev === currentCharacter.images.length - 1 ? 0 : prev + 1
                            )}
                            className="p-3 text-white/60 hover:text-white hover:bg-white/10 rounded-2xl transition-all duration-300"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="lg:col-span-3 space-y-8">
                    <div>
                      <h2 className="text-5xl font-light mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                        {currentCharacter.name}
                      </h2>
                      <p className="text-xl text-white/80 leading-relaxed">{currentCharacter.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-8">
                        <div className="bg-black/30 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                          <h3 className="text-sm font-medium text-white/60 mb-4 uppercase tracking-wider flex items-center">
                            <User className="w-4 h-4 mr-2" />
                            Biography
                          </h3>
                          <p className="text-white/80 leading-relaxed">{currentCharacter.bio}</p>
                        </div>
                        
                        <div className="bg-black/30 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                          <h3 className="text-sm font-medium text-white/60 mb-4 uppercase tracking-wider">Traits</h3>
                          <div className="flex flex-wrap gap-2">
                            {currentCharacter.traits.map((trait, index) => (
                              <span key={index} className="px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full text-sm text-white/90 hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-300">
                                {trait}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="bg-black/30 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                          <h3 className="text-sm font-medium text-white/60 mb-4 uppercase tracking-wider">Appearance</h3>
                          <div className="space-y-3">
                            {Object.entries(currentCharacter.appearance).map(([key, value]) => (
                              <div key={key} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                                <span className="text-white/70 capitalize font-medium">{key}</span>
                                <span className="text-white">{value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-8">
                        <div className="bg-black/30 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                          <h3 className="text-sm font-medium text-white/60 mb-4 uppercase tracking-wider">Psychology</h3>
                          <div className="space-y-4">
                            <div>
                              <p className="text-white/80 mb-3 font-medium">Personality</p>
                              <div className="flex flex-wrap gap-2">
                                {currentCharacter.psyche.personality.map((trait, i) => (
                                  <span key={i} className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs text-white/90">
                                    {trait}
                                  </span>
                                ))}
                              </div>
                            </div>
                            {currentCharacter.psyche.quirks && (
                              <div>
                                <p className="text-white/80 mb-3 font-medium">Quirks</p>
                                <div className="flex flex-wrap gap-2">
                                  {currentCharacter.psyche.quirks.map((quirk, i) => (
                                    <span key={i} className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs text-white/90">
                                      {quirk}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="bg-black/30 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                          <h3 className="text-sm font-medium text-white/60 mb-4 uppercase tracking-wider">Relationships</h3>
                          <div className="space-y-3">
                            {Object.entries(currentCharacter.relationships).map(([name, relation]) => (
                              <div key={name} className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors duration-300">
                                <span className="font-medium text-white">{name}</span>
                                <span className="text-sm text-white/60">{relation}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-black/30 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
                      <h3 className="text-xl font-light mb-6 flex items-center">
                        <BookOpen className="w-6 h-6 mr-3" />
                        Story Appearances
                      </h3>
                      <div className="space-y-4">
                        {currentCharacter.timeline.map(event => (
                          <div
                            key={event.id}
                            className="p-6 bg-white/5 border border-white/10 rounded-2xl cursor-pointer hover:bg-white/10 hover:border-white/20 transition-all duration-500 group"
                            onClick={() => {
                              setActiveTab('timeline');
                              setSelectedEvent(event);
                            }}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-3">
                                  <span className="text-xs text-blue-400 font-medium bg-blue-500/10 px-3 py-1 rounded-full">
                                    Chapter {event.chapterNumber}
                                  </span>
                                  <span className="text-xs text-white/60">
                                    {new Date(event.date).toLocaleDateString()}
                                  </span>
                                </div>
                                <h4 className="font-medium text-white mb-2 text-lg">{event.chapterTitle}</h4>
                                <p className="text-sm text-white/70 line-clamp-2 leading-relaxed">{event.story}</p>
                              </div>
                              <ChevronRight className="w-6 h-6 text-white/40 group-hover:text-white/70 transition-all duration-300 flex-shrink-0 ml-4 group-hover:translate-x-1" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;