import React from 'react';
import { Award, Calendar, ExternalLink, Edit, Plus, Trash2, Save, X, Eye } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

export default function Certificates() {
  const { t } = useLanguage();
  const { user, addActivity } = useAuth();
  const [certificates, setCertificates] = React.useState([]);
  const [selectedCert, setSelectedCert] = React.useState(null);
  const [showEditor, setShowEditor] = React.useState(false);
  const [editingCert, setEditingCert] = React.useState(null);

  const defaultCertificates = [
    {
      id: '1',
      title: 'HTML & CSS Fundamentals',
      issuer: 'FreeCodeCamp',
      date: '2024',
      description: 'Comprehensive course covering HTML5 and CSS3 fundamentals',
      fullDescription: 'This comprehensive certification covers advanced HTML5 semantic elements, CSS3 animations, flexbox, grid layouts, and responsive design principles. The course included hands-on projects building modern websites from scratch.',
      color: 'from-orange-500 to-red-500',
      icon: '🏆',
      verified: true,
      certificateUrl: '#',
      skills: ['HTML5', 'CSS3', 'Responsive Design']
    },
    {
      id: '2',
      title: 'JavaScript Algorithms',
      issuer: 'Coursera',
      date: '2024',
      description: 'Advanced JavaScript programming and algorithm design',
      fullDescription: 'Advanced certification focusing on JavaScript ES6+ features, data structures, algorithms, and problem-solving techniques. Covered topics include closures, promises, async/await, and functional programming concepts.',
      color: 'from-yellow-500 to-orange-500',
      icon: '⭐',
      verified: true,
      certificateUrl: '#',
      skills: ['JavaScript', 'Algorithms', 'Data Structures']
    },
    {
      id: '3',
      title: 'React Development',
      issuer: 'Udemy',
      date: '2024',
      description: 'Modern React development with hooks and context',
      fullDescription: 'Comprehensive React.js certification covering functional components, hooks, context API, state management, and modern React patterns. Built multiple projects including a full-stack application.',
      color: 'from-blue-500 to-cyan-500',
      icon: '🎯',
      verified: true,
      certificateUrl: '#',
      skills: ['React.js', 'Hooks', 'Context API']
    },
    {
      id: '4',
      title: 'Frontend Web Development',
      issuer: 'edX',
      date: '2024',
      description: 'Complete frontend development specialization',
      fullDescription: 'Complete frontend development specialization covering HTML, CSS, JavaScript, React, and modern development tools. Includes projects in responsive design, API integration, and deployment strategies.',
      color: 'from-purple-500 to-pink-500',
      icon: '🚀',
      verified: true,
      certificateUrl: '#',
      skills: ['Frontend Development', 'Web APIs', 'Deployment']
    }
  ];

  React.useEffect(() => {
    const storedCerts = localStorage.getItem('certificates');
    if (storedCerts) {
      setCertificates(JSON.parse(storedCerts));
    } else {
      setCertificates(defaultCertificates);
      localStorage.setItem('certificates', JSON.stringify(defaultCertificates));
    }
  }, []);

  const saveCertificates = (updatedCerts) => {
    setCertificates(updatedCerts);
    localStorage.setItem('certificates', JSON.stringify(updatedCerts));
  };

  const handleDeleteCert = (certId) => {
    if (!user?.isOwner) return;
    const updatedCerts = certificates.filter(cert => cert.id !== certId);
    saveCertificates(updatedCerts);
    addActivity('Deleted a certificate');
    setSelectedCert(null);
  };

  const handleSaveCert = (certData) => {
    if (!user?.isOwner) return;
    
    if (editingCert) {
      const updatedCerts = certificates.map(cert => 
        cert.id === editingCert.id ? { ...cert, ...certData } : cert
      );
      saveCertificates(updatedCerts);
      addActivity(`Updated certificate: ${certData.title}`);
    } else {
      const newCert = {
        ...certData,
        id: Date.now().toString()
      };
      saveCertificates([...certificates, newCert]);
      addActivity(`Added new certificate: ${certData.title}`);
    }
    
    setShowEditor(false);
    setEditingCert(null);
  };

  if (showEditor) {
    return (
      <CertificateEditor
        certificate={editingCert}
        onSave={handleSaveCert}
        onCancel={() => {
          setShowEditor(false);
          setEditingCert(null);
        }}
      />
    );
  }

  if (selectedCert) {
    return (
      <CertificateDetail
        certificate={selectedCert}
        onClose={() => setSelectedCert(null)}
        onEdit={() => {
          setEditingCert(selectedCert);
          setShowEditor(true);
          setSelectedCert(null);
        }}
        onDelete={() => handleDeleteCert(selectedCert.id)}
        isOwner={user?.isOwner}
      />
    );
  }

  return (
    <section id="certificates" className="py-20 px-4 bg-white dark:bg-gray-900">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-16">
          <div className="text-center flex-1">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">
              {t('certificatesTitle')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {t('certificatesDescription')}
            </p>
          </div>
          
          {user?.isOwner && (
            <button
              onClick={() => setShowEditor(true)}
              className="bg-gradient-to-r from-blue-600 to-red-600 text-white px-6 py-3 rounded-full hover:from-blue-700 hover:to-red-700 transition-all transform hover:scale-105 flex items-center space-x-2 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span>Add Certificate</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden cursor-pointer group relative"
              onClick={() => setSelectedCert(cert)}
            >
              {user?.isOwner && (
                <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingCert(cert);
                      setShowEditor(true);
                    }}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCert(cert.id);
                    }}
                    className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div className={`bg-gradient-to-r ${cert.color} p-6 text-white`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl">{cert.icon}</div>
                  {cert.verified && (
                    <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold">
                      ✓ Verified
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold mb-2">{cert.title}</h3>
                <div className="flex items-center text-white/80">
                  <Award className="w-4 h-4 mr-2" />
                  <span>{cert.issuer}</span>
                </div>
              </div>

              <div className="p-6">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {cert.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{cert.date}</span>
                  </div>
                  
                  <button className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
                    <span className="mr-2">View Details</span>
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Learning Progress */}
        <div className="bg-gradient-to-r from-blue-600 to-red-600 p-8 rounded-2xl text-white">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-4">Learning Progress</h3>
            <p className="text-blue-100">Tracking my continuous learning journey in web development</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white/20 p-6 rounded-lg backdrop-blur-sm text-center">
              <div className="text-3xl font-bold mb-2">HTML5</div>
              <div className="w-full bg-white/30 rounded-full h-3 mb-2">
                <div className="bg-white h-3 rounded-full" style={{ width: '95%' }}></div>
              </div>
              <div className="text-sm text-blue-100">Advanced</div>
            </div>
            
            <div className="bg-white/20 p-6 rounded-lg backdrop-blur-sm text-center">
              <div className="text-3xl font-bold mb-2">CSS3</div>
              <div className="w-full bg-white/30 rounded-full h-3 mb-2">
                <div className="bg-white h-3 rounded-full" style={{ width: '90%' }}></div>
              </div>
              <div className="text-sm text-blue-100">Advanced</div>
            </div>
            
            <div className="bg-white/20 p-6 rounded-lg backdrop-blur-sm text-center">
              <div className="text-3xl font-bold mb-2">JavaScript</div>
              <div className="w-full bg-white/30 rounded-full h-3 mb-2">
                <div className="bg-white h-3 rounded-full" style={{ width: '85%' }}></div>
              </div>
              <div className="text-sm text-blue-100">Intermediate+</div>
            </div>
            
            <div className="bg-white/20 p-6 rounded-lg backdrop-blur-sm text-center">
              <div className="text-3xl font-bold mb-2">React</div>
              <div className="w-full bg-white/30 rounded-full h-3 mb-2">
                <div className="bg-white h-3 rounded-full" style={{ width: '80%' }}></div>
              </div>
              <div className="text-sm text-blue-100">Intermediate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CertificateDetail({ certificate, onClose, onEdit, onDelete, isOwner }) {
  return (
    <div className="py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <button
          onClick={onClose}
          className="mb-8 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
        >
          ← Back to Certificates
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className={`bg-gradient-to-r ${certificate.color} p-8 text-white`}>
            <div className="flex justify-between items-start">
              <div>
                <div className="text-6xl mb-4">{certificate.icon}</div>
                <h1 className="text-3xl font-bold mb-2">{certificate.title}</h1>
                <div className="flex items-center space-x-4 text-white/80">
                  <span className="flex items-center">
                    <Award className="w-5 h-5 mr-2" />
                    {certificate.issuer}
                  </span>
                  <span className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    {certificate.date}
                  </span>
                </div>
              </div>

              {isOwner && (
                <div className="flex space-x-2">
                  <button
                    onClick={onEdit}
                    className="p-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-lg transition-colors"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={onDelete}
                    className="p-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="p-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                  About This Certificate
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                  {certificate.fullDescription || certificate.description}
                </p>

                {certificate.skills && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                      Skills Covered
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {certificate.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                    Certificate Details
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Issuer</span>
                      <div className="font-semibold text-gray-800 dark:text-white">
                        {certificate.issuer}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Date</span>
                      <div className="font-semibold text-gray-800 dark:text-white">
                        {certificate.date}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Status</span>
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span className="text-green-600 dark:text-green-400 font-semibold">
                          {certificate.verified ? 'Verified' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {certificate.certificateUrl && (
                  <a
                    href={certificate.certificateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-gradient-to-r from-blue-600 to-red-600 text-white text-center py-3 rounded-lg hover:from-blue-700 hover:to-red-700 transition-all transform hover:scale-105 font-semibold"
                  >
                    <ExternalLink className="w-5 h-5 inline mr-2" />
                    View Certificate
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CertificateEditor({ certificate, onSave, onCancel }) {
  const [formData, setFormData] = React.useState({
    title: certificate?.title || '',
    issuer: certificate?.issuer || '',
    date: certificate?.date || '',
    description: certificate?.description || '',
    fullDescription: certificate?.fullDescription || '',
    color: certificate?.color || 'from-blue-500 to-cyan-500',
    icon: certificate?.icon || '🏆',
    verified: certificate?.verified || true,
    certificateUrl: certificate?.certificateUrl || '',
    skills: certificate?.skills || []
  });

  const [newSkill, setNewSkill] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.issuer.trim()) return;
    onSave(formData);
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(skill => skill !== skillToRemove)
    });
  };

  const colorOptions = [
    'from-orange-500 to-red-500',
    'from-yellow-500 to-orange-500',
    'from-blue-500 to-cyan-500',
    'from-purple-500 to-pink-500',
    'from-green-500 to-teal-500',
    'from-indigo-500 to-purple-500'
  ];

  const iconOptions = ['🏆', '⭐', '🎯', '🚀', '💎', '🔥', '⚡', '🌟'];

  return (
    <div className="min-h-screen py-20 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-red-600 p-6 text-white">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">
                {certificate ? 'Edit Certificate' : 'Add New Certificate'}
              </h1>
              <button
                onClick={onCancel}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Certificate Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Issuer *
                </label>
                <input
                  type="text"
                  value={formData.issuer}
                  onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date
                </label>
                <input
                  type="text"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  placeholder="2024"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Color Theme
                </label>
                <select
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                >
                  {colorOptions.map(color => (
                    <option key={color} value={color}>
                      {color.replace('from-', '').replace(' to-', ' → ').replace('-500', '')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Icon
                </label>
                <select
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                >
                  {iconOptions.map(icon => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Short Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Description
              </label>
              <textarea
                value={formData.fullDescription}
                onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                rows={4}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Certificate URL
              </label>
              <input
                type="url"
                value={formData.certificateUrl}
                onChange={(e) => setFormData({ ...formData, certificateUrl: e.target.value })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Skills Covered
              </label>
              <div className="flex space-x-2 mb-3">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  placeholder="Add a skill..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm flex items-center space-x-2"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="verified"
                checked={formData.verified}
                onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="verified" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Verified Certificate
              </label>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t dark:border-gray-700">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-lg hover:from-blue-700 hover:to-red-700 transition-all flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{certificate ? 'Update' : 'Create'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}