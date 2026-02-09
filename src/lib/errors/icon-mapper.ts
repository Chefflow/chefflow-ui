import {
  AlertCircle,
  Clock,
  KeyRound,
  type LucideIcon,
  Mail,
  ServerCrash,
  UserX,
  WifiOff,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  UserX,
  Mail,
  KeyRound,
  WifiOff,
  Clock,
  ServerCrash,
  AlertCircle,
};

export function getIconComponent(iconName: string): LucideIcon {
  return iconMap[iconName] || AlertCircle;
}
