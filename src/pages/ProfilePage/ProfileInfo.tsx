import { useState } from "react";

interface ProfileInfoProps {
  email: string;
  userName: string;
  onChangeName?: (newName: string) => Promise<void>;
  onChangePassword?: (oldPass: string, newPass: string) => Promise<void>;
}

export default function ProfileInfo({
  email,
  userName,
  onChangeName,
  onChangePassword,
}: ProfileInfoProps) {
  const [newName, setNewName] = useState("");
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [loadingName, setLoadingName] = useState(false);
  const [loadingPass, setLoadingPass] = useState(false);
  const [error, setError] = useState("");

  const handleNameChange = async () => {
    if (!newName.trim()) return;
    if (!onChangeName) return;
    setLoadingName(true);
    setError("");
    try {
      await onChangeName(newName);
      setNewName("");
    } catch (e: any) {
      setError(e?.response?.data?.message || "Error changing name");
    } finally {
      setLoadingName(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!onChangePassword) return;
    setLoadingPass(true);
    setError("");
    try {
      await onChangePassword(oldPass, newPass);
      setOldPass("");
      setNewPass("");
    } catch (e: any) {
      setError(e?.response?.data?.message || "Error changing password");
    } finally {
      setLoadingPass(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Profile Settings</h2>
      
      <div style={styles.infoBox}>
        <p style={styles.infoText}><strong>Email:</strong> {email}</p>
        <p style={styles.infoText}><strong>Current Name:</strong> {userName}</p>
      </div>

      {error && <div style={styles.errorBadge}>{error}</div>}

      {onChangeName && (
        <div style={styles.section}>
          <label style={styles.label}>Update Name</label>
          <div style={styles.row}>
            <input
              style={styles.input}
              type="text"
              placeholder="Enter new name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <button 
              style={{...styles.button, ...(loadingName || !newName ? styles.buttonDisabled : {})}} 
              onClick={handleNameChange} 
              disabled={loadingName || !newName}
            >
              {loadingName ? "Saving..." : "Update"}
            </button>
          </div>
        </div>
      )}

      {onChangePassword && (
        <div style={styles.section}>
          <label style={styles.label}>Security</label>
          <input
            style={styles.input}
            type="password"
            placeholder="Current Password"
            value={oldPass}
            onChange={(e) => setOldPass(e.target.value)}
          />
          <input
            style={{...styles.input, marginTop: '10px'}}
            type="password"
            placeholder="New Password"
          value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
          />
          <button
            style={{...styles.button, marginTop: '15px', width: '100%', ...(loadingPass || !oldPass || !newPass ? styles.buttonDisabled : {})}}
            onClick={handlePasswordChange}
            disabled={loadingPass || !oldPass || !newPass}
          >
            {loadingPass ? "Updating Password..." : "Change Password"}
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "420px",
    margin: "40px auto",
    padding: "30px",
    borderRadius: "12px",
    backgroundColor: "#ffffff",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  title: {
    margin: "0 0 20px 0",
    fontSize: "24px",
    fontWeight: "700" as const,
    color: "#1a1a1a",
  },
  infoBox: {
    padding: "15px",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    marginBottom: "25px",
  },
  infoText: {
    margin: "5px 0",
    fontSize: "14px",
    color: "#4a4a4a",
  },
  section: {
    marginTop: "25px",
    display: "flex",
    flexDirection: "column" as const,
  },
  label: {
    fontSize: "13px",
    fontWeight: "600" as const,
    color: "#666",
    marginBottom: "8px",
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
  },
  row: {
    display: "flex",
    gap: "10px",
  },
  input: {
    flex: 1,
    padding: "10px 14px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    fontSize: "15px",
    outline: "none",
    transition: "border-color 0.2s",
  },
  button: {
    padding: "10px 20px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#1a1a1a",
    color: "white",
    fontSize: "14px",
    fontWeight: "600" as const,
    cursor: "pointer",
    transition: "all 0.2s",
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
    cursor: "not-allowed",
  },
  errorBadge: {
    padding: "10px",
    backgroundColor: "#fff1f0",
    border: "1px solid #ffa39e",
    color: "#cf1322",
    borderRadius: "6px",
    fontSize: "14px",
    marginBottom: "20px",
  }
};