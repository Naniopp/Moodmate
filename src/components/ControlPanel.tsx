import { Button } from '@/components/ui/button';
import { Video, VideoOff, Camera } from 'lucide-react';
import { motion } from 'framer-motion';

interface ControlPanelProps {
  isActive: boolean;
  onToggle: () => void;
  onCapture: () => void;
}

const ControlPanel = ({ isActive, onToggle, onCapture }: ControlPanelProps) => {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="flex items-center gap-4 justify-center"
    >
      <Button
        onClick={onToggle}
        size="lg"
        className={`
          text-lg px-8 py-6 rounded-full shadow-soft transition-smooth
          ${isActive 
            ? 'bg-destructive hover:bg-destructive/90' 
            : 'gradient-primary hover:opacity-90'
          }
        `}
      >
        {isActive ? (
          <>
            <VideoOff className="mr-2 h-5 w-5" />
            Stop Camera
          </>
        ) : (
          <>
            <Video className="mr-2 h-5 w-5" />
            Start Camera
          </>
        )}
      </Button>

      {isActive && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <Button
            onClick={onCapture}
            size="lg"
            variant="outline"
            className="px-8 py-6 rounded-full border-2 shadow-soft transition-smooth hover:scale-105"
          >
            <Camera className="mr-2 h-5 w-5" />
            Capture
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ControlPanel;
