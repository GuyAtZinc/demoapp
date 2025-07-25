import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Layout, 
  Type, 
  Image, 
  Square, 
  Navigation,
  Menu,
  Download,
  Smartphone,
  Monitor,
  Tablet,
  Plus,
  Trash2,
  Move
} from 'lucide-react';

interface WireframeElement {
  id: string;
  type: 'header' | 'navigation' | 'content' | 'sidebar' | 'footer' | 'image' | 'text' | 'button' | 'form';
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  properties: Record<string, string | number | boolean>;
}

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

interface WireframeDesignerProps {
  clientBrief: ClientBrief;
}

export default function WireframeDesigner({ clientBrief }: WireframeDesignerProps) {
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [elements, setElements] = useState<WireframeElement[]>([
    {
      id: 'header-1',
      type: 'header',
      x: 0,
      y: 0,
      width: 100,
      height: 80,
      label: 'Header',
      properties: { backgroundColor: '#f8f9fa' }
    },
    {
      id: 'nav-1',
      type: 'navigation',
      x: 0,
      y: 80,
      width: 100,
      height: 50,
      label: 'Navigation',
      properties: { backgroundColor: '#ffffff' }
    },
    {
      id: 'content-1',
      type: 'content',
      x: 0,
      y: 130,
      width: 70,
      height: 400,
      label: 'Main Content',
      properties: { backgroundColor: '#ffffff' }
    },
    {
      id: 'sidebar-1',
      type: 'sidebar',
      x: 70,
      y: 130,
      width: 30,
      height: 400,
      label: 'Sidebar',
      properties: { backgroundColor: '#f8f9fa' }
    },
    {
      id: 'footer-1',
      type: 'footer',
      x: 0,
      y: 530,
      width: 100,
      height: 80,
      label: 'Footer',
      properties: { backgroundColor: '#e9ecef' }
    }
  ]);
  
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [draggedElement, setDraggedElement] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const getViewportDimensions = () => {
    switch (viewport) {
      case 'desktop': return { width: 1200, height: 800 };
      case 'tablet': return { width: 768, height: 1024 };
      case 'mobile': return { width: 375, height: 667 };
      default: return { width: 1200, height: 800 };
    }
  };

  const getElementIcon = (type: string) => {
    switch (type) {
      case 'header': return <Layout className="w-4 h-4" />;
      case 'navigation': return <Navigation className="w-4 h-4" />;
      case 'content': return <Type className="w-4 h-4" />;
      case 'sidebar': return <Menu className="w-4 h-4" />;
      case 'footer': return <Layout className="w-4 h-4" />;
      case 'image': return <Image className="w-4 h-4" />;
      case 'text': return <Type className="w-4 h-4" />;
      case 'button': return <Square className="w-4 h-4" />;
      case 'form': return <Square className="w-4 h-4" />;
      default: return <Square className="w-4 h-4" />;
    }
  };

  const getElementColor = (type: string) => {
    const colorMap = {
      'header': 'bg-[rgb(171,184,195)]',
      'navigation': 'bg-[rgb(2,3,129)]',
      'content': 'bg-[rgb(182,227,212)]',
      'sidebar': 'bg-[rgb(151,120,209)]',
      'footer': 'bg-[rgb(171,184,195)]',
      'image': 'bg-[rgb(182,227,212)]',
      'text': 'bg-[rgb(2,3,129)]',
      'button': 'bg-[rgb(254,248,76)]',
      'form': 'bg-white border-2 border-[rgb(2,3,129)]'
    };
    return colorMap[type as keyof typeof colorMap] || 'bg-gray-300';
  };

  const addElement = (type: WireframeElement['type']) => {
    const { width: viewportWidth, height: viewportHeight } = getViewportDimensions();
    const newElement: WireframeElement = {
      id: `${type}-${Date.now()}`,
      type,
      x: 10,
      y: 10,
      width: type === 'button' ? 15 : type === 'text' ? 40 : 50,
      height: type === 'button' ? 8 : type === 'text' ? 6 : 20,
      label: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      properties: {}
    };
    
    setElements([...elements, newElement]);
    setSelectedElement(newElement.id);
  };

  const deleteElement = (id: string) => {
    setElements(elements.filter(el => el.id !== id));
    setSelectedElement(null);
  };

  const updateElement = (id: string, updates: Partial<WireframeElement>) => {
    setElements(elements.map(el => 
      el.id === id ? { ...el, ...updates } : el
    ));
  };

  const exportWireframe = () => {
    const wireframeData = {
      project: clientBrief.projectName,
      viewport,
      elements,
      exported: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(wireframeData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${clientBrief.projectName || 'wireframe'}-${viewport}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const { width: viewportWidth, height: viewportHeight } = getViewportDimensions();
  const selectedEl = elements.find(el => el.id === selectedElement);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-[rgb(2,3,129)]">Wireframe Designer</h2>
          <p className="text-gray-600">Create visual layouts and component arrangements</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
            <Button
              size="sm"
              variant={viewport === 'desktop' ? 'default' : 'ghost'}
              onClick={() => setViewport('desktop')}
            >
              <Monitor className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant={viewport === 'tablet' ? 'default' : 'ghost'}
              onClick={() => setViewport('tablet')}
            >
              <Tablet className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant={viewport === 'mobile' ? 'default' : 'ghost'}
              onClick={() => setViewport('mobile')}
            >
              <Smartphone className="w-4 h-4" />
            </Button>
          </div>
          <Button onClick={exportWireframe} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Element Toolbar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Elements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { type: 'header', label: 'Header' },
                { type: 'navigation', label: 'Navigation' },
                { type: 'content', label: 'Content Block' },
                { type: 'sidebar', label: 'Sidebar' },
                { type: 'footer', label: 'Footer' },
                { type: 'image', label: 'Image' },
                { type: 'text', label: 'Text Block' },
                { type: 'button', label: 'Button' },
                { type: 'form', label: 'Form' }
              ].map(({ type, label }) => (
                <Button
                  key={type}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => addElement(type as WireframeElement['type'])}
                >
                  {getElementIcon(type)}
                  <span className="ml-2">{label}</span>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Canvas */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="capitalize">{viewport} View</span>
                <Badge variant="outline">
                  {viewportWidth} × {viewportHeight}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                ref={canvasRef}
                className="relative border-2 border-gray-300 canvas-grid mx-auto bg-white overflow-hidden"
                style={{ 
                  width: `${Math.min(viewportWidth * 0.5, 600)}px`,
                  height: `${Math.min(viewportHeight * 0.5, 400)}px`
                }}
              >
                {elements.map((element) => (
                  <div
                    key={element.id}
                    className={`absolute cursor-pointer wireframe-element ${getElementColor(element.type)} ${
                      selectedElement === element.id ? 'ring-2 ring-[rgb(2,3,129)]' : ''
                    }`}
                    style={{
                      left: `${(element.x / 100) * 100}%`,
                      top: `${(element.y / viewportHeight) * 100}%`,
                      width: `${(element.width / 100) * 100}%`,
                      height: `${(element.height / viewportHeight) * 100}%`,
                      minHeight: '20px'
                    }}
                    onClick={() => setSelectedElement(element.id)}
                  >
                    <div className="w-full h-full flex items-center justify-center text-xs font-medium text-center p-1">
                      <div className="flex items-center space-x-1">
                        {getElementIcon(element.type)}
                        <span className="truncate">{element.label}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Properties Panel */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Properties</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedEl ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Label</Label>
                    <Input
                      value={selectedEl.label}
                      onChange={(e) => updateElement(selectedEl.id, { label: e.target.value })}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label>Width (%)</Label>
                      <Input
                        type="number"
                        value={selectedEl.width}
                        onChange={(e) => updateElement(selectedEl.id, { width: parseInt(e.target.value) || 0 })}
                        min="1"
                        max="100"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Height (px)</Label>
                      <Input
                        type="number"
                        value={selectedEl.height}
                        onChange={(e) => updateElement(selectedEl.id, { height: parseInt(e.target.value) || 0 })}
                        min="10"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label>X Position (%)</Label>
                      <Input
                        type="number"
                        value={selectedEl.x}
                        onChange={(e) => updateElement(selectedEl.id, { x: parseInt(e.target.value) || 0 })}
                        min="0"
                        max="100"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Y Position (px)</Label>
                      <Input
                        type="number"
                        value={selectedEl.y}
                        onChange={(e) => updateElement(selectedEl.id, { y: parseInt(e.target.value) || 0 })}
                        min="0"
                      />
                    </div>
                  </div>
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full"
                    onClick={() => deleteElement(selectedEl.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Element
                  </Button>
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center">
                  Select an element to edit properties
                </p>
              )}
            </CardContent>
          </Card>

          {/* Elements List */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-sm">Elements ({elements.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 max-h-60 overflow-auto custom-scrollbar">
              {elements.map((element) => (
                <div
                  key={element.id}
                  className={`flex items-center justify-between p-2 rounded border cursor-pointer ${
                    selectedElement === element.id 
                      ? 'border-[rgb(2,3,129)] bg-[rgb(2,3,129)]/5' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedElement(element.id)}
                >
                  <div className="flex items-center space-x-2">
                    {getElementIcon(element.type)}
                    <span className="text-sm truncate">{element.label}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {element.type}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Project Features Reference */}
      {clientBrief.features.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Features to Wireframe</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {clientBrief.features.map((feature, index) => (
                <Badge key={index} variant="secondary">
                  {feature}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}