'use client';

import { useState, useEffect, memo } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { RiAddLine, RiDeleteBin6Line, RiSaveLine, RiArrowDownSLine, RiArrowUpSLine } from 'react-icons/ri';
import { toast } from 'react-hot-toast';
import { ApiService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

interface Skill {
  id: string;
  name: string;
  level: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  link?: string;
}

interface Experience {
  id: string;
  company: string;
  position: string;
  duration: string;
  description: string;
}

interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

interface PersonalInfo {
  fullName: string;
  title: string;
  bio: string;
  email: string;
  location: string;
  website: string;
  phone: string;
}

// Move Section component outside and memoize it
const Section = memo(({ 
  id, 
  title, 
  children,
  isExpanded,
  onToggle 
}: { 
  id: string;
  title: string;
  children: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
}) => {
  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50"
      >
        <h2 className="text-lg font-medium text-gray-900">{title}</h2>
        <span className="text-gray-400">
          {isExpanded ? <RiArrowUpSLine size={24} /> : <RiArrowDownSLine size={24} />}
        </span>
      </button>
      {isExpanded && (
        <div className="px-6 pb-6">
          {children}
        </div>
      )}
    </div>
  );
});

Section.displayName = 'Section';

export default function EditPortfolioPage() {
  const { updateUserProfile } = useAuth();
  const [expandedSection, setExpandedSection] = useState<string>('personal');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    fullName: '',
    title: '',
    bio: '',
    email: '',
    location: '',
    website: '',
    phone: ''
  });

  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  useEffect(() => {
    loadPortfolioData();
  }, []);

  const loadPortfolioData = async () => {
    try {
      setIsLoading(true);
      const response = await ApiService.getUserProfile();
      console.log('Raw API Response:', response); // Debug log

      if (response && response.data) {
        const profileData = response.data;
        console.log('Profile Data:', profileData); // Debug log

        setPersonalInfo({
          fullName: profileData.fullName || '',
          title: profileData.title || '',
          bio: profileData.bio || '',
          email: profileData.email || '',
          location: profileData.location || '',
          website: profileData.website || '',
          phone: profileData.phone || ''
        });
      } else {
        console.error('No data in response:', response);
        toast.error('Failed to load profile data. Invalid response format.');
      }
    } catch (error) {
      console.error('Failed to load profile data:', error);
      toast.error('Failed to load profile data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePersonalInfoChange = (field: keyof PersonalInfo) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newValue = e.target.value;
    setPersonalInfo((prev) => ({
      ...prev,
      [field]: newValue
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const updateData = {
        fullName: personalInfo.fullName,
        title: personalInfo.title,
        bio: personalInfo.bio,
        location: personalInfo.location,
        website: personalInfo.website,
        phone: personalInfo.phone
      };

      console.log('Sending update data:', updateData); // Debug log
      const response = await ApiService.updateUserProfile(updateData);
      console.log('Update response:', response); // Debug log

      if (response && response.data) {
        toast.success('Profile updated successfully!');
        // Reload the data to ensure we have the latest
        await loadPortfolioData();
      } else {
        throw new Error('Invalid response from update');
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleSection = (section: string) => () => {
    setExpandedSection(expandedSection === section ? '' : section);
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto pb-20">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-gray-900">Edit Portfolio</h1>
          <p className="mt-1 text-sm text-gray-600">
            Update your portfolio information
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Personal Info Section */}
            <Section 
              id="personal" 
              title="Personal Information"
              isExpanded={expandedSection === 'personal'}
              onToggle={toggleSection('personal')}
            >
              <div className="space-y-4">
                <Input
                  name="fullName"
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={personalInfo.fullName}
                  onChange={handlePersonalInfoChange('fullName')}
                />
                <Input
                  name="title"
                  label="Title"
                  placeholder="e.g., Full Stack Developer"
                  value={personalInfo.title}
                  onChange={handlePersonalInfoChange('title')}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    rows={4}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Write a short bio about yourself"
                    value={personalInfo.bio}
                    onChange={handlePersonalInfoChange('bio')}
                  />
                </div>
                <Input
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="your@email.com"
                  value={personalInfo.email}
                  onChange={handlePersonalInfoChange('email')}
                  disabled
                />
                <Input
                  name="phone"
                  label="Phone"
                  type="tel"
                  placeholder="+1 (234) 567-8900"
                  value={personalInfo.phone}
                  onChange={handlePersonalInfoChange('phone')}
                />
                <Input
                  name="location"
                  label="Location"
                  placeholder="City, Country"
                  value={personalInfo.location}
                  onChange={handlePersonalInfoChange('location')}
                />
                <Input
                  name="website"
                  label="Website"
                  placeholder="https://yourwebsite.com"
                  type="url"
                  value={personalInfo.website}
                  onChange={handlePersonalInfoChange('website')}
                />
              </div>
            </Section>

            {/* Other sections will be static */}
            <Section id="social" title="Social Links" isExpanded={expandedSection === 'social'} onToggle={toggleSection('social')}>
              <p className="text-gray-600">Please contact admin to update social links.</p>
            </Section>

            <Section id="skills" title="Skills" isExpanded={expandedSection === 'skills'} onToggle={toggleSection('skills')}>
              <p className="text-gray-600">Please contact admin to update skills.</p>
            </Section>

            <Section id="projects" title="Projects" isExpanded={expandedSection === 'projects'} onToggle={toggleSection('projects')}>
              <p className="text-gray-600">Please contact admin to update projects.</p>
            </Section>

            <Section id="education" title="Education" isExpanded={expandedSection === 'education'} onToggle={toggleSection('education')}>
              <p className="text-gray-600">Please contact admin to update education details.</p>
            </Section>

            <Section id="experience" title="Experience" isExpanded={expandedSection === 'experience'} onToggle={toggleSection('experience')}>
              <p className="text-gray-600">Please contact admin to update experience details.</p>
            </Section>

            {/* Save Button */}
            <div className="fixed bottom-8 right-8">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="shadow-lg"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <RiSaveLine className="w-5 h-5 mr-2" />
                    Save Changes
                  </div>
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </DashboardLayout>
  );
}
