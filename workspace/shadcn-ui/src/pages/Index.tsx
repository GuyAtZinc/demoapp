import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
  Layers, 
  PlusCircle, 
  Download, 
  Upload,
  Save,
  Eye,
  Settings
} from 'lucide-react';
import SitemapDesigner from '@/components/SitemapDesigner';
import WireframeDesigner from '@/components/WireframeDesigner';
import ClientBriefForm from '@/components/ClientBriefForm';

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

export default function Index() {
  const [activeTab, setActiveTab] = useState('brief');
  const [clientBrief, setClientBrief] = useState<ClientBrief>({
    projectName: '',
    clientName: '',
    description: '',
    goals: [],
    targetAudience: '',
    features: [],
    brandColors: [],
    notes: ''
  });

  const handleSaveProject = () => {
    const projectData = {
      clientBrief,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(projectData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${clientBrief.projectName || 'sitemap-project'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[rgb(2,3,129)] to-[rgb(151,120,209)] rounded-lg flex items-center justify-center">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[rgb(2,3,129)]">SiteMapper Pro</h1>
                <p className="text-sm text-gray-500">Sitemap & Wireframe Designer</p>
              </div>
            </div>
            {clientBrief.projectName && (
              <Badge variant="outline" className="bg-[rgb(254,248,76)] text-[rgb(2,3,129)] border-[rgb(254,248,76)]">
                {clientBrief.projectName}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleSaveProject}>
              <Save className="w-4 h-4 mr-2" />
              Save Project
            </Button>
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="brief" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Client Brief</span>
            </TabsTrigger>
            <TabsTrigger value="sitemap" className="flex items-center space-x-2">
              <Layers className="w-4 h-4" />
              <span>Sitemap</span>
            </TabsTrigger>
            <TabsTrigger value="wireframe" className="flex items-center space-x-2">
              <Eye className="w-4 h-4" />
              <span>Wireframes</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="brief" className="space-y-6">
            <ClientBriefForm 
              clientBrief={clientBrief} 
              setClientBrief={setClientBrief}
              onComplete={() => setActiveTab('sitemap')}
            />
          </TabsContent>

          <TabsContent value="sitemap" className="space-y-6">
            <SitemapDesigner clientBrief={clientBrief} />
          </TabsContent>

          <TabsContent value="wireframe" className="space-y-6">
            <WireframeDesigner clientBrief={clientBrief} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}