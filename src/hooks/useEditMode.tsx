import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { useAuth } from './useAuth';

interface EditModeContextType {
  isEditMode: boolean;
  toggleEditMode: () => void;
  enableEditMode: () => void;
  disableEditMode: () => void;
  canEdit: boolean;
}

const EditModeContext = createContext<EditModeContextType | undefined>(undefined);

export function EditModeProvider({ children }: { children: ReactNode }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const { isAdmin, isEditor } = useAuth();
  
  const canEdit = isAdmin || isEditor;

  const toggleEditMode = useCallback(() => {
    if (canEdit) {
      setIsEditMode((prev) => !prev);
    }
  }, [canEdit]);

  const enableEditMode = useCallback(() => {
    if (canEdit) {
      setIsEditMode(true);
    }
  }, [canEdit]);

  const disableEditMode = useCallback(() => {
    setIsEditMode(false);
  }, []);

  return (
    <EditModeContext.Provider value={{ isEditMode, toggleEditMode, enableEditMode, disableEditMode, canEdit }}>
      {children}
    </EditModeContext.Provider>
  );
}

export function useEditMode() {
  const context = useContext(EditModeContext);
  if (context === undefined) {
    throw new Error('useEditMode must be used within an EditModeProvider');
  }
  return context;
}
