import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { GithubIcon, LinkedinIcon, Edit2, User, Mail, Book, Briefcase, Save, ArrowLeft, MapPin } from 'lucide-react';
import { toastStore } from '../components/ui/Toaster';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Link } from 'react-router-dom';

interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  bio?: string;
  skills?: string[];
  education?: string;
  experience?: string;
  college?: string;
  github?: string;
  linkedin?: string;
}

const Profile = () => {
  const { userId } = useParams<{ userId: string }>();
  const { currentUser, updateUserProfile } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [editingSkills, setEditingSkills] = useState('');
  const [education, setEducation] = useState('');
  const [experience, setExperience] = useState('');
  const [college, setCollege] = useState('');
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');

  // New states to handle connect input visibility and temp values
  const [connectGithub, setConnectGithub] = useState(false);
  const [connectLinkedin, setConnectLinkedin] = useState(false);
  const [tempGithub, setTempGithub] = useState('');
  const [tempLinkedin, setTempLinkedin] = useState('');

  const isOwnProfile = userId === currentUser?.uid;

  useEffect(() => {
    if (userId) {
      fetchUserProfile(userId);
    }
  }, [userId]);

  const fetchUserProfile = async (uid: string) => {
    try {
      const userRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data() as UserProfile;
        setProfile(userData);
        setDisplayName(userData.displayName || '');
        setBio(userData.bio || '');
        setSkills(userData.skills || []);
        setEditingSkills(userData.skills ? userData.skills.join(', ') : '');
        setEducation(userData.education || '');
        setExperience(userData.experience || '');
        setCollege(userData.college || '');
        setGithub(userData.github || '');
        setLinkedin(userData.linkedin || '');
        setTempGithub(userData.github || '');
        setTempLinkedin(userData.linkedin || '');
      } else {
        // Fallback profile for demo
        setProfile({
          uid,
          displayName: 'Demo User',
          email: 'demo@example.com',
          bio: 'Passionate developer and collaborator.',
          skills: ['React', 'Node.js', 'Python'],
          education: 'Computer Science Student',
          experience: 'Full Stack Developer',
          college: 'IIT Delhi',
          github: '',
          linkedin: ''
        });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toastStore.addToast('Failed to load profile', 'error');
    } finally {
      setLoading(false);
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Update displayName in Firebase Auth
      await updateUserProfile(displayName);

      // Update profile document in Firestore
      const userRef = doc(db, 'users', currentUser?.uid || '');
      await setDoc(userRef, {
        displayName,
        bio,
        skills: editingSkills.split(',').map(skill => skill.trim()),
        education,
        experience,
        college,
        github,
        linkedin,
        email: currentUser?.email || ''
      }, { merge: true });

      setSkills(editingSkills.split(',').map(skill => skill.trim()));
      setIsEditing(false);
      toastStore.addToast('Profile updated successfully!', 'success');
    } catch (error) {
      console.error('Failed to update profile', error);
      toastStore.addToast('Failed to update profile', 'error');
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-light"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Profile not found</h2>
        <Link to="/projects" className="btn btn-primary">
          Browse projects
        </Link>
      </div>
    );
  }

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {!isOwnProfile && (
        <div className="mb-8">
          <button 
            onClick={() => window.history.back()}
            className="text-primary-light hover:text-primary transition-colors duration-200 flex items-center group"
          >
            <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
            Back
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="card lg:col-span-1 hover:shadow-glow-sm transition-all duration-300">
          <div className="flex flex-col items-center text-center">
            <div className="h-32 w-32 rounded-full bg-gradient-to-br from-primary/30 to-primary-light/20 flex items-center justify-center mb-4 border-2 border-primary/30 hover:border-primary-light hover:scale-105 transition-all duration-300">
              <User className="h-20 w-20 text-primary-light" />
            </div>
            
            {!isEditing ? (
              <>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  {profile.displayName || 'User'}
                </h1>
                <p className="text-gray-400 mt-1 flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  {profile.email}
                </p>
                
                {profile.college && (
                  <p className="text-primary-light mt-2 flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    {profile.college}
                  </p>
                )}
                
                <div className="mt-6 flex justify-center space-x-4">
                  <a 
                    href={profile.github || "#"} 
                    className="p-2 rounded-full bg-background hover:bg-secondary transition-all duration-200 hover:scale-110 hover:shadow-glow-sm"
                  >
                    <GithubIcon className="h-6 w-6" />
                  </a>
                  <a 
                    href={profile.linkedin || "#"} 
                    className="p-2 rounded-full bg-background hover:bg-secondary transition-all duration-200 hover:scale-110 hover:shadow-glow-sm"
                  >
                    <LinkedinIcon className="h-6 w-6" />
                  </a>
                </div>
                
                {isOwnProfile && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn btn-secondary text-sm mt-8 w-full hover:scale-105 transition-transform duration-200"
                  >
                    <Edit2 className="h-4 w-4 mr-2" /> Edit Profile
                  </button>
                )}
              </>
            ) : (
              <form onSubmit={handleSubmit} className="w-full mt-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="input focus:border-primary-light focus:ring-primary-light/20"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-1">College</label>
                  <input
                    type="text"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    className="input focus:border-primary-light focus:ring-primary-light/20"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-1">GitHub Profile URL</label>
                  <input
                    type="url"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    className="input focus:border-primary-light focus:ring-primary-light/20"
                    placeholder="https://github.com/username"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-1">LinkedIn Profile URL</label>
                  <input
                    type="url"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    className="input focus:border-primary-light focus:ring-primary-light/20"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
                
                <div className="flex space-x-2 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="btn btn-secondary text-sm flex-1 hover:scale-105 transition-transform duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary text-sm flex-1 hover:scale-105 transition-transform duration-200"
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
            <div className="card mb-8 hover:shadow-glow-sm transition-all duration-300">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <span className="h-2 w-2 bg-primary-light rounded-full mr-3 animate-pulse"></span>
                  About Me
                </h2>
              </div>
              <p className="text-gray-300 leading-relaxed">{profile.bio}</p>
              
              <div className="mt-8 space-y-6">
                <div className="flex items-start group">
                  <Book className="h-5 w-5 text-primary-light mr-3 mt-1 group-hover:scale-110 transition-transform duration-200" />
                  <div>
                    <h3 className="font-medium text-white">Education</h3>
                    <p className="text-gray-400">{profile.education}</p>
                  </div>
                </div>
                
                <div className="flex items-start group">
                  <Briefcase className="h-5 w-5 text-primary-light mr-3 mt-1 group-hover:scale-110 transition-transform duration-200" />
                  <div>
                    <h3 className="font-medium text-white">Experience</h3>
                    <p className="text-gray-400">{profile.experience}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="card mb-8 border border-primary/30 hover:shadow-glow-md transition-all duration-300">
              <h2 className="text-xl font-bold mb-4 text-primary-light">Edit About Me</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="input h-24 focus:border-primary-light focus:ring-primary-light/20"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">Education</label>
                <input
                  type="text"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  className="input focus:border-primary-light focus:ring-primary-light/20"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">Experience</label>
                <input
                  type="text"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="input focus:border-primary-light focus:ring-primary-light/20"
                />
              </div>
            </div>
          )}
          
          <div className="card hover:shadow-glow-sm transition-all duration-300">
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <span className="h-2 w-2 bg-blue-500 rounded-full mr-3 animate-pulse"></span>
                Skills
              </h2>
            </div>
            
            {!isEditing ? (
              <div className="flex flex-wrap gap-2">
                {profile.skills?.map((skill, index) => (
                  <span 
                    key={index} 
                    className="tag tag-primary hover:scale-105 transition-transform duration-200"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">Skills (comma-separated)</label>
                <input
                  type="text"
                  value={editingSkills}
                  onChange={(e) => setEditingSkills(e.target.value)}
                  className="input focus:border-primary-light focus:ring-primary-light/20"
                  placeholder="React, JavaScript, Node.js"
                />
              </div>
            )}
          </div>
          
          {isOwnProfile && (
            <div className="mt-8 card hover:shadow-glow-sm transition-all duration-300">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <span className="h-2 w-2 bg-green-500 rounded-full mr-3 animate-pulse"></span>
                Connected Accounts
              </h2>
              
              <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-secondary to-background-lighter rounded-lg border border-gray-700/50 hover:border-primary/30 transition-all duration-200">
                <div className="flex items-center">
                  <GithubIcon className="h-6 w-6 mr-3" />
                  <span>GitHub</span>
                </div>
                {!connectGithub ? (
                  <button
                    className="btn btn-secondary text-xs py-2 hover:scale-105 transition-transform duration-200"
                    onClick={() => {
                      setConnectGithub(true);
                      setTempGithub(github);
                    }}
                  >
                    Connect
                  </button>
                ) : (
                  <div className="flex space-x-2 items-center">
                    <input
                      type="url"
                      value={tempGithub}
                      onChange={(e) => setTempGithub(e.target.value)}
                      placeholder="https://github.com/username"
                      className="input input-sm w-60 focus:border-primary-light focus:ring-primary-light/20"
                    />
                    <button
                      className="btn btn-primary text-xs py-2 hover:scale-105 transition-transform duration-200"
                      onClick={async () => {
                        try {
                          const userRef = doc(db, 'users', currentUser?.uid || '');
                          await setDoc(userRef, { github: tempGithub }, { merge: true });
                          setGithub(tempGithub);
                          setConnectGithub(false);
                          toastStore.addToast('GitHub profile updated!', 'success');
                        } catch (error) {
                          console.error('Failed to update GitHub profile', error);
                          toastStore.addToast('Failed to update GitHub profile', 'error');
                        }
                      }}
                    >
                      Save
                    </button>
                    <button
                      className="btn btn-secondary text-xs py-2 hover:scale-105 transition-transform duration-200"
                      onClick={() => {
                        setConnectGithub(false);
                        setTempGithub(github);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-secondary to-background-lighter rounded-lg border border-gray-700/50 hover:border-primary/30 transition-all duration-200">
                <div className="flex items-center">
                  <LinkedinIcon className="h-6 w-6 mr-3" />
                  <span>LinkedIn</span>
                </div>
                {!connectLinkedin ? (
                  <button
                    className="btn btn-secondary text-xs py-2 hover:scale-105 transition-transform duration-200"
                    onClick={() => {
                      setConnectLinkedin(true);
                      setTempLinkedin(linkedin);
                    }}
                  >
                    Connect
                  </button>
                ) : (
                  <div className="flex space-x-2 items-center">
                    <input
                      type="url"
                      value={tempLinkedin}
                      onChange={(e) => setTempLinkedin(e.target.value)}
                      placeholder="https://linkedin.com/in/username"
                      className="input input-sm w-60 focus:border-primary-light focus:ring-primary-light/20"
                    />
                    <button
                      className="btn btn-primary text-xs py-2 hover:scale-105 transition-transform duration-200"
                      onClick={async () => {
                        try {
                          const userRef = doc(db, 'users', currentUser?.uid || '');
                          await setDoc(userRef, { linkedin: tempLinkedin }, { merge: true });
                          setLinkedin(tempLinkedin);
                          setConnectLinkedin(false);
                          toastStore.addToast('LinkedIn profile updated!', 'success');
                        } catch (error) {
                          console.error('Failed to update LinkedIn profile', error);
                          toastStore.addToast('Failed to update LinkedIn profile', 'error');
                        }
                      }}
                    >
                      Save
                    </button>
                    <button
                      className="btn btn-secondary text-xs py-2 hover:scale-105 transition-transform duration-200"
                      onClick={() => {
                        setConnectLinkedin(false);
                        setTempLinkedin(linkedin);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;