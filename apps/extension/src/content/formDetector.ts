import { DetectedField } from "@jobease/shared-types";
import { extractFieldContext } from "./fieldExtractor";

export function detectFormFields(): { fields: DetectedField[]; elementsMap: Map<string, HTMLElement> } {
  const elementsMap = new Map<string, HTMLElement>();
  const fields: DetectedField[] = [];

  const selector = "input:not([type='hidden']):not([type='submit']):not([type='button']), textarea, select";
  const elements = Array.from(document.querySelectorAll<HTMLElement>(selector));

  elements.forEach((el, index) => {
    // Skip invisible elements
    if (el.offsetWidth === 0 && el.offsetHeight === 0 && el.tagName.toLowerCase() !== "select") {
      return;
    }

    const field = extractFieldContext(el, index);
    fields.push(field);
    elementsMap.set(field.id, el);
  });

  return { fields, elementsMap };
}
