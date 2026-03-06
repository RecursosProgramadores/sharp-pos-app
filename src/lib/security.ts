/**
 * Security utilities for the application
 * Covers: XSS prevention, input sanitization, rate limiting, activity logging
 */

import { supabase } from "@/integrations/supabase/client";

// ==========================================
// INPUT SANITIZATION & XSS PREVENTION
// ==========================================

/**
 * Sanitize string input to prevent XSS attacks
 * Strips HTML tags and dangerous characters
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove inline event handlers
    .replace(/data:\s*text\/html/gi, '') // Remove data:text/html
    .trim();
}

/**
 * Sanitize object values recursively
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const sanitized = { ...obj };
  for (const key in sanitized) {
    const value = sanitized[key];
    if (typeof value === 'string') {
      (sanitized as Record<string, unknown>)[key] = sanitizeInput(value);
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      (sanitized as Record<string, unknown>)[key] = sanitizeObject(value as Record<string, unknown>);
    }
  }
  return sanitized;
}

/**
 * Validate phone number format (Peru)
 */
export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 9 && cleaned.length <= 15;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/;
  return emailRegex.test(email) && email.length <= 320;
}

/**
 * Validate price - must be positive number within reasonable range
 */
export function isValidPrice(price: number): boolean {
  return typeof price === 'number' && price > 0 && price <= 100000 && isFinite(price);
}

/**
 * Validate quantity - must be positive integer within reasonable range
 */
export function isValidQuantity(qty: number): boolean {
  return Number.isInteger(qty) && qty > 0 && qty <= 10000;
}

// ==========================================
// RATE LIMITING (Client-side)
// ==========================================

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

/**
 * Simple client-side rate limiter
 * @returns true if request should be blocked
 */
export function isRateLimited(key: string, maxAttempts: number = 5, windowMs: number = 60000): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);
  
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }
  
  entry.count++;
  if (entry.count > maxAttempts) {
    return true;
  }
  
  return false;
}

/**
 * Get remaining seconds until rate limit resets
 */
export function getRateLimitRemainingSeconds(key: string): number {
  const entry = rateLimitMap.get(key);
  if (!entry) return 0;
  const remaining = Math.ceil((entry.resetAt - Date.now()) / 1000);
  return Math.max(0, remaining);
}

// ==========================================
// ACTIVITY LOGGING / AUDIT TRAIL
// ==========================================

/**
 * Log user activity for audit trail
 */
export async function logActivity(params: {
  action: string;
  entityType: string;
  entityId?: string;
  details?: Record<string, unknown>;
}): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('activity_logs').insert({
      user_id: user.id,
      action: params.action,
      entity_type: params.entityType,
      entity_id: params.entityId || null,
      details: params.details || {},
    });
  } catch (error) {
    // Silently fail - don't break app flow for logging
    console.error('Activity log error:', error);
  }
}

// ==========================================
// SESSION SECURITY
// ==========================================

/**
 * Check if session is still valid and not expired
 */
export async function validateSession(): Promise<boolean> {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session) return false;
    
    // Check if token is expired
    const expiresAt = session.expires_at;
    if (expiresAt && expiresAt * 1000 < Date.now()) {
      await supabase.auth.signOut();
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
}

// ==========================================
// FILE UPLOAD SECURITY
// ==========================================

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Validate file before upload
 */
export function validateFileUpload(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { valid: false, error: 'Tipo de archivo no permitido. Solo se aceptan imágenes (JPEG, PNG, WebP, GIF).' };
  }
  
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'El archivo es demasiado grande. Máximo 5MB.' };
  }
  
  // Check file extension matches type
  const ext = file.name.split('.').pop()?.toLowerCase();
  const validExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
  if (!ext || !validExtensions.includes(ext)) {
    return { valid: false, error: 'Extensión de archivo no válida.' };
  }
  
  return { valid: true };
}

// ==========================================
// CSP NONCE (for inline scripts if needed)
// ==========================================

/**
 * Generate a random nonce for CSP
 */
export function generateNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
}
