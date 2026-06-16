import { createContext, useContext, useReducer, useCallback } from 'react';

const WorkbenchContext = createContext(null);

const defaultMorphosis = {
  bgOpacity: 0.08,
  blur: 24,
  borderWidth: 1,
  borderOpacity: 0.12,
  shadowSize: 12,
  shadowOpacity: 0.2,
  radius: 16,
  gradientAngle: 135,
  gradientStart: '#0ea5e9',
  gradientStop: '#a855f7',
};

const initialState = {
  activeTool: 'converter',
  mediaFile: null,
  convertedResult: null,
  compressedFile: null,
  svgInput: '',
  svgOutput: '',
  morphosis: { ...defaultMorphosis },
  generatedCode: '',
  selectedFiles: [],
  isFullscreen: false,
};

function workbenchReducer(state, action) {
  switch (action.type) {
    case 'SET_ACTIVE_TOOL':
      return { ...state, activeTool: action.payload };
    case 'SET_MEDIA_FILE':
      return { ...state, mediaFile: action.payload };
    case 'SET_CONVERTED_RESULT':
      return { ...state, convertedResult: action.payload };
    case 'SET_COMPRESSED_FILE':
      return { ...state, compressedFile: action.payload };
    case 'SET_SVG_INPUT':
      return { ...state, svgInput: action.payload };
    case 'SET_SVG_OUTPUT':
      return { ...state, svgOutput: action.payload };
    case 'UPDATE_MORPHOSIS':
      return { ...state, morphosis: { ...state.morphosis, ...action.payload } };
    case 'SET_GENERATED_CODE':
      return { ...state, generatedCode: action.payload };
    case 'SET_SELECTED_FILES':
      return { ...state, selectedFiles: action.payload };
    case 'ADD_FILES': {
      const newFiles = action.payload.filter(
        (nf) => !state.selectedFiles.some((sf) => sf.name === nf.name)
      );
      return { ...state, selectedFiles: [...state.selectedFiles, ...newFiles] };
    }
    case 'REMOVE_FILE':
      return { 
        ...state, 
        selectedFiles: state.selectedFiles.filter((_, i) => i !== action.payload) 
      };
    case 'CLEAR_FILES':
      return { ...state, selectedFiles: [], mediaFile: null };
    case 'SET_FULLSCREEN':
      return { ...state, isFullscreen: action.payload };
    default:
      return state;
  }
}

export function WorkbenchProvider({ children }) {
  const [state, dispatch] = useReducer(workbenchReducer, initialState);

  const updateMorphosis = useCallback((patch) => {
    dispatch({ type: 'UPDATE_MORPHOSIS', payload: patch });
  }, []);

  const value = { state, dispatch, updateMorphosis };

  return (
    <WorkbenchContext.Provider value={value}>
      {children}
    </WorkbenchContext.Provider>
  );
}

export function useWorkbench() {
  const context = useContext(WorkbenchContext);
  if (!context) throw new Error('useWorkbench must be used within WorkbenchProvider');
  return context;
}
