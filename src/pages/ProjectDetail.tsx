import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toastStore } from '../components/ui/Toaster';
import { Users, Calendar, Clock, MessageSquare, UserPlus, ExternalLink, User, Check, Plus } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
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
  createdAt: string;
  applicants: number;
  members: { id: string; name: string; role: string; }[];
  tasks: { id: number; title: string; completed: boolean; }[];
}

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [application, setApplication] = useState('');

  useEffect(() => {
    fetchProject();
  }, [id]);

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

  const isCreator = currentUser?.uid === project.creatorId;
  const isMember = project.members?.some(member => member.id === currentUser?.uid);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!application.trim()) {
      toastStore.addToast('Please describe why you want to join this project', 'error');
      return;
    }
    
    try {
      // Here you would implement the application logic with Firebase
      toastStore.addToast('Application submitted successfully!', 'success');
      setIsApplying(false);
      setApplication('');
    } catch (error) {
      console.error('Error submitting application:', error);
      toastStore.addToast('Failed to submit application', 'error');
    }
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <Link to="/projects" className="text-primary-light hover:underline flex items-center">
          ← Back to projects
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="card mb-8">
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-3xl font-bold">{project.title}</h1>
              <div className="flex space-x-2">
                {project.isWomenLed && (
                  <span className="tag bg-pink-500/20 text-pink-400">Women-led</span>
                )}
                {project.isCollegeOnly && (
                  <span className="tag bg-blue-500/20 text-blue-400">College</span>
                )}
                <span className="tag tag-primary">Open</span>
              </div>
            </div>
            
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 mb-6">{project.description}</p>
            </div>
            
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Required Skills</h2>
              <div className="flex flex-wrap">
                {project.skills.map(skill => (
                  <span key={skill} className="tag">{skill}</span>
                ))}
              </div>
            </div>
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center p-4 bg-secondary rounded-lg">
                <Users className="h-6 w-6 text-primary-light mr-3" />
                <div>
                  <h3 className="font-medium">Team Size</h3>
                  <p className="text-gray-400">{project.teamSize}</p>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-secondary rounded-lg">
                <Calendar className="h-6 w-6 text-primary-light mr-3" />
                <div>
                  <h3 className="font-medium">Duration</h3>
                  <p className="text-gray-400">{project.duration}</p>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-secondary rounded-lg">
                <Clock className="h-6 w-6 text-primary-light mr-3" />
                <div>
                  <h3 className="font-medium">Posted</h3>
                  <p className="text-gray-400">{project.createdAt}</p>
                </div>
              </div>
            </div>
          </div>
          
          {(isCreator || isMember) && project.tasks && (
            <div className="card mb-8">
              <h2 className="text-xl font-bold mb-4">Project Tasks</h2>
              
              <div className="space-y-4">
                {project.tasks.map(task => (
                  <div 
                    key={task.id} 
                    className={`flex items-center p-4 rounded-lg ${
                      task.completed ? 'bg-green-900/20' : 'bg-secondary'
                    }`}
                  >
                    <div
                      className={`h-5 w-5 rounded-full mr-3 flex items-center justify-center ${
                        task.completed 
                          ? 'bg-green-500 text-white' 
                          : 'border border-gray-500'
                      }`}
                    >
                      {task.completed && <Check className="h-3 w-3" />}
                    </div>
                    <p className={task.completed ? 'line-through text-gray-400' : ''}>
                      {task.title}
                    </p>
                  </div>
                ))}
              </div>
              
              <button className="btn btn-secondary text-sm mt-6">
                <Plus className="h-4 w-4 mr-2" /> Add task
              </button>
            </div>
          )}
          
          {isApplying && (
            <div className="card mb-8">
              <h2 className="text-xl font-bold mb-4">Apply to Join</h2>
              
              <form onSubmit={handleApply}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Why do you want to join this project?
                  </label>
                  <textarea
                    value={application}
                    onChange={(e) => setApplication(e.target.value)}
                    className="input h-32"
                    placeholder="Describe your interest, relevant skills, and how you can contribute..."
                    required
                  />
                </div>
                
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsApplying(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    Submit Application
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
        
        <div className="lg:col-span-1">
          <div className="card mb-8">
            <div className="flex items-center mb-6">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                <User className="h-6 w-6 text-primary-light" />
              </div>
              <div>
                <h2 className="font-bold">{project.creatorName}</h2>
                <p className="text-sm text-gray-400">Project Creator</p>
              </div>
            </div>
            
            <div className="space-y-4 mt-6">
              {!isCreator && !isMember && !isApplying && (
                <button 
                  onClick={() => setIsApplying(true)}
                  className="btn btn-primary w-full"
                >
                  <UserPlus className="h-5 w-5 mr-2" />
                  Apply to Join
                </button>
              )}
              
              <button className="btn btn-secondary w-full">
                <MessageSquare className="h-5 w-5 mr-2" />
                Contact Creator
              </button>
              
              {(isCreator || isMember) && (
                <a href="#" className="btn btn-secondary w-full flex items-center justify-center">
                  <ExternalLink className="h-5 w-5 mr-2" />
                  Project Workspace
                </a>
              )}
            </div>
          </div>
          
          {project.members && (
            <div className="card mb-8">
              <h2 className="text-xl font-bold mb-4">Team Members</h2>
              
              <div className="space-y-4">
                {project.members.map(member => (
                  <div key={member.id} className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                      <User className="h-5 w-5 text-primary-light" />
                    </div>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-gray-400">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {isCreator && (
            <div className="card">
              <h2 className="text-xl font-bold mb-4">Applicants</h2>
              
              <p className="text-gray-400">
                {project.applicants} people have applied to join this project.
              </p>
              
              <Link to="/dashboard" className="btn btn-secondary w-full mt-4">
                Review Applications
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;