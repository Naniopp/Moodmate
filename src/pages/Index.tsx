import { useState } from 'react';
import { motion } from 'framer-motion';
import EmotionDetector from '@/components/EmotionDetector';
import EmotionDisplay from '@/components/EmotionDisplay';
import ControlPanel from '@/components/ControlPanel';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState('neutral');
  const [confidence, setConfidence] = useState(0);
  const { toast } = useToast();

  const handleEmotionDetected = (emotion: string, score: number) => {
    setCurrentEmotion(emotion);
    setConfidence(score);
  };

  const handleToggle = () => {
    setIsActive(!isActive);
    if (!isActive) {
      toast({
        title: "Camera Started",
        description: "MoodMate is now detecting your emotions!",
      });
    } else {
      toast({
        title: "Camera Stopped",
        description: "See you next time!",
      });
    }
  };

  const handleCapture = () => {
    toast({
      title: "Snapshot Captured! 📸",
      description: `You're feeling ${currentEmotion}`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 gap-8">
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-4 mb-8"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-7xl mb-4"
        >
          🎭
        </motion.div>
        <h1 className="text-6xl font-bold gradient-primary bg-clip-text text-transparent">
          MoodMate
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Your Personal Mood Buddy
        </p>
        <p className="text-sm text-muted-foreground">
          Real-time emotion detection powered by AI
        </p>
      </motion.div>

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-start">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <EmotionDetector
            isActive={isActive}
            onEmotionDetected={handleEmotionDetected}
          />
        </motion.div>

        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center"
        >
          <EmotionDisplay emotion={currentEmotion} confidence={confidence} />
        </motion.div>
      </div>

      <ControlPanel
        isActive={isActive}
        onToggle={handleToggle}
        onCapture={handleCapture}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center text-sm text-muted-foreground mt-8"
      >
        <p>✨ Click "Start Camera" to begin detecting your mood</p>
      </motion.div>
    </div>
  );
};

export default Index;
