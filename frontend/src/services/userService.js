export async function sendTokenToBackend(idToken, options = {}) {
    const { isLogin = false, additionalData = {} } = options;
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

    const url = isLogin ? `${BACKEND_URL}/api/auth/me` : `${BACKEND_URL}/api/auth`;
    const method = isLogin ? "GET" : "POST";

    // !! Debugging
    console.log("📍 Sending to backend:", { url, method, additionalData });

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      ...(method === "POST" && { body: JSON.stringify(additionalData) }),
    });
  
    let data;
  
    try {
      data = await res.json();
    } catch {
      throw new Error("Invalid JSON response from backend");
    }
  
    if (!res.ok || !data.success) {
      const message = data?.message || "Backend request failed";
      throw new Error(message);
    }
  
    return data.data; // ✅ return only the user profile
  }



  // // fetchUserProfile

  //   export async function fetchUserProfile(idToken) {
  //       const res = await fetch("/api/me", {
  //           method: "GET",
  //           headers: {
  //               "Content-Type": "application/json",
  //               Authorization: `Bearer ${idToken}`,
  //           },
  //       });

  //       let data;

  //       try {
  //           data = await res.json();
  //           if (!data) {
  //               throw new Error("No data received from backend");
  //           }
            
  //       } catch {
  //           throw new Error("Invalid JSON response from backend");
  //       }

  //       if (!res.ok || !data.success) {
  //           const message = data?.message || "Backend request failed";
  //           throw new Error(message);
  //       }

  //       return data.data; // ✅ return only the user profile
  //   }
  