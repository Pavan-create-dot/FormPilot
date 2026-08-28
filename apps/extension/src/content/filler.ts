export function fillTextInput(element: HTMLInputElement | HTMLTextAreaElement, value: string): boolean {
  try {
    element.focus();

    const prototype = element instanceof HTMLInputElement ? window.HTMLInputElement.prototype : window.HTMLTextAreaElement.prototype;
    const valueSetter = Object.getOwnPropertyDescriptor(prototype, "value")?.set;

    if (valueSetter) {
      valueSetter.call(element, value);
    } else {
      element.value = value;
    }

    element.dispatchEvent(new Event("input", { bubbles: true }));
    element.dispatchEvent(new Event("change", { bubbles: true }));
    element.dispatchEvent(new Event("blur", { bubbles: true }));
    return true;
  } catch (err) {
    console.error("Error filling text input:", err);
    return false;
  }
}

export function fillSelect(element: HTMLSelectElement, value: string): boolean {
  try {
    element.focus();

    // Match exact text or value option
    let targetIndex = -1;
    const targetValueNorm = value.toLowerCase().trim();

    for (let i = 0; i < element.options.length; i++) {
      const opt = element.options[i];
      if (
        opt.value.toLowerCase().trim() === targetValueNorm ||
        opt.text.toLowerCase().trim() === targetValueNorm ||
        opt.text.toLowerCase().includes(targetValueNorm)
      ) {
        targetIndex = i;
        break;
      }
    }

    if (targetIndex >= 0) {
      element.selectedIndex = targetIndex;
      const valueSetter = Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, "value")?.set;
      if (valueSetter) {
        valueSetter.call(element, element.options[targetIndex].value);
      }
      element.dispatchEvent(new Event("change", { bubbles: true }));
      element.dispatchEvent(new Event("blur", { bubbles: true }));
      return true;
    }
    return false;
  } catch (err) {
    console.error("Error filling select input:", err);
    return false;
  }
}

export function fillRadioGroup(elements: HTMLInputElement[], value: string | boolean): boolean {
  try {
    const valStr = String(value).toLowerCase().trim();
    for (const radio of elements) {
      const radioLabel = radio.parentElement?.textContent?.toLowerCase().trim() || radio.value.toLowerCase().trim();
      if (radioLabel.includes(valStr) || valStr.includes(radioLabel)) {
        radio.focus();
        radio.checked = true;
        radio.dispatchEvent(new Event("change", { bubbles: true }));
        return true;
      }
    }
    return false;
  } catch (err) {
    console.error("Error filling radio group:", err);
    return false;
  }
}

export function fillCheckbox(element: HTMLInputElement, checked: boolean): boolean {
  try {
    element.focus();
    element.checked = checked;
    element.dispatchEvent(new Event("change", { bubbles: true }));
    return true;
  } catch (err) {
    console.error("Error filling checkbox:", err);
    return false;
  }
}

export function fillField(element: HTMLElement, value: any): boolean {
  if (!element || value === undefined || value === null) return false;

  const strValue = Array.isArray(value) ? value.join(", ") : String(value);

  if (element instanceof HTMLInputElement) {
    if (element.type === "radio") {
      const name = element.name;
      const radios = name ? Array.from(document.querySelectorAll<HTMLInputElement>(`input[type='radio'][name='${name}']`)) : [element];
      return fillRadioGroup(radios, value);
    }
    if (element.type === "checkbox") {
      return fillCheckbox(element, Boolean(value));
    }
    return fillTextInput(element, strValue);
  }

  if (element instanceof HTMLTextAreaElement) {
    return fillTextInput(element, strValue);
  }

  if (element instanceof HTMLSelectElement) {
    return fillSelect(element, strValue);
  }

  return false;
}
