import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toastStore } from '../components/ui/Toaster';
import { Users, Calendar, Clock, MessageSquare, UserPlus, ExternalLink, User, Check, Plus, ArrowLeft } from 'lucide-react';
import { doc, getDoc, collection, addDoc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

interface Project {
  id: string;
  title: string;
  description: string;
  skills: string[];
  teamSize: string;
  duration: string;
  isCollegeOnly: boolean;
  isWomenLed: boolean;
  creatorName: string;
  creatorId: string;
  college: string;
  createdAt: string;
  applicants: number;
  members: { id: string; name: string; role: string; }[];
  tasks: { id: number; title: string; completed: boolean; }[];
}

interface Application {
  id: string;
  userId: string;
  name: string;
  college: string;
  message: string;
  timestamp: string;
  status?: 'pending' | 'accepted' | 'rejected';
}

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [application, setApplication] = useState('');
  const [applications, setApplications] = useState<Application[]>([]);
  const [applicationsLoading, setApplicationsLoading] = useState(false);

  // Move isCreator and isMember above useEffect
  const isCreator = currentUser && project && currentUser.uid === project.creatorId;
  const isMember = currentUser && project && project.members?.some(member => member.id === currentUser.uid);

  useEffect(() => {
    fetchProject();
    // eslint-disable-next-line
  }, [id]);

  // Add a new useEffect to fetch applications only when project is loaded and user is creator
  useEffect(() => {
    if (project && currentUser && currentUser.uid === project.creatorId) {
      fetchApplications();
    }
    // eslint-disable-next-line
  }, [project, currentUser]);

  const fetchProject = async () => {
    try {
      if (!id) return;
      
      const projectRef = doc(db, 'projects', id);
      const projectDoc = await getDoc(projectRef);
      
      if (projectDoc.exists()) {
        setProject({
          id: projectDoc.id,
          ...projectDoc.data()
        } as Project);
      }
    } catch (error) {
      console.error('Error fetching project:', error);
      toastStore.addToast('Failed to load project details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    if (!id) return;
    setApplicationsLoading(true);
    try {
      const appsRef = collection(db, 'projects', id, 'applications');
      const appsSnap = await getDocs(appsRef);
      const apps: Application[] = appsSnap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() })) as Application[];
      setApplications(apps);
    } catch (error) {
      toastStore.addToast('Failed to load applications', 'error');
    } finally {
      setApplicationsLoading(false);
    }
  };

  const handleApplicationStatus = async (appId: string, newStatus: 'accepted' | 'rejected') => {
    if (!id) return;
    try {
      const appRef = doc(db, 'projects', id, 'applications', appId);
      await updateDoc(appRef, { status: newStatus });
      setApplications(prev => prev.map(app => app.id === appId ? { ...app, status: newStatus } : app));
      toastStore.addToast(`Application ${newStatus}`, 'success');
    } catch (error) {
      toastStore.addToast('Failed to update application status', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-light"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Project not found</h2>
        <Link to="/projects" className="btn btn-primary">
          Browse projects
        </Link>
      </div>
    );
  }

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!application.trim()) {
      toastStore.addToast('Please describe why you want to join this project', 'error');
      return;
    }
    
    if (!currentUser || !id) {
      toastStore.addToast('You must be logged in to apply', 'error');
      return;
    }

    try {
      // Fetch applicant's college from profiles
      const profileRef = doc(db, 'profiles', currentUser.uid);
      const profileSnap = await getDoc(profileRef);
      let college = '';
      if (profileSnap.exists()) {
        college = profileSnap.data().college || '';
      }
      // Save application to subcollection
      const appsRef = collection(db, 'projects', id, 'applications');
      await addDoc(appsRef, {
        userId: currentUser.uid,
        name: currentUser.displayName || '',
        college,
        message: application,
        timestamp: new Date().toISOString(),
      });
      toastStore.addToast('Application submitted successfully!', 'success');
      setIsApplying(false);
      setApplication('');
      // Refresh applications if creator is viewing
      if (project && currentUser.uid === project.creatorId) fetchApplications();
    } catch (error) {
      console.error('Error submitting application:', error);
      toastStore.addToast('Failed to submit application', 'error');
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <Link 
          to="/projects" 
          className="text-primary-light hover:text-primary transition-colors duration-200 flex items-center group"
        >
          <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
          Back to projects
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="card mb-8 hover:shadow-glow-sm transition-all duration-300">
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {project.title}
              </h1>
              <div className="flex space-x-2">
                {project.isWomenLed && (
                  <span className="tag bg-pink-500/20 text-pink-400 border border-pink-500/30 animate-pulse-slow">
                    Women-led
                  </span>
                )}
                {project.isCollegeOnly && (
                  <span className="tag bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    College
                  </span>
                )}
                <span className="tag tag-primary border border-primary/30">Open</span>
              </div>
            </div>
            
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 mb-6 leading-relaxed">{project.description}</p>
            </div>
            
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <span className="h-2 w-2 bg-primary-light rounded-full mr-3 animate-pulse"></span>
                Required Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {project.skills.map((skill, index) => (
                  <span 
                    key={skill} 
                    className="tag hover:scale-105 transition-transform duration-200"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center p-4 bg-gradient-to-br from-secondary to-background-lighter rounded-lg hover:scale-105 transition-transform duration-200 border border-gray-800/50">
                <Users className="h-6 w-6 text-primary-light mr-3" />
                <div>
                  <h3 className="font-medium">Team Size</h3>
                  <p className="text-gray-400">{project.teamSize}</p>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-gradient-to-br from-secondary to-background-lighter rounded-lg hover:scale-105 transition-transform duration-200 border border-gray-800/50">
                <Calendar className="h-6 w-6 text-primary-light mr-3" />
                <div>
                  <h3 className="font-medium">Duration</h3>
                  <p className="text-gray-400">{project.duration}</p>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-gradient-to-br from-secondary to-background-lighter rounded-lg hover:scale-105 transition-transform duration-200 border border-gray-800/50">
                <Clock className="h-6 w-6 text-primary-light mr-3" />
                <div>
                  <h3 className="font-medium">Posted</h3>
                  <p className="text-gray-400">{formatDate(project.createdAt)}</p>
                </div>
              </div>
            </div>

            {project.college && (
              <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-transparent rounded-lg border border-primary/20">
                <p className="text-sm text-gray-400">
                  <span className="font-medium text-primary-light">College:</span> {project.college}
                </p>
              </div>
            )}
          </div>
          
          {(isCreator || isMember) && project.tasks && (
            <div className="card mb-8 hover:shadow-glow-sm transition-all duration-300">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <span className="h-2 w-2 bg-green-500 rounded-full mr-3 animate-pulse"></span>
                Project Tasks
              </h2>
              
              <div className="space-y-4">
                {project.tasks.map((task, index) => (
                  <div 
                    key={task.id} 
                    className={`flex items-center p-4 rounded-lg transition-all duration-300 hover:scale-[1.02] ${
                      task.completed 
                        ? 'bg-gradient-to-r from-green-900/20 to-green-800/10 border border-green-500/30' 
                        : 'bg-gradient-to-r from-secondary to-background-lighter border border-gray-700/50'
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div
                      className={`h-5 w-5 rounded-full mr-3 flex items-center justify-center transition-all duration-300 ${
                        task.completed 
                          ? 'bg-green-500 text-white scale-110' 
                          : 'border border-gray-500 hover:border-primary-light'
                      }`}
                    >
                      {task.completed && <Check className="h-3 w-3" />}
                    </div>
                    <p className={`transition-all duration-300 ${
                      task.completed ? 'line-through text-gray-400' : 'text-gray-200'
                    }`}>
                      {task.title}
                    </p>
                  </div>
                ))}
              </div>
              
              <button className="btn btn-secondary text-sm mt-6 hover:scale-105 transition-transform duration-200">
                <Plus className="h-4 w-4 mr-2" /> Add task
              </button>
            </div>
          )}
          
          {isApplying && (
            <div className="card mb-8 border border-primary/30 hover:shadow-glow-md transition-all duration-300">
              <h2 className="text-xl font-bold mb-4 text-primary-light">Apply to Join</h2>
              
              <form onSubmit={handleApply}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Why do you want to join this project?
                  </label>
                  <textarea
                    value={application}
                    onChange={(e) => setApplication(e.target.value)}
                    className="input h-32 focus:border-primary-light focus:ring-primary-light/20"
                    placeholder="Describe your interest, relevant skills, and how you can contribute..."
                    required
                  />
                </div>
                
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsApplying(false)}
                    className="btn btn-secondary hover:scale-105 transition-transform duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary hover:scale-105 transition-transform duration-200"
                  >
                    Submit Application
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
        
        <div className="lg:col-span-1">
          <div className="card mb-8 hover:shadow-glow-sm transition-all duration-300">
            <div className="flex items-center mb-6">
              <Link 
                to={`/profile/${project.creatorId}`}
                className="flex items-center group hover:scale-105 transition-transform duration-200"
              >
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/30 to-primary-light/20 flex items-center justify-center mr-3 border border-primary/30 group-hover:border-primary-light group-hover:shadow-glow-sm transition-all duration-300">
                  <User className="h-6 w-6 text-primary-light" />
                </div>
                <div>
                  <h2 className="font-bold group-hover:text-primary-light transition-colors duration-200">
                    {project.creatorName}
                  </h2>
                  <p className="text-sm text-gray-400">Project Creator</p>
                </div>
              </Link>
            </div>
            
            <div className="space-y-4 mt-6">
              {!isCreator && !isMember && !isApplying && (
                <button 
                  onClick={() => setIsApplying(true)}
                  className="btn btn-primary w-full hover:scale-105 hover:shadow-glow-md transition-all duration-300"
                >
                  <UserPlus className="h-5 w-5 mr-2" />
                  Apply to Join
                </button>
              )}
              
              <button className="btn btn-secondary w-full hover:scale-105 transition-transform duration-200">
                <MessageSquare className="h-5 w-5 mr-2" />
                Contact Creator
              </button>
              
              {(isCreator || isMember) && (
                <a href="#" className="btn btn-secondary w-full flex items-center justify-center hover:scale-105 transition-transform duration-200">
                  <ExternalLink className="h-5 w-5 mr-2" />
                  Project Workspace
                </a>
              )}
            </div>
          </div>
          
          {project.members && project.members.length > 0 && (
            <div className="card mb-8 hover:shadow-glow-sm transition-all duration-300">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <span className="h-2 w-2 bg-blue-500 rounded-full mr-3 animate-pulse"></span>
                Team Members
              </h2>
              
              <div className="space-y-4">
                {project.members.map((member, index) => (
                  <Link
                    key={member.id}
                    to={`/profile/${member.id}`}
                    className="flex items-center group hover:scale-105 transition-transform duration-200 p-2 rounded-lg hover:bg-secondary/50"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary-light/10 flex items-center justify-center mr-3 border border-primary/20 group-hover:border-primary-light group-hover:shadow-glow-sm transition-all duration-300">
                      <User className="h-5 w-5 text-primary-light" />
                    </div>
                    <div>
                      <p className="font-medium group-hover:text-primary-light transition-colors duration-200">
                        {member.name}
                      </p>
                      <p className="text-sm text-gray-400">{member.role}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
          
          {isCreator && (
            <div className="card border border-yellow-500/30 hover:shadow-glow-md transition-all duration-300">
              <h2 className="text-xl font-bold mb-4 text-yellow-400 flex items-center">
                <span className="h-2 w-2 bg-yellow-400 rounded-full mr-3 animate-pulse"></span>
                Applicants
              </h2>
              {applicationsLoading ? (
                <div className="text-gray-400">Loading applicants...</div>
              ) : applications.length === 0 ? (
                <p className="text-gray-400 mb-4">No applications yet.</p>
              ) : (
                <div className="space-y-4 mb-4">
                  {applications.map(app => (
                    <div key={app.id} className="p-3 rounded-lg bg-secondary/40 border border-secondary/30">
                      <div className="font-medium text-primary-light">{app.name}</div>
                      <div className="text-sm text-gray-400">{app.college}</div>
                      <div className="text-sm text-gray-300 mt-1">{app.message}</div>
                      <div className="text-xs text-gray-500 mt-1">{new Date(app.timestamp).toLocaleString()}</div>
                      <div className="mt-2 flex items-center gap-2">
                        {app.status === 'accepted' && <span className="px-2 py-1 rounded bg-green-600/30 text-green-400 text-xs font-semibold">Accepted</span>}
                        {app.status === 'rejected' && <span className="px-2 py-1 rounded bg-red-600/30 text-red-400 text-xs font-semibold">Rejected</span>}
                        {(app.status === undefined || app.status === 'pending') && (
                          <>
                            <button
                              className="btn btn-primary btn-xs"
                              disabled={app.status !== undefined && app.status !== 'pending'}
                              onClick={() => handleApplicationStatus(app.id, 'accepted')}
                            >
                              Accept
                            </button>
                            <button
                              className="btn btn-secondary btn-xs"
                              disabled={app.status !== undefined && app.status !== 'pending'}
                              onClick={() => handleApplicationStatus(app.id, 'rejected')}
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;