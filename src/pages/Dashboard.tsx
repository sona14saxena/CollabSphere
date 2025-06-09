import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Check, Clock, Users, MessageSquare, Trash2, Bell } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { toastStore } from '../components/ui/Toaster';

interface Project {
  id: string;
  title: string;
  description: string;
  creatorId: string;
  members: { id: string; name: string; role: string; }[];
  tasks: { id: number; title: string; completed: boolean; }[];
  applications: number;
  lastActivity: string;
}

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('projects');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New application for AI Study Assistant', time: '2h ago' },
    { id: 2, message: 'Task completed: Design database schema', time: '5h ago' },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    fetchUserProjects();
  }, [currentUser]);

  const fetchUserProjects = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      const projectsRef = collection(db, 'projects');
      const q = query(projectsRef, where('creatorId', '==', currentUser.uid));
      const querySnapshot = await getDocs(q);
      
      const projectData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Project[];
      
      setProjects(projectData);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toastStore.addToast('Failed to load projects', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    
    try {
      await deleteDoc(doc(db, 'projects', projectId));
      setProjects(projects.filter(p => p.id !== projectId));
      toastStore.addToast('Project deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting project:', error);
      toastStore.addToast('Failed to delete project', 'error');
    }
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-400 mt-1">Manage your projects and collaborations</p>
        </div>
        <div className="flex items-center mt-4 md:mt-0">
          <div className="relative mr-4">
            <button
              onClick={toggleNotifications}
              className="p-2 rounded-full bg-background-lighter hover:bg-secondary transition-colors duration-200"
            >
              <Bell className="h-5 w-5 text-primary-light" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary rounded-full text-xs flex items-center justify-center">
                {notifications.length}
              </span>
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-background-lighter rounded-lg shadow-lg z-50 border border-gray-800 animate-fade-in">
                <div className="p-4">
                  <h3 className="text-sm font-medium mb-3">Notifications</h3>
                  <div className="space-y-3">
                    {notifications.map(notification => (
                      <div key={notification.id} className="flex items-start p-2 hover:bg-secondary rounded-lg transition-colors duration-200">
                        <div className="flex-1">
                          <p className="text-sm">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          <Link to="/post-project" className="btn btn-primary">
            <PlusCircle className="h-5 w-5 mr-2" /> Post a new project
          </Link>
        </div>
      </div>

      <div className="border-b border-gray-800 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            className={`pb-4 px-1 transition-colors duration-200 ${
              activeTab === 'projects'
                ? 'border-b-2 border-primary-light text-primary-light font-medium'
                : 'text-gray-400 hover:text-gray-300 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('projects')}
          >
            My Projects
          </button>
          <button
            className={`pb-4 px-1 transition-colors duration-200 ${
              activeTab === 'tasks'
                ? 'border-b-2 border-primary-light text-primary-light font-medium'
                : 'text-gray-400 hover:text-gray-300 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('tasks')}
          >
            Tasks
          </button>
          <button
            className={`pb-4 px-1 transition-colors duration-200 ${
              activeTab === 'applications'
                ? 'border-b-2 border-primary-light text-primary-light font-medium'
                : 'text-gray-400 hover:text-gray-300 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('applications')}
          >
            Applications
          </button>
        </nav>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-light"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {projects.map(project => (
            <div 
              key={project.id} 
              className="card hover:shadow-glow-sm transform hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold">{project.title}</h2>
                <div className="flex items-center space-x-2">
                  <Link 
                    to={`/projects/${project.id}`}
                    className="text-primary-light hover:underline"
                  >
                    View details
                  </Link>
                  <button
                    onClick={() => handleDeleteProject(project.id)}
                    className="p-2 rounded-full hover:bg-red-900/20 text-red-500 transition-colors duration-200"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <p className="text-gray-400 mb-6">{project.description}</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 bg-secondary rounded-lg transform hover:scale-105 transition-transform duration-200">
                  <Users className="h-5 w-5 mx-auto mb-1 text-primary-light" />
                  <p className="text-sm text-gray-300">Team</p>
                  <p className="text-lg font-bold">{project.members?.length || 0}</p>
                </div>
                <div className="text-center p-3 bg-secondary rounded-lg transform hover:scale-105 transition-transform duration-200">
                  <Check className="h-5 w-5 mx-auto mb-1 text-green-500" />
                  <p className="text-sm text-gray-300">Tasks</p>
                  <p className="text-lg font-bold">
                    {project.tasks?.filter(t => t.completed).length || 0}/{project.tasks?.length || 0}
                  </p>
                </div>
                <div className="text-center p-3 bg-secondary rounded-lg transform hover:scale-105 transition-transform duration-200">
                  <MessageSquare className="h-5 w-5 mx-auto mb-1 text-blue-500" />
                  <p className="text-sm text-gray-300">Applications</p>
                  <p className="text-lg font-bold">{project.applications || 0}</p>
                </div>
                <div className="text-center p-3 bg-secondary rounded-lg transform hover:scale-105 transition-transform duration-200">
                  <Clock className="h-5 w-5 mx-auto mb-1 text-yellow-500" />
                  <p className="text-sm text-gray-300">Activity</p>
                  <p className="text-sm">{project.lastActivity || 'No activity'}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {project.members?.map(member => (
                  <Link
                    key={member.id}
                    to={`/profile/${member.id}`}
                    className="flex items-center px-3 py-1 bg-secondary rounded-full hover:bg-primary/20 transition-colors duration-200"
                  >
                    <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                      <Users className="h-4 w-4 text-primary-light" />
                    </div>
                    <span className="text-sm">{member.name}</span>
                    <span className="text-xs text-gray-500 ml-2">{member.role}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;