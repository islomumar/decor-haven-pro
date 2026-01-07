import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { useAuth } from './useAuth';

interface EditModeContextType {
  isEditMode: boolean;
  toggleEditMode: () => void;
  enableEditMode: () => void;
  disableEditMode: () => void;
  canEdit: boolean;
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (value: boolean) => void;
}

const EditModeContext = createContext<EditModeContextType | undefined>(undefined);

const EDIT_MODE_STORAGE_KEY = 'lovable_edit_mode';

export function EditModeProvider({ children }: { children: ReactNode }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const { isAdmin, isManager, hasPermission, user, loading } = useAuth();
  
  // Admin and Manager can edit site content
  const canEdit = isAdmin || isManager || hasPermission('siteContent', 'edit');

  // Initialize edit mode from URL params or localStorage - only after auth loads
  useEffect(() => {
    // Wait for auth to finish loading
    if (loading) return;
    
    if (!canEdit || !user) {
      setIsEditMode(false);
      return;
    }

    // Check URL parameter first
    const urlParams = new URLSearchParams(window.location.search);
    const editParam = urlParams.get('edit');
    
    if (editParam === 'true') {
      setIsEditMode(true);
      // Store in localStorage for persistence
      localStorage.setItem(EDIT_MODE_STORAGE_KEY, 'true');
      // Remove from URL without reload
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('edit');
      window.history.replaceState({}, '', newUrl.toString());
      return;
    }

    // Check localStorage
    const storedEditMode = localStorage.getItem(EDIT_MODE_STORAGE_KEY);
    if (storedEditMode === 'true') {
      setIsEditMode(true);
    }
  }, [canEdit, user, loading]);

  const toggleEditMode = useCallback(() => {
    if (canEdit) {
      setIsEditMode((prev) => {
        const newValue = !prev;
        if (newValue) {
          localStorage.setItem(EDIT_MODE_STORAGE_KEY, 'true');
        } else {
          localStorage.removeItem(EDIT_MODE_STORAGE_KEY);
          setHasUnsavedChanges(false);
        }
        return newValue;
      });
    }
  }, [canEdit]);

  const enableEditMode = useCallback(() => {
    if (canEdit) {
      setIsEditMode(true);
      localStorage.setItem(EDIT_MODE_STORAGE_KEY, 'true');
    }
  }, [canEdit]);

  const disableEditMode = useCallback(() => {
    setIsEditMode(false);
    localStorage.removeItem(EDIT_MODE_STORAGE_KEY);
    setHasUnsavedChanges(false);
  }, []);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges && isEditMode) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges, isEditMode]);

  return (
    <EditModeContext.Provider 
      value={{ 
        isEditMode, 
        toggleEditMode, 
        enableEditMode, 
        disableEditMode, 
        canEdit,
        hasUnsavedChanges,
        setHasUnsavedChanges,
      }}
    >
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