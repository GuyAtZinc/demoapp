import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Home, 
  File, 
  Folder,
  ArrowDown,
  ArrowRight,
  Download
} from 'lucide-react';

interface SitemapNode {
  id: string;
  title: string;
  type: 'page' | 'section' | 'external';
  children: SitemapNode[];
  parent?: string;
  url?: string;
  description?: string;
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

interface SitemapDesignerProps {
  clientBrief: ClientBrief;
}

export default function SitemapDesigner({ clientBrief }: SitemapDesignerProps) {
  const [sitemap, setSitemap] = useState<SitemapNode>({
    id: 'home',
    title: 'Home',
    type: 'page',
    children: [
      {
        id: 'about',
        title: 'About',
        type: 'page',
        children: [],
        parent: 'home'
      },
      {
        id: 'services',
        title: 'Services',
        type: 'section',
        children: [],
        parent: 'home'
      },
      {
        id: 'contact',
        title: 'Contact',
        type: 'page',
        children: [],
        parent: 'home'
      }
    ]
  });
  
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [editingNode, setEditingNode] = useState<string | null>(null);
  const [newNodeTitle, setNewNodeTitle] = useState('');

  const findNodeById = useCallback((nodes: SitemapNode, id: string): SitemapNode | null => {
    if (nodes.id === id) return nodes;
    for (const child of nodes.children) {
      const found = findNodeById(child, id);
      if (found) return found;
    }
    return null;
  }, []);

  const addNode = (parentId: string, type: 'page' | 'section' = 'page') => {
    if (!newNodeTitle.trim()) return;

    const newNode: SitemapNode = {
      id: `node-${Date.now()}`,
      title: newNodeTitle.trim(),
      type,
      children: [],
      parent: parentId
    };

    const updateNodes = (nodes: SitemapNode): SitemapNode => {
      if (nodes.id === parentId) {
        return { ...nodes, children: [...nodes.children, newNode] };
      }
      return {
        ...nodes,
        children: nodes.children.map(updateNodes)
      };
    };

    setSitemap(updateNodes(sitemap));
    setNewNodeTitle('');
  };

  const deleteNode = (nodeId: string) => {
    const removeNode = (nodes: SitemapNode): SitemapNode => {
      return {
        ...nodes,
        children: nodes.children
          .filter(child => child.id !== nodeId)
          .map(removeNode)
      };
    };

    setSitemap(removeNode(sitemap));
    setSelectedNode(null);
  };

  const updateNodeTitle = (nodeId: string, newTitle: string) => {
    const updateNodes = (nodes: SitemapNode): SitemapNode => {
      if (nodes.id === nodeId) {
        return { ...nodes, title: newTitle };
      }
      return {
        ...nodes,
        children: nodes.children.map(updateNodes)
      };
    };

    setSitemap(updateNodes(sitemap));
    setEditingNode(null);
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'page': return <File className="w-4 h-4" />;
      case 'section': return <Folder className="w-4 h-4" />;
      case 'external': return <ArrowRight className="w-4 h-4" />;
      default: return <File className="w-4 h-4" />;
    }
  };

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'page': return 'bg-[rgb(2,3,129)] text-white';
      case 'section': return 'bg-[rgb(151,120,209)] text-white';
      case 'external': return 'bg-[rgb(254,248,76)] text-[rgb(2,3,129)]';
      default: return 'bg-gray-500 text-white';
    }
  };

  const exportSitemap = () => {
    const sitemapData = {
      project: clientBrief.projectName,
      sitemap: sitemap,
      exported: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(sitemapData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${clientBrief.projectName || 'sitemap'}-structure.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderNode = (node: SitemapNode, level: number = 0): React.ReactNode => {
    const isSelected = selectedNode === node.id;
    const isEditing = editingNode === node.id;

    return (
      <div key={node.id} className={`${level > 0 ? 'ml-8' : ''} mb-4`}>
        <div className={`relative ${level > 0 ? 'before:absolute before:left-[-20px] before:top-[20px] before:w-4 before:h-px before:bg-[rgb(171,184,195)]' : ''}`}>
          {level > 0 && (
            <div className="absolute left-[-32px] top-0 w-4 h-full border-l-2 border-[rgb(171,184,195)] border-dashed"></div>
          )}
          
          <div
            className={`sitemap-node p-4 rounded-lg border-2 cursor-pointer transition-all ${
              isSelected 
                ? 'border-[rgb(2,3,129)] bg-[rgb(2,3,129)]/5' 
                : 'border-gray-200 hover:border-[rgb(151,120,209)]'
            }`}
            onClick={() => setSelectedNode(node.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${getNodeColor(node.type)}`}>
                  {node.id === 'home' ? <Home className="w-4 h-4" /> : getNodeIcon(node.type)}
                </div>
                
                {isEditing ? (
                  <Input
                    value={node.title}
                    onChange={(e) => updateNodeTitle(node.id, e.target.value)}
                    onBlur={() => setEditingNode(null)}
                    onKeyPress={(e) => e.key === 'Enter' && setEditingNode(null)}
                    className="w-48"
                    autoFocus
                  />
                ) : (
                  <div>
                    <h3 className="font-semibold text-[rgb(2,3,129)]">{node.title}</h3>
                    <Badge variant="outline" className="mt-1 text-xs">
                      {node.type}
                    </Badge>
                  </div>
                )}
              </div>
              
              {isSelected && (
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingNode(node.id);
                    }}
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                  {node.id !== 'home' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNode(node.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {node.children.map(child => renderNode(child, level + 1))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-[rgb(2,3,129)]">Site Architecture</h2>
          <p className="text-gray-600">Design your website's information architecture and navigation structure</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button onClick={exportSitemap} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Sitemap
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sitemap Tree */}
        <div className="lg:col-span-3">
          <Card className="h-[600px]">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Home className="w-5 h-5" />
                <span>Site Structure</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="h-full overflow-auto custom-scrollbar">
              <div className="space-y-4">
                {renderNode(sitemap)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls Panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Add New Page</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Page title"
                value={newNodeTitle}
                onChange={(e) => setNewNodeTitle(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && selectedNode && addNode(selectedNode)}
              />
              <div className="space-y-2">
                <Button
                  className="w-full"
                  onClick={() => selectedNode && addNode(selectedNode, 'page')}
                  disabled={!selectedNode || !newNodeTitle.trim()}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Page
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => selectedNode && addNode(selectedNode, 'section')}
                  disabled={!selectedNode || !newNodeTitle.trim()}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Section
                </Button>
              </div>
              {!selectedNode && (
                <p className="text-sm text-gray-500 text-center">
                  Select a parent node first
                </p>
              )}
            </CardContent>
          </Card>

          {/* Quick Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Quick Add</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {['Blog', 'Portfolio', 'Shop', 'FAQ', 'Privacy Policy', 'Terms'].map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    setNewNodeTitle(suggestion);
                    if (selectedNode) addNode(selectedNode, 'page');
                  }}
                  disabled={!selectedNode}
                >
                  {suggestion}
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Node Info */}
          {selectedNode && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Selected Node</CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const node = findNodeById(sitemap, selectedNode);
                  return node ? (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className={`p-1 rounded ${getNodeColor(node.type)}`}>
                          {getNodeIcon(node.type)}
                        </div>
                        <span className="font-medium">{node.title}</span>
                      </div>
                      <Badge variant="outline">{node.type}</Badge>
                      <p className="text-sm text-gray-500">
                        Children: {node.children.length}
                      </p>
                    </div>
                  ) : null;
                })()}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Project Context */}
      {clientBrief.features.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Project Features to Consider</CardTitle>
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