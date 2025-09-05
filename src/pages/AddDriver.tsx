import { useState, useRef } from "react";
import { format } from "date-fns";
import { CalendarIcon, Upload, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import FileUpload from "@/components/FileUpload";
import { useToast } from "@/hooks/use-toast";
import { Save, User } from "lucide-react";

interface DriverFormData {
  firstName: string;
  lastName: string;
  employeeId: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  webAccess: boolean;
  isActive: boolean;
  licenseNumber: string;
  licenseState: string;
  licenseExpiry: string;
  cdlClass: string[];
  endorsements: string[];
  hosExempt: string;
  exemptionReason: string;
  medicalCardNumber: string;
  medicalCardExpiry: string;
  notes: string;
}

const AddDriver = () => {
  const [formData, setFormData] = useState<DriverFormData>({
    firstName: "",
    lastName: "",
    employeeId: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    webAccess: false,
    isActive: true,
    licenseNumber: "",
    licenseState: "",
    licenseExpiry: "",
    cdlClass: [],
    endorsements: [],
    hosExempt: "",
    exemptionReason: "",
    medicalCardNumber: "",
    medicalCardExpiry: "",
    notes: "",
  });
  const [dqfFiles, setDqfFiles] = useState<Array<{file: File, label: string}>>([]);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string>("");
  const [fileLabel, setFileLabel] = useState<string>("");
  const [selectedDqfFile, setSelectedDqfFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedOwners, setSelectedOwners] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleInputChange = (field: keyof DriverFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileSelect = (file: File) => {
    setSelectedDqfFile(file);
    // Auto-populate file label with filename if label is empty
    if (fileLabel.trim() === "") {
      // Remove file extension for cleaner label
      const nameWithoutExtension = file.name.replace(/\.[^/.]+$/, "");
      setFileLabel(nameWithoutExtension);
    }
  };

  const handleUploadFile = () => {
    if (!selectedDqfFile || fileLabel.trim() === "") {
      toast({
        title: "Missing Information",
        description: "Please enter a label and select a file before uploading.",
        variant: "destructive",
      });
      return;
    }
    
    setDqfFiles(prev => [...prev, { file: selectedDqfFile, label: fileLabel }]);
    setFileLabel(""); // Clear the label for next file
    setSelectedDqfFile(null); // Clear selected file
    
    toast({
      title: "File Uploaded",
      description: `${selectedDqfFile.name} has been added successfully.`,
      duration: 3000,
    });
  };

  const handleRemoveSelectedFile = () => {
    setSelectedDqfFile(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setProfileImage(null);
    setProfileImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeDqfFile = (index: number) => {
    setDqfFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleOwnerSelection = (ownerId: string, ownerName: string) => {
    setSelectedOwners(prev => {
      if (prev.includes(ownerName)) {
        return prev.filter(owner => owner !== ownerName);
      } else {
        return [...prev, ownerName];
      }
    });
  };

  const handleCdlClassSelection = (cdlClass: string) => {
    setFormData(prev => ({
      ...prev,
      cdlClass: prev.cdlClass.includes(cdlClass)
        ? prev.cdlClass.filter(cls => cls !== cdlClass)
        : [...prev.cdlClass, cdlClass]
    }));
  };

  const handleEndorsementSelection = (endorsement: string) => {
    setFormData(prev => ({
      ...prev,
      endorsements: prev.endorsements.includes(endorsement)
        ? prev.endorsements.filter(end => end !== endorsement)
        : [...prev.endorsements, endorsement]
    }));
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
        employeeId: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        webAccess: false,
        isActive: true,
        licenseNumber: "",
        licenseState: "",
        licenseExpiry: "",
        cdlClass: [],
        endorsements: [],
        hosExempt: "",
        exemptionReason: "",
        medicalCardNumber: "",
        medicalCardExpiry: "",
        notes: "",
      });
      setFileLabel("");
      setDqfFiles([]);
      setSelectedDqfFile(null);
      setProfileImage(null);
      setProfileImagePreview("");
      setSelectedOwners([]);
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
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Enter the driver's basic personal details
              </CardDescription>
            </div>
            {/* Profile Image */}
            <div className="flex flex-col items-center space-y-2">
              <Label className="text-sm">Profile Image</Label>
              <div 
                className="relative cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => fileInputRef.current?.click()}
              >
                {profileImagePreview ? (
                  <>
                    <img
                      src={profileImagePreview}
                      alt="Profile preview"
                      className="w-16 h-16 rounded-full object-cover border-2 border-border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-1 -right-1 h-5 w-5 p-0 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage();
                      }}
                    >
                      <X className="h-2 w-2" />
                    </Button>
                  </>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-muted border-2 border-dashed border-border flex items-center justify-center hover:bg-muted/80 transition-colors">
                    <User className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <div className="space-y-2">
                    <Label htmlFor="employeeId">Employee ID *</Label>
                    <Input
                      id="employeeId"
                      value={formData.employeeId}
                      onChange={(e) => handleInputChange("employeeId", e.target.value)}
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
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="webAccess"
                      checked={formData.webAccess}
                      onCheckedChange={(checked) => handleInputChange("webAccess", checked as boolean)}
                    />
                    <Label htmlFor="webAccess">Web Access User</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => handleInputChange("isActive", checked as boolean)}
                    />
                    <Label htmlFor="isActive">Active User</Label>
                  </div>
                </div>
                {formData.webAccess && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <Label>Assigned Owners</Label>
                       <Popover>
                         <PopoverTrigger asChild>
                           <Button
                             variant="outline"
                             className="w-full justify-start text-left font-normal bg-background"
                           >
                             <span>
                               {selectedOwners.length > 0 
                                 ? selectedOwners.join(", ") 
                                 : "Select owners..."
                               }
                             </span>
                           </Button>
                         </PopoverTrigger>
                         <PopoverContent className="w-full p-3 bg-background border border-border z-50">
                           <div className="space-y-2">
                             <div className="flex items-center space-x-2">
                               <Checkbox 
                                 id="owner1" 
                                 checked={selectedOwners.includes("Owner 1")}
                                 onCheckedChange={() => handleOwnerSelection("owner1", "Owner 1")}
                               />
                               <Label htmlFor="owner1" className="text-sm">Owner 1</Label>
                             </div>
                             <div className="flex items-center space-x-2">
                               <Checkbox 
                                 id="owner2" 
                                 checked={selectedOwners.includes("Owner 2")}
                                 onCheckedChange={() => handleOwnerSelection("owner2", "Owner 2")}
                               />
                               <Label htmlFor="owner2" className="text-sm">Owner 2</Label>
                             </div>
                             <div className="flex items-center space-x-2">
                               <Checkbox 
                                 id="owner3" 
                                 checked={selectedOwners.includes("Owner 3")}
                                 onCheckedChange={() => handleOwnerSelection("owner3", "Owner 3")}
                               />
                               <Label htmlFor="owner3" className="text-sm">Owner 3</Label>
                             </div>
                             <div className="flex items-center space-x-2">
                               <Checkbox 
                                 id="owner4" 
                                 checked={selectedOwners.includes("Owner 4")}
                                 onCheckedChange={() => handleOwnerSelection("owner4", "Owner 4")}
                               />
                               <Label htmlFor="owner4" className="text-sm">Owner 4</Label>
                             </div>
                           </div>
                         </PopoverContent>
                       </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="userGroup">User Group</Label>
                      <Select>
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Select user group" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border border-border z-50">
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="driver">Driver</SelectItem>
                          <SelectItem value="dispatcher">Dispatcher</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
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
                <Label htmlFor="licenseNumber">
                  License Number {!formData.webAccess && "*"}
                </Label>
                <Input
                  id="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={(e) => handleInputChange("licenseNumber", e.target.value)}
                  required={!formData.webAccess}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="licenseState">
                  License State {!formData.webAccess && "*"}
                </Label>
                <Input
                  id="licenseState"
                  value={formData.licenseState}
                  onChange={(e) => handleInputChange("licenseState", e.target.value)}
                  required={!formData.webAccess}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="licenseExpiry">
                  Expiration Date {!formData.webAccess && "*"}
                </Label>
                <Input
                  id="licenseExpiry"
                  type="date"
                  value={formData.licenseExpiry}
                  onChange={(e) => handleInputChange("licenseExpiry", e.target.value)}
                  required={!formData.webAccess}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cdlClass">CDL Class</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal bg-background"
                    >
                      <span>
                        {formData.cdlClass.length > 0 
                          ? formData.cdlClass.map(cls => `Class ${cls}`).join(", ") 
                          : "Select CDL Class..."
                        }
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-3 bg-background border border-border z-50">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="classA" 
                          checked={formData.cdlClass.includes("A")}
                          onCheckedChange={() => handleCdlClassSelection("A")}
                        />
                        <Label htmlFor="classA" className="text-sm">Class A</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="classB" 
                          checked={formData.cdlClass.includes("B")}
                          onCheckedChange={() => handleCdlClassSelection("B")}
                        />
                        <Label htmlFor="classB" className="text-sm">Class B</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="classC" 
                          checked={formData.cdlClass.includes("C")}
                          onCheckedChange={() => handleCdlClassSelection("C")}
                        />
                        <Label htmlFor="classC" className="text-sm">Class C</Label>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="endorsements">Endorsements</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal bg-background"
                    >
                      <span>
                        {formData.endorsements.length > 0 
                          ? formData.endorsements.join(", ") 
                          : "Select endorsements..."
                        }
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-3 bg-background border border-border z-50">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="hazmat" 
                          checked={formData.endorsements.includes("H - Hazmat")}
                          onCheckedChange={() => handleEndorsementSelection("H - Hazmat")}
                        />
                        <Label htmlFor="hazmat" className="text-sm">H - Hazmat</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="tankVehicles" 
                          checked={formData.endorsements.includes("N - Tank Vehicles")}
                          onCheckedChange={() => handleEndorsementSelection("N - Tank Vehicles")}
                        />
                        <Label htmlFor="tankVehicles" className="text-sm">N - Tank Vehicles</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="passengerTransport" 
                          checked={formData.endorsements.includes("P - Passenger Transport")}
                          onCheckedChange={() => handleEndorsementSelection("P - Passenger Transport")}
                        />
                        <Label htmlFor="passengerTransport" className="text-sm">P - Passenger Transport</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="schoolBus" 
                          checked={formData.endorsements.includes("S - School Bus")}
                          onCheckedChange={() => handleEndorsementSelection("S - School Bus")}
                        />
                        <Label htmlFor="schoolBus" className="text-sm">S - School Bus</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="doubleTriples" 
                          checked={formData.endorsements.includes("T - Double/Triples")}
                          onCheckedChange={() => handleEndorsementSelection("T - Double/Triples")}
                        />
                        <Label htmlFor="doubleTriples" className="text-sm">T - Double/Triples</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="tankerHazmat" 
                          checked={formData.endorsements.includes("X - Tanker + Hazmat")}
                          onCheckedChange={() => handleEndorsementSelection("X - Tanker + Hazmat")}
                        />
                        <Label htmlFor="tankerHazmat" className="text-sm">X - Tanker + Hazmat</Label>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hosExempt">HOS Exempt</Label>
                <Select onValueChange={(value) => handleInputChange("hosExempt", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="exemptionReason">Exemption Reason</Label>
                <Input
                  id="exemptionReason"
                  value={formData.exemptionReason}
                  onChange={(e) => handleInputChange("exemptionReason", e.target.value)}
                  placeholder="Enter exemption reason if applicable"
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
             <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
               <div className="space-y-2">
                 <Label htmlFor="medicalCardExpiry">Medical Card Expiration Date</Label>
                 <Input
                   id="medicalCardExpiry"
                   type="date"
                   value={formData.medicalCardExpiry}
                   onChange={(e) => handleInputChange("medicalCardExpiry", e.target.value)}
                 />
               </div>
             </div>
          </CardContent>
        </Card>

        {/* Uploaded Files Display */}
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Files</CardTitle>
            <CardDescription>
              Files that have been uploaded for this driver
            </CardDescription>
          </CardHeader>
          <CardContent>
            {dqfFiles.length > 0 || profileImage ? (
              <div className="space-y-4">
                {dqfFiles.map((dqfFile, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/50">
                    <div className="flex-1">
                      <div className="font-medium text-sm">
                        {dqfFile.label}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {dqfFile.file.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {(dqfFile.file.size / 1024 / 1024).toFixed(2)} MB
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeDqfFile(index)}
                      className="ml-4"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {profileImage && (
                  <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/50">
                    <div className="flex-1">
                      <div className="font-medium text-sm">
                        Profile Image
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {profileImage.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {(profileImage.size / 1024 / 1024).toFixed(2)} MB
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={removeImage}
                      className="ml-4"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                No files uploaded yet
              </div>
            )}
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
              <Label htmlFor="fileLabel">File Label *</Label>
              <Input
                id="fileLabel"
                value={fileLabel}
                onChange={(e) => setFileLabel(e.target.value)}
                placeholder="Enter a name/label for this file..."
                required
              />
            </div>
            <FileUpload 
              onFileSelect={handleFileSelect} 
              selectedFile={selectedDqfFile}
              onFileRemove={handleRemoveSelectedFile}
            />
            <div className="flex justify-end">
              <Button
                type="button"
                onClick={handleUploadFile}
                disabled={!selectedDqfFile || fileLabel.trim() === ""}
                className="min-w-24"
              >
                <Upload className="h-4 w-4 mr-2" />
                Attach
              </Button>
            </div>
            {dqfFiles.length > 0 && (
              <div className="text-sm text-muted-foreground">
                {dqfFiles.length} file{dqfFiles.length !== 1 ? 's' : ''} uploaded.
              </div>
            )}
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
                Add User
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddDriver;