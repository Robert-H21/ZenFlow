import { useState } from "react";
import { OnboardingForm } from "@/components/OnboardingForm";
import { AssessmentQuiz } from "@/components/AssessmentQuiz";
import { AssessmentResults } from "@/components/AssessmentResults";
import { WellnessDashboard } from "@/components/WellnessDashboard";
import zenHero from "@/assets/zen-hero.jpg";

interface UserProfile {
  name: string;
  gender: string;
  dateOfBirth: string;
  stressSummary: string;
}

type AppStep = 'welcome' | 'onboarding' | 'assessment' | 'results' | 'dashboard';

const Index = () => {
  const [currentStep, setCurrentStep] = useState<AppStep>('welcome');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [assessmentScore, setAssessmentScore] = useState<number>(0);
  const [stressLevel, setStressLevel] = useState<string>('');

  const handleOnboardingComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    setCurrentStep('assessment');
  };

  const handleAssessmentComplete = (score: number, level: string) => {
    setAssessmentScore(score);
    setStressLevel(level);
    setCurrentStep('results');
  };

  const handleResultsContinue = () => {
    setCurrentStep('dashboard');
  };

  const handleGetStarted = () => {
    setCurrentStep('onboarding');
  };

  if (currentStep === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-calm">
        {/* Hero Section */}
        <div className="relative h-screen flex items-center justify-center overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${zenHero})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background/80" />
          </div>
          
          <div className="relative z-10 text-center max-w-4xl mx-auto px-4 space-y-8">
            <div className="space-y-4 animate-float">
              <h1 className="text-5xl md:text-7xl font-bold text-foreground">
                <span className="bg-gradient-primary bg-clip-text text-transparent">ZenFlow   "Encuentra tu paz Interior"
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Tu viaje personalizado para superar el estrés y la ansiedad comienza aquí. 
                Descubre estrategias de afrontamiento, entiende tus problemas y construye hábitos de bienestar duraderos.
              </p>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={handleGetStarted}
                className="bg-gradient-primary text-primary-foreground px-8 py-4 rounded-full text-lg font-semibold shadow-peaceful hover:shadow-gentle transition-calm hover:scale-105 animate-breathe"
              >
                Comienza Tu Viaje de paz y Bienestar
              </button>
              <p className="text-sm text-muted-foreground">
                Gratis • Personalizado • Basado en evidencia
                <p></p>
                Todos los derechos reservados 2025
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-calm py-8 px-4">
      <div className="container mx-auto">
        {currentStep === 'onboarding' && (
          <OnboardingForm onComplete={handleOnboardingComplete} />
        )}
        
        {currentStep === 'assessment' && (
          <AssessmentQuiz onComplete={handleAssessmentComplete} />
        )}
        
        {currentStep === 'results' && userProfile && (
          <AssessmentResults 
            score={assessmentScore}
            level={stressLevel}
            userName={userProfile.name}
            onContinue={handleResultsContinue}
          />
        )}
        
        {currentStep === 'dashboard' && userProfile && (
          <WellnessDashboard 
            userName={userProfile.name}
            stressLevel={assessmentScore}
            stressCategory={stressLevel}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
