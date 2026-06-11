import {
  ArrowRight,
  AudioLines,
  BrainCircuit,
  Building2,
  Calculator,
  Check,
  CheckCircle2,
  FileText,
  Layers,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Tent,
  Users,
  type LucideIcon,
} from "lucide-react";

// Maps the icon keys stored in the aivexa_ tables to Lucide icons.
const icons: Record<string, LucideIcon> = {
  munim: Calculator,
  voice: AudioLines,
  hospital: Stethoscope,
  camp: Tent,
  chat: MessageSquare,
  brain: BrainCircuit,
  shield: ShieldCheck,
  check: CheckCircle2,
  layers: Layers,
  doc: FileText,
  users: Users,
  spark: Sparkles,
  tick: Check,
  arrow: ArrowRight,
  mail: Mail,
  pin: MapPin,
  phone: Phone,
  building: Building2,
};

export default function Icon({
  name,
  size = 24,
  strokeWidth = 1.8,
}: {
  name: string;
  size?: number;
  strokeWidth?: number;
}) {
  const Cmp = icons[name] ?? Sparkles;
  return <Cmp size={size} strokeWidth={strokeWidth} aria-hidden="true" />;
}
