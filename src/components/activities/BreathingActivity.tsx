import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Heart, Volume2, VolumeX } from "lucide-react";

interface BreathingActivityProps {
  onComplete?: () => void;
}

export const BreathingActivity = ({ onComplete }: BreathingActivityProps) => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale');
  const [timeLeft, setTimeLeft] = useState(4);
  const [cycle, setCycle] = useState(0);
  const [progress, setProgress] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Función para crear sonidos de respiración
  const playBreathingSound = (type: 'inhale' | 'exhale') => {
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
      
      if (type === 'inhale') {
        // Sonido ascendente para inhalar
        oscillator.frequency.setValueAtTime(200, context.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, context.currentTime + 1);
        gainNode.gain.setValueAtTime(0, context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.1, context.currentTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.05, context.currentTime + 3);
        gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 4);
      } else {
        // Sonido descendente para exhalar
        oscillator.frequency.setValueAtTime(400, context.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(150, context.currentTime + 2);
        gainNode.gain.setValueAtTime(0, context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.08, context.currentTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.04, context.currentTime + 6);
        gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 8);
      }
      
      oscillator.type = 'sine';
      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + (type === 'inhale' ? 4 : 8));
    } catch (error) {
      console.log('Audio not supported');
    }
  };

  const phaseDurations = {
    inhale: 4,
    hold: 7,
    exhale: 8,
    rest: 1
  };

  const phaseLabels = {
    inhale: 'Inhala',
    hold: 'Mantén',
    exhale: 'Exhala',
    rest: 'Descansa'
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && cycle < 4) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Cambiar de fase
            if (phase === 'inhale') {
              setPhase('hold');
              return phaseDurations.hold;
            } else if (phase === 'hold') {
              setPhase('exhale');
              playBreathingSound('exhale');
              return phaseDurations.exhale;
            } else if (phase === 'exhale') {
              setPhase('rest');
              return phaseDurations.rest;
            } else {
              // Completar ciclo
              setCycle(prev => prev + 1);
              setPhase('inhale');
              if (cycle + 1 < 4) {
                playBreathingSound('inhale');
              }
              return phaseDurations.inhale;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }

    if (cycle >= 4) {
      setIsActive(false);
      onComplete?.();
    }

    return () => clearInterval(interval);
  }, [isActive, phase, cycle, onComplete]);

  useEffect(() => {
    if (isActive) {
      const totalDuration = Object.values(phaseDurations).reduce((a, b) => a + b, 0);
      const currentPhaseProgress = ((phaseDurations[phase] - timeLeft) / phaseDurations[phase]) * 100;
      let phaseOffset = 0;
      
      if (phase === 'hold') phaseOffset = (phaseDurations.inhale / totalDuration) * 100;
      else if (phase === 'exhale') phaseOffset = ((phaseDurations.inhale + phaseDurations.hold) / totalDuration) * 100;
      else if (phase === 'rest') phaseOffset = ((phaseDurations.inhale + phaseDurations.hold + phaseDurations.exhale) / totalDuration) * 100;
      
      const cycleProgress = (cycle / 4) * 100;
      const currentCycleProgress = (phaseOffset + (currentPhaseProgress / totalDuration) * 100) / 4;
      
      setProgress(cycleProgress + currentCycleProgress);
    }
  }, [phase, timeLeft, cycle, isActive]);

  const handleStart = () => {
    setIsActive(true);
    setCycle(0);
    setPhase('inhale');
    setTimeLeft(4);
    setProgress(0);
    playBreathingSound('inhale');
  };

  const handleStop = () => {
    setIsActive(false);
    setCycle(0);
    setPhase('inhale');
    setTimeLeft(4);
    setProgress(0);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className={`p-4 rounded-full transition-all duration-1000 ${
            phase === 'inhale' ? 'bg-blue-100 scale-110' :
            phase === 'hold' ? 'bg-yellow-100 scale-125' :
            phase === 'exhale' ? 'bg-green-100 scale-90' :
            'bg-gray-100 scale-100'
          }`}>
            <Heart className={`h-8 w-8 transition-all duration-1000 ${
              phase === 'inhale' ? 'text-blue-600' :
              phase === 'hold' ? 'text-yellow-600' :
              phase === 'exhale' ? 'text-green-600' :
              'text-gray-600'
            }`} />
          </div>
        </div>
        
        {isActive && (
          <>
            <h3 className="text-2xl font-bold text-foreground mb-2">
              {phaseLabels[phase]}
            </h3>
            <div className="text-4xl font-mono font-bold text-primary mb-4">
              {timeLeft}
            </div>
            <p className="text-muted-foreground mb-4">
              Ciclo {cycle + 1} de 4
            </p>
          </>
        )}
        
        {!isActive && cycle === 0 && (
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2">Respiración 4-7-8</h3>
            <p className="text-muted-foreground">
              Técnica de respiración para reducir el estrés y la ansiedad
            </p>
          </div>
        )}
        
        {cycle >= 4 && (
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-green-600 mb-2">¡Completado!</h3>
            <p className="text-muted-foreground">
              Has completado 4 ciclos de respiración 4-7-8
            </p>
          </div>
        )}
      </div>

      <Progress value={progress} className="w-full" />

      <div className="flex gap-4 justify-center">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="mb-4"
        >
          {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </Button>
      </div>

      <div className="flex gap-4 justify-center">
        {!isActive && cycle < 4 && (
          <Button onClick={handleStart} className="px-8">
            {cycle === 0 ? 'Comenzar' : 'Continuar'}
          </Button>
        )}
        
        {isActive && (
          <Button variant="outline" onClick={handleStop} className="px-8">
            Detener
          </Button>
        )}
        
        {cycle >= 4 && (
          <Button onClick={handleStart} className="px-8">
            Repetir
          </Button>
        )}
      </div>

      <div className="bg-accent/30 p-4 rounded-lg">
        <h4 className="font-medium mb-2">Instrucciones:</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Inhala por la nariz durante 4 segundos</li>
          <li>• Mantén la respiración por 7 segundos</li>
          <li>• Exhala completamente por la boca durante 8 segundos</li>
          <li>• Repite el ciclo 4 veces</li>
        </ul>
      </div>
    </div>
  );
};