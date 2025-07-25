import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Plus, FileText, AlertCircle } from "lucide-react";

const Index = () => {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">
          Driver Management Dashboard
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Streamline your driver onboarding process with comprehensive qualification file management
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="h-5 w-5 text-primary" />
              <span>Add New Driver</span>
            </CardTitle>
            <CardDescription>
              Register a new driver with complete qualification documentation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/drivers/add">
                <Plus className="h-4 w-4 mr-2" />
                Add Driver
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-primary" />
              <span>Driver Registry</span>
            </CardTitle>
            <CardDescription>
              View and manage all registered drivers in your fleet
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" disabled>
              <Users className="h-4 w-4 mr-2" />
              View Drivers
              <span className="text-xs ml-2">(Coming Soon)</span>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-primary" />
              <span>DQF Management</span>
            </CardTitle>
            <CardDescription>
              Manage Driver Qualification Files and compliance documents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" disabled>
              <FileText className="h-4 w-4 mr-2" />
              Manage Files
              <span className="text-xs ml-2">(Coming Soon)</span>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-accent border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-primary">
            <AlertCircle className="h-5 w-5" />
            <span>What are DQF Files?</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground">
            Driver Qualification Files (DQF) are comprehensive records maintained for each commercial driver, 
            containing their employment application, road test results, driving record, and other qualification 
            documents required by DOT regulations. Our system helps you maintain these critical files in 
            compliance with federal transportation safety requirements.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
