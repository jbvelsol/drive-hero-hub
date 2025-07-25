import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import FileUpload from "@/components/FileUpload";
import { useToast } from "@/hooks/use-toast";
import { Save, User } from "lucide-react";

interface DriverFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  licenseState: string;
  licenseExpiry: string;
  cdlClass: string;
  endorsements: string;
  medicalCardNumber: string;
  notes: string;
}

const AddDriver = () => {
  const [formData, setFormData] = useState<DriverFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    licenseNumber: "",
    licenseState: "",
    licenseExpiry: "",
    cdlClass: "",
    endorsements: "",
    medicalCardNumber: "",
    notes: "",
  });
  const [medicalCardExpiry, setMedicalCardExpiry] = useState<Date>();
  const [dqfFile, setDqfFile] = useState<File | null>(null);
  const [fileLabel, setFileLabel] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: keyof DriverFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileSelect = (file: File) => {
    setDqfFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Driver Added Successfully",
        description: `${formData.firstName} ${formData.lastName} has been added to the system.`,
      });

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        licenseNumber: "",
        licenseState: "",
        licenseExpiry: "",
        cdlClass: "",
        endorsements: "",
        medicalCardNumber: "",
        notes: "",
      });
      setMedicalCardExpiry(undefined);
      setFileLabel("");
      setDqfFile(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add driver. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <User className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold text-foreground">Add New Driver</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Enter the driver's basic personal details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* License Information */}
        <Card>
          <CardHeader>
            <CardTitle>License Information</CardTitle>
            <CardDescription>
              Commercial driver's license details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="licenseNumber">License Number *</Label>
                <Input
                  id="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={(e) => handleInputChange("licenseNumber", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="licenseState">License State *</Label>
                <Input
                  id="licenseState"
                  value={formData.licenseState}
                  onChange={(e) => handleInputChange("licenseState", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="licenseExpiry">Expiry Date *</Label>
                <Input
                  id="licenseExpiry"
                  type="date"
                  value={formData.licenseExpiry}
                  onChange={(e) => handleInputChange("licenseExpiry", e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cdlClass">CDL Class</Label>
                <Select onValueChange={(value) => handleInputChange("cdlClass", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select CDL Class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">Class A</SelectItem>
                    <SelectItem value="B">Class B</SelectItem>
                    <SelectItem value="C">Class C</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="endorsements">Endorsements</Label>
                <Input
                  id="endorsements"
                  value={formData.endorsements}
                  onChange={(e) => handleInputChange("endorsements", e.target.value)}
                  placeholder="e.g., H, N, P, S, T, X"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Medical Card Information */}
        <Card>
          <CardHeader>
            <CardTitle>Medical Card Information</CardTitle>
            <CardDescription>
              DOT medical examination certificate details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="medicalCardNumber">Medical Card Number</Label>
                <Input
                  id="medicalCardNumber"
                  value={formData.medicalCardNumber}
                  onChange={(e) => handleInputChange("medicalCardNumber", e.target.value)}
                  placeholder="Enter medical certificate number"
                />
              </div>
              <div className="space-y-2">
                <Label>Medical Card Expiration Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !medicalCardExpiry && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {medicalCardExpiry ? (
                        format(medicalCardExpiry, "PPP")
                      ) : (
                        <span>Pick expiration date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={medicalCardExpiry}
                      onSelect={setMedicalCardExpiry}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardContent>
        </Card>


        {/* DQF File Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Driver Qualification File (DQF)</CardTitle>
            <CardDescription>
              Upload the driver's qualification file and supporting documents
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fileLabel">File Label</Label>
              <Input
                id="fileLabel"
                value={fileLabel}
                onChange={(e) => setFileLabel(e.target.value)}
                placeholder="Enter a name/label for this file..."
              />
            </div>
            <FileUpload onFileSelect={handleFileSelect} />
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Any additional information about the driver..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <Separator />

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              "Adding Driver..."
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Add Driver
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddDriver;