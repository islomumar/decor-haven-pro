import { Pencil, Eye, Globe } from 'lucide-react';
import { useEditMode } from '@/hooks/useEditMode';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function EditModeToggle() {
  const { isEditMode, toggleEditMode, canEdit } = useEditMode();
  const { language, setLanguage } = useLanguage();

  if (!canEdit) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {/* Language Switcher (only visible in edit mode) */}
      {isEditMode && (
        <div className="bg-card rounded-full shadow-xl border border-border p-1 flex items-center gap-1">
          <button
            onClick={() => setLanguage('uz')}
            className={cn(
              'px-3 py-1.5 text-sm font-medium rounded-full transition-all flex items-center gap-1',
              language === 'uz'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted'
            )}
          >
            <Globe className="h-3 w-3" />
            UZ
          </button>
          <button
            onClick={() => setLanguage('ru')}
            className={cn(
              'px-3 py-1.5 text-sm font-medium rounded-full transition-all flex items-center gap-1',
              language === 'ru'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted'
            )}
          >
            <Globe className="h-3 w-3" />
            RU
          </button>
        </div>
      )}

      {/* Edit Mode Toggle */}
      <Button
        onClick={toggleEditMode}
        size="lg"
        className={cn(
          'rounded-full shadow-xl gap-2 transition-all',
          isEditMode
            ? 'bg-green-600 hover:bg-green-700 text-white'
            : 'bg-primary hover:bg-primary/90'
        )}
      >
        {isEditMode ? (
          <>
            <Eye className="h-5 w-5" />
            <span className="hidden sm:inline">Ko'rish rejimi</span>
          </>
        ) : (
          <>
            <Pencil className="h-5 w-5" />
            <span className="hidden sm:inline">Tahrirlash</span>
          </>
        )}
      </Button>

      {/* Edit Mode Indicator */}
      {isEditMode && (
        <div className="absolute -top-12 right-0 bg-amber-500 text-white text-xs font-medium px-3 py-1 rounded-full shadow-lg animate-pulse">
          ✏️ Tahrirlash rejimi
        </div>
      )}
    </div>
  );
}
