// Frontend API utility connecting to MongoDB backend + localStorage fallback
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export async function registerStudentApi(studentData) {
  try {
    const res = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentData)
    });

    const result = await res.json().catch(() => null);

    if (res.ok && result && result.success && result.data) {
      console.log('✅ Student data saved to MongoDB!');
      return { success: true, data: result.data, message: result.message };
    }

    const errorMsg = (result && result.message) || `Server error (${res.status}). Failed to save details to database.`;
    return { success: false, message: errorMsg };
  } catch (err) {
    console.error('Backend API registration error:', err.message);
    return { 
      success: false, 
      message: 'Could not connect to database server. Please check if the server is running.' 
    };
  }
}

export async function loginStudentApi(phone, password) {
  try {
    const res = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, password })
    });

    if (res.ok) {
      const result = await res.json();
      if (result.success && result.data) {
        return result.data;
      }
    }
  } catch (err) {
    console.warn('Backend API login error:', err.message);
  }
  return null;
}

export async function updateTrackApi(id, missionTrack) {
  try {
    await fetch(`${API_BASE_URL}/update-track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, missionTrack })
    });
  } catch (err) {}
}
