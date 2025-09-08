import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { searchData } from '../../data/searchDemoData.ts'
import { FiSearch, FiSettings, FiPaperclip, FiUser, FiMessageCircle, FiList } from 'react-icons/fi';
import Loader from '../loader/index.tsx';
import Shimmer from '../shimmer/index.tsx';
import Tabs from './tabs.tsx';

export default function AnimateSearch() {
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    files: true,
    people: true,
    chats: false,
    lists: false
  });
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, searchQuery ? 800 : 0); // 800ms delay when searching

    return () => clearTimeout(timer);
  }, [searchQuery]);
  const filteredPeople = searchData.people.filter(person =>
    person.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFiles = searchData.files.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTabCounts = () => {
    const peopleCount = filteredPeople.length;
    const filesCount = filteredFiles.length;
    const allCount = peopleCount + filesCount;

    return { all: allCount, files: filesCount, people: peopleCount, chats: 0, list: 0 };
  };

  const counts = getTabCounts();

  const highlightText = (text: string, searchQuery: string) => {
    if (!searchQuery.trim()) return text;

    const regex = new RegExp(`(${searchQuery.trim()})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="bg-[#fee3c7]">
          {part}
        </span>
      ) : (
        part
      )
    );
  };


  const renderSearchState = () => {
    if (!searchQuery) {
      return null
    }

    if (isLoading) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col h-64 gap-4 px-6"
        >
          <div className='border-b border-gray-200 pb-4'>
            <Shimmer />
          </div>
          <div className='border-b border-gray-200 pb-4'>
            <Shimmer />
          </div>
          <div className='border-b border-gray-200 pb-4'>
            <Shimmer />
          </div>
          <div className='border-b border-gray-200 pb-4'>
            <Shimmer />
          </div>
        </motion.div>
      );
    }

    if (counts.all === 0) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center h-64 text-gray-400"
        >
          <FiSearch className="w-12 h-12 mb-4" />
          <p className="text-lg">No results found</p>
        </motion.div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className=""
      >
        {(activeTab === 'all' || activeTab === 'people') && filteredPeople.map((person, index) => (
          <motion.div
            key={person.id}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}

            className='hover:bg-[#f7f7f7]'
          >
            <div className="flex items-center space-x-3 py-2 cursor-pointer group border-b border-gray-200 mx-6">
              <div className="relative">
                <img
                  src={person.avatar}
                  alt={person.name}
                  className="w-10 h-10 rounded-lg object-cover"
                />
                <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${person.isActive ? 'bg-[#f9c200]' : 'bg-[#da1413]'
                  }`} />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{highlightText(person.name, searchQuery)}</h3>
                <p className="text-sm text-gray-500">{person.status}</p>
              </div>
            </div>
          </motion.div>
        ))}

        {(activeTab === 'all' || activeTab === 'files') && filteredFiles.map((file, index) => (
          <motion.div
            key={file.id}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (filteredPeople.length + index) * 0.1 }}
            className='hover:bg-[#f7f7f7]'
          >
            <div className="flex items-center space-x-3 py-2 cursor-pointer group border-b border-gray-200 mx-6">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                <FiPaperclip className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{highlightText(file.name, searchQuery)}</h3>
                <p className="text-sm text-gray-500">in {file.location} • {file.lastEdited}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    );
  };

  return (
    <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg mx-5 md:mx-auto">
      <div className="relative">
        <div className="flex items-center justify-between px-4 md:px-6 py-6 transition-all duration-200">
          <div className='flex items-center'>
            {
              isLoading ? <div className='ml-1 md:-ml-1 w-5 h-5 md:w-6 md:h-6 mr-1 md:mr-3'><Loader size={20} color={'#9f9f9f'} /></div> :
                <div className=''>
                  <FiSearch className="ml-1 md:-ml-1 w-5 h-5 md:w-6 md:h-6 mr-1 md:mr-3 text-[#9f9f9f]" />
                </div>
            }
            <input
              type="text"
              placeholder={searchQuery ? searchQuery : "Searching is easier"}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 text-xl bg-transparent outline-none text-black placeholder-[#9d9d9d] font-medium"
            />
          </div>
          <AnimatePresence mode="wait">
            {searchQuery ? (
              <motion.div
                key="clear"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.3 }}
                onClick={() => setSearchQuery('')}
                className=" hover:text-gray-600 transition-colors text-[#121212] border-b-[1.4px] hover:cursor-pointer text-xs leading-3"
              >
                Clear
              </motion.div>
            ) : (
              <motion.div
                key="quick-access"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.1 }}
                className="flex items-center space-x-2 hover:cursor-pointer"
              >
                <div className='w-6 h-[27px] border border-[#c7c7c7] rounded-md flex '>
                  <div className="w-6 h-6 bg-white border-b border-[#c7c7c7] rounded-md flex items-center justify-center">
                    <span className="text-[10px] text-[#757575] font-semibold">S</span>
                  </div>
                </div>
                <span className="hidden md:block text-sm text-gray-500">quick access</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Search Results */}
      <div className="max-h-96 overflow-hidden">
        <AnimatePresence mode="wait">
          {searchQuery ? (
            <motion.div
              key="search-results"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="h-full"
            >
              {/* Tabs */}
              <div className="flex items-center justify-between px-6 pt-2 border-b-2 border-[#f2f2f2]">
                <Tabs
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  filters={filters}
                  counts={counts}
                />
                <div className="relative">
                  <div
                    onClick={() => setShowFilters(!showFilters)}
                    className="transition-colors text-gray-400 hover:text-gray-600 flex items-start -mt-2"
                  >
                    <FiSettings className={`w-5 h-5 transform transition-transform duration-300 ${showFilters ? 'rotate-90' : 'rotate-0'}`} />
                  </div>
                  <AnimatePresence>
                    {showFilters && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className="absolute right-0 top-8 md:top-12 bg-white rounded-lg shadow-lg border border-gray-200 p-4 w-40 md:w-48 z-10"
                      >
                        <div className="space-y-3">
                          {Object.entries(filters).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                {key === 'files' && <FiPaperclip className="w-4 h-4 text-gray-400" />}
                                {key === 'people' && <FiUser className="w-4 h-4 text-gray-400" />}
                                {key === 'chats' && <FiMessageCircle className="w-4 h-4 text-gray-400" />}
                                {key === 'lists' && <FiList className="w-4 h-4 text-gray-400" />}
                                <span className="text-md capitalize text-black">{key}</span>
                              </div>
                              <button
                                onClick={() => {
                                  setFilters(prev => ({ ...prev, [key]: !value }))
                                  if (activeTab === key) setActiveTab('all')
                                }}
                                className={`w-6 h-4 rounded-full transition-colors relative border-none outline-none focus:ring-0 ${value ? 'bg-black' : 'bg-gray-400'
                                  }`}
                              >
                                <motion.div
                                  animate={{ x: value ? 8 : 0 }}
                                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                  className="absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full focus:border-none focus:outline-none focus:ring-0"
                                />
                              </button>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Results */}
              <div
                className="py-3 h-80 overflow-y-auto hide-scrollbar">
                {renderSearchState()}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full"
            >
              {renderSearchState()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}