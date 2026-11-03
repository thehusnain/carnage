import { z } from 'zod';

export const vehicleIds = ['conventional', 'connected', 'electrified', 'assisted'] as const;
export const modes = ['Mechanical', 'Electronic', 'Network', 'Security', 'Threat', 'Protection'] as const;
export type VehicleId = typeof vehicleIds[number];
export type Mode = typeof modes[number];
export type Level = 'beginner' | 'technical';
const ids = z.array(z.string().min(1));
export const componentSchema = z.object({
  id: z.string().min(1), name: z.string().min(1), category: z.enum(['Mechanical', 'Electronic', 'Energy', 'Connectivity', 'Assistance']),
  vehicles: z.array(z.enum(vehicleIds)).min(1), location: z.string().min(1), description: z.string().min(1), purpose: z.string().min(1),
  operation: z.string().min(1), technical: z.string().min(1), inputs: ids.min(1), outputs: ids.min(1), related: ids,
  interfaces: ids, security: z.string().min(1), threats: ids, protections: ids, limitations: z.string().min(1), prerequisites: ids, sources: ids.min(1),
  anchor: z.tuple([z.number().min(0).max(100), z.number().min(0).max(100)]),
});
export type Component = z.infer<typeof componentSchema>;
export const threatSchema = z.object({
  id: z.string(), name: z.string(), definition: z.string(), access: z.string(), principle: z.string(), impact: z.string(),
  limitations: z.string(), components: ids.min(1), protections: ids.min(1), sources: ids.min(1),
});
export type Threat = z.infer<typeof threatSchema>;
export const protectionSchema = z.object({
  id: z.string(), name: z.string(), description: z.string(), technical: z.string(), requirement: z.string(), limitations: z.string(), sources: ids.min(1),
});
export type Protection = z.infer<typeof protectionSchema>;
export const topicSchema = z.object({
  id: z.string(), name: z.string(), description: z.string(), technical: z.string(), limitations: z.string(), components: ids, sources: ids.min(1),
});
export type Topic = z.infer<typeof topicSchema>;
