import React, { useState, useRef, useEffect } from 'react';

const PredictiveInput = () => {
  const [inputValue, setInputValue] = useState('');
  const [currentWord, setCurrentWord] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const inputRef = useRef(null);
  const spanRef = useRef(null);

  const suggestions = [
    'Apple', 'Banana', 'Cherry', 'Date', 'Elderberry', 'Fig', 'Grape', 'Honeydew', 'superlongassstring'
  ];

  const suggestionSlice = suggestion.slice(currentWord.length)

  const handleChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    const words = value.split(' ');
    const lastWord = words[words.length - 1];
    setCurrentWord(lastWord);

    if (isDeleting) {
      setSuggestion('');
    } else if (lastWord) {
      const match = suggestions.find(item => item.toLowerCase().startsWith(lastWord.toLowerCase()));
      setSuggestion(match ? match : '');
    } else {
      setSuggestion('');
    }
  };
 

  const handleKeyDown = (e) => {
    if (e.key === 'Tab' && suggestion) {
      e.preventDefault();
      const words = inputValue.split(' ');
      words[words.length - 1] = suggestion;
      setInputValue(words.join(' ') + ' ');
      setCurrentWord('');
      setSuggestion('');
    }

    // if (e.key === ' ' || e.key === 'Spacebar') {
    //   setCurrentWord('');
    //   console.log(currentWord)
    // }

    if (e.key === 'Backspace' || e.key === 'Delete') {
        setIsDeleting(true);
      } else {
        setIsDeleting(false);
      }
  };

  const handleSuggestionClick = () => {
    const words = inputValue.split(' ');
    words[words.length - 1] = suggestion;
    setInputValue(words.join(' ') + ' ');
    setCurrentWord('');
    setSuggestion('');
  };

  // Measure the width of the current input value to position the suggestion correctly
  useEffect(() => {
    if (spanRef.current && inputRef.current) {
      spanRef.current.textContent = inputRef.current.value;
    }
  }, [inputValue]);

  return (
    <div className="relative w-52">
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleChange}
        
        onKeyDown={handleKeyDown}
        className="flex h-10 w-full rounded-md border border-input bg-background dark:bg-[#1e1e1e] px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      />
      <span ref={spanRef} className="invisible absolute whitespace-pre p-2"></span>
      {currentWord && suggestion && suggestion.toLowerCase().startsWith(currentWord.toLowerCase()) && (
        <div
          className="absolute top-0 text-gray-400 bg-transparent pointer-events-none select-none"
          style={{
            left: `${spanRef.current?.offsetWidth}px`,
            top: `calc(50% - 12px)`, // Adjust to vertically center the suggestion text
            paddingLeft: inputValue.length > 0 ? '6px' : '0px', // Adjust padding for better alignment
          }}
          onClick={handleSuggestionClick}
        >
          <span className="text-gray-300 text-sm">{suggestionSlice}</span>
        </div>
      )}
    </div>
  );
};

export default PredictiveInput;