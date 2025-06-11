import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Download, Copy, Trash2 } from 'lucide-react';

export const SpeechToText: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
          } else {
            interimTranscript += result[0].transcript;
          }
        }
        
        setTranscript(prev => prev + finalTranscript);
        setInterimTranscript(interimTranscript);
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
        setInterimTranscript('');
      };
      
      setRecognition(recognitionInstance);
    } else {
      setIsSupported(false);
    }
  }, []);

  const startListening = () => {
    if (recognition) {
      recognition.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  const clearTranscript = () => {
    setTranscript('');
    setInterimTranscript('');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(transcript);
  };

  const downloadTranscript = () => {
    const blob = new Blob([transcript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transcript.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isSupported) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <div className="text-red-600 mb-2">
            <MicOff className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-red-900 mb-2">Speech Recognition Not Supported</h3>
          <p className="text-red-700">Your browser doesn't support speech recognition. Please use Chrome, Edge, or Safari.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Mic className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Speech to Text</h2>
            <p className="text-gray-600">Convert your speech into written text</p>
          </div>
        </div>

        <div className="text-center mb-8">
          <button
            onClick={isListening ? stopListening : startListening}
            className={`relative w-32 h-32 rounded-full border-4 transition-all duration-300 ${
              isListening 
                ? 'bg-red-500 border-red-600 animate-pulse' 
                : 'bg-purple-500 border-purple-600 hover:bg-purple-600'
            }`}
          >
            {isListening ? (
              <MicOff className="w-12 h-12 text-white mx-auto" />
            ) : (
              <Mic className="w-12 h-12 text-white mx-auto" />
            )}
            {isListening && (
              <div className="absolute inset-0 rounded-full border-4 border-red-400 animate-ping" />
            )}
          </button>
          <p className="mt-4 text-lg font-medium text-gray-700">
            {isListening ? 'Listening... Click to stop' : 'Click to start recording'}
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Transcript</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={copyToClipboard}
                disabled={!transcript}
                className="inline-flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 disabled:opacity-50"
              >
                <Copy className="w-4 h-4 mr-1" />
                Copy
              </button>
              <button
                onClick={downloadTranscript}
                disabled={!transcript}
                className="inline-flex items-center px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 disabled:opacity-50"
              >
                <Download className="w-4 h-4 mr-1" />
                Download
              </button>
              <button
                onClick={clearTranscript}
                disabled={!transcript}
                className="inline-flex items-center px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Clear
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 min-h-[200px] border border-gray-200">
            {transcript || interimTranscript ? (
              <div className="text-gray-900 leading-relaxed">
                {transcript}
                {interimTranscript && (
                  <span className="text-gray-500 italic">{interimTranscript}</span>
                )}
              </div>
            ) : (
              <div className="text-gray-500 italic text-center py-8">
                Your speech will appear here...
              </div>
            )}
          </div>
          
          {transcript && (
            <div className="mt-4 text-sm text-gray-600">
              Word count: {transcript.split(/\s+/).filter(word => word.length > 0).length}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};