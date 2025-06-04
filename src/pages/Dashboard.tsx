import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Check, Clock, Users, MessageSquare } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

// Task type
interface Task {
  id: number;
  title: string;
  completed: boolean;
  projectId: string;
  assignedTo: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  role: string;
  members: number;
  tasks: number;
  completedTasks: number;
  applications: number;
  lastActivity: string;
}

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('projects');

  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: 'Design database schema', completed: true, projectId: '1', assignedTo: currentUser?.displayName || 'You' },
    { id: 2, title: 'Implement user authentication', completed: true, projectId: '1', assignedTo: currentUser?.displayName || 'You' },
    { id: 3, title: 'Create wireframes for UI', completed: false, projectId: '1', assignedTo: currentUser?.displayName || 'You' },
    { id: 4, title: 'Research ML models for study recommendations', completed: false, projectId: '1', assignedTo: 'Alex Chen' },
    { id: 5, title: 'Collect campus carbon data', completed: true, projectId: '2', assignedTo: 'Sarah Johnson' },
    { id: 6, title: 'Design dashboard visualizations', completed: false, projectId: '2', assignedTo: currentUser?.displayName || 'You' }
  ]);

  const [myProjects, setMyProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);

  const [projectApplicants, setProjectApplicants] = useState<{ [projectId: string]: any[] }>({});
  const [loadingApplicants, setLoadingApplicants] = useState<{ [projectId: string]: boolean }>({});

  const [appliedProjects, setAppliedProjects] = useState<(Project & { status: string; appliedDate: string })[]>([]);
  const [loadingApplications, setLoadingApplications] = useState(false);

  useEffect(() => {
    if (!currentUser) return;

    const fetchMyProjects = async () => {
      setLoadingProjects(true);
      try {
        const q = query(collection(db, 'projects'), where('creatorId', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);
        const projects: Project[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          projects.push({
            id: doc.id,
            title: data.title || 'Untitled',
            description: data.description || '',
            role: 'Project Owner',
            members: Array.isArray(data.members) ? data.members.length : 0,
            tasks: Array.isArray(data.tasks) ? data.tasks.length : 0,
            completedTasks: data.completedTasks || 0,
            applications: Array.isArray(data.applicants) ? data.applicants.length : 0,
            lastActivity: data.lastActivity || 'N/A',
          });
        });
        setMyProjects(projects);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoadingProjects(false);
      }
    };

    const fetchAppliedProjects = async () => {
      setLoadingApplications(true);
      try {
        const q = query(collection(db, 'applications'), where('applicantId', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);
        const applications: (Project & { status: string; appliedDate: string })[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          applications.push({
            id: doc.id,
            title: data.title || 'Untitled',
            description: data.description || '',
            role: 'Applicant',
            members: Array.isArray(data.members) ? data.members.length : 0,
            tasks: Array.isArray(data.tasks) ? data.tasks.length : 0,
            completedTasks: data.completedTasks || 0,
            applications: Array.isArray(data.applicants) ? data.applicants.length : 0,
            lastActivity: data.lastActivity || 'N/A',
            status: data.status || 'Pending',
            appliedDate: data.appliedDate || 'N/A',
          });
        });
        setAppliedProjects(applications);
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setLoadingApplications(false);
      }
    };

    fetchMyProjects();
    fetchAppliedProjects();
  }, [currentUser]);

  const fetchApplicantsForProject = async (projectId: string) => {
    setLoadingApplicants(prev => ({ ...prev, [projectId]: true }));
    try {
      const q = query(collection(db, 'applications'), where('projectId', '==', projectId));
      const querySnapshot = await getDocs(q);
      const applicants = querySnapshot.docs.map(doc => doc.data());
      setProjectApplicants(prev => ({ ...prev, [projectId]: applicants }));
    } catch (error) {
      console.error('Error fetching applicants:', error);
    } finally {
      setLoadingApplicants(prev => ({ ...prev, [projectId]: false }));
    }
  };

  const toggleTaskCompletion = (taskId: number) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-400 mt-1">Manage your projects and collaborations</p>
          </div>
          <button
            className="relative p-2 rounded-full bg-primary/20 text-primary-light hover:bg-primary/30"
            title="Notifications"
            onClick={() => alert('Notification feature coming soon!')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-5-5.917V5a2 2 0 10-4 0v.083A6 6 0 004 11v3.159c0 .538-.214 1.055-.595 1.436L2 17h5m5 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-background bg-red-400"></span>
          </button>
        </div>
        <Link to="/post-project" className="btn btn-primary mt-4 md:mt-0">
          <PlusCircle className="h-5 w-5 mr-2" /> Post a new project
        </Link>
      </div>

      <div className="border-b border-gray-800 mb-6">
        <nav className="-mb-px flex space-x-8">
          {['projects', 'tasks', 'applications'].map(tab => (
            <button
              key={tab}
              className={`pb-4 px-1 ${
                activeTab === tab
                  ? 'border-b-2 border-primary-light text-primary-light font-medium'
                  : 'text-gray-400 hover:text-gray-300 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'projects' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {loadingProjects ? (
            <p>Loading projects...</p>
          ) : myProjects.length === 0 ? (
            <p>No projects found.</p>
          ) : (
            myProjects.map(project => (
            <div 
              key={project.id} 
              className="card hover:shadow-glow-sm opacity-0 transform translate-y-6 transition-all duration-700 ease-in-out scroll-animate"
              data-scroll
            >
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold">{project.title}</h2>
                  <span className="tag tag-primary">{project.role}</span>
                </div>
                <p className="text-gray-400 mb-6">{project.description}</p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-3 bg-secondary rounded-lg">
                    <Users className="h-5 w-5 mx-auto mb-1 text-primary-light" />
                    <p className="text-sm text-gray-300">Team</p>
                    <p className="text-lg font-bold">{project.members}</p>
                  </div>
                  <div className="text-center p-3 bg-secondary rounded-lg">
                    <Check className="h-5 w-5 mx-auto mb-1 text-green-500" />
                    <p className="text-sm text-gray-300">Tasks</p>
                    <p className="text-lg font-bold">{project.completedTasks}/{project.tasks}</p>
                  </div>
                  <div className="text-center p-3 bg-secondary rounded-lg">
                    <PlusCircle className="h-5 w-5 mx-auto mb-1 text-blue-500" />
                    <p className="text-sm text-gray-300">Applications</p>
                    <p className="text-lg font-bold">{project.applications}</p>
                  </div>
                  <div className="text-center p-3 bg-secondary rounded-lg">
                    <Clock className="h-5 w-5 mx-auto mb-1 text-yellow-500" />
                    <p className="text-sm text-gray-300">Activity</p>
                    <p className="text-sm">{project.lastActivity}</p>
                  </div>
                </div>

                <button
                  onClick={() => fetchApplicantsForProject(project.id)}
                  className="mb-4 text-sm text-primary-light hover:underline"
                >
                  View Applicants
                </button>

                {loadingApplicants[project.id] ? (
                  <p>Loading applicants...</p>
                ) : (
                  projectApplicants[project.id] && projectApplicants[project.id].length > 0 && (
                    <ul className="mb-6 space-y-2">
                      {projectApplicants[project.id].map((applicant, index) => (
                        <li key={index} className="bg-secondary p-3 rounded-md">
                          <p className="font-semibold">{applicant.applicantName || 'Unnamed Applicant'}</p>
                          <p className="text-sm text-gray-400">{applicant.applicantEmail || 'No email provided'}</p>
                          <p className="text-xs text-gray-500">Applied on: {applicant.appliedDate || 'N/A'}</p>
                        </li>
                      ))}
                    </ul>
                  )
                )}

                <div className="flex justify-between items-center">
                  <Link to={`/projects/${project.id}`} className="text-primary-light hover:underline">
                    View details
                  </Link>
                  <div className="flex space-x-2">
                    <button className="p-2 rounded-full bg-primary/20 text-primary-light hover:bg-primary/30">
                      <MessageSquare className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'tasks' && (
        <div className="card p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">My Tasks</h2>
            <button className="btn btn-secondary text-sm py-2">
              <PlusCircle className="h-4 w-4 mr-2" /> Add task
            </button>
          </div>
          <ul className="space-y-4">
            {tasks.map(task => (
              <li key={task.id} className="flex items-center justify-between bg-secondary p-3 rounded-md">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTaskCompletion(task.id)}
                    className="mr-3"
                  />
                  <span className={`text-sm ${task.completed ? 'line-through text-gray-400' : ''}`}>
                    {task.title}
                  </span>
                </div>
                <span className="text-xs text-gray-400">Assigned to: {task.assignedTo}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === 'applications' && (
        <div className="card p-6">
          <h2 className="text-xl font-bold mb-6">Applications</h2>
          {loadingApplications ? (
            <p>Loading applications...</p>
          ) : appliedProjects.length === 0 ? (
            <p>No applications found.</p>
          ) : (
            <ul className="space-y-4">
              {appliedProjects.map(project => (
                <li key={project.id} className="bg-secondary p-4 rounded-md">
                  <h3 className="font-semibold text-lg">{project.title}</h3>
                  <p className="text-gray-400 text-sm mb-2">{project.description}</p>
                  <p className="text-xs text-gray-500">Status: {project.status} | Applied on: {project.appliedDate}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
