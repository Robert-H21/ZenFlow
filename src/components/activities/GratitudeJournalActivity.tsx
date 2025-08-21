import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, Heart, Star, Volume2, VolumeX } from "lucide-react";

interface GratitudeJournalActivityProps {
  onComplete?: () => void;
}

const gratitudePrompts = [
  "¿Qué persona en tu vida te hace sentir agradecido/a hoy?",
  "¿Qué momento del día de hoy te trajo alegría?",
  "¿Qué aspecto de tu salud o bienestar aprecias más?"
];

export const GratitudeJournalActivity = ({ onComplete }: GratitudeJournalActivityProps) => {
  const [isActive, setIsActive] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutos total
  const [progress, setProgress] = useState(0);
  const [gratitudeEntries, setGratitudeEntries] = useState<string[]>(['', '', '']);
  const [isCompleted, setIsCompleted] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Función para crear sonidos de confirmación suaves
  const playConfirmationSound = () => {
    if (!soundEnabled) return;
    
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const context = audioContextRef.current;
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(context.destination);
      
      // Acorde suave ascendente de gratitud
      oscillator.frequency.setValueAtTime(523, context.currentTime); // Do
      oscillator.frequency.setValueAtTime(659, context.currentTime + 0.15); // Mi
      oscillator.frequency.setValueAtTime(784, context.currentTime + 0.3); // Sol
      
      gainNode.gain.setValueAtTime(0, context.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.04, context.currentTime + 0.05);
      gainNode.gain.linearRampToValueAtTime(0.02, context.currentTime + 0.4);
      gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.8);
      
      oscillator.type = 'sine';
      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + 0.8);
    } catch (error) {
      console.log('Audio not supported');
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsActive(false);
            setIsCompleted(true);
            onComplete?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, onComplete]);

  useEffect(() => {
    if (isActive) {
      const totalTime = 300;
      const progressPercent = ((totalTime - timeLeft) / totalTime) * 100;
      setProgress(progressPercent);
    }
  }, [timeLeft, isActive]);

  const handleStart = () => {
    setIsActive(true);
    setTimeLeft(300);
    setProgress(0);
    setIsCompleted(false);
    setCurrentPrompt(0);
    setGratitudeEntries(['', '', '']);
  };

  const handleStop = () => {
    setIsActive(false);
    setTimeLeft(300);
    setProgress(0);
    setIsCompleted(false);
  };

  const handleEntryChange = (index: number, value: string) => {
    const newEntries = [...gratitudeEntries];
    const wasEmpty = newEntries[index].trim().length === 0;
    newEntries[index] = value;
    setGratitudeEntries(newEntries);
    
    // Reproducir sonido cuando se complete una entrada por primera vez
    if (wasEmpty && value.trim().length > 10) {
      playConfirmationSound();
    }
  };

  const handleComplete = () => {
    setIsActive(false);
    setIsCompleted(true);
    playConfirmationSound();
    setTimeout(() => onComplete?.(), 800);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const allEntriesFilled = gratitudeEntries.every(entry => entry.trim().length > 0);

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className={`p-4 rounded-full transition-all duration-500 ${
            isCompleted ? 'bg-green-100' : 'bg-primary/20'
          }`}>
            {isCompleted ? (
              <Heart className="h-8 w-8 text-green-600" />
            ) : (
              <BookOpen className="h-8 w-8 text-primary" />
            )}
          </div>
        </div>
        
        {isActive && !isCompleted && (
          <>
            <h3 className="text-2xl font-bold text-foreground mb-2">
              Diario de Gratitud
            </h3>
            <p className="text-muted-foreground mb-4">
              Toma un momento para reflexionar sobre las cosas buenas de tu día
            </p>
            <div className="text-4xl font-mono font-bold text-primary mb-4">
              {formatTime(timeLeft)}
            </div>
          </>
        )}
        
        {!isActive && !isCompleted && (
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2">Diario de Gratitud</h3>
            <p className="text-muted-foreground">
              Escribe 3 cosas por las que te sientes agradecido/a hoy
            </p>
          </div>
        )}
        
        {isCompleted && (
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-green-600 mb-2">¡Completado!</h3>
            <p className="text-muted-foreground">
              Has completado tu diario de gratitud diario
            </p>
          </div>
        )}
      </div>

      <Progress value={progress} className="w-full" />

      {(isActive || isCompleted) && (
        <div className="space-y-6">
          {gratitudePrompts.map((prompt, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-primary" />
                <h4 className="font-medium text-foreground">{prompt}</h4>
              </div>
              <Textarea
                placeholder="Escribe tu respuesta aquí..."
                value={gratitudeEntries[index]}
                onChange={(e) => handleEntryChange(index, e.target.value)}
                className="min-h-20"
                disabled={isCompleted}
              />
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-4 justify-center mb-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setSoundEnabled(!soundEnabled)}
        >
          {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </Button>
      </div>

      <div className="flex gap-4 justify-center">
        {!isActive && !isCompleted && (
          <Button onClick={handleStart} className="px-8">
            Comenzar
          </Button>
        )}
        
        {isActive && !isCompleted && (
          <>
            <Button variant="outline" onClick={handleStop} className="px-8">
              Detener
            </Button>
            {allEntriesFilled && (
              <Button onClick={handleComplete} className="px-8">
                Completar
              </Button>
            )}
          </>
        )}
        
        {isCompleted && (
          <Button onClick={handleStart} className="px-8">
            Escribir Nuevo
          </Button>
        )}
      </div>

      <div className="bg-accent/30 p-4 rounded-lg">
        <h4 className="font-medium mb-2">Beneficios del diario de gratitud:</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Mejora el estado de ánimo y reduce el estrés</li>
          <li>• Aumenta la satisfacción con la vida</li>
          <li>• Fortalece las relaciones personales</li>
          <li>• Desarrolla una perspectiva más positiva</li>
        </ul>
      </div>
    </div>
  );
};