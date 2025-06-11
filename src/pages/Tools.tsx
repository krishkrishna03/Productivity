import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { TextSummarizer } from '../components/TextSummarizer';
import { TextToSpeech } from '../components/TextToSpeech';
import { SpeechToText } from '../components/SpeechToText';
import { SentimentAnalysis } from '../components/SentimentAnalysis';
import { TaskManager } from '../components/TaskManager';

export const Tools: React.FC = () => {
  const [activeTab, setActiveTab] = useState('summarizer');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'summarizer':
        return <TextSummarizer />;
      case 'text-to-speech':
        return <TextToSpeech />;
      case 'speech-to-text':
        return <SpeechToText />;
      case 'sentiment':
        return <SentimentAnalysis />;
      case 'tasks':
        return <TaskManager />;
      default:
        return <TextSummarizer />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
        />
        
        <div className="flex-1 lg:ml-0">
          {/* Mobile header */}
          <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
          
          {/* Main content */}
          <main className="p-6">
            {renderActiveComponent()}
          </main>
        </div>
      </div>
    </div>
  );
};