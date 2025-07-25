import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X, Plus, ArrowRight } from 'lucide-react';

interface ClientBrief {
  projectName: string;
  clientName: string;
  description: string;
  goals: string[];
  targetAudience: string;
  features: string[];
  brandColors: string[];
  notes: string;
}

interface ClientBriefFormProps {
  clientBrief: ClientBrief;
  setClientBrief: (brief: ClientBrief) => void;
  onComplete: () => void;
}

export default function ClientBriefForm({ clientBrief, setClientBrief, onComplete }: ClientBriefFormProps) {
  const [newGoal, setNewGoal] = useState('');
  const [newFeature, setNewFeature] = useState('');
  const [newColor, setNewColor] = useState('');

  const updateBrief = (field: keyof ClientBrief, value: string | string[]) => {
    setClientBrief({
      ...clientBrief,
      [field]: value
    });
  };

  const addGoal = () => {
    if (newGoal.trim()) {
      updateBrief('goals', [...clientBrief.goals, newGoal.trim()]);
      setNewGoal('');
    }
  };

  const removeGoal = (index: number) => {
    const updatedGoals = clientBrief.goals.filter((_, i) => i !== index);
    updateBrief('goals', updatedGoals);
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      updateBrief('features', [...clientBrief.features, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    const updatedFeatures = clientBrief.features.filter((_, i) => i !== index);
    updateBrief('features', updatedFeatures);
  };

  const addColor = () => {
    if (newColor.trim()) {
      updateBrief('brandColors', [...clientBrief.brandColors, newColor.trim()]);
      setNewColor('');
    }
  };

  const removeColor = (index: number) => {
    const updatedColors = clientBrief.brandColors.filter((_, i) => i !== index);
    updateBrief('brandColors', updatedColors);
  };

  const isComplete = clientBrief.projectName && clientBrief.description;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-[rgb(2,3,129)]">Client Brief</h2>
        <p className="text-gray-600">Gather project requirements to inform your sitemap and wireframe design</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[rgb(2,3,129)]">Project Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="projectName">Project Name *</Label>
              <Input
                id="projectName"
                value={clientBrief.projectName}
                onChange={(e) => updateBrief('projectName', e.target.value)}
                placeholder="e.g., Acme Corp Website Redesign"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="clientName">Client Name</Label>
              <Input
                id="clientName"
                value={clientBrief.clientName}
                onChange={(e) => updateBrief('clientName', e.target.value)}
                placeholder="e.g., Acme Corporation"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Project Description *</Label>
              <Textarea
                id="description"
                value={clientBrief.description}
                onChange={(e) => updateBrief('description', e.target.value)}
                placeholder="Describe the project, its purpose, and key requirements..."
                rows={4}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="targetAudience">Target Audience</Label>
              <Textarea
                id="targetAudience"
                value={clientBrief.targetAudience}
                onChange={(e) => updateBrief('targetAudience', e.target.value)}
                placeholder="Who is the primary audience for this website/app?"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Goals & Features */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[rgb(2,3,129)]">Goals & Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Goals */}
            <div className="space-y-3">
              <Label>Project Goals</Label>
              <div className="flex space-x-2">
                <Input
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  placeholder="Add a project goal"
                  onKeyPress={(e) => e.key === 'Enter' && addGoal()}
                />
                <Button onClick={addGoal} size="sm" variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {clientBrief.goals.map((goal, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                    <span>{goal}</span>
                    <button onClick={() => removeGoal(index)}>
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="space-y-3">
              <Label>Required Features</Label>
              <div className="flex space-x-2">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Add a required feature"
                  onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                />
                <Button onClick={addFeature} size="sm" variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {clientBrief.features.map((feature, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                    <span>{feature}</span>
                    <button onClick={() => removeFeature(index)}>
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Brand Colors */}
            <div className="space-y-3">
              <Label>Brand Colors</Label>
              <div className="flex space-x-2">
                <Input
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  placeholder="e.g., #FF5733 or Blue"
                  onKeyPress={(e) => e.key === 'Enter' && addColor()}
                />
                <Button onClick={addColor} size="sm" variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {clientBrief.brandColors.map((color, index) => (
                  <Badge key={index} variant="outline" className="flex items-center space-x-1">
                    <div 
                      className="w-3 h-3 rounded-full border"
                      style={{ backgroundColor: color.startsWith('#') ? color : 'transparent' }}
                    />
                    <span>{color}</span>
                    <button onClick={() => removeColor(index)}>
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[rgb(2,3,129)]">Additional Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={clientBrief.notes}
            onChange={(e) => updateBrief('notes', e.target.value)}
            placeholder="Any additional requirements, constraints, or notes about the project..."
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Action Button */}
      <div className="flex justify-center">
        <Button 
          onClick={onComplete}
          disabled={!isComplete}
          className="bg-[rgb(2,3,129)] hover:bg-[rgb(2,3,129)]/90 text-white px-8 py-3"
        >
          Continue to Sitemap Design
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}