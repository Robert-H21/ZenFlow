import { useState } from "react";
import { WellnessCard } from "./WellnessCard";
import { WellnessButton } from "./WellnessButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Heart, Brain, Activity, BookOpen, Lightbulb, Target, ChevronDown, Briefcase, Home, User, Star, Flower2, Search, GraduationCap, Users } from "lucide-react";
import workStressImg from "@/assets/work-stress.jpg";
import personalLifeImg from "@/assets/personal-life.jpg";
import internalFactorsImg from "@/assets/internal-factors.jpg";
import workplaceStressImg from "@/assets/workplace-stress.jpg";
import studentStressImg from "@/assets/student-stress.jpg";
import breathingActivityImg from "@/assets/breathing-activity.jpg";
import muscleActivityImg from "@/assets/muscle-activity.jpg";
import mindfulActivityImg from "@/assets/mindful-activity.jpg";
import gratitudeActivityImg from "@/assets/gratitude-activity.jpg";
import meditationActivityImg from "@/assets/meditation-activity.jpg";
import bodyScanActivityImg from "@/assets/body-scan-activity.jpg";
import { BreathingActivity } from "./activities/BreathingActivity";
import { MuscleTensionActivity } from "./activities/MuscleTensionActivity";
import { MindfulObservationActivity } from "./activities/MindfulObservationActivity";
import { GratitudeJournalActivity } from "./activities/GratitudeJournalActivity";
import { MeditationActivity } from "./activities/MeditationActivity";
import { BodyScanActivity } from "./activities/BodyScanActivity";

interface DashboardProps {
  userName: string;
  stressLevel: number;
  stressCategory: string;
}

const adviceByLevel = {
  low: [
    "Mantén tu rutina actual de manejo del estrés - ¡lo estás haciendo muy bien!",
    "Practica gratitud diariamente para reforzar patrones de pensamiento positivo",
    "Continúa con ejercicio regular y hábitos de sueño saludables",
    "Comparte tus estrategias exitosas de afrontamiento con otros que puedan beneficiarse"
  ],
  moderate: [
    "Establece una práctica diaria de mindfulness o meditación (comienza con 5-10 minutos)",
    "Crea límites entre el tiempo de trabajo y personal",
    "Practica ejercicios de respiración profunda cuando te sientas abrumado/a",
    "Considera hablar con un consejero o terapeuta para apoyo adicional"
  ],
  high: [
    "Prioriza el alivio inmediato del estrés mediante técnicas de respiración profunda y grounding",
    "Busca apoyo de amigos, familia o un profesional de salud mental",
    "Enfócate en autocuidado básico: sueño adecuado, nutrición y movimiento suave",
    "Considera terapia profesional o consejería para desarrollar estrategias de afrontamiento"
  ]
};

const stressReliefActivities = [
  {
    title: "Respiración 4-7-8",
    description: "Inhala por 4, mantén por 7, exhala por 8. Repite 4 veces.",
    icon: Heart,
    duration: "2 minutos",
    image: breathingActivityImg
  },
  {
    title: "Relajación Muscular Progresiva",
    description: "Tensa y libera cada grupo muscular desde los pies hasta la cabeza.",
    icon: Activity,
    duration: "10 minutos",
    image: muscleActivityImg
  },
  {
    title: "Observación Consciente",
    description: "Enfócate en 5 cosas que puedes ver, 4 que puedes oír, 3 que puedes tocar.",
    icon: Brain,
    duration: "5 minutos",
    image: mindfulActivityImg
  },
  {
    title: "Diario de Gratitud",
    description: "Escribe 3 cosas por las que estás agradecido/a hoy.",
    icon: BookOpen,
    duration: "5 minutos",
    image: gratitudeActivityImg
  },
  {
    title: "Meditación Guiada",
    description: "Sesión de mindfulness para encontrar paz interior y reducir el estrés.",
    icon: Flower2,
    duration: "5-30 minutos",
    image: meditationActivityImg
  },
  {
    title: "Escaneo Corporal",
    description: "Explora conscientemente cada parte de tu cuerpo para liberar tensiones.",
    icon: Search,
    duration: "8 minutos",
    image: bodyScanActivityImg
  }
];

