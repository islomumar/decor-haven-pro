import { useState } from 'react';
import { Pencil, Eye, Globe, X, Save, LogOut, Check } from 'lucide-react';
import { useEditMode } from '@/hooks/useEditMode';
import { useSiteContent } from '@/hooks/useSiteContent';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export function EditModeToggle() {
  const { isEditMode, toggleEditMode, disableEditMode, canEdit, hasUnsavedChanges } = useEditMode();
  const { refreshContent } = useSiteContent();
  const { language, setLanguage } = useLanguage();
  const [saving, setSaving] = useState(false);

  // Don't render for non-admin users
  if (!canEdit) return null;

  const handleSaveAll = async () => {
    setSaving(true);
    // Refresh content to ensure all changes are synced
    await refreshContent();
    setSaving(false);
  };

  const handleExitEditMode = () => {
    if (hasUnsavedChanges) {
      const confirm = window.confirm('Saqlanmagan o\'zgarishlar bor. Chiqishni xohlaysizmi?');
      if (!confirm) return;
    }
    disableEditMode();
  };

  // Collapsed button when not in edit mode
  if (!isEditMode) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={toggleEditMode}
            size="lg"
            className="fixed bottom-6 right-6 z-50 rounded-full shadow-xl gap-2 bg-primary hover:bg-primary/90"
          >
            <Pencil className="h-5 w-5" />
            <span className="hidden sm:inline">Tahrirlash</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Sayt kontentini tahrirlash</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  // Expanded floating toolbar in edit mode
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
      <div className="container mx-auto px-4 pb-6">
        <div className="flex justify-center">
          <div className="pointer-events-auto bg-card/95 backdrop-blur-md rounded-2xl shadow-2xl border border-border p-2 flex items-center gap-2">
            {/* Edit Mode Indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 text-amber-600 rounded-xl">
              <Pencil className="h-4 w-4" />
              <span className="text-sm font-medium">Tahrirlash rejimi</span>
            </div>

            <div className="w-px h-8 bg-border" />

            {/* Language Switcher */}
            <div className="flex items-center gap-1 bg-muted rounded-xl p-1">
              <button
                onClick={() => setLanguage('uz')}
                className={cn(
                  'px-3 py-1.5 text-sm font-medium rounded-lg transition-all flex items-center gap-1',
                  language === 'uz'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Globe className="h-3.5 w-3.5" />
                UZ
              </button>
              <button
                onClick={() => setLanguage('ru')}
                className={cn(
                  'px-3 py-1.5 text-sm font-medium rounded-lg transition-all flex items-center gap-1',
                  language === 'ru'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Globe className="h-3.5 w-3.5" />
                RU
              </button>
            </div>

            <div className="w-px h-8 bg-border" />

            {/* Save Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleSaveAll}
                  disabled={saving}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  {saving ? (
                    <>
                      <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Saqlanmoqda...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Yangilash
                    </>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Barcha o'zgarishlarni yangilash</p>
              </TooltipContent>
            </Tooltip>

            {/* Preview Mode Toggle */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={toggleEditMode}
                  variant="secondary"
                  size="sm"
                  className="gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Ko'rish
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Ko'rish rejimiga o'tish</p>
              </TooltipContent>
            </Tooltip>

            {/* Exit Edit Mode */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleExitEditMode}
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Tahrirlashni tugatish</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Overlay hint for first-time users */}
      <style>{`
        [data-editable]:hover {
          outline: 2px dashed hsl(var(--primary) / 0.5) !important;
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
}