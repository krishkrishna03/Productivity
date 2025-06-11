import React, { useState } from 'react';
import { Heart, Upload, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { analyzeSentiment, readFileAsText } from '../utils/textProcessing';
import { SentimentResult } from '../types';

export const SentimentAnalysis: React.FC = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState<SentimentResult | null>(null);

  const handleAnalyze = () => {
    if (!text.trim()) return;
    const analysis = analyzeSentiment(text);
    setResult(analysis);
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

  const getSentimentIcon = (label: string) => {
    switch (label) {
      case 'positive': return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'negative': return <TrendingDown className="w-5 h-5 text-red-600" />;
      default: return <Minus className="w-5 h-5 text-gray-600" />;
    }
  };

  const getSentimentColor = (label: string) => {
    switch (label) {
      case 'positive': return 'text-green-600 bg-green-50 border-green-200';
      case 'negative': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getEmotionColor = (emotion: string, value: number) => {
    const intensity = Math.round(value * 100);
    const colors = {
      joy: `bg-yellow-${Math.min(400 + intensity, 600)}`,
      sadness: `bg-blue-${Math.min(400 + intensity, 600)}`,
      anger: `bg-red-${Math.min(400 + intensity, 600)}`,
      fear: `bg-purple-${Math.min(400 + intensity, 600)}`,
      surprise: `bg-pink-${Math.min(400 + intensity, 600)}`
    };
    return colors[emotion as keyof typeof colors] || 'bg-gray-400';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-pink-100 rounded-lg">
            <Heart className="w-6 h-6 text-pink-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Sentiment Analysis</h2>
            <p className="text-gray-600">Analyze the emotional tone of your text</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Text for Analysis
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter the text you want to analyze for sentiment..."
                className="w-full h-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <label htmlFor="sentiment-file-upload" className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50">
                <Upload className="w-4 h-4 mr-2" />
                Upload Text File
              </label>
              <input
                id="sentiment-file-upload"
                type="file"
                accept=".txt"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
            
            <button
              onClick={handleAnalyze}
              disabled={!text.trim()}
              className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-pink-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <Heart className="w-4 h-4" />
              <span>Analyze Sentiment</span>
            </button>
          </div>

          {result && (
            <div className="space-y-4">
              <div className={`rounded-lg p-4 border ${getSentimentColor(result.label)}`}>
                <div className="flex items-center space-x-2 mb-2">
                  {getSentimentIcon(result.label)}
                  <h3 className="font-semibold capitalize">{result.label} Sentiment</h3>
                </div>
                <div className="text-sm">
                  Confidence: {Math.round(result.confidence * 100)}%
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Emotional Breakdown</h4>
                <div className="space-y-3">
                  {Object.entries(result.emotions).map(([emotion, value]) => (
                    <div key={emotion} className="flex items-center space-x-3">
                      <div className="w-16 text-sm text-gray-600 capitalize">{emotion}</div>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${getEmotionColor(emotion, value)}`}
                          style={{ width: `${value * 100}%` }}
                        />
                      </div>
                      <div className="w-12 text-sm text-gray-600 text-right">
                        {Math.round(value * 100)}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Analysis Summary</h4>
                <div className="text-sm text-gray-700 space-y-1">
                  <div>Overall Score: {result.score.toFixed(3)}</div>
                  <div>
                    Primary Emotion: {
                      Object.entries(result.emotions).reduce((a, b) => 
                        result.emotions[a[0] as keyof typeof result.emotions] > result.emotions[b[0] as keyof typeof result.emotions] ? a : b
                      )[0]
                    }
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};