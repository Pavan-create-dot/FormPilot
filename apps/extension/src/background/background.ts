const API_BASE = "http://localhost:5000/api";

async function getStoredToken(): Promise<string | null> {
  return new Promise((resolve) => {
    chrome.storage.local.get(["jobease_token"], (result) => {
      resolve(result.jobease_token || null);
    });
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SET_TOKEN") {
    chrome.storage.local.set({ jobease_token: message.payload.token }, () => {
      sendResponse({ success: true });
    });
    return true;
  }

  if (message.type === "GET_TOKEN") {
    getStoredToken().then((token) => sendResponse({ token }));
    return true;
  }

  if (message.type === "MATCH_FIELDS") {
    (async () => {
      try {
        const token = await getStoredToken();
        const res = await fetch(`${API_BASE}/fields/match`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify(message.payload)
        });
        const data = await res.json();
        sendResponse(data);
      } catch (err: any) {
        console.error("Match fields API error:", err);
        sendResponse({ error: err.message });
      }
    })();
    return true;
  }

  if (message.type === "SAVE_CUSTOM_ANSWER") {
    (async () => {
      try {
        const token = await getStoredToken();
        const res = await fetch(`${API_BASE}/custom-answers`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify(message.payload)
        });
        const data = await res.json();
        sendResponse(data);
      } catch (err: any) {
        console.error("Save custom answer error:", err);
        sendResponse({ error: err.message });
      }
    })();
    return true;
  }

  if (message.type === "GET_PROFILE") {
    (async () => {
      try {
        const token = await getStoredToken();
        if (!token) {
          sendResponse({ authenticated: false });
          return;
        }
        const res = await fetch(`${API_BASE}/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) {
          sendResponse({ authenticated: false });
          return;
        }
        const data = await res.json();
        sendResponse({ authenticated: true, profile: data.profile, completeness: data.completeness });
      } catch (err: any) {
        sendResponse({ authenticated: false, error: err.message });
      }
    })();
    return true;
  }
});
