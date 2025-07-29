import React from 'react';
import { Code, Palette, Smartphone, Globe, Edit, Plus, Trash2, Save, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

export default function Skills() {
  const { t } = useLanguage();
  const { user, addActivity } = useAuth();
  const [skills, setSkills] = React.useState([]);
  const [isEditing, setIsEditing] = React.useState(false);
  const [editingSkill, setEditingSkill] = React.useState(null);
  const [showAddForm, setShowAddForm] = React.useState(false);

  const defaultSkills = [
    {
      id: '1',
      category: 'Languages',
      icon: <Code className="w-8 h-8" />,
      items: [
        { name: 'HTML5', level: 95, color: 'bg-orange-500' },
        { name: 'CSS3', level: 90, color: 'bg-blue-500' },
        { name: 'JavaScript', level: 85, color: 'bg-yellow-500' },
        { name: 'ECMAScript', level: 80, color: 'bg-green-500' }
      ]
    },
    {
      id: '2',
      category: 'Frameworks',
      icon: <Globe className="w-8 h-8" />,
      items: [
        { name: 'React.js', level: 80, color: 'bg-cyan-500' },
        { name: 'Bootstrap', level: 90, color: 'bg-purple-500' },
        { name: 'Tailwind CSS', level: 95, color: 'bg-teal-500' }
      ]
    },
    {
      id: '3',
      category: 'Design',
      icon: <Palette className="w-8 h-8" />,
      items: [
        { name: 'Responsive Design', level: 90, color: 'bg-indigo-500' },
        { name: 'Color Theory', level: 80, color: 'bg-red-500' }
      ]
    },
    {
      id: '4',
      category: 'Development',
      icon: <Smartphone className="w-8 h-8" />,
      items: [
        { name: 'Mobile First', level: 85, color: 'bg-emerald-500' },
        { name: 'Cross-browser', level: 80, color: 'bg-amber-500' },
        { name: 'Performance', level: 75, color: 'bg-violet-500' }
      ]
    }
  ];

  React.useEffect(() => {
    const storedSkills = localStorage.getItem('skills');
    if (storedSkills) {
      setSkills(JSON.parse(storedSkills));
    } else {
      setSkills(defaultSkills);
      localStorage.setItem('skills', JSON.stringify(defaultSkills));
    }
  }, []);

  const saveSkills = (updatedSkills) => {
    setSkills(updatedSkills);
    localStorage.setItem('skills', JSON.stringify(updatedSkills));
  };

  const handleDeleteSkill = (skillId) => {
    if (!user?.isOwner) return;
    const updatedSkills = skills.filter(skill => skill.id !== skillId);
    saveSkills(updatedSkills);
    addActivity('Deleted a skill category');
  };

  const handleSaveSkill = (skillData) => {
    if (!user?.isOwner) return;
    
    if (editingSkill) {
      const updatedSkills = skills.map(skill => 
        skill.id === editingSkill.id ? { ...skill, ...skillData } : skill
      );
      saveSkills(updatedSkills);
      addActivity(`Updated skill category: ${skillData.category}`);
    } else {
      const newSkill = {
        ...skillData,
        id: Date.now().toString()
      };
      saveSkills([...skills, newSkill]);
      addActivity(`Added new skill category: ${skillData.category}`);
    }
    
    setIsEditing(false);
    setEditingSkill(null);
    setShowAddForm(false);
  };

  return (
    <section id="skills" className="py-20 px-4 bg-white dark:bg-gray-900">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-16">
          <div className="text-center flex-1">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">
              {t('skillsTitle')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {t('skillsDescription')}
            </p>
          </div>
          
          {user?.isOwner && (
            <div className="flex space-x-2">
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-gradient-to-r from-blue-600 to-red-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-red-700 transition-all flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Skill</span>
              </button>
            </div>
          )}
        </div>

        {(showAddForm || editingSkill) && user?.isOwner && (
          <SkillEditor
            skill={editingSkill}
            onSave={handleSaveSkill}
            onCancel={() => {
              setShowAddForm(false);
              setEditingSkill(null);
              setIsEditing(false);
            }}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {skills.map((skillGroup, index) => (
            <div
              key={skillGroup.id}
              className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 relative group"
            >
              {user?.isOwner && (
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                  <button
                    onClick={() => {
                      setEditingSkill(skillGroup);
                      setIsEditing(true);
                    }}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteSkill(skillGroup.id)}
                    className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-red-500 rounded-lg flex items-center justify-center text-white mr-4">
                  {skillGroup.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                  {skillGroup.category}
                </h3>
              </div>

              <div className="space-y-4">
                {skillGroup.items.map((skill, skillIndex) => (
                  <div key={skillIndex} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {skill.name}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {skill.level}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`${skill.color} h-2 rounded-full transition-all duration-1000 ease-out`}
                        style={{ 
                          width: skill.level + '%',
                          animation: `fillBar 2s ease-out ${skillIndex * 0.2}s forwards`
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Learning Progress */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-red-600 p-8 rounded-2xl text-white">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-4">Learning Progress</h3>
            <p className="text-blue-100">My continuous journey in mastering frontend technologies</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Current Focus</h4>
              <div className="space-y-3">
                <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span>React Advanced Patterns</span>
                    <span>75%</span>
                  </div>
                  <div className="w-full bg-white/30 rounded-full h-2">
                    <div className="bg-white h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                <div className="bg-white/20 p-4 rounded-lg backdrop-blur-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span>Backend Integration</span>
                    <span>45%</span>
                  </div>
                  <div className="w-full bg-white/30 rounded-full h-2">
                    <div className="bg-white h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Next Goals</h4>
              <div className="space-y-2">
                <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                  <span>TypeScript Mastery</span>
                </div>
                <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                  <span>Node.js & Express</span>
                </div>
                <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                  <span>MongoDB & Database Design</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SkillEditor({ skill, onSave, onCancel }) {
  const [formData, setFormData] = React.useState({
    category: skill?.category || '',
    items: skill?.items || [{ name: '', level: 50, color: 'bg-blue-500' }]
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.category.trim()) return;
    
    onSave({
      category: formData.category,
      icon: <Code className="w-8 h-8" />,
      items: formData.items.filter(item => item.name.trim())
    });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { name: '', level: 50, color: 'bg-blue-500' }]
    });
  };

  const removeItem = (index) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index)
    });
  };

  const updateItem = (index, field, value) => {
    const updatedItems = formData.items.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    );
    setFormData({ ...formData, items: updatedItems });
  };

  const colorOptions = [
    'bg-blue-500', 'bg-red-500', 'bg-green-500', 'bg-yellow-500',
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-blue-600 to-red-600 p-6 text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">
              {skill ? 'Edit Skill Category' : 'Add New Skill Category'}
            </h2>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category Name
            </label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              placeholder="e.g., Languages, Frameworks"
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Skills
              </label>
              <button
                type="button"
                onClick={addItem}
                className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add Skill</span>
              </button>
            </div>

            <div className="space-y-4">
              {formData.items.map((item, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => updateItem(index, 'name', e.target.value)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                        placeholder="Skill name"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={item.level}
                        onChange={(e) => updateItem(index, 'level', parseInt(e.target.value))}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                        placeholder="Level %"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <select
                        value={item.color}
                        onChange={(e) => updateItem(index, 'color', e.target.value)}
                        className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                      >
                        {colorOptions.map(color => (
                          <option key={color} value={color}>
                            {color.replace('bg-', '').replace('-500', '')}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="p-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
              <span>{skill ? 'Update' : 'Create'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}