import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface IframePopupProps {
  url: string;
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function PreviewFile({ url, title, isOpen, onClose }: IframePopupProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-3xl h-[80vh] bg-gray-900 text-white p-4">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <iframe 
          src={`${url}`} 
          className="w-full h-full border-none rounded-lg"  
        />
      </DialogContent>
    </Dialog>
  );
}
