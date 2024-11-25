'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import Image from 'next/image';
import { RiGithubFill, RiLinkedinBoxFill, RiTwitterFill, RiGlobalLine, RiMailLine, RiPhoneLine, RiMapPin2Line, RiArrowRightLine, RiQrCodeLine, RiShareLine } from 'react-icons/ri';
import { toast } from 'react-hot-toast';
import QRCodeModal from '@/components/profile/QRCodeModal';

interface Project {
  title: string;
  description: string;
  image?: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
}

interface Experience {
  company: string;
  position: string;
  duration: string;
  description: string;
}

interface Education {
  institution: string;
  degree: string;
  duration: string;
  description?: string;
}

interface ProfilePageProps {
  params: Promise<{ username: string }>;
}

export default function PublicProfilePage({ params }: ProfilePageProps) {
  const { username } = use(params);
  const [activeSection, setActiveSection] = useState('about');
  const [mounted, setMounted] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // This would come from API based on username
  const profile = {
    name: "John Doe",
    title: "Full Stack Developer",
    avatar: "/avatar-placeholder.jpg",
    bio: "Passionate developer with 5+ years of experience in building web applications. Focused on creating user-friendly and scalable solutions.",
    location: "New York, USA",
    email: "john@example.com",
    phone: "+1 234 567 8900",
    skills: ["React", "TypeScript", "Node.js", "Python", "AWS", "Docker"],
    socialLinks: [
      { platform: 'github', url: 'https://github.com/johndoe' },
      { platform: 'linkedin', url: 'https://linkedin.com/in/johndoe' },
      { platform: 'twitter', url: 'https://twitter.com/johndoe' },
      { platform: 'website', url: 'https://johndoe.com' }
    ],
    projects: [
      {
        title: "E-commerce Platform",
        description: "A full-stack e-commerce solution with real-time inventory management",
        image: "/project1.jpg",
        technologies: ["React", "Node.js", "MongoDB", "Socket.io"],
        liveUrl: "https://project.com",
        githubUrl: "https://github.com/project"
      },
      // Add more projects as needed
    ],
    experience: [
      {
        company: "Tech Corp",
        position: "Senior Developer",
        duration: "2020 - Present",
        description: "Led a team of 5 developers in building enterprise applications"
      },
      // Add more experience as needed
    ],
    education: [
      {
        institution: "Tech University",
        degree: "BS in Computer Science",
        duration: "2015 - 2019",
        description: "Focus on Software Engineering and AI"
      },
      // Add more education as needed
    ]
  };

  const profileUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/${username}`
    : '';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      toast.success('Profile link copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  const renderSocialLinks = () => (
    <div className="flex space-x-4">
      {profile.socialLinks.map((link) => {
        const Icon = {
          github: RiGithubFill,
          linkedin: RiLinkedinBoxFill,
          twitter: RiTwitterFill,
          website: RiGlobalLine
        }[link.platform];

        return Icon ? (
          <a
            key={link.platform}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/80 hover:text-white transition-colors hover:scale-110 transform duration-200"
          >
            <Icon className="w-6 h-6" />
          </a>
        ) : null;
      })}
    </div>
  );

  const renderProjects = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {profile.projects.map((project, index) => (
        <div 
          key={index} 
          className="group bg-white rounded-xl shadow-lg overflow-hidden hover-lift"
        >
          {project.image && (
            <div className="relative h-48 overflow-hidden">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover transform group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}
          <div className="p-6">
            <h3 className="text-xl font-semibold gradient-text">{project.title}</h3>
            <p className="text-gray-600 mt-2">{project.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.technologies.map((tech, i) => (
                <span 
                  key={i} 
                  className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
            <div className="mt-6 flex space-x-4">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                >
                  Live Demo
                  <RiArrowRightLine className="ml-1 w-4 h-4" />
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-gray-600 hover:text-gray-800 font-medium"
                >
                  GitHub
                  <RiArrowRightLine className="ml-1 w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderExperience = () => (
    <div className="space-y-8">
      {profile.experience.map((exp, index) => (
        <div 
          key={index} 
          className="relative pl-8 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-gradient-to-b before:from-blue-600 before:to-purple-600"
        >
          <div className="absolute left-0 top-0 w-2 h-2 rounded-full bg-blue-600 -translate-x-[5px]" />
          <h3 className="text-xl font-semibold gradient-text">{exp.position}</h3>
          <p className="text-gray-700 font-medium mt-1">{exp.company}</p>
          <p className="text-sm text-gray-500 mt-1">{exp.duration}</p>
          <p className="mt-3 text-gray-600">{exp.description}</p>
        </div>
      ))}
    </div>
  );

  const renderEducation = () => (
    <div className="space-y-8">
      {profile.education.map((edu, index) => (
        <div 
          key={index} 
          className="relative pl-8 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-gradient-to-b before:from-blue-600 before:to-purple-600"
        >
          <div className="absolute left-0 top-0 w-2 h-2 rounded-full bg-blue-600 -translate-x-[5px]" />
          <h3 className="text-xl font-semibold gradient-text">{edu.degree}</h3>
          <p className="text-gray-700 font-medium mt-1">{edu.institution}</p>
          <p className="text-sm text-gray-500 mt-1">{edu.duration}</p>
          {edu.description && <p className="mt-3 text-gray-600">{edu.description}</p>}
        </div>
      ))}
    </div>
  );

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="relative max-w-5xl mx-auto px-4 py-24">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="relative w-40 h-40 rounded-2xl overflow-hidden border-4 border-white/20 shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <Image
                src={profile.avatar}
                alt={profile.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="text-center md:text-left flex-grow">
              <h1 className="text-5xl font-bold">{profile.name}</h1>
              <p className="text-2xl text-blue-100 mt-4 font-light">{profile.title}</p>
              <div className="mt-6 flex items-center justify-center md:justify-start space-x-4">
                {renderSocialLinks()}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowQRModal(true)}
                className="p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-200 group relative"
                title="Show QR Code"
              >
                <RiQrCodeLine className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
              </button>
              <button
                onClick={handleCopyLink}
                className="p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-200 group"
                title="Copy Profile Link"
              >
                <RiShareLine className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      <QRCodeModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        profileUrl={profileUrl}
        username={username}
      />

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 -mt-8">
        {/* Contact Info */}
        <div className="glass-effect rounded-2xl p-6 mb-12 shadow-lg animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a href={`mailto:${profile.email}`} className="flex items-center space-x-3 text-gray-600 hover:text-blue-600 transition-colors group">
              <div className="p-3 rounded-lg bg-blue-50 group-hover:bg-blue-100 transition-colors">
                <RiMailLine className="w-6 h-6" />
              </div>
              <span className="font-medium">{profile.email}</span>
            </a>
            <a href={`tel:${profile.phone}`} className="flex items-center space-x-3 text-gray-600 hover:text-blue-600 transition-colors group">
              <div className="p-3 rounded-lg bg-blue-50 group-hover:bg-blue-100 transition-colors">
                <RiPhoneLine className="w-6 h-6" />
              </div>
              <span className="font-medium">{profile.phone}</span>
            </a>
            <div className="flex items-center space-x-3 text-gray-600">
              <div className="p-3 rounded-lg bg-blue-50">
                <RiMapPin2Line className="w-6 h-6" />
              </div>
              <span className="font-medium">{profile.location}</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mb-12">
          <nav className="flex space-x-1 bg-white p-1 rounded-xl shadow-md">
            {['about', 'projects', 'experience', 'education'].map((section) => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                  activeSection === section
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Section Content */}
        <div className="py-8 section-fade-in">
          {activeSection === 'about' && (
            <div>
              <p className="text-xl text-gray-600 leading-relaxed mb-12">{profile.bio}</p>
              <h2 className="text-2xl font-semibold mb-6 gradient-text">Skills & Expertise</h2>
              <div className="flex flex-wrap gap-3">
                {profile.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-white text-gray-700 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
          {activeSection === 'projects' && renderProjects()}
          {activeSection === 'experience' && renderExperience()}
          {activeSection === 'education' && renderEducation()}
        </div>
      </div>
    </div>
  );
}
