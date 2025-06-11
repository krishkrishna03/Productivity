export const summarizeText = (text: string, maxSentences: number = 3): SummaryResult => {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  if (sentences.length <= maxSentences) {
    return {
      originalLength: text.length,
      summaryLength: text.length,
      summary: text,
      keyPoints: sentences.map(s => s.trim())
    };
  }

  // Simple extractive summarization based on sentence position and length
  const sentenceScores = sentences.map((sentence, index) => {
    let score = 0;
    
    // Position scoring (first and last sentences are often important)
    if (index === 0 || index === sentences.length - 1) score += 2;
    if (index < sentences.length * 0.3) score += 1;
    
    // Length scoring (medium-length sentences often contain key info)
    const words = sentence.trim().split(/\s+/).length;
    if (words >= 10 && words <= 30) score += 1;
    
    // Keyword scoring (simple implementation)
    const keywords = ['important', 'significant', 'key', 'main', 'primary', 'essential', 'crucial'];
    keywords.forEach(keyword => {
      if (sentence.toLowerCase().includes(keyword)) score += 1;
    });
    
    return { sentence: sentence.trim(), score, index };
  });

  // Select top sentences
  const topSentences = sentenceScores
    .sort((a, b) => b.score - a.score)
    .slice(0, maxSentences)
    .sort((a, b) => a.index - b.index);

  const summary = topSentences.map(s => s.sentence).join('. ') + '.';
  
  return {
    originalLength: text.length,
    summaryLength: summary.length,
    summary,
    keyPoints: topSentences.map(s => s.sentence)
  };
};

export const analyzeSentiment = (text: string): SentimentResult => {
  const positiveWords = [
    'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'awesome', 'love',
    'happy', 'joy', 'pleased', 'satisfied', 'perfect', 'brilliant', 'outstanding', 'superb'
  ];
  
  const negativeWords = [
    'bad', 'terrible', 'awful', 'horrible', 'hate', 'disgusting', 'worst', 'angry',
    'sad', 'disappointed', 'frustrated', 'annoyed', 'upset', 'furious', 'depressed'
  ];

  const emotionWords = {
    joy: ['happy', 'joy', 'excited', 'thrilled', 'delighted', 'cheerful', 'elated'],
    sadness: ['sad', 'depressed', 'melancholy', 'gloomy', 'sorrowful', 'downhearted'],
    anger: ['angry', 'furious', 'rage', 'mad', 'irritated', 'annoyed', 'outraged'],
    fear: ['afraid', 'scared', 'terrified', 'anxious', 'worried', 'nervous', 'frightened'],
    surprise: ['surprised', 'amazed', 'astonished', 'shocked', 'stunned', 'bewildered']
  };

  const words = text.toLowerCase().split(/\W+/);
  
  let positiveScore = 0;
  let negativeScore = 0;
  const emotions = { joy: 0, sadness: 0, anger: 0, fear: 0, surprise: 0 };

  words.forEach(word => {
    if (positiveWords.includes(word)) positiveScore++;
    if (negativeWords.includes(word)) negativeScore++;
    
    Object.entries(emotionWords).forEach(([emotion, emotionWordList]) => {
      if (emotionWordList.includes(word)) {
        emotions[emotion as keyof typeof emotions]++;
      }
    });
  });

  const totalWords = words.length;
  const totalScore = positiveScore - negativeScore;
  const normalizedScore = totalWords > 0 ? totalScore / totalWords : 0;
  
  let label: 'positive' | 'negative' | 'neutral';
  let confidence: number;
  
  if (normalizedScore > 0.05) {
    label = 'positive';
    confidence = Math.min(normalizedScore * 10, 1);
  } else if (normalizedScore < -0.05) {
    label = 'negative';
    confidence = Math.min(Math.abs(normalizedScore) * 10, 1);
  } else {
    label = 'neutral';
    confidence = 1 - Math.abs(normalizedScore) * 10;
  }

  // Normalize emotions
  const maxEmotion = Math.max(...Object.values(emotions));
  if (maxEmotion > 0) {
    Object.keys(emotions).forEach(key => {
      emotions[key as keyof typeof emotions] = emotions[key as keyof typeof emotions] / maxEmotion;
    });
  }

  return {
    score: normalizedScore,
    label,
    confidence,
    emotions
  };
};

export const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = (e) => reject(e);
    reader.readAsText(file);
  });
};