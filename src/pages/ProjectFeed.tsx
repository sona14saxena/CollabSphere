import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Users, BookOpen } from 'lucide-react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';
import { toastStore } from '../components/ui/Toaster';

interface Project {
  id: string;
  title: string;
  description: string;
  skills: string[];
  teamSize: string;
  duration: string;
  isWomenLed: boolean;
  creatorName: string;
  creatorId: string;
  college: string;
  createdAt: string;
  applicants: number;
}

const ProjectFeed = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'women' | 'myCollege'>('all');
  const { currentUser } = useAuth();
  const [myCollege, setMyCollege] = useState<string>('');

  useEffect(() => {
    if (currentUser?.uid) {
      fetchUserCollege(currentUser.uid);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchProjects();
  }, [filter, myCollege]);

  const fetchUserCollege = async (uid: string) => {
    try {
      const userRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setMyCollege(userData.college || '');
      }
    } catch (error) {
      console.error('Error fetching user college:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      setLoading(true);
      let projectQuery = collection(db, 'projects');
      let constraints: any[] = [];

      if (filter === 'women') {
        constraints.push(where('isWomenLed', '==', true));
      }

      const q = constraints.length > 0 ? query(projectQuery, ...constraints) : query(projectQuery);
      const querySnapshot = await getDocs(q);
      
      let projectData = querySnapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data()
      })) as Project[];

      if (filter === 'myCollege' && myCollege) {
        // Filter projects by owner's college
        const filteredProjects: Project[] = [];
        for (const project of projectData) {
          try {
            const userRef = doc(db, 'users', project.creatorId);
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
              const userData = userDoc.data();
              if (userData.college === myCollege) {
                filteredProjects.push(project);
              }
            }
          } catch (error) {
            console.error('Error fetching project owner college:', error);
          }
        }
        projectData = filteredProjects;
      }

      setProjects(projectData);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toastStore.addToast('Failed to load projects', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSearch = () => {
    fetchProjects();
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Browse Projects</h1>
          <p className="text-gray-400 mt-1">Find collaborations that match your skills and interests</p>
        </div>
        <Link to="/post-project" className="btn btn-primary mt-4 md:mt-0">
          Post a project
        </Link>
      </div>

      <div className="bg-background-lighter rounded-xl p-4 mb-8">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
              placeholder="Search projects..."
            />
          </div>

          <button
            onClick={handleSearch}
            className="btn btn-primary"
          >
            Search
          </button>

          <div className="flex space-x-4">
            <button
              onClick={() => setFilter('all')}
              className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            >
              All Projects
            </button>
            <button
              onClick={() => setFilter('women')}
              className={`btn ${filter === 'women' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Women-Led
            </button>
            <button
              onClick={() => setFilter('myCollege')}
              className={`btn ${filter === 'myCollege' ? 'btn-primary' : 'btn-secondary'}`}
              disabled={!myCollege}
              title={!myCollege ? 'Set your college in profile to enable' : ''}
            >
              My College
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-light mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading projects...</p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-16">
          <h2 className="text-xl font-bold mb-2">No projects found</h2>
          <p className="text-gray-400">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map(project => (
            <div 
              key={project.id} 
              className={`card hover:shadow-glow-sm transform hover:-translate-y-1 transition-all duration-300 ${project.isWomenLed ? 'female-led' : ''}`}
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold">{project.title}</h2>
                <div className="flex space-x-2">
                  {project.isWomenLed && (
                    <span className="tag bg-pink-500/20 text-pink-400">Women-led</span>
                  )}
                </div>
              </div>

              <p className="text-gray-400 mb-4 line-clamp-3">{project.description}</p>

              <div className="mb-4">
                {project.skills.map(skill => (
                  <span key={skill} className="tag">{skill}</span>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="flex items-center text-sm text-gray-400">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{project.teamSize}</span>
                </div>
                <div className="flex items-center text-sm text-gray-400">
                  <BookOpen className="h-4 w-4 mr-1" />
                  <span>{project.duration}</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-sm">
                  <span className="text-gray-500">By {project.creatorName}</span>
                  <span className="text-gray-600 mx-2">•</span>
                  <span className="text-gray-500">{project.college}</span>
                </div>
                <Link to={`/projects/${project.id}`} className="text-primary-light hover:underline">
                  View details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectFeed;
