import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';
import { toastStore } from '../components/ui/Toaster';
import { X, Plus } from 'lucide-react';

const skillOptions = [
  'React', 'Angular', 'Vue', 'JavaScript', 'TypeScript', 'Node.js', 
  'Python', 'Java', 'C++', 'C#', 'Ruby', 'PHP', 'Swift', 'Kotlin',
  'Flutter', 'React Native', 'Firebase', 'AWS', 'UI/UX Design',
  'Product Management', 'Data Science', 'Machine Learning', 'DevOps'
];

const PostProject = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [teamSize, setTeamSize] = useState('3-5');
  const [duration, setDuration] = useState('1-3 months');
  const [isCollegeOnly, setIsCollegeOnly] = useState(false);
  const [isWomenLed, setIsWomenLed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredSkillOptions = skillOptions.filter(
    skill => !selectedSkills.includes(skill) && skill.toLowerCase().includes(skillInput.toLowerCase())
  );

  const addSkill = (skill: string) => {
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill]);
    }
    setSkillInput('');
  };

  const removeSkill = (skill: string) => {
    setSelectedSkills(selectedSkills.filter(s => s !== skill));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || selectedSkills.length === 0) {
      toastStore.addToast('Please fill in all required fields', 'error');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const projectData = {
        title,
        description,
        skills: selectedSkills,
        teamSize,
        duration,
        isCollegeOnly,
        isWomenLed,
        creatorId: currentUser?.uid,
        creatorName: currentUser?.displayName,
        creatorEmail: currentUser?.email,
        college: currentUser?.college || 'Not specified',
        createdAt: new Date().toISOString(),
        status: 'open',
        applicants: 0,
        members: [{ 
          id: currentUser?.uid, 
          name: currentUser?.displayName, 
          role: 'Project Lead' 
        }],
        tasks: [
          { id: 1, title: 'Project Setup', completed: false },
          { id: 2, title: 'Team Formation', completed: false },
          { id: 3, title: 'Initial Planning', completed: false }
        ]
      };
      
      const docRef = await addDoc(collection(db, 'projects'), projectData);
      
      toastStore.addToast('Project posted successfully!', 'success');
      navigate(`/projects/${docRef.id}`);
    } catch (error) {
      console.error('Error posting project:', error);
      toastStore.addToast('Failed to post project. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Post a New Project</h1>
      
      <form onSubmit={handleSubmit} className="card">
        <div className="mb-6">
          <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
            Project Title <span className="text-primary-light">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input"
            placeholder="e.g., AI-Powered Study Assistant"
            required
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
            Project Description <span className="text-primary-light">*</span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input h-32"
            placeholder="Describe your project, its goals, and what you're trying to achieve..."
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Required Skills <span className="text-primary-light">*</span>
          </label>
          
          <div className="flex flex-wrap mb-2">
            {selectedSkills.map(skill => (
              <div key={skill} className="tag tag-primary flex items-center">
                {skill}
                <button 
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="ml-1 focus:outline-none"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
          
          <div className="relative">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              className="input"
              placeholder="Type or select required skills..."
            />
            
            {skillInput && filteredSkillOptions.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-background-lighter rounded-md shadow-lg max-h-60 overflow-auto">
                <ul className="py-1">
                  {filteredSkillOptions.map(skill => (
                    <li 
                      key={skill}
                      className="px-4 py-2 hover:bg-secondary cursor-pointer"
                      onClick={() => addSkill(skill)}
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <button
            type="button"
            onClick={() => {
              if (skillInput && !selectedSkills.includes(skillInput)) {
                addSkill(skillInput);
              }
            }}
            className="mt-2 flex items-center text-sm text-primary-light hover:underline"
          >
            <Plus className="h-4 w-4 mr-1" /> Add custom skill
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="teamSize" className="block text-sm font-medium text-gray-300 mb-1">
              Team Size
            </label>
            <select
              id="teamSize"
              value={teamSize}
              onChange={(e) => setTeamSize(e.target.value)}
              className="input"
            >
              <option value="1-2">1-2 members</option>
              <option value="3-5">3-5 members</option>
              <option value="6-10">6-10 members</option>
              <option value="10+">10+ members</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-300 mb-1">
              Expected Duration
            </label>
            <select
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="input"
            >
              <option value="< 1 month">Less than 1 month</option>
              <option value="1-3 months">1-3 months</option>
              <option value="3-6 months">3-6 months</option>
              <option value="6+ months">6+ months</option>
              <option value="Ongoing">Ongoing</option>
            </select>
          </div>
        </div>
        
        <div className="space-y-4 mb-8">
          <div className="flex items-center">
            <input
              id="collegeOnly"
              type="checkbox"
              checked={isCollegeOnly}
              onChange={(e) => setIsCollegeOnly(e.target.checked)}
              className="h-4 w-4 rounded border-gray-600 bg-gray-700 focus:ring-primary-light"
            />
            <label htmlFor="collegeOnly" className="ml-2 block text-sm text-gray-300">
              College students only
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              id="womenLed"
              type="checkbox"
              checked={isWomenLed}
              onChange={(e) => setIsWomenLed(e.target.checked)}
              className="h-4 w-4 rounded border-gray-600 bg-gray-700 focus:ring-primary-light"
            />
            <label htmlFor="womenLed" className="ml-2 block text-sm text-gray-300">
              Women in Tech project
            </label>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn btn-secondary mr-4"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary"
          >
            {isSubmitting ? 'Posting...' : 'Post Project'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostProject;