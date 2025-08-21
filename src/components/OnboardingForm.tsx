import { useState } from "react";
import { WellnessCard } from "./WellnessCard";
import { WellnessButton } from "./WellnessButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface UserProfile {
  name: string;
  gender: string;
  dateOfBirth: string;
  stressSummary: string;
}

interface OnboardingFormProps {
  onComplete: (profile: UserProfile) => void;
}

export const OnboardingForm = ({ onComplete }: OnboardingFormProps) => {
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    gender: "",
    dateOfBirth: "",
    stressSummary: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (profile.name && profile.gender && profile.dateOfBirth && profile.stressSummary) {
      onComplete(profile);
    }
  };

  const isComplete = profile.name && profile.gender && profile.dateOfBirth && profile.stressSummary;

  return (
    <WellnessCard className="max-w-md mx-auto">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-foreground mb-2">Bienvenido a ZenFlow</h2>
          <p className="text-muted-foreground">Personalicemos tu experiencia</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">¿Cómo te gustaría que te llamemos?</Label>
            <Input
              id="name"
              value={profile.name}
              onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ingresa tu nombre preferido"
              className="transition-calm focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Género</Label>
            <Select value={profile.gender} onValueChange={(value) => setProfile(prev => ({ ...prev, gender: value }))}>
              <SelectTrigger className="transition-calm">
                <SelectValue placeholder="Selecciona tu género" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="female">Femenino</SelectItem>
                <SelectItem value="male">Masculino</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dob">Fecha de Nacimiento</Label>
            <Input
              id="dob"
              type="date"
              value={profile.dateOfBirth}
              onChange={(e) => setProfile(prev => ({ ...prev, dateOfBirth: e.target.value }))}
              className="transition-calm focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary">Breve resumen de tus preocupaciones sobre estrés y ansiedad</Label>
            <Textarea
              id="summary"
              value={profile.stressSummary}
              onChange={(e) => setProfile(prev => ({ ...prev, stressSummary: e.target.value }))}
              placeholder="Cuéntanos qué te ha estado causando estrés o ansiedad últimamente..."
              className="min-h-24 transition-calm focus:ring-primary resize-none"
            />
          </div>

          <WellnessButton 
            type="submit" 
            className="w-full" 
            disabled={!isComplete}
            size="lg"
          >
            Continúa Tu Viaje
          </WellnessButton>
        </form>
      </div>
    </WellnessCard>
  );
};