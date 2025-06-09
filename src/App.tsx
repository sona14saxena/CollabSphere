import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/Toaster';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import PostProject from './pages/PostProject';
import ProjectFeed from './pages/ProjectFeed';
import ProjectDetail from './pages/ProjectDetail';
import WomenInTech from './pages/WomenInTech';
import ProtectedRoute from './components/auth/ProtectedRoute';
import GridOverlay from './components/ui/GridOverlay';

function App() {
  return (
    <>
      <GridOverlay />
      <Navbar />
      <main className="min-h-screen pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/projects" element={<ProjectFeed />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/women-in-tech" element={<WomenInTech />} />
          <Route path="/profile/:userId" element={<Profile />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/post-project" element={<PostProject />} />
          </Route>
        </Routes>
      </main>
      <Footer />
      <Toaster />
    </>
  );
}

export default App;