const stressCauses = [
  {
    category: "Estrés Estudiantil",
    icon: GraduationCap,
    image: studentStressImg,
    causes: [
      {
        title: "Presión académica",
        description: "Exigencias altas de calificaciones y competencia constante con otros estudiantes."
      },
      {
        title: "Carga de trabajo excesiva",
        description: "Múltiples materias, proyectos y exámenes que se acumulan simultáneamente."
      },
      {
        title: "Incertidumbre sobre el futuro",
        description: "Preocupaciones sobre carrera profesional y estabilidad económica futura."
      }
    ],
    solutions: [
      {
        title: "Técnicas de estudio eficientes",
        description: "Organiza tu tiempo de estudio y usa métodos como la técnica Pomodoro."
      },
      {
        title: "Equilibrio vida-estudio",
        description: "Dedica tiempo a actividades recreativas y socialización."
      }
    ]
  },
  {
    category: "Estrés Laboral",
    icon: Briefcase,
    image: workplaceStressImg,
    causes: [
      {
        title: "Carga de trabajo excesiva",
        description: "Cuando las demandas laborales superan tu capacidad de manejo, puede generar agotamiento físico y mental."
      },
      {
        title: "Ambiente laboral tóxico",
        description: "Relaciones conflictivas con colegas o supervisores que crean un entorno negativo y estresante."
      },
      {
        title: "Falta de control",
        description: "Sentir que no tienes influencia sobre tus tareas o decisiones laborales puede aumentar significativamente el estrés."
      },
      {
        title: "Inseguridad laboral",
        description: "La incertidumbre sobre la estabilidad del empleo genera ansiedad constante y preocupación por el futuro."
      }
    ],
    solutions: [
      {
        title: "Técnicas de gestión del tiempo",
        description: "Aprende a priorizar tareas, delegar cuando sea posible y establecer límites claros entre trabajo y vida personal."
      },
      {
        title: "Comunicación asertiva",
        description: "Desarrolla habilidades para expresar tus necesidades y preocupaciones de manera profesional y constructiva."
      },
      {
        title: "Pausas regulares",
        description: "Incorpora descansos breves durante el día y toma tus vacaciones para recargar energías."
      },
      {
        title: "Desarrollo profesional",
        description: "Invierte en mejorar tus habilidades para aumentar tu confianza y valor en el mercado laboral."
      }
    ]
  },
  {
    category: "Vida Personal",
    icon: Home,
    image: personalLifeImg,
    causes: [
      {
        title: "Problemas de relación",
        description: "Conflictos familiares o de pareja que pueden generar tensión emocional constante y afectar otras áreas de la vida."
      },
      {
        title: "Preocupaciones financieras",
        description: "La inseguridad económica puede crear ansiedad persistente y afectar tu capacidad de disfrutar la vida."
      },
      {
        title: "Problemas de salud",
        description: "Enfermedades propias o de seres queridos que generan preocupación y pueden limitar tus actividades diarias."
      },
      {
        title: "Cambios importantes",
        description: "Transiciones como mudanzas, divorcios o pérdidas que requieren adaptación y pueden generar estrés temporal."
      }
    ],
    solutions: [
      {
        title: "Redes de apoyo social",
        description: "Mantén conexiones fuertes con amigos, familia y comunidad para tener apoyo emocional cuando lo necesites."
      },
      {
        title: "Planificación financiera",
        description: "Crea un presupuesto, establece un fondo de emergencia y busca asesoría financiera si es necesario."
      },
      {
        title: "Cuidado preventivo",
        description: "Mantén revisiones médicas regulares y adopta hábitos saludables para prevenir problemas de salud."
      },
      {
        title: "Flexibilidad y adaptación",
        description: "Desarrolla habilidades de adaptación y considera los cambios como oportunidades de crecimiento."
      }
    ]
  },
  {
    category: "Factores Internos",
    icon: User,
    image: internalFactorsImg,
    causes: [
      {
        title: "Perfeccionismo",
        description: "Establecer estándares imposiblemente altos puede llevarte al agotamiento y la insatisfacción constante."
      },
      {
        title: "Diálogo interno negativo",
        description: "Los pensamientos autocríticos y pesimistas pueden intensificar el estrés y reducir tu autoestima."
      },
      {
        title: "Expectativas poco realistas",
        description: "Esperar demasiado de ti mismo o de las situaciones puede llevar a la frustración y el desánimo."
      },
      {
        title: "Autocuidado deficiente",
        description: "Descuidar tus necesidades básicas de sueño, ejercicio y nutrición afecta tu capacidad de manejar el estrés."
      }
    ],
    solutions: [
      {
        title: "Práctica de auto-compasión",
        description: "Trátate con la misma amabilidad que mostrarías a un buen amigo durante momentos difíciles."
      },
      {
        title: "Mindfulness y meditación",
        description: "Desarrolla la capacidad de observar tus pensamientos sin juzgarlos y mantenerte presente en el momento."
      },
      {
        title: "Establecimiento de metas realistas",
        description: "Define objetivos alcanzables y celebra los pequeños logros en el camino hacia tus metas mayores."
      },
      {
        title: "Rutinas de bienestar",
        description: "Crea hábitos consistentes de ejercicio, sueño adecuado, nutrición balanceada y tiempo para relajarte."
      }
    ]
  }
];

