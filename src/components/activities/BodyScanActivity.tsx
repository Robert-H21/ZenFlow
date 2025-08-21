import { useState, useEffect, useRef } from "react";
import { WellnessButton } from "../WellnessButton";
import { WellnessCard } from "../WellnessCard";
import { Play, Pause, RotateCcw, Volume2, VolumeX, ChevronRight } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import bodyScanImg from "@/assets/body-scan-activity.jpg";

interface BodyScanActivityProps {
  onComplete: () => void;
}

const bodyParts = [
  { name: "Pies", duration: 30, instruction: "Enfócate en tus pies. Siente cualquier tensión o relajación. Respira hacia esta área." },
  { name: "Piernas", duration: 45, instruction: "Dirige tu atención a tus piernas. Nota las sensaciones desde los tobillos hasta las caderas." },
  { name: "Caderas", duration: 30, instruction: "Centra tu atención en la zona de las caderas. Permite que se relajen completamente." },
  { name: "Abdomen", duration: 45, instruction: "Siente tu abdomen subir y bajar con cada respiración. Relaja todos los músculos." },
  { name: "Pecho", duration: 40, instruction: "Observa tu pecho expandirse y contraerse. Libera cualquier tensión acumulada." },
  { name: "Brazos", duration: 40, instruction: "Desde los hombros hasta las puntas de los dedos, siente tus brazos completamente relajados." },
  { name: "Cuello", duration: 30, instruction: "Relaja los músculos del cuello. Deja que tu cabeza descanse naturalmente." },
  { name: "Rostro", duration: 35, instruction: "Suaviza todos los músculos de tu rostro. Relaja la mandíbula, los ojos, la frente." }
];

