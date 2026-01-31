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
  const [success, setSuccess] = useState("");

  const handleNameChange = async () => {
    if (!newName.trim() || !onChangeName) return;
    setLoadingName(true);
    setError("");
    setSuccess("");
    try {
      await onChangeName(newName);
      setNewName("");
      setSuccess("Name updated successfully!");
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
    setSuccess("");
    try {
      await onChangePassword(oldPass, newPass);
      setOldPass("");
      setNewPass("");
      setSuccess("Password updated successfully!");
    } catch (e: any) {
      setError(e?.response?.data?.message || "Error changing password");
    } finally {
      setLoadingPass(false);
    }
  };

  const inputStyles = "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all mb-3";
  const btnStyles = "w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors";

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">
          {userName.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Profile Settings</h2>
          <p className="text-gray-500 text-sm">{email}</p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700">Current Name: <span className="text-gray-900">{userName}</span></p>
      </div>

      {error && <div className="p-3 mb-4 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">{error}</div>}
      {success && <div className="p-3 mb-4 text-sm text-green-600 bg-green-50 rounded-lg border border-green-100">{success}</div>}

      {onChangeName && (
        <section className="mt-8 pt-6 border-t border-gray-100">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Update Name</h3>
          <input
            type="text"
            placeholder="Enter new name"
            className={inputStyles}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <button onClick={handleNameChange} disabled={loadingName || !newName} className={btnStyles}>
            {loadingName ? "Saving..." : "Save Name"}
          </button>
        </section>
      )}

      {onChangePassword && (
        <section className="mt-8 pt-6 border-t border-gray-100">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Security</h3>
          <input
            type="password"
            placeholder="Current password"
            className={inputStyles}
            value={oldPass}
            onChange={(e) => setOldPass(e.target.value)}
          />
          <input
            type="password"
            placeholder="New password"
            className={inputStyles}
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
          />
          <button
            onClick={handlePasswordChange}
            disabled={loadingPass || !oldPass || !newPass}
            className={btnStyles}
          >
            {loadingPass ? "Updating..." : "Update Password"}
          </button>
        </section>
      )}
    </div>
  );
}