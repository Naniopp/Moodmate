import { motion, AnimatePresence } from 'framer-motion';

interface EmotionDisplayProps {
  emotion: string;
  confidence: number;
}

const emotionData: { [key: string]: { emoji: string; color: string; label: string; message: string } } = {
  happy: {
    emoji: '😊',
    color: 'hsl(45 100% 55%)',
    label: 'Happy',
    message: 'You\'re radiating joy!'
  },
  sad: {
    emoji: '😢',
    color: 'hsl(220 80% 60%)',
    label: 'Sad',
    message: 'It\'s okay to feel down sometimes'
  },
  angry: {
    emoji: '😠',
    color: 'hsl(0 80% 60%)',
    label: 'Angry',
    message: 'Take a deep breath'
  },
  surprised: {
    emoji: '😮',
    color: 'hsl(280 80% 65%)',
    label: 'Surprised',
    message: 'Wow! What happened?'
  },
  neutral: {
    emoji: '😐',
    color: 'hsl(200 20% 60%)',
    label: 'Neutral',
    message: 'Feeling calm and balanced'
  },
  fear: {
    emoji: '😨',
    color: 'hsl(270 70% 55%)',
    label: 'Fearful',
    message: 'You\'re safe here'
  },
  disgust: {
    emoji: '🤢',
    color: 'hsl(120 50% 50%)',
    label: 'Disgusted',
    message: 'Something bothering you?'
  }
};

const EmotionDisplay = ({ emotion, confidence }: EmotionDisplayProps) => {
  const data = emotionData[emotion] || emotionData.neutral;
  const confidencePercent = Math.round(confidence * 100);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={emotion}
        initial={{ scale: 0, opacity: 0, rotate: -180 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        exit={{ scale: 0, opacity: 0, rotate: 180 }}
        transition={{ 
          type: "spring",
          stiffness: 200,
          damping: 20
        }}
        className="flex flex-col items-center gap-6 p-8 rounded-3xl bg-card shadow-soft"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="text-9xl"
          style={{ filter: `drop-shadow(0 0 20px ${data.color})` }}
        >
          {data.emoji}
        </motion.div>

        <div className="text-center space-y-2">
          <h2 className="text-4xl font-bold gradient-primary bg-clip-text text-transparent">
            {data.label}
          </h2>
          <p className="text-lg text-muted-foreground">
            {data.message}
          </p>
        </div>

        <div className="w-full max-w-xs space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Confidence</span>
            <span className="font-semibold">{confidencePercent}%</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${confidencePercent}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="h-full gradient-primary"
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EmotionDisplay;
