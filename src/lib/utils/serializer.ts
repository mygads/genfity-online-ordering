/**
 * Serializer Utilities
 * Handle BigInt, Decimal, Date and other special type serialization
 */

import { Decimal } from '@prisma/client/runtime/library';

/**
 * Convert BigInt, Decimal, Date values to JSON-compatible types recursively
 * @param obj - Object to serialize
 * @returns Serialized object with special types converted
 */
export function serializeBigInt<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'bigint') {
    return String(obj) as T;
  }

  // Handle Prisma Decimal
  if (obj instanceof Decimal) {
    return obj.toNumber() as T;
  }

  // Handle Date
  if (obj instanceof Date) {
    return obj.toISOString() as T;
  }

  if (Array.isArray(obj)) {
    return obj.map(serializeBigInt) as T;
  }

  if (typeof obj === 'object') {
    const serialized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      serialized[key] = serializeBigInt(value);
    }
    return serialized as T;
  }

  return obj;
}

/**
 * Custom JSON stringifier that handles BigInt
 * @param data - Data to stringify
 * @returns JSON string
 */
export function jsonStringify(data: unknown): string {
  return JSON.stringify(data, (_, value) =>
    typeof value === 'bigint' ? value.toString() : value
  );
}
