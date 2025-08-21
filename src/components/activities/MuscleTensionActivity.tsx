import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Activity, Volume2, VolumeX } from "lucide-react";

interface MuscleTensionActivityProps {
  onComplete?: () => void;
}

const muscleGroups = [
  { name: 'Pies', duration: 5 },
  { name: 'Pantorrillas', duration: 5 },
  { name: 'Muslos', duration: 5 },
  { name: 'Glúteos', duration: 5 },
  { name: 'Abdomen', duration: 5 },
  { name: 'Manos', duration: 5 },
  { name: 'Brazos', duration: 5 },
  { name: 'Hombros', duration: 5 },
  { name: 'Cuello', duration: 5 },
  { name: 'Cara', duration: 5 }
];

export const MuscleTensionActivity = ({ onComplete }: MuscleTensionActivityProps) => {
  const [isActive, setIsActive] = useState(false);
  const [currentGroup, setCurrentGroup] = useState(0);
  const [phase, setPhase] = useState<'tense' | 'relax'>('tense');
  const [timeLeft, setTimeLeft] = useState(5);
  const [progress, setProgress] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Función para crear sonidos de relajación
  const playRelaxationSound = (type: 'tense' | 'relax') => {
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
      
      if (type === 'tense') {
        // Sonido de tensión - tono constante
        oscillator.frequency.setValueAtTime(220, context.currentTime);
        gainNode.gain.setValueAtTime(0, context.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.05, context.currentTime + 0.1);
        gainNode.gain.linearRampToValueAtTime(0.05, context.currentTime + 4.5);
        gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 5);
      } else {
        // Sonido de relajación - tono descendente suave
        oscillator.frequency.setValueAtTime(440, context.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(110, context.currentTime + 4);
        gainNode.gain.setValueAtTime(0, context.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.03, context.currentTime + 0.2);
        gainNode.gain.linearRampToValueAtTime(0.01, context.currentTime + 4);
        gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 5);
      }
      
      oscillator.type = 'sine';
      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + 5);
    } catch (error) {
      console.log('Audio not supported');
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && currentGroup < muscleGroups.length) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            if (phase === 'tense') {
              setPhase('relax');
              playRelaxationSound('relax');
              return 5; // 5 segundos de relajación
            } else {
              // Pasar al siguiente grupo muscular
              setCurrentGroup(prev => prev + 1);
              setPhase('tense');
              if (currentGroup + 1 < muscleGroups.length) {
                playRelaxationSound('tense');
              }
              return 5; // 5 segundos de tensión
            }
          }
          return prev - 1;
        });
      }, 1000);
    }

    if (currentGroup >= muscleGroups.length) {
      setIsActive(false);
      onComplete?.();
    }

    return () => clearInterval(interval);
  }, [isActive, currentGroup, phase, onComplete]);

  useEffect(() => {
    if (isActive) {
      const totalGroups = muscleGroups.length;
      const groupProgress = (currentGroup / totalGroups) * 100;
      const phaseProgress = phase === 'relax' ? 50 : 0;
      const timeProgress = ((5 - timeLeft) / 5) * 50;
      
      setProgress(groupProgress + (phaseProgress + timeProgress) / totalGroups);
    }
  }, [currentGroup, phase, timeLeft, isActive]);

  const handleStart = () => {
    setIsActive(true);
    setCurrentGroup(0);
    setPhase('tense');
    setTimeLeft(5);
    setProgress(0);
    playRelaxationSound('tense');
  };

  const handleStop = () => {
    setIsActive(false);
    setCurrentGroup(0);
    setPhase('tense');
    setTimeLeft(5);
    setProgress(0);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className={`p-4 rounded-full transition-all duration-500 ${
            phase === 'tense' ? 'bg-red-100 scale-110' : 'bg-green-100 scale-90'
          }`}>
            <Activity className={`h-8 w-8 transition-all duration-500 ${
              phase === 'tense' ? 'text-red-600' : 'text-green-600'
            }`} />
          </div>
        </div>
        
        {isActive && currentGroup < muscleGroups.length && (
          <>
            <h3 className="text-2xl font-bold text-foreground mb-2">
              {muscleGroups[currentGroup].name}
            </h3>
            <p className="text-lg text-primary mb-2">
              {phase === 'tense' ? 'Tensa los músculos' : 'Relaja los músculos'}
            </p>
            <div className="text-4xl font-mono font-bold text-primary mb-4">
              {timeLeft}
            </div>
            <p className="text-muted-foreground mb-4">
              Grupo {currentGroup + 1} de {muscleGroups.length}
            </p>
          </>
        )}
        
        {!isActive && currentGroup === 0 && (
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2">Relajación Muscular Progresiva</h3>
            <p className="text-muted-foreground">
              Tensa y relaja cada grupo muscular para liberar la tensión acumulada
            </p>
          </div>
        )}
        
        {currentGroup >= muscleGroups.length && (
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-green-600 mb-2">¡Completado!</h3>
            <p className="text-muted-foreground">
              Has completado la relajación de todos los grupos musculares
            </p>
          </div>
        )}
      </div>

      <Progress value={progress} className="w-full" />

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
        {!isActive && currentGroup < muscleGroups.length && (
          <Button onClick={handleStart} className="px-8">
            {currentGroup === 0 ? 'Comenzar' : 'Continuar'}
          </Button>
        )}
        
        {isActive && (
          <Button variant="outline" onClick={handleStop} className="px-8">
            Detener
          </Button>
        )}
        
        {currentGroup >= muscleGroups.length && (
          <Button onClick={handleStart} className="px-8">
            Repetir
          </Button>
        )}
      </div>

      <div className="bg-accent/30 p-4 rounded-lg">
        <h4 className="font-medium mb-2">Instrucciones:</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Tensa cada grupo muscular por 5 segundos</li>
          <li>• Relaja completamente por 5 segundos</li>
          <li>• Nota la diferencia entre tensión y relajación</li>
          <li>• Continúa desde los pies hasta la cabeza</li>
        </ul>
      </div>
    </div>
  );
};