import {
  Activity,
  Brain,
  Ear,
  Smile,
  Sparkles,
  Users,
  type LucideProps,
} from "lucide-react";
import type { ReactNode } from "react";

/**
 * Mapea la clave `icon` de cada servicio a su ícono de lucide-react.
 *
 * El map guarda funciones de render en lugar de componentes para no asignar un
 * componente a una variable durante el render, que es lo que penaliza la regla
 * `react-hooks/static-components`.
 */
const iconMap: Record<string, (props: LucideProps) => ReactNode> = {
  activity: (props) => <Activity {...props} />,
  brain: (props) => <Brain {...props} />,
  ear: (props) => <Ear {...props} />,
  smile: (props) => <Smile {...props} />,
  sparkles: (props) => <Sparkles {...props} />,
  users: (props) => <Users {...props} />,
};

export function renderServiceIcon(key: string, props: LucideProps): ReactNode {
  return (iconMap[key] ?? iconMap.sparkles)(props);
}