const motivationalQuotes = [
  "Cada pequeño paso hacia el bienestar es una victoria que merece ser celebrada.",
  "Tu capacidad de superar los desafíos es más fuerte de lo que imaginas.",
  "El autocuidado no es egoísmo, es una necesidad para poder cuidar de otros.",
  "Los momentos difíciles son temporales, pero tu fortaleza es permanente.",
  "Cada día es una nueva oportunidad para elegir tu bienestar.",
  "Tu paz mental vale más que cualquier perfección externa.",
  "El progreso, no la perfección, es lo que realmente importa en tu viaje.",
  "Eres más resiliente de lo que cualquier situación estresante."
];

export const WellnessDashboard = ({ userName, stressLevel, stressCategory }: DashboardProps) => {
  const [activeActivity, setActiveActivity] = useState<string | null>(null);
  const [isActivityDialogOpen, setIsActivityDialogOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [currentQuote] = useState(() => 
    motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
  );

  const getCurrentAdvice = () => {
    if (stressLevel <= 3) return adviceByLevel.low;
    if (stressLevel <= 6) return adviceByLevel.moderate;
    return adviceByLevel.high;
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Welcome Header */}
      <WellnessCard className="text-center bg-gradient-calm">
        <div className="flex items-center justify-center space-x-4 mb-4">
          <h1 className="text-3xl font-bold text-foreground">Bienvenido/a de vuelta, {userName}</h1>
          <Badge className={stressLevel <= 3 ? "bg-green-100 text-green-800" : stressLevel <= 6 ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}>
            Estrés {stressCategory}
          </Badge>
        </div>
        <p className="text-muted-foreground">Tu viaje personalizado de bienestar continúa aquí</p>
      </WellnessCard>

      <Tabs defaultValue="advice" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 gap-1 h-auto p-1">
          <TabsTrigger value="advice" className="text-xs md:text-sm px-2 py-2 md:px-3">Consejos</TabsTrigger>
          <TabsTrigger value="activities" className="text-xs md:text-sm px-2 py-2 md:px-3">Actividades</TabsTrigger>
          <TabsTrigger value="causes" className="text-xs md:text-sm px-2 py-2 md:px-3">Entender Estrés</TabsTrigger>
          <TabsTrigger value="progress" className="text-xs md:text-sm px-2 py-2 md:px-3">Progreso</TabsTrigger>
          <TabsTrigger value="creators" className="text-xs md:text-sm px-2 py-2 md:px-3 col-span-2 md:col-span-1">Creadores</TabsTrigger>
        </TabsList>

        <TabsContent value="advice" className="space-y-4">
          <WellnessCard>
            <div className="flex items-center space-x-2 mb-4">
              <Lightbulb className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Recomendaciones Personalizadas</h2>
            </div>
            <div className="grid gap-4">
              {getCurrentAdvice().map((advice, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-accent/30 rounded-lg">
                  <div className="bg-primary/20 text-primary rounded-full p-1 mt-1">
                    <Target className="h-4 w-4" />
                  </div>
                  <p className="text-foreground">{advice}</p>
                </div>
              ))}
            </div>
            
            {/* Frase Motivadora */}
            <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border-l-4 border-primary">
              <div className="flex items-center space-x-2 mb-2">
                <Star className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">Frase del Día</h3>
              </div>
              <p className="text-foreground italic">"{currentQuote}"</p>
            </div>
          </WellnessCard>
        </TabsContent>

        <TabsContent value="activities" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {stressReliefActivities.map((activity, index) => {
              const Icon = activity.icon;
              return (
                 <WellnessCard 
                   key={index} 
                   className={`cursor-pointer transition-calm ${activeActivity === activity.title ? 'ring-2 ring-primary' : ''}`}
                   animated
                   onClick={() => {
                     setActiveActivity(activity.title);
                     setIsActivityDialogOpen(true);
                   }}
                 >
                   <div className="mb-4">
                     <img 
                       src={activity.image} 
                       alt={activity.title} 
                       className="w-full h-32 object-cover rounded-lg"
                     />
                   </div>
                   <div className="flex items-start space-x-4">
                     <div className="bg-primary/20 text-primary rounded-full p-3">
                       <Icon className="h-6 w-6" />
                     </div>
                     <div className="flex-1">
                       <h3 className="font-semibold text-foreground mb-1">{activity.title}</h3>
                       <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
                       <Badge variant="secondary">{activity.duration}</Badge>
                     </div>
                   </div>
                 </WellnessCard>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="causes" className="space-y-4">
          <div className="grid gap-6">
            {stressCauses.map((category, index) => {
              const Icon = category.icon;
              const isExpanded = expandedCategories.includes(category.category);
              
              return (
                <WellnessCard key={index} className="overflow-hidden">
                  <Collapsible>
                    <CollapsibleTrigger 
                      className="w-full"
                      onClick={() => toggleCategory(category.category)}
                    >
                      <div className="flex items-center justify-between p-2 hover:bg-accent/50 rounded-lg transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className="bg-primary/20 text-primary rounded-full p-2">
                            <Icon className="h-5 w-5" />
                          </div>
                          <h3 className="text-lg font-semibold text-foreground">{category.category}</h3>
                        </div>
                        <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${
                          isExpanded ? 'rotate-180' : ''
                        }`} />
                      </div>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent>
                      <div className="mt-4">
                        <div className="mb-6">
                          <img 
                            src={category.image} 
                            alt={category.category} 
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-medium text-foreground mb-4 flex items-center">
                              <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                              Causas Comunes
                            </h4>
                            <div className="space-y-4">
                              {category.causes.map((cause, idx) => (
                                <div key={idx} className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border-l-3 border-red-500">
                                  <h5 className="font-medium text-foreground mb-1">{cause.title}</h5>
                                  <p className="text-sm text-muted-foreground">{cause.description}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-foreground mb-4 flex items-center">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              Soluciones Efectivas
                            </h4>
                            <div className="space-y-4">
                              {category.solutions.map((solution, idx) => (
                                <div key={idx} className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-3 border-green-500">
                                  <h5 className="font-medium text-foreground mb-1">{solution.title}</h5>
                                  <p className="text-sm text-muted-foreground">{solution.description}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </WellnessCard>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <WellnessCard className="text-center">
            <h2 className="text-xl font-semibold text-foreground mb-4">Sigue Tu Viaje</h2>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                La evaluación regular ayuda a seguir tu progreso. Considera retomar la evaluación semanalmente para monitorear tus niveles de estrés.
              </p>
              <WellnessButton onClick={() => window.location.reload()}>
                Retomar Evaluación
              </WellnessButton>
            </div>
          </WellnessCard>
        </TabsContent>

        <TabsContent value="creators" className="space-y-4">
          <WellnessCard>
            <div className="text-center space-y-6">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Users className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-semibold">Equipo de Desarrollo</h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {["Jocabed Llanca Lorenzo", "Rosa Roque Colorado", "Mishelle López Valles", "Noelia Doria Aranda"].map((name, index) => (
                  <div key={index} className="p-4 bg-accent/30 rounded-lg">
                    <h3 className="font-semibold text-foreground">{name}</h3>
                    <p className="text-sm text-muted-foreground mt-2">Desarrolladora</p>
                  </div>
                ))}
              </div>
              <p className="text-muted-foreground">ZenFlow fue creado con dedicación para ayudarte en tu bienestar.</p>
            </div>
          </WellnessCard>
        </TabsContent>
      </Tabs>

      {/* Activity Dialog */}
      <Dialog open={isActivityDialogOpen} onOpenChange={setIsActivityDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{activeActivity}</DialogTitle>
          </DialogHeader>
          
          {activeActivity === "Respiración 4-7-8" && (
            <BreathingActivity onComplete={() => setIsActivityDialogOpen(false)} />
          )}
          
          {activeActivity === "Relajación Muscular Progresiva" && (
            <MuscleTensionActivity onComplete={() => setIsActivityDialogOpen(false)} />
          )}
          
          {activeActivity === "Observación Consciente" && (
            <MindfulObservationActivity onComplete={() => setIsActivityDialogOpen(false)} />
          )}
          
          {activeActivity === "Diario de Gratitud" && (
            <GratitudeJournalActivity onComplete={() => setIsActivityDialogOpen(false)} />
          )}
          
          {activeActivity === "Meditación Guiada" && (
            <MeditationActivity onComplete={() => setIsActivityDialogOpen(false)} />
          )}
          
          {activeActivity === "Escaneo Corporal" && (
            <BodyScanActivity onComplete={() => setIsActivityDialogOpen(false)} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
