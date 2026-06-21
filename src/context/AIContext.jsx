import { createContext, useContext, useState, useCallback, useRef } from 'react';
import { useFavorites, useRecent, useStorage } from '../hooks/useStorage';
import { useWorkbench } from './WorkbenchContext';

const AIContext = createContext(null);

// System prompt that defines the AI's role and context
const SYSTEM_PROMPT = `You are FuncSilo AI, an intelligent assistant powered by LexaChat for the FuncSilo Assets platform. This project is integrated into the FuncSilo toolkit as part of the FuncSilo ecosystem.
You help users with image processing, component creation, design systems, and asset management in their workspace.

CRITICAL POLICY: You must ONLY answer questions directly related to this project, the FuncSilo Assets toolkit, the FuncSilo ecosystem, the user's workspace, or its features. 
If the user asks any question that is unrelated to the project, FuncSilo Assets, the FuncSilo ecosystem, or the user's active assets/tools, you must politely decline to answer. Under no circumstances should you answer general-knowledge questions, unrelated programming questions, recipes, math, trivia, general chat, or other outside topics. Politely inform the user that your knowledge is strictly scoped to assisting them with the FuncSilo ecosystem and toolkit.

You have access to the following context:
- Current user's recent conversions
- Favorited items
- Stored assets
- Available tools: Image Converter, Image Compressor, SVG to React, Design Studio, Component Library

Your capabilities:
1. Help users convert images between formats (PNG, JPEG, WebP, ICO, SVG)
2. Guide users on compression and optimization
3. Assist with creating React components
4. Help with design themes and styles
5. Explain features and workflows
6. Provide troubleshooting support

Always be helpful, professional, and concise. Use emojis sparingly. Provide actionable advice.`;

