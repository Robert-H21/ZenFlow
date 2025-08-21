import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Brain, Eye, Ear, Hand, Volume2, VolumeX } from "lucide-react";

interface MindfulObservationActivityProps {
  onComplete?: () => void;
}

const observationSteps = [
  { 
    name: '5 cosas que puedes VER', 
    icon: Eye, 
    duration: 60,
    instruction: 'Mira a tu alrededor y encuentra 5 cosas que puedes ver. Obsérvalas detenidamente.',
    examples: ['Un objeto en la mesa', 'Un color específico', 'Una textura', 'Una forma', 'Un detalle que no habías notado']
  },
  { 
    name: '4 cosas que puedes OÍR', 
    icon: Ear, 
    duration: 45,
    instruction: 'Cierra los ojos y escucha. Identifica 4 sonidos diferentes.',
    examples: ['Sonidos de la naturaleza', 'Ruido de fondo', 'Tu propia respiración', 'Sonidos lejanos']
  },
  { 
    name: '3 cosas que puedes TOCAR', 
    icon: Hand, 
    duration: 30,
    instruction: 'Toca 3 objetos cerca de ti. Siente sus texturas, temperatura y forma.',
    examples: ['La superficie de una mesa', 'Tu ropa', 'Un objeto personal']
  }
];

export const MindfulObservationActivity = ({ onComplete }: MindfulObservationActivityProps) => {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [progress, setProgress] = useState(0);
  const [foundItems, setFoundItems] = useState<string[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Función para crear sonidos ambientales suaves
  const playStepSound = (stepIndex: number) => {
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
      
      // Diferentes tonos para cada paso
      const frequencies = [523, 659, 784]; // Do, Mi, Sol
      oscillator.frequency.setValueAtTime(frequencies[stepIndex], context.currentTime);
      
      // Sonido muy suave de transición
      gainNode.gain.setValueAtTime(0, context.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.03, context.currentTime + 0.1);
      gainNode.gain.linearRampToValueAtTime(0.01, context.currentTime + 0.8);
      gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 1.5);
      
      oscillator.type = 'sine';
      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + 1.5);
    } catch (error) {
      console.log('Audio not supported');
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && currentStep < observationSteps.length) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Pasar al siguiente paso
            setCurrentStep(prevStep => prevStep + 1);
            const nextStep = currentStep + 1;
            if (nextStep < observationSteps.length) {
              playStepSound(nextStep);
              return observationSteps[nextStep].duration;
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    if (currentStep >= observationSteps.length) {
      setIsActive(false);
      onComplete?.();
    }

    return () => clearInterval(interval);
  }, [isActive, currentStep, onComplete]);

  useEffect(() => {
    if (isActive && currentStep < observationSteps.length) {
      const step = observationSteps[currentStep];
      const stepProgress = ((step.duration - timeLeft) / step.duration) * 100;
      const totalProgress = (currentStep / observationSteps.length) * 100;
      const currentStepProgress = stepProgress / observationSteps.length;
      
      setProgress(totalProgress + currentStepProgress);
    }
  }, [currentStep, timeLeft, isActive]);

  const handleStart = () => {
    setIsActive(true);
    setCurrentStep(0);
    setTimeLeft(observationSteps[0].duration);
    setProgress(0);
    setFoundItems([]);
    playStepSound(0);
  };

  const handleStop = () => {
    setIsActive(false);
    setCurrentStep(0);
    setTimeLeft(observationSteps[0].duration);
    setProgress(0);
    setFoundItems([]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentStepData = observationSteps[currentStep];

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        {isActive && currentStep < observationSteps.length && (
          <>
            <div className="flex items-center justify-center mb-4">
              <div className="p-4 rounded-full bg-primary/20">
                <currentStepData.icon className="h-8 w-8 text-primary" />
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-foreground mb-2">
              {currentStepData.name}
            </h3>
            <p className="text-muted-foreground mb-4">
              {currentStepData.instruction}
            </p>
            <div className="text-4xl font-mono font-bold text-primary mb-4">
              {formatTime(timeLeft)}
            </div>
            <p className="text-muted-foreground mb-4">
              Paso {currentStep + 1} de {observationSteps.length}
            </p>
          </>
        )}
        
        {!isActive && currentStep === 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-center mb-4">
              <div className="p-4 rounded-full bg-primary/20">
                <Brain className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Observación Consciente 5-4-3</h3>
            <p className="text-muted-foreground">
              Técnica de grounding para conectarte con el momento presente
            </p>
          </div>
        )}
        
        {currentStep >= observationSteps.length && (
          <div className="mb-4">
            <div className="flex items-center justify-center mb-4">
              <div className="p-4 rounded-full bg-green-100">
                <Brain className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-green-600 mb-2">¡Completado!</h3>
            <p className="text-muted-foreground">
              Has completado el ejercicio de observación consciente
            </p>
          </div>
        )}
      </div>

      <Progress value={progress} className="w-full" />

      {isActive && currentStep < observationSteps.length && (
        <div className="bg-accent/30 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Ejemplos de lo que puedes encontrar:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            {currentStepData.examples.map((example, index) => (
              <li key={index}>• {example}</li>
            ))}
          </ul>
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
        {!isActive && currentStep < observationSteps.length && (
          <Button onClick={handleStart} className="px-8">
            {currentStep === 0 ? 'Comenzar' : 'Continuar'}
          </Button>
        )}
        
        {isActive && (
          <Button variant="outline" onClick={handleStop} className="px-8">
            Detener
          </Button>
        )}
        
        {currentStep >= observationSteps.length && (
          <Button onClick={handleStart} className="px-8">
            Repetir
          </Button>
        )}
      </div>

      <div className="bg-accent/30 p-4 rounded-lg">
        <h4 className="font-medium mb-2">Instrucciones:</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Encuentra 5 cosas que puedes ver (1 minuto)</li>
          <li>• Identifica 4 sonidos que puedes oír (45 segundos)</li>
          <li>• Toca 3 objetos y siente sus texturas (30 segundos)</li>
          <li>• Enfócate completamente en cada sentido</li>
        </ul>
      </div>
    </div>
  );
};