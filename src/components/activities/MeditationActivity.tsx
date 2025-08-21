import { useState, useEffect, useRef } from "react";
import { WellnessButton } from "../WellnessButton";
import { WellnessCard } from "../WellnessCard";
import { Play, Pause, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import meditationImg from "@/assets/meditation-activity.jpg";

interface MeditationActivityProps {
  onComplete: () => void;
}

export const MeditationActivity = ({ onComplete }: MeditationActivityProps) => {
  const [duration, setDuration] = useState(5); // 5 minutos por defecto
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [volume, setVolume] = useState([0.5]);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Crear el audio de meditación (sonido suave de olas)
    audioRef.current = new Audio("data:audio/wav;base64,UklGRhwCAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YfgBAAC0tbWttbW1qbu1tbu1qbW1qLW1qbW1tbWoqam1qam1qam1qam1qLW1qbW1qam1qLW1tbWptau1tbWotbW1u7Wptam1tbWptbW1qLW1qbWptau1tbWptbW1qLW1qLW1qbWptbW1qLW1qLW1qLWptbW1qLW1qbWptbW1qLW1qbWptbW1qLW1qbWptbW1qLW1qbWptbW1qLW1qbWptbW1qLW1qbWptbW1qLW1qbWptbW1qLW1qbWptbW1qLW1qbWptbW1qLW1qbWptbW1qLW1qbWptbW1qLW1qbWptbW1qLW1qbWptbW1qLW1qbW1qLW1qbW1qLW1qbW1qLW1qbW1qLW1qbW1qLW1qbW1qLW1qbW1qLW1qbW1qLW1qbW1qLW1qbW1qLW1qbW1qLW1qbW1qLW1qbW1qLW1qbW1qLW1qbW1qLW1qbW1qLW1qbW1qLW1qbW1qLW1qbW1qLW1qbW1qLW1qbW1qLW1qLW1qLW1qbW1qLW1qLW1qbW1qLW1qbW1qLW1qbW1qLW1qbW1qLW1qbW1qLW1qbW1qLW1qbW1qLW1qbW1qLW1qbW1qLW1qbW1qLW1qbW1qLW1qbW1qLW1qbW1qLW1qbW1qLW1qbW1qLW1qbW1qLW1qbW1qLW1qbW1qLW1qbW1qLW1qbW1qLW1qbW1qLW1qbW1qLW1qbW1qLW1qbW1qbW1qLW1qLW1qLW1qbW1qLW1qbW1qLW1qbW1qLW1qbW1qLW1qbW1qLW1qbW1qLW1qbW1qLW1qbW1qLW1qbW1qLW1qbW1qbW1qLW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qLW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qLW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1qbW1");
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
    setTimeLeft(duration * 60);
    setIsCompleted(false);
  }, [duration]);

  const startTimer = () => {
    setIsActive(true);
    if (audioRef.current && !isMuted) {
      audioRef.current.play();
    }
    
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsActive(false);
          setIsCompleted(true);
          if (audioRef.current) {
            audioRef.current.pause();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pauseTimer = () => {
    setIsActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(duration * 60);
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

  const progress = ((duration * 60 - timeLeft) / (duration * 60)) * 100;

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <img 
          src={meditationImg} 
          alt="Sesión de meditación" 
          className="w-full h-48 object-cover rounded-lg"
        />
      </div>

      <WellnessCard>
        <div className="text-center space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Meditación Guiada</h3>
            <p className="text-muted-foreground">
              Encuentra paz interior con esta sesión de meditación mindfulness. Respira profundamente y suelta toda tensión.
            </p>
          </div>

          {!isActive && !isCompleted && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Duración (minutos)</label>
                <Slider
                  value={[duration]}
                  onValueChange={(value) => setDuration(value[0])}
                  max={30}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <p className="text-sm text-muted-foreground mt-1">{duration} minutos</p>
              </div>
            </div>
          )}

          <div className="relative">
            <div className="w-32 h-32 mx-auto mb-4 relative">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                <circle 
                  cx="50" 
                  cy="50" 
                  r="45" 
                  stroke="hsl(var(--muted))" 
                  strokeWidth="4" 
                  fill="none" 
                />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="45" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth="4" 
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                  className="transition-all duration-1000 ease-in-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{formatTime(timeLeft)}</div>
                  <div className="text-xs text-muted-foreground">restante</div>
                </div>
              </div>
            </div>
          </div>

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
              onClick={resetTimer}
              disabled={!isActive && timeLeft === duration * 60}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reiniciar
            </WellnessButton>
            
            <WellnessButton
              onClick={isActive ? pauseTimer : startTimer}
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
                  {timeLeft === duration * 60 ? 'Comenzar' : 'Reanudar'}
                </>
              )}
            </WellnessButton>
          </div>

          {isCompleted && (
            <div className="text-center p-4 bg-primary/10 rounded-lg">
              <h4 className="font-semibold text-foreground mb-2">¡Sesión Completada!</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Has completado {duration} minutos de meditación mindfulness. ¡Excelente trabajo!
              </p>
              <WellnessButton onClick={onComplete}>
                Finalizar Sesión
              </WellnessButton>
            </div>
          )}
        </div>
      </WellnessCard>
    </div>
  );
};