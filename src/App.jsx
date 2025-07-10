
import timelineData from './data/timelineData.json';
import charactersData from './data/charactersData.js';
import { useState, useMemo } from 'react';
import { Calendar, User, Book, Filter, X, ChevronLeft, ChevronRight, Search, ZoomIn, ZoomOut, Play } from 'lucide-react';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('timeline');
  const [selectedCharacter, setSelectedCharacter] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentCharacter, setCurrentCharacter] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [timelineZoom, setTimelineZoom] = useState(1);

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
    1: 365.25 * 24 * 60 * 60 * 1000,
    2: (365.25 * 24 * 60 * 60 * 1000) / 12,
    3: 24 * 60 * 60 * 1000
  };

  const spacingPerUnit = {
    1: 200,
    2: 100,
    3: 50
  };

  const height = useMemo(() => {
    if (totalMs <= 0) return 0;
    const units = totalMs / unitMs[timelineZoom];
    return units * spacingPerUnit[timelineZoom];
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
    } else {
      while (current <= maxDate) {
        dates.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
    }
    return dates;
  }, [minDate, maxDate, timelineZoom]);

  const formatTimelineDate = (date) => {
    if (timelineZoom === 1) return date.getFullYear().toString();
    if (timelineZoom === 2) return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-black/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
        <div className="container mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <Book className="w-5 h-5 text-black" />
              </div>
              <h1 className="text-2xl font-light tracking-tight">Story Manager</h1>
            </div>
            <nav className="flex space-x-1 bg-white/5 rounded-2xl p-1">
              <button
                onClick={() => {
                  setActiveTab('timeline');
                  setSelectedEvent(null);
                }}
                className={`px-8 py-3 text-sm font-medium transition-all duration-300 rounded-xl ${
                  activeTab === 'timeline'
                    ? 'text-black bg-white shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                Timeline
              </button>
              <button
                onClick={() => {
                  setActiveTab('characters');
                  setCurrentCharacter(null);
                }}
                className={`px-8 py-3 text-sm font-medium transition-all duration-300 rounded-xl ${
                  activeTab === 'characters'
                    ? 'text-black bg-white shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                Characters
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-8 py-12">
        {activeTab === 'timeline' && (
          <>
            {/* Timeline Controls */}
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <select
                    value={selectedCharacter}
                    onChange={(e) => setSelectedCharacter(e.target.value)}
                    className="appearance-none bg-white/5 border border-white/10 text-sm rounded-2xl px-6 py-3 pr-12 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all duration-300"
                  >
                    <option value="">All Characters</option>
                    {enrichedCharactersData.map(char => (
                      <option key={char.id} value={char.id} className="bg-gray-900">{char.name}</option>
                    ))}
                  </select>
                  <Filter className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
                </div>
                {selectedCharacter && (
                  <button
                    onClick={() => setSelectedCharacter('')}
                    className="text-white/50 hover:text-white p-2 hover:bg-white/10 rounded-xl transition-all duration-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="flex items-center space-x-4 bg-white/5 rounded-2xl p-1">
                <button
                  onClick={() => setTimelineZoom(Math.max(1, timelineZoom - 1))}
                  className={`p-3 rounded-xl transition-all duration-300 ${
                    timelineZoom === 1 ? 'text-white/30' : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                  disabled={timelineZoom === 1}
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-sm text-white/70 min-w-[70px] text-center font-medium">
                  {timelineZoom === 1 ? 'Years' : timelineZoom === 2 ? 'Months' : 'Days'}
                </span>
                <button
                  onClick={() => setTimelineZoom(Math.min(3, timelineZoom + 1))}
                  className={`p-3 rounded-xl transition-all duration-300 ${
                    timelineZoom === 3 ? 'text-white/30' : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                  disabled={timelineZoom === 3}
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Timeline and Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="overflow-hidden">
                <div className="overflow-y-auto h-[75vh] scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                  <div className="relative pr-4" style={{ height: `${Math.max(height, 600)}px` }}>
                    {/* Scale Marks */}
                    {scaleDates.map((date, index) => {
                      const position = ((date - minDate) / totalMs) * height;
                      return (
                        <div
                          key={index}
                          className="absolute left-0 text-xs text-white/50 font-medium"
                          style={{ top: `${position}px` }}
                        >
                          {formatTimelineDate(date)}
                        </div>
                      );
                    })}
                    {/* Timeline Line */}
                    <div
                      className="absolute left-20 top-0 w-px bg-gradient-to-b from-white/60 via-white/30 to-white/10"
                      style={{ height: '100%' }}
                    />
                    {/* Events */}
                    {filteredEvents.map((event, index) => {
                      const eventDate = new Date(event.date);
                      const position = ((eventDate - minDate) / totalMs) * height;
                      const isSelected = selectedEvent?.id === event.id;
                      return (
                        <div
                          key={event.id}
                          className="absolute left-20 w-full"
                          style={{ top: `${position}px` }}
                        >
                          <div className="relative flex items-center group">
                            <div className={`absolute -left-2 w-4 h-4 rounded-full border-2 border-black z-10 transition-all duration-300 ${
                              isSelected ? 'bg-white scale-125' : 'bg-white/80 group-hover:bg-white group-hover:scale-110'
                            }`} />
                            <div
                              className={`ml-6 bg-white/5 backdrop-blur-sm p-6 rounded-2xl cursor-pointer transition-all duration-500 hover:bg-white/10 hover:scale-105 hover:shadow-xl ${
                                isSelected ? 'border border-white/20 bg-white/10 shadow-xl scale-105' : 'border border-white/5 hover:border-white/20'
                              }`}
                              onClick={() => setSelectedEvent(event)}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h3 className="font-medium text-white mb-1">{event.chapterTitle}</h3>
                                  <p className="text-sm text-white/60 mb-2">{eventDate.toLocaleDateString()}</p>
                                  <p className="text-sm text-white/70 line-clamp-2">{event.story}</p>
                                </div>
                                <Play className="w-5 h-5 text-white/50 flex-shrink-0 ml-4 group-hover:text-white transition-colors duration-300" />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              <div className="lg:sticky lg:top-32 lg:h-[75vh] lg:overflow-y-auto lg:scrollbar-thin lg:scrollbar-thumb-white/20 lg:scrollbar-track-transparent">
                {selectedEvent ? (
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                    <button
                      onClick={() => setSelectedEvent(null)}
                      className="text-white/50 hover:text-white mb-6 p-2 hover:bg-white/10 rounded-xl transition-all duration-300"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-3xl font-light mb-2">
                          Chapter {selectedEvent.chapterNumber}
                        </h2>
                        <h3 className="text-xl text-white/80 mb-4">{selectedEvent.chapterTitle}</h3>
                        <p className="text-white/70 leading-relaxed">{selectedEvent.story}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-white/60 mb-4 uppercase tracking-wider">Characters</h4>
                        <div className="space-y-3">
                          {selectedEvent.characters.map(charId => {
                            const character = enrichedCharactersData.find(c => c.id.toLowerCase() === charId.toLowerCase());
                            if (!character) return null;
                            return (
                              <div
                                key={character.id}
                                className="flex items-center space-x-4 p-4 bg-white/5 rounded-2xl cursor-pointer hover:bg-white/10 transition-all duration-300 group"
                                onClick={() => {
                                  setActiveTab('characters');
                                  setCurrentCharacter(character);
                                }}
                              >
                                <div className="w-12 h-12 bg-white/10 rounded-2xl overflow-hidden flex-shrink-0">
                                  <img
                                    src={character.images[0]}
                                    alt={character.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h5 className="font-medium text-white truncate">{character.name}</h5>
                                  <p className="text-sm text-white/60 truncate">{character.description}</p>
                                </div>
                                <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-white/70 transition-colors duration-300" />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-white/40">
                    <div className="text-center">
                      <Calendar className="w-16 h-16 mx-auto mb-4 text-white/20" />
                      <p className="text-lg font-light">Select an event to view details</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {activeTab === 'characters' && (
          <div>
            {!currentCharacter ? (
              <div className="space-y-8">
                <div className="relative max-w-md">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                  <input
                    type="text"
                    placeholder="Search characters..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-sm focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all duration-300"
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
                      <div className="aspect-[3/4] bg-white/5 border border-white/10 rounded-3xl overflow-hidden mb-4 transition-all duration-500 group-hover:border-white/30 group-hover:shadow-2xl group-hover:scale-105">
                        <img
                          src={character.images[0]}
                          alt={character.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      </div>
                      <div className="px-2">
                        <h3 className="font-medium text-white mb-1 group-hover:text-white/90 transition-colors duration-300">{character.name}</h3>
                        <p className="text-sm text-white/60 mb-3 line-clamp-2">{character.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-white/50">
                            {character.timeline.length} chapters
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
                  className="flex items-center text-white/60 hover:text-white transition-colors duration-300 group"
                >
                  <ChevronLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                  Back to characters
                </button>
                
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                  <div className="lg:col-span-2">
                    <div className="sticky top-32 space-y-6">
                      <div className="aspect-[3/4] bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
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
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                  index === currentImageIndex ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/70'
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
                      <h2 className="text-4xl font-light mb-3">{currentCharacter.name}</h2>
                      <p className="text-xl text-white/70 leading-relaxed">{currentCharacter.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-8">
                        <div>
                          <h3 className="text-sm font-medium text-white/60 mb-4 uppercase tracking-wider">Biography</h3>
                          <p className="text-white/80 leading-relaxed">{currentCharacter.bio}</p>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-white/60 mb-4 uppercase tracking-wider">Traits</h3>
                          <div className="flex flex-wrap gap-2">
                            {currentCharacter.traits.map((trait, index) => (
                              <span key={index} className="px-4 py-2 bg-white/10 border border-white/20 rounded-full text-sm hover:bg-white/20 transition-colors duration-300">
                                {trait}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-white/60 mb-4 uppercase tracking-wider">Appearance</h3>
                          <div className="space-y-3">
                            {Object.entries(currentCharacter.appearance).map(([key, value]) => (
                              <div key={key} className="flex items-center justify-between p-3 bg-white/5 rounded-2xl">
                                <span className="text-white/70 capitalize font-medium">{key}</span>
                                <span className="text-white">{value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-8">
                        <div>
                          <h3 className="text-sm font-medium text-white/60 mb-4 uppercase tracking-wider">Psychology</h3>
                          <div className="space-y-4">
                            <div>
                              <p className="text-white/80 mb-3 font-medium">Personality</p>
                              <div className="flex flex-wrap gap-2">
                                {currentCharacter.psyche.personality.map((trait, i) => (
                                  <span key={i} className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs">
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
                                    <span key={i} className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs">
                                      {quirk}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-white/60 mb-4 uppercase tracking-wider">Relationships</h3>
                          <div className="space-y-3">
                            {Object.entries(currentCharacter.relationships).map(([name, relation]) => (
                              <div key={name} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors duration-300">
                                <span className="font-medium text-white">{name}</span>
                                <span className="text-sm text-white/60">{relation}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-light mb-6">Story Appearances</h3>
                      <div className="space-y-4">
                        {currentCharacter.timeline.map(event => (
                          <div
                            key={event.id}
                            className="p-6 bg-white/5 border border-white/10 rounded-2xl cursor-pointer hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
                            onClick={() => {
                              setActiveTab('timeline');
                              setSelectedEvent(event);
                            }}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium text-white mb-2">Chapter {event.chapterNumber}: {event.chapterTitle}</h4>
                                <p className="text-sm text-white/70 line-clamp-3">{event.story}</p>
                              </div>
                              <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-white/70 transition-colors duration-300 flex-shrink-0 ml-4" />
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