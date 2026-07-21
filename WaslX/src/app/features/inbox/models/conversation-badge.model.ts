export type BadgeVariant = 'success' | 'warning' | 'danger' | 'neutral' | 'ai';

export interface BadgeDisplay {
  label: string;
  variant: BadgeVariant;
  visible: boolean;
}