export function AIProvider({ children }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  const { favorites } = useFavorites();
  const { recent } = useRecent();
  const { items: storageItems } = useStorage();
  const { state: workbenchState } = useWorkbench();

  // Build context from user data
  const buildContext = useCallback(() => {
    const recentItems = recent.slice(0, 5).map(r => 
      `${r.fileName} (${r.from} → ${r.to}, ${r.reduction}% smaller)`
    ).join(', ');

    const favoriteItems = favorites.slice(0, 5).map(f => 
      `${f.name} (${f.type})`
    ).join(', ');

    const storageInfo = storageItems.length > 0 
      ? `${storageItems.length} items stored` 
      : 'No items in storage';

    // Get current active route/pathname
    const currentPath = window.location.pathname;

    // Get Design Studio local styles if any
    let studioStylesText = 'None';
    try {
      const storedStyles = localStorage.getItem('funcsilo_studio_styles') || localStorage.getItem('funclexa_studio_styles');
      if (storedStyles) {
        const parsed = JSON.parse(storedStyles);
        // Format them as a readable string
        studioStylesText = Object.entries(parsed)
          .map(([k, v]) => `  ${k}: ${v}`)
          .join('\n');
      }
    } catch (e) {
      // Ignore
    }

    return `
User Workspace Context:
- Active Route/Page: ${currentPath}
- Active Tool: ${workbenchState.activeTool}
- Loaded Media File: ${workbenchState.mediaFile ? `${workbenchState.mediaFile.name} (${workbenchState.mediaFile.size} bytes)` : 'None'}
- Converted Result: ${workbenchState.convertedResult ? 'Yes (conversion completed)' : 'None'}
- SVG Input Length: ${workbenchState.svgInput ? `${workbenchState.svgInput.length} chars` : 'Empty'}
- SVG Output React Code Length: ${workbenchState.svgOutput ? `${workbenchState.svgOutput.length} chars` : 'Empty'}
- Multi-Morphosis Engine settings:
  bgOpacity: ${workbenchState.morphosis.bgOpacity}
  blur: ${workbenchState.morphosis.blur}px
  borderWidth: ${workbenchState.morphosis.borderWidth}px
  borderOpacity: ${workbenchState.morphosis.borderOpacity}
  shadowSize: ${workbenchState.morphosis.shadowSize}px
  shadowOpacity: ${workbenchState.morphosis.shadowOpacity}
  radius: ${workbenchState.morphosis.radius}px
  gradientAngle: ${workbenchState.morphosis.gradientAngle}°
  gradientStart: ${workbenchState.morphosis.gradientStart}
  gradientStop: ${workbenchState.morphosis.gradientStop}
- Design Studio Active Styles:
${studioStylesText}
- Recent conversions: ${recentItems || 'None'}
- Favorites: ${favoriteItems || 'None'}
- Storage Info: ${storageInfo}
- Total favorites: ${favorites.length}
- Total recent: ${recent.length}
- Total stored: ${storageItems.length}
`;
  }, [recent, favorites, storageItems, workbenchState]);

  // Send message to Groq API
  const sendMessage = useCallback(async (userMessage) => {
    if (!userMessage.trim()) return;

    // Get Groq API key from environment
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    if (!apiKey) {
      const errorMsg = 'Groq API key not configured. Please add VITE_GROQ_API_KEY to your environment variables.';
      setError(errorMsg);
      setMessages(prev => [...prev, { role: 'assistant', content: `⚠️ ${errorMsg}` }]);
      return;
    }

    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsProcessing(true);
    setError(null);

    // Add user message to UI
    const userMsg = { role: 'user', content: userMessage };
    setMessages(prev => [...prev, userMsg]);

    // Build context
    const context = buildContext();
    const systemPrompt = SYSTEM_PROMPT + context;

    try {
      // Prepare messages for API
      const apiMessages = [
        { role: 'system', content: systemPrompt },
        ...messages.slice(-10), // Keep last 10 messages for context
        userMsg,
      ];

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant', // Using Llama 3.1 8B for fast, context-aware assistance
          messages: apiMessages,
          temperature: 0.7,
          max_tokens: 1024,
          stream: false,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `API error: ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage = data.choices[0]?.message?.content || 'I apologize, but I could not process your request.';

      // Add assistant response
      setMessages(prev => [...prev, { role: 'assistant', content: assistantMessage }]);

      // Store messages in localStorage for persistence
      try {
        localStorage.setItem('funcsilo_chat_history', JSON.stringify(
          [...messages, userMsg, { role: 'assistant', content: assistantMessage }].slice(-50)
        ));
      } catch (e) {
        // Ignore storage errors
      }

    } catch (error) {
      if (error.name === 'AbortError') {
        // Request was cancelled
        return;
      }
      
      console.error('AI Error:', error);
      setError(error.message);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `⚠️ Error: ${error.message || 'Something went wrong. Please try again.'}` 
      }]);
    } finally {
      setIsProcessing(false);
      abortControllerRef.current = null;
    }
  }, [messages, buildContext]);

  // Clear chat history
  const clearHistory = useCallback(() => {
    setMessages([]);
    localStorage.removeItem('funcsilo_chat_history');
  }, []);

  // Load chat history from localStorage
  const loadHistory = useCallback(() => {
    try {
      const stored = localStorage.getItem('funcsilo_chat_history') || localStorage.getItem('funclexa_chat_history');
      if (stored) {
        const parsed = JSON.parse(stored);
        setMessages(parsed);
      }
    } catch (e) {
      // Ignore
    }
  }, []);

  // Quick actions with context
  const quickActions = {
    'convert image': 'I can help you convert images. Upload an image in the Media Desk, select your target format (PNG, JPEG, WebP, ICO, or SVG), and click Convert.',
    'compress image': 'Use the Compressor tool in Media Desk. Upload your image, adjust the quality slider, and click Compress. I can also help you choose optimal settings.',
    'create component': 'Open the Design Studio to create React components. You can customize styles, colors, animations, and 3D transforms in real-time.',
    'generate theme': 'In the Design Studio, click the "Generate Theme" button (🎨) or select from pre-built themes like Glassmorphism, Neumorphism, or Cyberpunk.',
    'svg to react': 'Use the SVG → React tool in Media Desk. Paste your SVG code and click "Convert to React" to get a React component.',
    'export assets': 'Your assets can be exported from the Storage manager. Click the Storage button in the sidebar to view and export your files.',
    'help': 'I can help with:\n• Image conversion and compression\n• React component creation\n• Design themes and styles\n• SVG to React conversion\n• Asset management\n\nWhat would you like help with?',
  };

  return (
    <AIContext.Provider value={{
      messages,
      isProcessing,
      error,
      sendMessage,
      clearHistory,
      loadHistory,
      quickActions,
      buildContext,
    }}>
      {children}
    </AIContext.Provider>
  );
}

export function useAI() {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
}