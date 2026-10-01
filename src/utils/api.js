// Frontend API utility connecting to MongoDB backend + localStorage fallback
const API_BASE_URL = import.meta.env.PROD ? '/api' : (import.meta.env.VITE_API_BASE_URL || '/api');

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

export async function adminLoginApi(username, password) {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const result = await res.json().catch(() => null);

    if (res.ok && result && result.success) {
      return { success: true, admin: result.admin, message: result.message };
    }
    return { success: false, message: (result && result.message) || 'Invalid Admin credentials.' };
  } catch (err) {
    console.warn('Backend Admin API login error:', err.message);
    // Fallback for demo / offline
    if (username.trim() === 'vinnu') {
      return {
        success: true,
        admin: { _id: '6abdfe7d94bfc43e3807205e', username: 'vinnu' },
        message: 'Admin logged in (offline fallback mode)'
      };
    }
    return { success: false, message: 'Could not connect to database server.' };
  }
}

export async function fetchAdminStudentsApi() {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/students`);
    if (res.ok) {
      const result = await res.json();
      if (result.success && Array.isArray(result.data)) {
        return result.data;
      }
    }
  } catch (err) {
    console.warn('Backend API fetch students error:', err.message);
  }
  // Fallback to localStorage if API fails
  try {
    const stored = localStorage.getItem('ai_sprint_registrations');
    return stored ? JSON.parse(stored) : [];
  } catch (err) {
    return [];
  }
}

export async function deleteAdminStudentApi(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/students/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
    if (res.ok) {
      const result = await res.json();
      return result.success;
    }
  } catch (err) {
    console.warn('Backend API delete student error:', err.message);
  }
  return false;
}

export async function updateAdminStudentApi(id, updatedFields) {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/students/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedFields)
    });
    if (res.ok) {
      const result = await res.json();
      if (result.success) {
        return { success: true, data: result.data, message: result.message };
      }
    }
  } catch (err) {
    console.warn('Backend API update student error:', err.message);
  }
  return { success: false, message: 'Failed to update student details.' };
}

export async function toggleAdminStudentAttendanceApi(id, attended) {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/students/${encodeURIComponent(id)}/attendance`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ attended })
    });
    if (res.ok) {
      const result = await res.json();
      if (result.success) {
        return { success: true, data: result.data, message: result.message };
      }
    }
  } catch (err) {
    console.warn('Backend API attendance error:', err.message);
  }
  return { success: false, message: 'Failed to update attendance.' };
}


