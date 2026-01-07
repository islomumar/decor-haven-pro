import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Pencil, Check, X, Loader2 } from 'lucide-react';
import { useEditMode } from '@/hooks/useEditMode';
import { useSiteContent } from '@/hooks/useSiteContent';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';

interface EditableTextProps {
  contentKey: string;
  fallback?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
  className?: string;
  multiline?: boolean;
  section?: string;
  field?: string;
}

export function EditableText({
  contentKey,
  fallback = '',
  as: Component = 'span',
  className = '',
  multiline = false,
  section,
  field,
}: EditableTextProps) {
  const { isEditMode, canEdit, setHasUnsavedChanges } = useEditMode();
  const { getContent, updateContent } = useSiteContent();
  const { language } = useLanguage();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [saving, setSaving] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLSpanElement>(null);

  const currentValue = getContent(contentKey, language, fallback);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleStartEdit = () => {
    setEditValue(currentValue);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (editValue === currentValue) {
      setIsEditing(false);
      return;
    }
    
    setSaving(true);
    setHasUnsavedChanges(true);
    const success = await updateContent(contentKey, language, editValue);
    setSaving(false);
    
    if (success) {
      setIsEditing(false);
      setHasUnsavedChanges(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue(currentValue);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  // Not in edit mode or can't edit - render normally
  if (!isEditMode || !canEdit) {
    return <Component className={className}>{currentValue}</Component>;
  }

  // In edit mode but not actively editing
  if (!isEditing) {
    return (
      <span 
        ref={containerRef}
        className="relative inline-block"
        data-editable="true"
        data-section={section}
        data-field={field || contentKey}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Component 
          className={cn(
            className, 
            'cursor-pointer transition-all duration-200',
            isHovered 
              ? 'ring-2 ring-primary/60 ring-offset-2 rounded bg-primary/5' 
              : 'ring-2 ring-dashed ring-primary/20 ring-offset-2 rounded'
          )}
          onClick={handleStartEdit}
        >
          {currentValue || <span className="text-muted-foreground italic">Matn kiriting...</span>}
        </Component>
        
        {/* Edit icon on hover */}
        <button
          onClick={handleStartEdit}
          className={cn(
            'absolute -top-3 -right-3 p-1.5 bg-primary text-primary-foreground rounded-full shadow-lg transition-all duration-200 z-10',
            isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'
          )}
          title="Tahrirlash"
        >
          <Pencil className="h-3 w-3" />
        </button>
      </span>
    );
  }

  // Actively editing
  return (
    <span 
      className="relative inline-flex items-start gap-2 bg-background p-2 rounded-lg shadow-lg border-2 border-primary"
      data-editable="true"
      data-section={section}
      data-field={field || contentKey}
    >
      {multiline ? (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className={cn(
            'w-full min-h-[100px] min-w-[300px] px-3 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y',
            className
          )}
          disabled={saving}
          placeholder="Matn kiriting..."
        />
      ) : (
        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className={cn(
            'px-3 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50',
            className
          )}
          disabled={saving}
          style={{ width: `${Math.max(editValue.length * 0.7 + 5, 15)}ch` }}
          placeholder="Matn kiriting..."
        />
      )}
      
      <div className="flex flex-col gap-1">
        <button
          onClick={handleSave}
          disabled={saving}
          className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          title="Saqlash (Enter)"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
        </button>
        <button
          onClick={handleCancel}
          disabled={saving}
          className="p-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors disabled:opacity-50"
          title="Bekor qilish (Esc)"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      
      {/* Help text */}
      <div className="absolute -bottom-6 left-0 text-xs text-muted-foreground">
        Enter - saqlash, Esc - bekor qilish
      </div>
    </span>
  );
}