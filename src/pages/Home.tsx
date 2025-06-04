import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Code, BookOpen } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Find teammates. <span className="text-primary-light">Build projects.</span> Collaborate better.
            </h1>
            <p className="mt-6 text-xl text-gray-300 max-w-3xl mx-auto">
              A student-first platform to pitch ideas, join teams, and build real-world skills.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/post-project" className="btn btn-primary">
                Post a Project
              </Link>
              <Link to="/projects" className="btn btn-secondary">
                Browse Projects
              </Link>
            </div>
          </div>
        </div>
        
        {/* Stats */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary-light">750+</p>
              <p className="mt-2 text-lg text-gray-300">Projects posted</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary-light">1,200+</p>
              <p className="mt-2 text-lg text-gray-300">Collaborations formed</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary-light">50+</p>
              <p className="mt-2 text-lg text-gray-300">Campuses reached</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background-lighter">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">How CollabSphere Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="card hover:scale-105 hover:shadow-glow-sm">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <Code className="h-6 w-6 text-primary-light" />
              </div>
              <h3 className="text-xl font-bold mb-3">Post Your Project</h3>
              <p className="text-gray-400">Share your project idea, describe required skills, and set expectations for potential team members.</p>
              <Link to="/post-project" className="inline-flex items-center mt-4 text-primary-light hover:underline">
                Post a project <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            
            <div className="card hover:scale-105 hover:shadow-glow-sm">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary-light" />
              </div>
              <h3 className="text-xl font-bold mb-3">Build Your Team</h3>
              <p className="text-gray-400">Review applications, find the right mix of skills and experience, and create your dream collaboration team.</p>
              <Link to="/projects" className="inline-flex items-center mt-4 text-primary-light hover:underline">
                Find collaborators <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            
            <div className="card hover:scale-105 hover:shadow-glow-sm">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-primary-light" />
              </div>
              <h3 className="text-xl font-bold mb-3">Manage & Collaborate</h3>
              <p className="text-gray-400">Use our built-in tools to track progress, assign tasks, and communicate effectively with your team.</p>
              <Link to="/dashboard" className="inline-flex items-center mt-4 text-primary-light hover:underline">
                View dashboard <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Featured Projects</h2>
            <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
              Check out some of the exciting collaborations happening on CollabSphere
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Project Card 1 */}
            <div className="card hover:shadow-glow-sm">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">AI-Powered Study Assistant</h3>
                <span className="tag tag-primary">Open</span>
              </div>
              <p className="text-gray-400 mb-4">
                Building an AI tool that helps students organize study materials and create personalized learning paths.
              </p>
              <div className="mb-4">
                <span className="tag">React</span>
                <span className="tag">Machine Learning</span>
                <span className="tag">Firebase</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">5 collaborators needed</span>
                <Link to="/projects/1" className="text-primary-light hover:underline">View details</Link>
              </div>
            </div>
            
            {/* Project Card 2 */}
            <div className="card hover:shadow-glow-sm female-led">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">Health & Wellness Tracker</h3>
                <span className="tag bg-pink-500/20 text-pink-400">Women-led</span>
              </div>
              <p className="text-gray-400 mb-4">
                Creating a comprehensive health tracking app with mood, nutrition, and exercise monitoring.
              </p>
              <div className="mb-4">
                <span className="tag">Flutter</span>
                <span className="tag">Firebase</span>
                <span className="tag">Health API</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">3 collaborators needed</span>
                <Link to="/projects/2" className="text-primary-light hover:underline">View details</Link>
              </div>
            </div>
            
            {/* Project Card 3 */}
            <div className="card hover:shadow-glow-sm">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">Campus Event Platform</h3>
                <span className="tag tag-primary">Open</span>
              </div>
              <p className="text-gray-400 mb-4">
                Developing a platform for students to discover, create, and RSVP to campus events and clubs.
              </p>
              <div className="mb-4">
                <span className="tag">Next.js</span>
                <span className="tag">MongoDB</span>
                <span className="tag">Tailwind</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">4 collaborators needed</span>
                <Link to="/projects/3" className="text-primary-light hover:underline">View details</Link>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link to="/projects" className="btn btn-primary">
              Explore all projects
            </Link>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Ready to start collaborating?</h2>
          <p className="mt-4 text-white/80 max-w-2xl mx-auto">
            Join CollabSphere today and connect with passionate students and creators ready to build amazing projects.
          </p>
          <div className="mt-8">
            <Link to="/register" className="btn bg-white text-primary hover:bg-gray-100">
              Create your account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;