import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Users, BookOpen } from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
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
  isCollegeOnly: boolean;
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
  const [filter, setFilter] = useState<'all' | 'college' | 'women'>('all');
  const [collegeFilter, setCollegeFilter] = useState<'myCollege' | 'allColleges'>('myCollege');
  const [selectedCollege, setSelectedCollege] = useState<string>('');
  const [availableColleges, setAvailableColleges] = useState<string[]>([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser && (currentUser as any).college) {
      setSelectedCollege((currentUser as any).college);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchAvailableColleges();
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [filter, collegeFilter, selectedCollege]);

  const fetchAvailableColleges = async () => {
    try {
      const collegesSnapshot = await getDocs(collection(db, 'colleges'));
      const collegesList = collegesSnapshot.docs.map(doc => doc.id);
      setAvailableColleges(collegesList);
    } catch (error) {
      console.error('Error fetching colleges:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      setLoading(true);
      let projectQuery = collection(db, 'projects');

      if (filter === 'college') {
        projectQuery = query(collection(db, 'projects'), where('isCollegeOnly', '==', true));
      } else if (filter === 'women') {
        projectQuery = query(collection(db, 'projects'), where('isWomenLed', '==', true));
      }

      if (collegeFilter === 'myCollege' && selectedCollege) {
        projectQuery = query(collection(db, 'projects'), where('college', '==', selectedCollege));
      } else if (collegeFilter === 'allColleges' && selectedCollege) {
        projectQuery = query(collection(db, 'projects'), where('college', '==', selectedCollege));
      }

      const querySnapshot = await getDocs(projectQuery);
      const projectData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Project));

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

          <div className="flex space-x-4">
            <button
              onClick={() => setFilter('all')}
              className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            >
              All Projects
            </button>
            <button
              onClick={() => setFilter('college')}
              className={`btn ${filter === 'college' ? 'btn-primary' : 'btn-secondary'}`}
            >
              College Only
            </button>
            <button
              onClick={() => setFilter('women')}
              className={`btn ${filter === 'women' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Women-Led
            </button>
            <div className="flex items-center space-x-2">
              <label className="text-gray-400">College Filter:</label>
              <select
                value={collegeFilter}
                onChange={(e) => setCollegeFilter(e.target.value as 'myCollege' | 'allColleges')}
                className="input"
              >
                <option value="myCollege">My College Only</option>
                <option value="allColleges">All Colleges</option>
              </select>
            </div>
            {collegeFilter === 'allColleges' && (
              <div className="flex items-center space-x-2">
                <label className="text-gray-400">Select College:</label>
                <select
                  value={selectedCollege}
                  onChange={(e) => setSelectedCollege(e.target.value)}
                  className="input"
                >
                  <option value="">All Colleges</option>
                  {availableColleges.map(college => (
                    <option key={college} value={college}>{college}</option>
                  ))}
                </select>
              </div>
            )}
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
              className={`card hover:shadow-glow-sm ${project.isWomenLed ? 'female-led' : ''}`}
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold">{project.title}</h2>
                <div className="flex space-x-2">
                  {project.isWomenLed && (
                    <span className="tag bg-pink-500/20 text-pink-400">Women-led</span>
                  )}
                  {project.isCollegeOnly && (
                    <span className="tag bg-blue-500/20 text-blue-400">College</span>
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
                <div className="text-sm text-gray-500">
                  By {project.creatorName}
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