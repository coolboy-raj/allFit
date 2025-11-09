"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { Activity, User, Bell, LogOut, Save, Edit2, Camera, Upload } from "lucide-react";
import { getCurrentUser, logout, isAuthenticated } from "@/lib/api/googleAuth";

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    contactNumber: "",
    address: "",
    bio: "",
    experience: "",
  });
  const [settings, setSettings] = useState({
    notifications: true,
    weeklyReports: true,
  });

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      router.push('/');
      return;
    }

    const currentUser = getCurrentUser();
    setUser(currentUser);

    // Load saved profile image
    const savedImage = localStorage.getItem('coach_profile_image');
    if (savedImage) {
      setProfileImage(savedImage);
    }

    // Load saved profile from localStorage
    const savedProfile = localStorage.getItem('coach_profile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    } else {
      // Initialize with user data
      setProfile({
        name: currentUser?.name || "",
        email: currentUser?.email || "",
        contactNumber: "",
        address: "",
        bio: "",
        experience: "",
      });
    }

    // Load saved settings from localStorage
    const savedSettings = localStorage.getItem('user_settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, [router]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      
      // Convert to base64 and store
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProfileImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    if (confirm('Are you sure you want to remove your profile image?')) {
      setProfileImage(null);
      localStorage.removeItem('coach_profile_image');
    }
  };

  const handleSaveProfile = () => {
    setLoading(true);
    
    // Save profile to localStorage
    localStorage.setItem('coach_profile', JSON.stringify(profile));
    
    // Save profile image if exists
    if (profileImage) {
      localStorage.setItem('coach_profile_image', profileImage);
    }
    
    setTimeout(() => {
      setLoading(false);
      setIsEditingProfile(false);
      alert('Profile saved successfully!');
    }, 500);
  };

  const handleSaveSettings = () => {
    setLoading(true);
    
    // Save to localStorage
    localStorage.setItem('user_settings', JSON.stringify(settings));
    
    setTimeout(() => {
      setLoading(false);
      alert('Settings saved successfully!');
    }, 500);
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  const handleProfileChange = (field: string, value: any) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/20"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-white/5 bg-black/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-6 w-6 text-white" />
              <span className="text-xl font-medium text-white">
                TotalFit
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={() => router.push('/dashboard')}>
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-2xl font-medium text-white mb-2">Settings</h1>
        <p className="text-sm text-white/50 mb-8">Manage your coach profile and platform preferences</p>

        <div className="space-y-6">
          {/* Profile Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-4 w-4 text-white" />
                    Coach Profile
                  </CardTitle>
                  <CardDescription>Manage your professional profile</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className="gap-2"
                >
                  <Edit2 className="h-3 w-3" />
                  {isEditingProfile ? 'Cancel' : 'Edit'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isEditingProfile ? (
                <>
                  <div className="flex items-center gap-4 pb-4 border-b border-white/5">
                    <div className="relative">
                      <img
                        src={profileImage || user.picture || '/default-avatar.png'}
                        alt={profile.name}
                        className="h-16 w-16 rounded-full object-cover border-2 border-white/10"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name || user.name || 'User')}&size=128&background=6366f1&color=fff`;
                        }}
                      />
                    </div>
                    <div>
                      <div className="font-medium text-white text-lg">{profile.name || user.name}</div>
                      <div className="text-sm text-white/50">{profile.email || user.email}</div>
                    </div>
                  </div>

                  {profile.contactNumber && (
                    <div>
                      <div className="text-xs font-medium text-white/40 uppercase mb-1">Contact Number</div>
                      <div className="text-sm text-white">{profile.contactNumber}</div>
                    </div>
                  )}

                  {profile.address && (
                    <div>
                      <div className="text-xs font-medium text-white/40 uppercase mb-1">Address</div>
                      <div className="text-sm text-white">{profile.address}</div>
                    </div>
                  )}

                  {profile.bio && (
                    <div>
                      <div className="text-xs font-medium text-white/40 uppercase mb-1">Bio</div>
                      <div className="text-sm text-white/70 leading-relaxed">{profile.bio}</div>
                    </div>
                  )}

                  {profile.experience && (
                    <div>
                      <div className="text-xs font-medium text-white/40 uppercase mb-1">Experience & Achievements</div>
                      <div className="text-sm text-white/70 leading-relaxed whitespace-pre-line">{profile.experience}</div>
                    </div>
                  )}

                  {!profile.contactNumber && !profile.address && !profile.bio && !profile.experience && (
                    <div className="text-center py-6 text-white/40">
                      <p className="text-sm">Click "Edit" to add more details to your profile</p>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* Profile Image Upload */}
                  <div className="flex flex-col items-center pb-4 border-b border-white/5">
                    <div className="relative group">
                      <img
                        src={profileImage || user.picture || '/default-avatar.png'}
                        alt={profile.name}
                        className="h-24 w-24 rounded-full object-cover border-2 border-white/10"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name || user.name || 'User')}&size=192&background=6366f1&color=fff`;
                        }}
                      />
                      <label 
                        htmlFor="profile-image-upload"
                        className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <Camera className="h-6 w-6 text-white" />
                      </label>
                      <input
                        id="profile-image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                    <div className="flex gap-2 mt-3">
                      <label 
                        htmlFor="profile-image-upload"
                        className="text-xs px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md cursor-pointer transition-colors flex items-center gap-1.5 text-white/70"
                      >
                        <Upload className="h-3 w-3" />
                        Upload Photo
                      </label>
                      {profileImage && (
                        <button
                          onClick={handleRemoveImage}
                          className="text-xs px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-md transition-colors text-red-400"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-white/40 mt-2">JPG, PNG or GIF. Max 5MB.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => handleProfileChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-white/10 rounded-md focus:ring-1 focus:ring-white/20 focus:border-white/20 text-white bg-black"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => handleProfileChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-white/10 rounded-md focus:ring-1 focus:ring-white/20 focus:border-white/20 text-white bg-black"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Contact Number
                    </label>
                    <input
                      type="tel"
                      value={profile.contactNumber}
                      onChange={(e) => handleProfileChange('contactNumber', e.target.value)}
                      className="w-full px-3 py-2 border border-white/10 rounded-md focus:ring-1 focus:ring-white/20 focus:border-white/20 text-white bg-black"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      value={profile.address}
                      onChange={(e) => handleProfileChange('address', e.target.value)}
                      className="w-full px-3 py-2 border border-white/10 rounded-md focus:ring-1 focus:ring-white/20 focus:border-white/20 text-white bg-black"
                      placeholder="City, State, Country"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={profile.bio}
                      onChange={(e) => handleProfileChange('bio', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-white/10 rounded-md focus:ring-1 focus:ring-white/20 focus:border-white/20 text-white bg-black resize-none"
                      placeholder="Tell athletes about yourself..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Experience & Achievements
                    </label>
                    <textarea
                      value={profile.experience}
                      onChange={(e) => handleProfileChange('experience', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-white/10 rounded-md focus:ring-1 focus:ring-white/20 focus:border-white/20 text-white bg-black resize-none"
                      placeholder="Certifications, coaching experience, notable achievements..."
                    />
                  </div>

                  <Button
                    onClick={handleSaveProfile}
                    disabled={loading}
                    className="w-full gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {loading ? 'Saving...' : 'Save Profile'}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Preferences Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-white" />
                Preferences
              </CardTitle>
              <CardDescription>Customize your experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white/[0.02] rounded-md border border-white/5">
                <div>
                  <div className="font-medium text-white text-sm">Daily Notifications</div>
                  <div className="text-xs text-white/40">
                    Receive reminders to log your data
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications}
                  onChange={(e) => handleChange('notifications', e.target.checked)}
                  className="h-4 w-4 rounded border-white/10"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-white/[0.02] rounded-md border border-white/5">
                <div>
                  <div className="font-medium text-white text-sm">Weekly Reports</div>
                  <div className="text-xs text-white/40">
                    Get weekly health summaries via email
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.weeklyReports}
                  onChange={(e) => handleChange('weeklyReports', e.target.checked)}
                  className="h-4 w-4 rounded border-white/10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={handleSaveSettings}
              disabled={loading}
              className="flex-1 gap-2"
            >
              <Save className="h-4 w-4" />
              {loading ? 'Saving...' : 'Save Settings'}
            </Button>

            <Button
              variant="outline"
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

