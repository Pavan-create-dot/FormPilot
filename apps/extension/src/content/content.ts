import { MatchResult } from "@jobease/shared-types";
import { detectFormFields } from "./formDetector";
import { fillField } from "./filler";

let activeElementsMap = new Map<string, HTMLElement>();
let activeMatches: MatchResult[] = [];

// Create & Inject Floating Review Overlay into Webpage DOM
function renderReviewModal(matches: MatchResult[], profileCompleteness: number) {
  const existing = document.getElementById("jobease-review-modal-root");
  if (existing) existing.remove();

  const modalRoot = document.createElement("div");
  modalRoot.id = "jobease-review-modal-root";
  modalRoot.style.position = "fixed";
  modalRoot.style.top = "20px";
  modalRoot.style.right = "20px";
  modalRoot.style.zIndex = "999999";
  modalRoot.style.width = "400px";
  modalRoot.style.maxHeight = "85vh";
  modalRoot.style.overflowY = "auto";
  modalRoot.style.backgroundColor = "#0f172a";
  modalRoot.style.color = "#f8fafc";
  modalRoot.style.border = "1px solid #334155";
  modalRoot.style.borderRadius = "12px";
  modalRoot.style.boxShadow = "0 25px 50px -12px rgba(0, 0, 0, 0.5)";
  modalRoot.style.fontFamily = "system-ui, -apple-system, sans-serif";
  modalRoot.style.padding = "16px";

  const highConfidence = matches.filter((m) => m.confidence >= 0.90 && !m.isSensitive && m.suggestedValue !== undefined);
  const needsConfirmation = matches.filter((m) => (m.confidence >= 0.65 && m.confidence < 0.90) || m.isSensitive || m.shouldAskUser);
  const unknownFields = matches.filter((m) => m.confidence < 0.65 || m.suggestedValue === undefined);

  let html = `
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
      <div style="display: flex; align-items: center; gap: 8px;">
        <div style="width: 28px; height: 28px; background: #4f46e5; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-weight: bold;">⚡</div>
        <h3 style="margin: 0; font-size: 16px; font-weight: 700; color: #fff;">JobEase Review</h3>
      </div>
      <button id="jobease-modal-close" style="background: none; border: none; color: #94a3b8; font-size: 18px; cursor: pointer;">✕</button>
    </div>

    <div style="font-size: 12px; color: #94a3b8; margin-bottom: 12px; padding: 8px; background: #1e293b; border-radius: 6px;">
      Profile Completeness: <strong style="color: #6366f1;">${profileCompleteness}%</strong>
    </div>

    <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px;">
  `;

  // High Confidence Fields
  if (highConfidence.length > 0) {
    html += `<div style="font-size: 11px; font-weight: 700; color: #10b981; text-transform: uppercase;">✓ Ready to Fill (${highConfidence.length})</div>`;
    highConfidence.forEach((m) => {
      html += `
        <div style="background: #1e293b; padding: 8px; border-radius: 6px; font-size: 12px;">
          <div style="font-weight: 600; color: #cbd5e1;">${m.originalQuestion || m.profileField}</div>
          <div style="color: #10b981; margin-top: 2px;">Value: ${m.suggestedValue}</div>
        </div>
      `;
    });
  }

  // Needs Confirmation / Sensitive
  if (needsConfirmation.length > 0) {
    html += `<div style="font-size: 11px; font-weight: 700; color: #f59e0b; text-transform: uppercase; margin-top: 8px;">⚠ Needs Confirmation (${needsConfirmation.length})</div>`;
    needsConfirmation.forEach((m, idx) => {
      html += `
        <div style="background: #1e293b; padding: 8px; border-radius: 6px; font-size: 12px; border-left: 3px solid #f59e0b;">
          <div style="font-weight: 600; color: #cbd5e1;">${m.originalQuestion || m.profileField}</div>
          <div style="color: #f59e0b; margin-top: 2px;">Suggested: ${m.suggestedValue || "Not set"} (${Math.round(m.confidence * 100)}%)</div>
          <label style="display: flex; align-items: center; gap: 6px; margin-top: 6px; font-size: 11px; color: #94a3b8;">
            <input type="checkbox" class="jobease-confirm-cb" data-field-id="${m.fieldId}" checked />
            Confirm this answer
          </label>
        </div>
      `;
    });
  }

  // Unknown / Low Confidence Fields
  if (unknownFields.length > 0) {
    html += `<div style="font-size: 11px; font-weight: 700; color: #ef4444; text-transform: uppercase; margin-top: 8px;">? Unknown Fields (${unknownFields.length})</div>`;
    unknownFields.forEach((m) => {
      html += `
        <div style="background: #1e293b; padding: 8px; border-radius: 6px; font-size: 12px; border-left: 3px solid #ef4444;">
          <div style="font-weight: 600; color: #cbd5e1;">${m.originalQuestion}</div>
          <input type="text" class="jobease-unknown-input" data-field-id="${m.fieldId}" placeholder="Enter answer..." style="width: 100%; box-sizing: border-box; margin-top: 6px; padding: 6px; background: #0f172a; border: 1px solid #334155; border-radius: 4px; color: #fff; font-size: 12px;" />
          <label style="display: flex; align-items: center; gap: 6px; margin-top: 6px; font-size: 11px; color: #94a3b8;">
            <input type="checkbox" class="jobease-remember-cb" data-field-id="${m.fieldId}" />
            Remember my answer for similar questions
          </label>
        </div>
      `;
    });
  }

  html += `
    </div>
    <div style="display: flex; gap: 8px; border-top: 1px solid #334155; padding-top: 12px;">
      <button id="jobease-fill-btn" style="flex: 1; padding: 10px; background: #4f46e5; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 13px;">
        Fill Confirmed Fields
      </button>
      <button id="jobease-cancel-btn" style="padding: 10px; background: #334155; color: #cbd5e1; border: none; border-radius: 6px; font-weight: 500; cursor: pointer; font-size: 13px;">
        Cancel
      </button>
    </div>
  `;

  modalRoot.innerHTML = html;
  document.body.appendChild(modalRoot);

  // Bind close buttons
  document.getElementById("jobease-modal-close")?.addEventListener("click", () => modalRoot.remove());
  document.getElementById("jobease-cancel-btn")?.addEventListener("click", () => modalRoot.remove());

  // Bind Fill button
  document.getElementById("jobease-fill-btn")?.addEventListener("click", async () => {
    let filledCount = 0;

    // 1. Fill high confidence fields
    highConfidence.forEach((m) => {
      const el = activeElementsMap.get(m.fieldId);
      if (el && m.suggestedValue !== undefined) {
        if (fillField(el, m.suggestedValue)) filledCount++;
      }
    });

    // 2. Fill confirmed fields
    const confirmCBs = document.querySelectorAll<HTMLInputElement>(".jobease-confirm-cb:checked");
    confirmCBs.forEach((cb) => {
      const fId = cb.getAttribute("data-field-id");
      const match = matches.find((m) => m.fieldId === fId);
      const el = fId ? activeElementsMap.get(fId) : undefined;
      if (match && el && match.suggestedValue !== undefined) {
        if (fillField(el, match.suggestedValue)) filledCount++;
      }
    });

    // 3. Fill unknown answered fields & save to custom answers if "Remember" checked
    const unknownInputs = document.querySelectorAll<HTMLInputElement>(".jobease-unknown-input");
    unknownInputs.forEach(async (input) => {
      const val = input.value.trim();
      const fId = input.getAttribute("data-field-id");
      if (val && fId) {
        const el = activeElementsMap.get(fId);
        const match = matches.find((m) => m.fieldId === fId);
        if (el && fillField(el, val)) filledCount++;

        const rememberCB = document.querySelector<HTMLInputElement>(`.jobease-remember-cb[data-field-id="${fId}"]`);
        if (rememberCB && rememberCB.checked && match?.originalQuestion) {
          // Send message to background to save custom answer
          chrome.runtime.sendMessage({
            type: "SAVE_CUSTOM_ANSWER",
            payload: {
              originalQuestion: match.originalQuestion,
              answer: val,
              fieldType: "text"
            }
          });
        }
      }
    });

    alert(`JobEase: Successfully filled ${filledCount} field(s). Please review before manually submitting.`);
    modalRoot.remove();
  });
}

// Listen for messages from popup or background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SCAN_AND_REVIEW") {
    const { fields, elementsMap } = detectFormFields();
    activeElementsMap = elementsMap;

    chrome.runtime.sendMessage(
      { type: "MATCH_FIELDS", payload: { fields } },
      (response) => {
        if (response && response.matches) {
          activeMatches = response.matches;
          renderReviewModal(response.matches, response.profileCompleteness || 0);
          sendResponse({ success: true, count: fields.length, matches: response.matches });
        } else {
          alert("JobEase: Could not connect to API or user not logged in.");
          sendResponse({ success: false });
        }
      }
    );
    return true; // Keep response channel open
  }

  if (message.type === "DETECT_FIELDS_COUNT") {
    const { fields } = detectFormFields();
    sendResponse({ count: fields.length });
    return true;
  }
});
