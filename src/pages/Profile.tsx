import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { GithubIcon, LinkedinIcon, Edit2, User, Mail, Book, Briefcase, Save } from 'lucide-react';
import { toastStore } from '../components/ui/Toaster';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const Profile = () => {
  const { currentUser, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const handleConnectGithub = () => {
    const url = window.prompt('Please enter your GitHub profile URL:', githubUrl);
    if (url !== null) {
      setGithubUrl(url);
      saveProfileLinks(url, linkedinUrl);
    }
  };

  const handleConnectLinkedin = () => {
    console.log('handleConnectLinkedin called');
    const url = window.prompt('Please enter your LinkedIn profile URL:', linkedinUrl);
    if (url !== null) {
      const trimmedUrl = url.trim();
      if (trimmedUrl === '') {
        toastStore.addToast('LinkedIn URL cannot be empty.', 'error');
        return;
      }
      if (!/^https?:\/\/(www\.)?linkedin\.com\/.*$/.test(trimmedUrl)) {
        toastStore.addToast('Please enter a valid LinkedIn profile URL.', 'error');
        return;
      }
      setLinkedinUrl(trimmedUrl);
      saveProfileLinks(githubUrl, trimmedUrl);
    }
  };

  const saveProfileLinks = async (github: string, linkedin: string) => {
    if (!currentUser) return;
    try {
      const docRef = doc(db, 'profiles', currentUser.uid);
      await setDoc(docRef, {
        bio,
        skills,
        education,
        experience,
        githubUrl: github,
        linkedinUrl: linkedin,
      }, { merge: true });
      toastStore.addToast('Connected accounts updated successfully!', 'success');
    } catch (error) {
      console.error('Failed to update connected accounts', error);
      toastStore.addToast('Failed to update connected accounts', 'error');
    }
  };
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [editingSkills, setEditingSkills] = useState('');
  const [education, setEducation] = useState('');
  const [experience, setExperience] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [college, setCollege] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!currentUser) return;
      const docRef = doc(db, 'profiles', currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setBio(data.bio || '');
        setSkills(data.skills || []);
        setEditingSkills((data.skills || []).join(', '));
        setEducation(data.education || '');
        setExperience(data.experience || '');
        setGithubUrl(data.githubUrl || '');
        setLinkedinUrl(data.linkedinUrl || '');
        setCollege(data.college || '');
      }
    };
    fetchProfile();
  }, [currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateUserProfile(displayName);
      const docRef = doc(db, 'profiles', currentUser!.uid);
      await setDoc(docRef, {
        bio,
        skills: editingSkills.split(',').map(skill => skill.trim()),
        education,
        experience,
        githubUrl,
        linkedinUrl,
        college,
      });
      setSkills(editingSkills.split(',').map(skill => skill.trim()));
      setIsEditing(false);
      toastStore.addToast('Profile updated successfully!', 'success');
    } catch (error) {
      console.error('Failed to update profile', error);
      toastStore.addToast('Failed to update profile', 'error');
    }
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="card lg:col-span-1">
          <div className="flex flex-col items-center text-center">
            <div className="h-32 w-32 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <User className="h-20 w-20 text-primary-light" />
            </div>

            {!isEditing ? (
              <>
                <h1 className="text-2xl font-bold">{displayName || 'User'}</h1>
                <p className="text-gray-400 mt-1">{currentUser?.email}</p>

                <div className="mt-6 flex justify-center space-x-4">
                  {githubUrl ? (
                    <a
                      href={githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-background hover:bg-secondary"
                    >
                      <GithubIcon className="h-6 w-6" />
                    </a>
                  ) : (
                    <a
                      href="#"
                      onClick={handleConnectGithub}
                      className="p-2 rounded-full bg-background hover:bg-secondary cursor-pointer"
                    >
                      <GithubIcon className="h-6 w-6" />
                    </a>
                  )}
                  {linkedinUrl ? (
                    <a
                      href={linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-background hover:bg-secondary"
                    >
                      <LinkedinIcon className="h-6 w-6" />
                    </a>
                  ) : (
                    <a
                      href="#"
                      onClick={handleConnectLinkedin}
                      className="p-2 rounded-full bg-background hover:bg-secondary cursor-pointer"
                    >
                      <LinkedinIcon className="h-6 w-6" />
                    </a>
                  )}
                </div>

                <button
                  onClick={() => setIsEditing(true)}
                  className="btn btn-secondary text-sm mt-8 w-full"
                >
                  <Edit2 className="h-4 w-4 mr-2" /> Edit Profile
                </button>
              </>
            ) : (
              <form onSubmit={handleSubmit} className="w-full mt-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="input"
                  />
                </div>

                <div className="flex space-x-2 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="btn btn-secondary text-sm flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary text-sm flex-1"
                  >
                    <Save className="h-4 w-4 mr-2" /> Save
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2">
          {!isEditing ? (
            <div className="card mb-8">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-bold mb-4">About Me</h2>
              </div>
              <p className="text-gray-300">{bio}</p>

              <div className="mt-8">
                <div className="flex items-center mb-4">
                  <Book className="h-5 w-5 text-primary-light mr-3" />
                  <div>
                    <h3 className="font-medium">Education</h3>
                    <p className="text-gray-400">{education}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Briefcase className="h-5 w-5 text-primary-light mr-3" />
                  <div>
                    <h3 className="font-medium">Experience</h3>
                    <p className="text-gray-400">{experience}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="card mb-8">
              <h2 className="text-xl font-bold mb-4">About Me</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="input h-24"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">Education</label>
                <input
                  type="text"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  className="input"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">Experience</label>
                <input
                  type="text"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="input"
                />
              </div>
            </div>
          )}

          <div className="card">
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-bold mb-4">Skills</h2>
            </div>

            {!isEditing ? (
              <div className="flex flex-wrap">
                {skills.map((skill, index) => (
                  <span key={index} className="tag tag-primary">{skill}</span>
                ))}
              </div>
            ) : (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">Skills (comma-separated)</label>
                <input
                  type="text"
                  value={editingSkills}
                  onChange={(e) => setEditingSkills(e.target.value)}
                  className="input"
                  placeholder="React, JavaScript, Node.js"
                />
              </div>
            )}
          </div>

          <div className="mt-8 card">
            <h2 className="text-xl font-bold mb-4">Connected Accounts</h2>

              <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                <div className="flex items-center">
                  <GithubIcon className="h-6 w-6 mr-3" />
                  <span>GitHub</span>
                </div>
                <button onClick={handleConnectGithub} className="btn btn-secondary text-xs py-2">Connect</button>
              </div>

              <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                <div className="flex items-center">
                  <LinkedinIcon className="h-6 w-6 mr-3" />
                  <span>LinkedIn</span>
                </div>
                <button onClick={handleConnectLinkedin} className="btn btn-secondary text-xs py-2">Connect</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
