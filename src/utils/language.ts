type Language = 'bg' | 'en';

export function getLocalizedField<T extends Record<string, any>>(
  obj: T | null | undefined,
  fieldName: string,
  language: Language
): string {
  if (!obj) return '';

  const langField = `${fieldName}_${language}`;

  if (langField in obj && obj[langField]) {
    return obj[langField] as string;
  }

  if (fieldName in obj && obj[fieldName]) {
    return obj[fieldName] as string;
  }

  return '';
}

export function getLocalizedArray<T extends Record<string, any>>(
  obj: T | null | undefined,
  fieldName: string,
  language: Language
): string[] {
  if (!obj) return [];

  const langField = `${fieldName}_${language}`;

  if (langField in obj && Array.isArray(obj[langField]) && obj[langField].length > 0) {
    return obj[langField] as string[];
  }

  if (fieldName in obj && Array.isArray(obj[fieldName])) {
    return obj[fieldName] as string[];
  }

  return [];
}
