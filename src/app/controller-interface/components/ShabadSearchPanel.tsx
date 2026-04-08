'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import { DEFAULT_SHABAD_LINES, ShabadLine } from '@/data/shabadLines';

interface SearchResult {
  id: string;
  firstLine: string;
  english?: string;
  ang: number;
  lineIndex: number;
  source: string;
  author: string;
  raag: string;
}

interface ShabadSearchPanelProps {
  onShabadSelect: (shabadId: string, lineIndex?: number) => void;
  shabadLines?: ShabadLine[];
  supportsAng?: boolean;
  className?: string;
}

const ShabadSearchPanel = ({
  onShabadSelect,
  shabadLines = DEFAULT_SHABAD_LINES,
  supportsAng = true,
  className = '',
}: ShabadSearchPanelProps) => {
  const [searchType, setSearchType] = useState<'ang' | 'text'>(supportsAng ? 'text' : 'text');
  const [angNumber, setAngNumber] = useState('');
  const [searchText, setSearchText] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (!supportsAng && searchType === 'ang') {
      setSearchType('text');
    }
  }, [supportsAng, searchType]);

  const mockResults: SearchResult[] = [
    {
      id: 'shabad-1',
      firstLine: 'ੴ ਸਤਿ ਨਾਮੁ ਕਰਤਾ ਪੁਰਖੁ ਨਿਰਭਉ ਨਿਰਵੈਰੁ ਅਕਾਲ ਮੂਰਤਿ ਅਜੂਨੀ ਸੈਭੰ ਗੁਰ ਪ੍ਰਸਾਦਿ',
      english: 'Ik-oamkkaari satinaamu karataa purakhu nirabhau niravairu akaal moorati ajoonee saibhann guraprsaadi ||',
      ang: 1,
      lineIndex: 0,
      source: 'Sri Guru Granth Sahib Ji',
      author: 'Guru Nanak Dev Ji',
      raag: 'No Raag',
    },
    {
      id: 'shabad-2',
      firstLine: 'ਸੋ ਦਰੁ ਰਾਗੁ ਆਸਾ ਮਹਲਾ ੧',
      english: '',
      ang: 8,
      lineIndex: 1,
      source: 'Sri Guru Granth Sahib Ji',
      author: 'Guru Nanak Dev Ji',
      raag: 'Aasa',
    },
    {
      id: 'shabad-3',
      firstLine: 'ਸੋ ਪੁਰਖੁ ਨਿਰੰਜਨੁ ਹਰਿ ਪੁਰਖੁ ਨਿਰੰਜਨੁ',
      english: '',
      ang: 10,
      lineIndex: 2,
      source: 'Sri Guru Granth Sahib Ji',
      author: 'Guru Nanak Dev Ji',
      raag: 'Aasa',
    },
    {
      id: 'shabad-4',
      firstLine: 'ਆਸਾ ਮਹਲਾ ੧ ॥ ਸੋ ਦਰੁ ਤੇਰਾ ਕੇਹਾ ਸੋ ਘਰੁ',
      english: '',
      ang: 12,
      lineIndex: 3,
      source: 'Sri Guru Granth Sahib Ji',
      author: 'Guru Nanak Dev Ji',
      raag: 'Aasa',
    },
    {
      id: 'shabad-5',
      firstLine: 'ਜਪੁ ਜੀ ਸਾਹਿਬ ਪਉੜੀ ੧',
      english: '',
      ang: 2,
      lineIndex: 4,
      source: 'Sri Guru Granth Sahib Ji',
      author: 'Guru Nanak Dev Ji',
      raag: 'No Raag',
    },
  ];

  // Use provided shabadLines or create search results from mock data
  const effectiveLines: ShabadLine[] = shabadLines.length > 0 ? shabadLines : mockResults.map((r) => ({
    id: r.id,
    code: '',
    gurmukhi: r.firstLine,
    english: r.english,
    translation: '',
    translationSource: r.source,
    Ang: String(r.ang),
  }));

  // Normalize Gurmukhi text for better matching
  const normalizeGurmukhi = (text: string): string => {
    return text
      .normalize('NFC') // Normalize Unicode to composed form
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  };

  // Normalize transliteration by removing punctuation/brackets for tolerant matching.
  const normalizeEnglish = (text: string): string => {
    return text
      .toLowerCase()
      .normalize('NFC')
      .replace(/[()]/g, '')
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  };

  // Lenient transliteration form: reduce repeated consonants (e.g. "rr" -> "r").
  const foldEnglishTransliteration = (text: string): string => {
    return text.replace(/([bcdfghjklmnpqrstvwxyz])\1+/g, '$1');
  };

  const handleSearch = () => {
    if (searchType === 'ang' && !supportsAng) {
      // Ang search not supported for this collection
      return;
    }

    setIsSearching(true);
    
    setTimeout(() => {
      if (searchType === 'ang' && angNumber) {
        // For Ang number search, search by line index (1-based)
        const lineNum = parseInt(angNumber);
        const filtered = effectiveLines
          .map((line, index) => ({
            id: line.id,
            firstLine: line.gurmukhi,
            english: line.english,
            ang: Number(line.Ang),
            lineIndex: index,
            source: line.translationSource || 'Jap Ji Sahib',
            author: 'Guru Nanak Dev Ji',
            raag: 'No Raag',
          }))
          .filter(result => Number.isFinite(result.ang) && result.ang === lineNum);
        setResults(filtered);
      } else if (searchType === 'text' && searchText) {
        // Normalize both search text and result text for accurate Gurmukhi matching
        const normalizedSearch = normalizeGurmukhi(searchText);
        const rawEnglishSearch = searchText.toLowerCase().trim();
        const normalizedEnglishSearch = normalizeEnglish(searchText);
        const foldedEnglishSearch = foldEnglishTransliteration(normalizedEnglishSearch);
        const gurmukhiSearchWords = normalizedSearch.split(/\s+/).filter(Boolean);
        const englishSearchWords = normalizedEnglishSearch.split(/\s+/).filter(Boolean);
        const foldedEnglishSearchWords = foldedEnglishSearch.split(/\s+/).filter(Boolean);
        
        const filtered = effectiveLines
          .map((line, index) => ({
            id: line.id,
            firstLine: line.gurmukhi,
            english: line.english,
            ang: Number(line.Ang),
            lineIndex: index,
            source: line.translationSource || 'Jap Ji Sahib',
            author: 'Guru Nanak Dev Ji',
            raag: 'No Raag',
          }))
          .filter(result => {
            const normalizedResult = normalizeGurmukhi(result.firstLine);
            const rawEnglishResult = (result.english || '').toLowerCase();
            const normalizedEnglishResult = normalizeEnglish(result.english || '');
            const foldedEnglishResult = foldEnglishTransliteration(normalizedEnglishResult);

            const gurmukhiMatch = gurmukhiSearchWords.some(word =>
              word.length > 0 && normalizedResult.includes(word)
            );

            const englishRawPhraseMatch =
              rawEnglishSearch.length > 0 && rawEnglishResult.includes(rawEnglishSearch);

            const englishNormalizedPhraseMatch =
              normalizedEnglishSearch.length > 0 &&
              normalizedEnglishResult.includes(normalizedEnglishSearch);

            const englishAllWordsMatch =
              englishSearchWords.length > 0 &&
              englishSearchWords.every(word =>
                word.length > 0 && normalizedEnglishResult.includes(word)
              );

            const englishFoldedPhraseMatch =
              foldedEnglishSearch.length > 0 &&
              foldedEnglishResult.includes(foldedEnglishSearch);

            const englishFoldedAllWordsMatch =
              foldedEnglishSearchWords.length > 0 &&
              foldedEnglishSearchWords.every(word =>
                word.length > 0 && foldedEnglishResult.includes(word)
              );

            return (
              gurmukhiMatch ||
              englishRawPhraseMatch ||
              englishNormalizedPhraseMatch ||
              englishAllWordsMatch ||
              englishFoldedPhraseMatch ||
              englishFoldedAllWordsMatch
            );
          });
        
        setResults(filtered);
      } else {
        setResults([]);
      }
      setIsSearching(false);
    }, 300);
  };

  // Pass both shabadId and lineIndex to the handler
  const handleResultClick = (shabadId: string, lineIndex: number) => {
    setSelectedId(shabadId);
    onShabadSelect(shabadId, lineIndex);
  };

  const handleClearSearch = () => {
    setAngNumber('');
    setSearchText('');
    setResults([]);
    setSelectedId(null);
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Search Type Toggle */}
      <div className="flex items-center gap-2 p-1 bg-background rounded-lg border border-border mb-4">
        <button
          onClick={() => setSearchType('text')}
          className={`
            flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md
            transition-smooth font-medium text-sm
            ${
              searchType === 'text' ? 'bg-primary text-primary-foreground shadow-elevated' : 'text-text-secondary hover:text-foreground hover:bg-muted'
            }
          `}
        >
          <Icon name="MagnifyingGlassIcon" size={18} />
          <span>Text Search</span>
        </button>
        <button
          onClick={() => supportsAng && setSearchType('ang')}
          disabled={!supportsAng}
          className={`
            flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md
            transition-smooth font-medium text-sm
            ${
              !supportsAng
                ? 'bg-muted text-text-secondary cursor-not-allowed'
                : searchType === 'ang'
                ? 'bg-primary text-primary-foreground shadow-elevated'
                : 'text-text-secondary hover:text-foreground hover:bg-muted'
            }
          `}
        >
          <Icon name="BookOpenIcon" size={18} />
          <span>Ang Number</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="space-y-3 mb-4">
        {searchType === 'ang' ? (
          <div>
            <label htmlFor="ang-input" className="block text-sm font-medium text-text-secondary mb-2">
              Enter Ang Number
            </label>
            <input
              id="ang-input"
              type="number"
              value={angNumber}
              onChange={(e) => setAngNumber(e.target.value)}
              placeholder="e.g., 1, 8, 10..."
              className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
        ) : (
          <div>
            <label htmlFor="text-input" className="block text-sm font-medium text-text-secondary mb-2">
              Search Gurmukhi Text
            </label>
            <input
              id="text-input"
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Enter Gurmukhi text..."
              className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
        )}

        <div className="flex items-center gap-2">
          <button
            onClick={handleSearch}
            disabled={
              isSearching ||
              (searchType === 'ang' && (!supportsAng || !angNumber)) ||
              (searchType === 'text' && !searchText)
            }
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:shadow-elevated transition-smooth disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] font-medium"
          >
            {isSearching ? (
              <>
                <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                <span>Searching...</span>
              </>
            ) : (
              <>
                <Icon name="MagnifyingGlassIcon" size={20} />
                <span>Search</span>
              </>
            )}
          </button>
          {(angNumber || searchText || results.length > 0) && (
            <button
              onClick={handleClearSearch}
              className="px-4 py-3 bg-muted text-text-secondary hover:text-foreground rounded-lg hover:bg-muted/80 transition-smooth active:scale-[0.98]"
              aria-label="Clear search"
            >
              <Icon name="XMarkIcon" size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Search Results */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {results.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-text-secondary">
                {results.length} {results.length === 1 ? 'Result' : 'Results'} Found
              </h3>
            </div>
            {results.map((result) => {
              return (
                <button
                  key={result.id}
                  onClick={() => handleResultClick(result.id, result.lineIndex)}
                  className={`
                    w-full text-left p-4 rounded-lg border transition-smooth
                    ${
                      selectedId === result.id
                        ? 'bg-primary/10 border-primary shadow-elevated'
                        : 'bg-surface border-border hover:bg-muted hover:border-muted'
                    }
                  `}
                >
                  <div className="space-y-2">
                    <p className="text-base font-medium text-foreground line-clamp-2">
                      {result.firstLine}
                    </p>
                    {result.english && (
                      <p className="text-sm text-foreground/85 line-clamp-2">{result.english}</p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-text-secondary">
                      <span className="flex items-center gap-1">
                        <Icon name="BookOpenIcon" size={14} />
                        Ang {result.ang}
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="MusicalNoteIcon" size={14} />
                        {result.raag}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary">{result.author}</p>
                  </div>
                </button>
              );
            })}
          </>
        ) : (angNumber || searchText) && !isSearching ? (
          <div className="flex flex-col items-center justify-center p-8 bg-surface rounded-lg border border-border">
            <Icon name="MagnifyingGlassIcon" size={48} className="text-text-secondary mb-3" />
            <p className="text-text-secondary text-sm">No results found</p>
            <p className="text-text-secondary text-xs mt-1">Try a different search term</p>
          </div>
        ) : (
          <div className="p-6 bg-muted/30 rounded-lg border border-border">
            <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
              <Icon name="LightBulbIcon" size={16} />
              Search Instructions
            </h4>
            <ul className="space-y-2 text-xs text-text-secondary">
              <li className="flex items-start gap-2">
                <Icon name="CheckCircleIcon" size={14} className="mt-0.5 flex-shrink-0" />
                <span>Use Ang Number search for specific page lookup</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="CheckCircleIcon" size={14} className="mt-0.5 flex-shrink-0" />
                <span>Use Text Search to find shabads by Gurmukhi words</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="CheckCircleIcon" size={14} className="mt-0.5 flex-shrink-0" />
                <span>Click on any result to load the complete shabad</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShabadSearchPanel;
