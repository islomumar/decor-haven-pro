import { useState, useRef } from 'react';
import { Pencil, Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { useEditMode } from '@/hooks/useEditMode';
import { useSiteContent } from '@/hooks/useSiteContent';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface EditableImageProps {
  contentKey: string;
  fallbackSrc: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
  section?: string;
  aspectRatio?: 'auto' | 'square' | 'video' | 'wide';
}

export function EditableImage({
  contentKey,
  fallbackSrc,
  alt,
  className = '',
  wrapperClassName = '',
  section,
  aspectRatio = 'auto',
}: EditableImageProps) {
  const { isEditMode, canEdit, setHasUnsavedChanges } = useEditMode();
  const { getContent, updateContent } = useSiteContent();
  const { toast } = useToast();
  
  const [isHovered, setIsHovered] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get image URL from content or use fallback
  const currentSrc = getContent(contentKey, 'uz', '') || fallbackSrc;

  const handleImageClick = () => {
    if (isEditMode && canEdit) {
      setShowDialog(true);
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        variant: 'destructive',
        title: 'Xatolik',
        description: 'Faqat rasm fayllari qabul qilinadi',
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: 'destructive',
        title: 'Xatolik',
        description: 'Rasm hajmi 5MB dan oshmasligi kerak',
      });
      return;
    }

    setIsUploading(true);
    setHasUnsavedChanges(true);

    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${contentKey}-${Date.now()}.${fileExt}`;
      const filePath = `site-content/${fileName}`;

      // Upload to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      // Save URL to site_content
      await updateContent(contentKey, 'uz', publicUrl);
      // Also save to RU for consistency
      await updateContent(contentKey, 'ru', publicUrl);

      setShowDialog(false);
      setHasUnsavedChanges(false);
      
      toast({
        title: 'Saqlandi',
        description: 'Rasm muvaffaqiyatli yangilandi',
      });
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        variant: 'destructive',
        title: 'Xatolik',
        description: error.message || 'Rasmni yuklashda xatolik yuz berdi',
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case 'square': return 'aspect-square';
      case 'video': return 'aspect-video';
      case 'wide': return 'aspect-[21/9]';
      default: return '';
    }
  };

  // Not in edit mode - render normally
  if (!isEditMode || !canEdit) {
    return (
      <div className={cn(wrapperClassName, getAspectRatioClass())}>
        <img 
          src={currentSrc} 
          alt={alt} 
          className={className}
        />
      </div>
    );
  }

  // In edit mode
  return (
    <>
      <div 
        className={cn(
          'relative group cursor-pointer',
          wrapperClassName,
          getAspectRatioClass()
        )}
        data-editable="true"
        data-section={section}
        data-field={contentKey}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleImageClick}
      >
        <img 
          src={currentSrc} 
          alt={alt} 
          className={cn(
            className,
            'transition-all duration-200',
            isHovered ? 'ring-4 ring-primary/60 ring-offset-2 rounded-lg brightness-75' : 'ring-2 ring-dashed ring-primary/20 rounded-lg'
          )}
        />
        
        {/* Overlay with edit icon */}
        <div 
          className={cn(
            'absolute inset-0 flex items-center justify-center transition-all duration-200',
            isHovered ? 'opacity-100' : 'opacity-0'
          )}
        >
          <div className="bg-primary text-primary-foreground rounded-full p-4 shadow-xl">
            <Pencil className="h-6 w-6" />
          </div>
        </div>

        {/* Badge */}
        <div 
          className={cn(
            'absolute top-2 right-2 px-2 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full shadow-lg transition-all duration-200 flex items-center gap-1',
            isHovered ? 'opacity-100' : 'opacity-0'
          )}
        >
          <ImageIcon className="h-3 w-3" />
          Rasmni o'zgartirish
        </div>
      </div>

      {/* Upload Dialog */}
      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-card rounded-2xl shadow-2xl border max-w-md w-full mx-4 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold text-lg">Rasmni o'zgartirish</h3>
              <button 
                onClick={() => setShowDialog(false)}
                className="p-2 hover:bg-muted rounded-full transition-colors"
                disabled={isUploading}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Current image preview */}
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">Hozirgi rasm:</p>
                <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                  <img 
                    src={currentSrc} 
                    alt={alt}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Upload area */}
              <div 
                className={cn(
                  "border-2 border-dashed rounded-xl p-8 text-center transition-all",
                  isUploading ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary hover:bg-primary/5"
                )}
              >
                {isUploading ? (
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-10 w-10 text-primary animate-spin" />
                    <p className="text-sm text-muted-foreground">Yuklanmoqda...</p>
                  </div>
                ) : (
                  <>
                    <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                    <p className="text-sm font-medium mb-1">Yangi rasm yuklang</p>
                    <p className="text-xs text-muted-foreground mb-4">
                      PNG, JPG, WEBP (max 5MB)
                    </p>
                    <label className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg cursor-pointer hover:bg-primary/90 transition-colors">
                      <Upload className="h-4 w-4" />
                      Faylni tanlang
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        disabled={isUploading}
                      />
                    </label>
                  </>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 p-4 border-t bg-muted/50">
              <button 
                onClick={() => setShowDialog(false)}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                disabled={isUploading}
              >
                Bekor qilish
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}