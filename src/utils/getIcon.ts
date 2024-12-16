import * as lucide from 'lucide-react';

export default function getIcon(name: string, fallBack: string): React.ComponentType<{ size: number }> | null
{
  const normalized = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  return (lucide as any)[normalized] || (lucide as any)[fallBack];
}
