import { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';

interface EmotionDetectorProps {
  isActive: boolean;
  onEmotionDetected: (emotion: string, confidence: number) => void;
}

const EmotionDetector = ({ isActive, onEmotionDetected }: EmotionDetectorProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const animationRef = useRef<number>();

  useEffect(() => {
    // Load face-api.js models
    const loadModels = async () => {
      try {
        setIsModelLoading(true);
        const MODEL_URL = '/models';
        
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        ]);
        
        setModelsLoaded(true);
        setIsModelLoading(false);
        console.log('Face detection models loaded successfully');
      } catch (error) {
        console.error('Error loading models:', error);
        setIsModelLoading(false);
      }
    };

    loadModels();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isActive && modelsLoaded) {
      startWebcam();
    } else {
      stopWebcam();
    }

    return () => {
      stopWebcam();
    };
  }, [isActive, modelsLoaded]);

  const startWebcam = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        },
        audio: false
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          detectEmotions();
        };
        setStream(mediaStream);
      }
    } catch (error) {
      console.error('Error accessing webcam:', error);
    }
  };

  const stopWebcam = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  };

  const detectEmotions = async () => {
    if (!videoRef.current || !canvasRef.current || !isActive || !modelsLoaded) {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video.readyState !== video.HAVE_ENOUGH_DATA) {
      animationRef.current = requestAnimationFrame(detectEmotions);
      return;
    }

    // Set canvas dimensions to match video
    const displaySize = {
      width: video.videoWidth,
      height: video.videoHeight
    };
    
    faceapi.matchDimensions(canvas, displaySize);

    try {
      // Detect faces with expressions
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      if (detections && detections.length > 0) {
        // Get the first face detection
        const detection = detections[0];
        const expressions = detection.expressions;
        
        // Find the dominant emotion
        const emotionEntries = Object.entries(expressions);
        const [dominantEmotion, confidence] = emotionEntries.reduce((prev, curr) => 
          curr[1] > prev[1] ? curr : prev
        );

        // Map face-api emotions to our emotion system
        const emotionMap: { [key: string]: string } = {
          'happy': 'happy',
          'sad': 'sad',
          'angry': 'angry',
          'surprised': 'surprised',
          'neutral': 'neutral',
          'fearful': 'fear',
          'disgusted': 'disgust'
        };

        const mappedEmotion = emotionMap[dominantEmotion] || 'neutral';
        onEmotionDetected(mappedEmotion, confidence);

        // Draw detections on canvas
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // Draw face detection box
          faceapi.draw.drawDetections(canvas, resizedDetections);
          
          // Draw emotion labels
          resizedDetections.forEach(detection => {
            const box = detection.detection.box;
            const drawBox = new faceapi.draw.DrawBox(box, {
              label: `${dominantEmotion}: ${(confidence * 100).toFixed(0)}%`
            });
            drawBox.draw(canvas);
          });
        }
      }
    } catch (error) {
      console.error('Error detecting emotions:', error);
    }

    // Continue detection loop
    animationRef.current = requestAnimationFrame(detectEmotions);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative aspect-video rounded-2xl overflow-hidden shadow-glow bg-card">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover mirror"
        />
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full mirror"
        />
        
        {isModelLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/90 backdrop-blur-sm z-10">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-muted-foreground">Loading AI models...</p>
              <p className="text-xs text-muted-foreground">This may take a moment on first load</p>
            </div>
          </div>
        )}

        {!isActive && !isModelLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/90 backdrop-blur-sm z-10">
            <div className="text-center space-y-4">
              <div className="text-6xl animate-float">📸</div>
              <p className="text-muted-foreground">Camera is off</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmotionDetector;
