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
}

export function EditableText({
  contentKey,
  fallback = '',
  as: Component = 'span',
  className = '',
  multiline = false,
}: EditableTextProps) {
  const { isEditMode, canEdit } = useEditMode();
  const { getContent, updateContent } = useSiteContent();
  const { language } = useLanguage();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

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
    const success = await updateContent(contentKey, language, editValue);
    setSaving(false);
    
    if (success) {
      setIsEditing(false);
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

  // Not in edit mode - render normally
  if (!isEditMode || !canEdit) {
    return <Component className={className}>{currentValue}</Component>;
  }

  // In edit mode but not actively editing
  if (!isEditing) {
    return (
      <span className="relative inline-block group">
        <Component className={cn(className, 'ring-2 ring-dashed ring-primary/30 ring-offset-2 rounded px-1 cursor-pointer hover:ring-primary/60 transition-all')}>
          {currentValue || <span className="text-muted-foreground italic">Matn kiriting...</span>}
        </Component>
        <button
          onClick={handleStartEdit}
          className="absolute -top-2 -right-2 p-1 bg-primary text-primary-foreground rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
          title="Tahrirlash"
        >
          <Pencil className="h-3 w-3" />
        </button>
      </span>
    );
  }

  // Actively editing
  return (
    <span className="relative inline-flex items-center gap-2">
      {multiline ? (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className={cn(
            'w-full min-h-[100px] px-3 py-2 border-2 border-primary rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y',
            className
          )}
          disabled={saving}
        />
      ) : (
        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className={cn(
            'px-3 py-1 border-2 border-primary rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50',
            className
          )}
          disabled={saving}
          style={{ width: `${Math.max(editValue.length * 0.6 + 5, 10)}ch` }}
        />
      )}
      <div className="flex gap-1">
        <button
          onClick={handleSave}
          disabled={saving}
          className="p-1.5 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors disabled:opacity-50"
          title="Saqlash"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
        </button>
        <button
          onClick={handleCancel}
          disabled={saving}
          className="p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors disabled:opacity-50"
          title="Bekor qilish"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </span>
  );
}