export const BodyScanActivity = ({ onComplete }: BodyScanActivityProps) => {
  const [currentPart, setCurrentPart] = useState(0);
  const [timeLeft, setTimeLeft] = useState(bodyParts[0].duration);
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [volume, setVolume] = useState([0.5]);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Crear el audio de relajación (sonido suave de respiración)
    audioRef.current = new Audio("data:audio/wav;base64,UklGRsQBAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YaABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAQABAAEAAQABAAIAAgACAAIAAgACAAMAAwADAAMAAwADAAQABAAEAAQABAAEAAUABQAFAAUABQAFAAYABgAGAAYABgAGAAcABwAHAAcABwAHAAgACAAIAAgACAAIAAkACQAJAAkACQAJAAoACgAKAAoACgAKAAsACwALAAsACwALAAwADAAMAAwADAAMAA0ADQANAA0ADQANAA4ADgAOAA4ADgAOAA8ADwAPAA8ADwAPABAAEAAQABAAEAAQABEAEQARABEAEQARABIAEgASABIAEgASABMAEwATABMAEwATABQAFAAUABQAFAAUABUAFQAVABUAFQAVABYAFgAWABYAFgAWABcAFwAXABcAFwAXABgAGAAYABgAGAAYABkAGQAZABkAGQAZABoAGgAaABoAGgAaABsAGwAbABsAGwAbABwAHAAcABwAHAAcAB0AHQAdAB0AHQAdAB4AHgAeAB4AHgAeAB8AHwAfAB8AHwAfACAAIAAgACAAIAAgACEAIQAhACEAIQAhACIAIgAiACIAIgAiACMAIwAjACMAIwAjACQAJAAkACQAJAAkACUAJQAlACUAJQAlACYAJgAmACYAJgAmACcAJwAnACcAJwAnACgAKAAoACgAKAAoACkAKQApACkAKQApACoAKgAqACoAKgAqACsAKwArACsAKwArACwALAAsACwALAAsAC0ALQAtAC0ALQAtAC4ALgAuAC4ALgAuAC8ALwAvAC8ALwAvADAAMAAwADAAMAAwADEAMQAxADEAMQAxADIAMgAyADIAMgAyADMAMwAzADMAMwAzADQANAA0ADQANAA0ADUANQAAAAs=");
    audioRef.current.loop = true;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume[0];
    }
  }, [volume, isMuted]);

  useEffect(() => {
    setTimeLeft(bodyParts[currentPart].duration);
  }, [currentPart]);

  const startScan = () => {
    setIsActive(true);
    if (audioRef.current && !isMuted) {
      audioRef.current.play();
    }
    
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (currentPart < bodyParts.length - 1) {
            setCurrentPart((prev) => prev + 1);
            return bodyParts[currentPart + 1].duration;
          } else {
            setIsActive(false);
            setIsCompleted(true);
            if (audioRef.current) {
              audioRef.current.pause();
            }
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pauseScan = () => {
    setIsActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const resetScan = () => {
    setIsActive(false);
    setCurrentPart(0);
    setTimeLeft(bodyParts[0].duration);
    setIsCompleted(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const totalDuration = bodyParts.reduce((sum, part) => sum + part.duration, 0);
  const elapsedDuration = bodyParts.slice(0, currentPart).reduce((sum, part) => sum + part.duration, 0) + 
                          (bodyParts[currentPart].duration - timeLeft);
  const progress = (elapsedDuration / totalDuration) * 100;

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <img 
          src={bodyScanImg} 
          alt="Escaneo corporal" 
          className="w-full h-48 object-cover rounded-lg"
        />
      </div>

      <WellnessCard>
        <div className="text-center space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Escaneo Corporal</h3>
            <p className="text-muted-foreground">
              Conecta con tu cuerpo mediante una exploración consciente desde los pies hasta la cabeza.
            </p>
          </div>

          <div className="text-center mb-6">
            <div className="text-3xl font-bold text-primary mb-2">
              {bodyParts[currentPart].name}
            </div>
            <div className="text-lg text-foreground mb-2">
              {formatTime(timeLeft)}
            </div>
            <div className="w-full bg-muted rounded-full h-2 mb-4">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-1000"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Parte {currentPart + 1} de {bodyParts.length}
            </p>
          </div>

          <WellnessCard className="bg-accent/20 border-l-4 border-primary">
            <p className="text-sm text-foreground text-left">
              {bodyParts[currentPart].instruction}
            </p>
          </WellnessCard>

          <div className="flex items-center justify-center space-x-2 mb-4">
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-full hover:bg-accent transition-colors"
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
            {!isMuted && (
              <Slider
                value={volume}
                onValueChange={setVolume}
                max={1}
                min={0}
                step={0.1}
                className="w-20"
              />
            )}
          </div>

          <div className="flex justify-center space-x-4">
            <WellnessButton
              variant="outline"
              size="sm"
              onClick={resetScan}
              disabled={!isActive && currentPart === 0 && timeLeft === bodyParts[0].duration}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reiniciar
            </WellnessButton>
            
            <WellnessButton
              onClick={isActive ? pauseScan : startScan}
              disabled={isCompleted}
              size="lg"
            >
              {isActive ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Pausar
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  {currentPart === 0 && timeLeft === bodyParts[0].duration ? 'Comenzar' : 'Reanudar'}
                </>
              )}
            </WellnessButton>
          </div>

          {isCompleted && (
            <div className="text-center p-4 bg-primary/10 rounded-lg">
              <h4 className="font-semibold text-foreground mb-2">¡Escaneo Completado!</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Has completado un recorrido completo por todo tu cuerpo. Ahora conoces mejor las sensaciones de tu organismo.
              </p>
              <WellnessButton onClick={onComplete}>
                Finalizar Sesión
              </WellnessButton>
            </div>
          )}

          {/* Progreso por partes del cuerpo */}
          <div className="grid grid-cols-2 gap-2 mt-6">
            {bodyParts.map((part, index) => (
              <div 
                key={index}
                className={`flex items-center space-x-2 p-2 rounded-lg transition-colors ${
                  index === currentPart 
                    ? 'bg-primary/20 text-primary' 
                    : index < currentPart 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                    : 'bg-muted/50 text-muted-foreground'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${
                  index === currentPart 
                    ? 'bg-primary animate-pulse' 
                    : index < currentPart 
                    ? 'bg-green-500' 
                    : 'bg-muted-foreground'
                }`} />
                <span className="text-xs font-medium">{part.name}</span>
                {index === currentPart && <ChevronRight className="h-3 w-3 ml-auto" />}
              </div>
            ))}
          </div>
        </div>
      </WellnessCard>
    </div>
  );
};