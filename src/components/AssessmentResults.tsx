import { WellnessCard } from "./WellnessCard";
import { WellnessButton } from "./WellnessButton";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface AssessmentResultsProps {
  score: number;
  level: string;
  userName: string;
  onContinue: () => void;
}

export const AssessmentResults = ({ score, level, userName, onContinue }: AssessmentResultsProps) => {
  const getScoreColor = () => {
    if (score <= 3) return "bg-green-100 text-green-800 border-green-200";
    if (score <= 6) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  const getEncouragement = () => {
    if (score <= 3) return "¡Estás manejando bien el estrés! Ayudémosle a mantener este estado positivo.";
    if (score <= 6) return "Estás experimentando estrés moderado. Juntos podemos trabajar para reducirlo.";
    return "Estás lidiando con estrés significativo. Recuerda, no estás solo/a y aquí hay ayuda.";
  };

  return (
    <WellnessCard className="max-w-2xl mx-auto text-center" animated>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            {userName}, aquí están tus resultados
          </h2>
          <p className="text-muted-foreground">Tu evaluación personalizada de bienestar</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-4">
            <div className="text-4xl font-bold text-primary animate-breathe">
              {score}/10
            </div>
            <Badge className={getScoreColor()}>
              Nivel de Estrés {level}
            </Badge>
          </div>
          
          <Progress 
            value={score * 10} 
            className="w-full h-3" 
          />
        </div>

        <div className="bg-gradient-calm p-4 rounded-lg">
          <p className="text-foreground font-medium">
            {getEncouragement()}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 text-left">
          <div className="p-4 bg-accent/30 rounded-lg">
            <h4 className="font-semibold text-foreground mb-2">Qué significa esto:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              {score <= 3 && (
                <>
                  <li>• Tienes mecanismos de afrontamiento saludables</li>
                  <li>• Los niveles de estrés son manejables</li>
                  <li>• Enfócate en mantener el equilibrio</li>
                </>
              )}
              {score > 3 && score <= 6 && (
                <>
                  <li>• Algunas áreas necesitan atención</li>
                  <li>• El estrés está afectando la vida diaria</li>
                  <li>• Es momento de implementar estrategias de afrontamiento</li>
                </>
              )}
              {score > 6 && (
                <>
                  <li>• El estrés te está impactando significativamente</li>
                  <li>• El apoyo profesional puede ser útil</li>
                  <li>• El autocuidado inmediato es importante</li>
                </>
              )}
            </ul>
          </div>

          <div className="p-4 bg-secondary/50 rounded-lg">
            <h4 className="font-semibold text-foreground mb-2">Próximos pasos:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Explora consejos personalizados</li>
              <li>• Prueba actividades para aliviar el estrés</li>
              <li>• Aprende sobre manejo del estrés</li>
              <li>• Construye hábitos diarios saludables</li>
            </ul>
          </div>
        </div>

        <WellnessButton 
          onClick={onContinue}
          size="lg"
          className="w-full"
        >
          Explora Tu Plan de Bienestar
        </WellnessButton>
      </div>
    </WellnessCard>
  );
};