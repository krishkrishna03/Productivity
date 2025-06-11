import React, { useState } from 'react';
import { FileText, Upload, Download, Loader2 } from 'lucide-react';
import { summarizeText, readFileAsText } from '../utils/textProcessing';
import { SummaryResult } from '../types';

export const TextSummarizer: React.FC = () => {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState<SummaryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [maxSentences, setMaxSentences] = useState(3);

  const handleSummarize = async () => {
    if (!text.trim()) return;
    
    setLoading(true);
    // Simulate processing delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const result = summarizeText(text, maxSentences);
    setSummary(result);
    setLoading(false);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const content = await readFileAsText(file);
      setText(content);
    } catch (error) {
      console.error('Error reading file:', error);
    }
  };

  const downloadSummary = () => {
    if (!summary) return;
    
    const content = `Original Text Length: ${summary.originalLength} characters\nSummary Length: ${summary.summaryLength} characters\n\nSummary:\n${summary.summary}\n\nKey Points:\n${summary.keyPoints.map((point, i) => `${i + 1}. ${point}`).join('\n')}`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'summary.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Text Summarizer</h2>
            <p className="text-gray-600">Extract key insights from your text content</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Input Text
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter your text here or upload a file..."
                className="w-full h-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Sentences: {maxSentences}
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={maxSentences}
                  onChange={(e) => setMaxSentences(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              
              <div>
                <label htmlFor="file-upload" className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload File
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept=".txt,.pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </div>
            
            <button
              onClick={handleSummarize}
              disabled={!text.trim() || loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
              <span>{loading ? 'Summarizing...' : 'Generate Summary'}</span>
            </button>
          </div>

          {summary && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Summary Results</h3>
                <button
                  onClick={downloadSummary}
                  className="inline-flex items-center px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-white rounded-lg p-3">
                  <div className="text-gray-600">Original Length</div>
                  <div className="font-semibold">{summary.originalLength} chars</div>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <div className="text-gray-600">Summary Length</div>
                  <div className="font-semibold">{summary.summaryLength} chars</div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Summary</h4>
                <p className="text-gray-700 leading-relaxed">{summary.summary}</p>
              </div>
              
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Key Points</h4>
                <ul className="space-y-1">
                  {summary.keyPoints.map((point, index) => (
                    <li key={index} className="text-gray-700 text-sm flex">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};