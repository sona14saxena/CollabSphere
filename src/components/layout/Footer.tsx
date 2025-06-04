import React from 'react';
import { Link } from 'react-router-dom';
import { GithubIcon, LinkedinIcon, TwitterIcon } from 'lucide-react';
import Logo from '../ui/Logo';

const Footer = () => {
  return (
    <footer className="bg-background-lighter border-t border-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center">
              <Logo className="h-8 w-auto" />
              <span className="ml-2 text-xl font-heading font-bold">CollabSphere</span>
            </div>
            <p className="mt-4 text-sm text-gray-400 max-w-md">
              A student-first platform to pitch ideas, join teams, and build real-world skills. Connect with collaborators, showcase your projects, and grow your portfolio.
            </p>
            <div className="mt-6 flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-primary-light">
                <GithubIcon className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-light">
                <LinkedinIcon className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-light">
                <TwitterIcon className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-white">Resources</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="/projects" className="text-sm text-gray-400 hover:text-primary-light">Projects</Link>
              </li>
              <li>
                <Link to="/women-in-tech" className="text-sm text-gray-400 hover:text-primary-light">Women in Tech</Link>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-primary-light">Blog</a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-primary-light">Resources</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-white">Company</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-primary-light">About</a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-primary-light">Privacy</a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-primary-light">Terms</a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-primary-light">Contact</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-800 pt-8">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} CollabSphere. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;