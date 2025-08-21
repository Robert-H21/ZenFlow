import { useState } from "react";
import { WellnessCard } from "./WellnessCard";
import { WellnessButton } from "./WellnessButton";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface Question {
  id: string;
  text: string;
  options: { value: string; label: string; score: number }[];
}

const questions: Question[] = [
  {
    id: "sleep",
    text: "¿Cómo ha sido la calidad de tu sueño últimamente?",
    options: [
      { value: "excellent", label: "Excelente - Duermo bien todas las noches", score: 1 },
      { value: "good", label: "Buena - Problemas menores de sueño ocasionalmente", score: 3 },
      { value: "fair", label: "Regular - Alteraciones del sueño frecuentes", score: 6 },
      { value: "poor", label: "Mala - Problemas crónicos de sueño", score: 9 }
    ]
  },
  {
    id: "worry",
    text: "¿Con qué frecuencia experimentas preocupación excesiva?",
    options: [
      { value: "rarely", label: "Raramente - Solo durante eventos importantes", score: 1 },
      { value: "sometimes", label: "A veces - Algunas veces por semana", score: 4 },
      { value: "often", label: "A menudo - Casi a diario", score: 7 },
      { value: "constantly", label: "Constantemente - Varias veces al día", score: 10 }
    ]
  },
  {
    id: "physical",
    text: "¿Experimentas síntomas físicos de estrés?",
    options: [
      { value: "none", label: "Sin síntomas físicos", score: 1 },
      { value: "mild", label: "Síntomas leves (dolores de cabeza ocasionales, tensión)", score: 3 },
      { value: "moderate", label: "Síntomas moderados (dolores regulares, fatiga)", score: 6 },
      { value: "severe", label: "Síntomas severos (dolor crónico, problemas digestivos)", score: 9 }
    ]
  },
  {
    id: "concentration",
    text: "¿Cómo está tu capacidad para concentrarte y enfocarte?",
    options: [
      { value: "excellent", label: "Excelente - Sin problemas para enfocarme", score: 1 },
      { value: "good", label: "Buena - Distracciones menores a veces", score: 3 },
      { value: "difficult", label: "Difícil - Me cuesta mantener el enfoque", score: 6 },
      { value: "impossible", label: "Casi imposible concentrarme", score: 10 }
    ]
  },
  {
    id: "social",
    text: "¿Cómo te sientes acerca de las interacciones sociales?",
    options: [
      { value: "enjoy", label: "Disfruto y busco interacciones sociales", score: 1 },
      { value: "comfortable", label: "Generalmente cómodo/a en entornos sociales", score: 2 },
      { value: "anxious", label: "A menudo me siento ansioso/a en situaciones sociales", score: 6 },
      { value: "avoid", label: "Evito activamente las interacciones sociales", score: 9 }
    ]
  },
  {
    id: "emotions",
    text: "¿Cómo manejas tus emociones cuando te sientes abrumado/a?",
    options: [
      { value: "well", label: "Muy bien - Tengo estrategias efectivas", score: 1 },
      { value: "okay", label: "Bien - A veces me cuesta pero me las arreglo", score: 3 },
      { value: "difficult", label: "Con dificultad - Me abruman las emociones fuertes", score: 7 },
      { value: "overwhelmed", label: "Muy mal - Me siento completamente desbordado/a", score: 10 }
    ]
  },
  {
    id: "worklife",
    text: "¿Cómo describirías tu equilibrio entre trabajo/estudio y vida personal?",
    options: [
      { value: "balanced", label: "Equilibrado - Tengo tiempo para todo", score: 1 },
      { value: "mostly", label: "Mayormente equilibrado - Pequeños desajustes ocasionales", score: 3 },
      { value: "unbalanced", label: "Desequilibrado - El trabajo/estudio domina mi tiempo", score: 7 },
      { value: "chaotic", label: "Caótico - Sin límites claros entre áreas de mi vida", score: 10 }
    ]
  },
  {
    id: "energy",
    text: "¿Cómo están tus niveles de energía durante el día?",
    options: [
      { value: "high", label: "Altos - Me siento energético/a la mayor parte del día", score: 1 },
      { value: "moderate", label: "Moderados - Tengo altibajos normales de energía", score: 3 },
      { value: "low", label: "Bajos - A menudo me siento cansado/a sin razón", score: 6 },
      { value: "exhausted", label: "Agotado/a - Constantemente sin energía", score: 9 }
    ]
  },
  {
    id: "appetite",
    text: "¿Has notado cambios en tu apetito o hábitos alimentarios?",
    options: [
      { value: "normal", label: "Normal - Sin cambios significativos", score: 1 },
      { value: "slight", label: "Ligeros cambios - Como un poco más o menos de lo usual", score: 3 },
      { value: "noticeable", label: "Cambios notables - Como mucho más o mucho menos", score: 6 },
      { value: "extreme", label: "Cambios extremos - Pérdida total o aumento excesivo de apetito", score: 9 }
    ]
  },
  {
    id: "decisions",
    text: "¿Cómo te sientes al tomar decisiones, incluso las pequeñas?",
    options: [
      { value: "confident", label: "Confiado/a - Tomo decisiones fácilmente", score: 1 },
      { value: "sometimes", label: "A veces dudoso/a - Algunas decisiones me cuestan", score: 4 },
      { value: "difficult", label: "Muy difícil - Me paralizo ante muchas decisiones", score: 7 },
      { value: "impossible", label: "Imposible - Evito tomar decisiones por completo", score: 10 }
    ]
  }
];

interface AssessmentQuizProps {
  onComplete: (score: number, level: string) => void;
}

export const AssessmentQuiz = ({ onComplete }: AssessmentQuizProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const handleAnswer = (value: string) => {
    const question = questions[currentQuestion];
    const selectedOption = question.options.find(opt => opt.value === value);
    if (selectedOption) {
      setAnswers(prev => ({ ...prev, [question.id]: selectedOption.score }));
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Calculate final score
      const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0);
      const maxScore = questions.length * 10;
      const normalizedScore = Math.round((totalScore / maxScore) * 10);
      
      let level = "Bajo";
      if (normalizedScore >= 7) level = "Alto";
      else if (normalizedScore >= 4) level = "Moderado";
      
      onComplete(normalizedScore, level);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQuestionData = questions[currentQuestion];
  const hasAnswer = answers[currentQuestionData.id] !== undefined;

  return (
    <WellnessCard className="max-w-2xl mx-auto">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-foreground mb-2">Evaluación de Estrés y Ansiedad</h2>
          <p className="text-muted-foreground">Pregunta {currentQuestion + 1} de {questions.length}</p>
        </div>

        <Progress value={progress} className="w-full" />

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-foreground">{currentQuestionData.text}</h3>
          
          <RadioGroup
            value={Object.keys(answers).find(key => key === currentQuestionData.id) ? 
              currentQuestionData.options.find(opt => opt.score === answers[currentQuestionData.id])?.value : ""}
            onValueChange={handleAnswer}
            className="space-y-3"
          >
            {currentQuestionData.options.map((option) => (
              <div key={option.value} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-calm">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="flex justify-end">
          <WellnessButton 
            onClick={handleNext}
            disabled={!hasAnswer}
            size="lg"
          >
            {currentQuestion < questions.length - 1 ? "Siguiente Pregunta" : "Ver Mis Resultados"}
          </WellnessButton>
        </div>
      </div>
    </WellnessCard>
  );
};