import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, UserPlus } from 'lucide-react';

// Mock data for women-led projects
const womenLedProjects = [
  {
    id: 2,
    title: 'Health & Wellness Tracker',
    description: 'Creating a comprehensive health tracking app with mood, nutrition, and exercise monitoring.',
    skills: ['Flutter', 'Firebase', 'Health API'],
    teamSize: '3-5',
    duration: '3-6 months',
    creatorName: 'Sarah Johnson',
  },
  {
    id: 5,
    title: 'Mental Health Support App',
    description: 'Developing a mobile app to connect students with mental health resources and peer support.',
    skills: ['React Native', 'Firebase', 'Node.js'],
    teamSize: '3-5',
    duration: '3-6 months',
    creatorName: 'Emily Patel',
  },
  {
    id: 7,
    title: 'Inclusive STEM Education Platform',
    description: 'Building an accessible platform to promote STEM education for underrepresented groups in tech.',
    skills: ['React', 'Node.js', 'MongoDB'],
    teamSize: '3-5',
    duration: '3-6 months',
    creatorName: 'Maria Rodriguez',
  },
  {
    id: 8,
    title: 'Women in Tech Mentorship Platform',
    description: 'Creating a platform to connect women in tech with mentors and resources for career growth.',
    skills: ['Vue.js', 'Firebase', 'Tailwind CSS'],
    teamSize: '3-5',
    duration: '1-3 months',
    creatorName: 'Priya Sharma',
  }
];

const WomenInTech = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-pink-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Women in Tech <span className="text-primary-light">Zone</span>
            </h1>
            <p className="mt-6 text-xl text-gray-300 max-w-3xl mx-auto">
              Supporting and promoting projects led by women and gender minorities in technology.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/post-project" className="btn btn-primary">
                Start a Project
              </Link>
              <Link to="/projects" className="btn btn-secondary">
                Join a Project
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">What is the Women in Tech Zone?</h2>
              <p className="text-gray-300 mb-4">
                The Women in Tech Zone is a dedicated space within CollabSphere that highlights and promotes projects led by women and gender minorities in technology.
              </p>
              <p className="text-gray-300 mb-4">
                Our goal is to create more opportunities for collaboration, mentorship, and visibility for underrepresented groups in the tech industry.
              </p>
              <p className="text-gray-300">
                Projects in this zone receive additional promotion, support resources, and access to a network of mentors committed to fostering diversity in tech.
              </p>
            </div>
            
            <div className="bg-background-lighter rounded-xl p-8 border border-pink-900/30">
              <h3 className="text-2xl font-bold mb-4">Why it matters</h3>
              
              <div className="space-y-6">
                <div className="flex">
                  <div className="h-10 w-10 rounded-full bg-pink-900/20 flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-pink-400 font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Representation</h4>
                    <p className="text-gray-400">Women make up only 26% of computing jobs, despite being 47% of the workforce.</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="h-10 w-10 rounded-full bg-pink-900/20 flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-pink-400 font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Innovation</h4>
                    <p className="text-gray-400">Diverse teams create more innovative solutions and perform better financially.</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="h-10 w-10 rounded-full bg-pink-900/20 flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-pink-400 font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Opportunity</h4>
                    <p className="text-gray-400">Creating spaces for collaboration leads to more opportunities and career growth.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20 bg-background-lighter">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">Featured Women-Led Projects</h2>
            <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
              Browse and join these exciting projects led by women in the CollabSphere community
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {womenLedProjects.map(project => (
              <div key={project.id} className="card hover:shadow-glow-sm female-led">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold">{project.title}</h3>
                  <span className="tag bg-pink-500/20 text-pink-400">Women-led</span>
                </div>
                <p className="text-gray-400 mb-4">
                  {project.description}
                </p>
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
                  <span className="text-sm text-gray-500">By {project.creatorName}</span>
                  <Link to={`/projects/${project.id}`} className="text-primary-light hover:underline">
                    View details
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/projects" className="btn btn-primary">
              Explore all projects
            </Link>
          </div>
        </div>
      </section>
      
      {/* Join CTA */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Join the Community</h2>
          <p className="text-gray-300 mb-8">
            Whether you're looking to lead a project, join a team, or simply connect with other women in tech, we invite you to become part of our growing community.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/post-project" className="btn btn-primary">
              <UserPlus className="h-5 w-5 mr-2" />
              Start Your Project
            </Link>
            <Link to="/register" className="btn btn-secondary">
              Create an Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WomenInTech;