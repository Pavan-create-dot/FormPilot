import { DetectedField, ElementType } from "@jobease/shared-types";

function getAssociatedLabelText(element: HTMLElement): string | undefined {
  if (element.id) {
    const label = document.querySelector(`label[for="${element.id}"]`);
    if (label && label.textContent) {
      return label.textContent.trim();
    }
  }

  // Parent label wrapping input
  const parentLabel = element.closest("label");
  if (parentLabel && parentLabel.textContent) {
    return parentLabel.textContent.trim();
  }

  return undefined;
}

function getAriaLabelledbyText(element: HTMLElement): string | undefined {
  const labelledBy = element.getAttribute("aria-labelledby");
  if (!labelledBy) return undefined;

  const targetEl = document.getElementById(labelledBy);
  return targetEl?.textContent?.trim();
}

function getNearbyVisibleText(element: HTMLElement): string | undefined {
  let current: HTMLElement | null = element.parentElement;
  let depth = 0;

  while (current && depth < 3) {
    const textNodes: string[] = [];
    const walker = document.createTreeWalker(current, NodeFilter.SHOW_TEXT);

    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (node.nodeValue && node.parentElement !== element) {
        const trimmed = node.nodeValue.trim();
        if (trimmed.length > 2) {
          textNodes.push(trimmed);
        }
      }
    }

    if (textNodes.length > 0) {
      return textNodes.join(" ");
    }

    current = current.parentElement;
    depth++;
  }

  return undefined;
}

function generateCSSSelector(element: HTMLElement): string {
  if (element.id) return `#${element.id}`;
  if (element.getAttribute("name")) return `[name="${element.getAttribute("name")}"]`;
  return element.tagName.toLowerCase();
}

export function extractFieldContext(element: HTMLElement, idIndex: number): DetectedField {
  const tagName = element.tagName.toLowerCase();
  let elementType: ElementType = "input";

  if (tagName === "textarea") elementType = "textarea";
  else if (tagName === "select") elementType = "select";
  else if (element.getAttribute("type") === "radio") elementType = "radio";
  else if (element.getAttribute("type") === "checkbox") elementType = "checkbox";

  const inputType = element.getAttribute("type") || undefined;
  const name = element.getAttribute("name") || undefined;
  const domId = element.id || undefined;
  const placeholder = element.getAttribute("placeholder") || undefined;
  const ariaLabel = element.getAttribute("aria-label") || undefined;

  // Context extraction hierarchy
  const label =
    getAssociatedLabelText(element) ||
    ariaLabel ||
    getAriaLabelledbyText(element) ||
    placeholder ||
    name ||
    domId ||
    getNearbyVisibleText(element);

  const required =
    element.hasAttribute("required") ||
    element.getAttribute("aria-required") === "true" ||
    label?.includes("*") ||
    false;

  let options: string[] | undefined = undefined;
  if (elementType === "select") {
    const selectEl = element as HTMLSelectElement;
    options = Array.from(selectEl.options)
      .map((opt) => opt.text.trim())
      .filter((text) => text && text.toLowerCase() !== "select");
  }

  return {
    id: `field_${idIndex}_${domId || name || Math.random().toString(36).substring(7)}`,
    elementType,
    inputType,
    name,
    domId,
    placeholder,
    label: label?.replace(/\*/g, "").trim(),
    ariaLabel,
    nearbyText: getNearbyVisibleText(element),
    required,
    options,
    cssSelector: generateCSSSelector(element)
  };
}
