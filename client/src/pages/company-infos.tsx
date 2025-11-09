import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Plus, Search, MapPin, Calendar, User, Mail, Phone, Globe, Facebook, Instagram, Twitter, Linkedin, Youtube } from "lucide-react";
import type { CompanyInfo } from "@shared/schema";

export default function CompanyInfos() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<CompanyInfo | null>(null);
  const { toast} = useToast();
  
  const { data: companies = [], isLoading } = useQuery<CompanyInfo[]>({
    queryKey: ["/admin/company-infos"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/admin/company-infos", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/admin/company-infos"] });
      setIsDialogOpen(false);
      setEditingCompany(null);
      toast({ title: "Company info created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create company info", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await apiRequest("PATCH", `/admin/company-infos/${id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/admin/company-infos"] });
      setIsDialogOpen(false);
      setEditingCompany(null);
      toast({ title: "Company info updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update company info", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/admin/company-infos/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/admin/company-infos"] });
      toast({ title: "Company info deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete company info", variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const contactInfo = {
      email: formData.get("email") || "",
      phone: formData.get("phone") || "",
      website: formData.get("website") || "",
      facebook: formData.get("facebook") || "",
      instagram: formData.get("instagram") || "",
      twitter: formData.get("twitter") || "",
      linkedin: formData.get("linkedin") || "",
      youtube: formData.get("youtube") || "",
    };

    const data = {
      name: formData.get("name"),
      foundedDate: formData.get("foundedDate") || null,
      logo: formData.get("logo") || null,
      founder: formData.get("founder") || null,
      country: formData.get("country") || null,
      location: formData.get("location") || null,
      contactInfo,
      isActive: formData.get("isActive") === "true",
    };

    if (editingCompany) {
      updateMutation.mutate({ id: editingCompany.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-muted-foreground">Loading company infos...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-semibold" data-testid="heading-company-infos">Company Infos</h1>
          <p className="text-muted-foreground mt-1">
            Manage company information and details
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingCompany(null)} data-testid="button-add-company">
              <Plus className="h-4 w-4 mr-2" />
              Add Company Info
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingCompany ? "Edit" : "Add"} Company Info</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Company Name *</Label>
                <Input
                  id="name"
                  name="name"
                  required
                  defaultValue={editingCompany?.name}
                  data-testid="input-name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="foundedDate">Founded Date</Label>
                  <Input
                    id="foundedDate"
                    name="foundedDate"
                    type="date"
                    defaultValue={editingCompany?.foundedDate || ""}
                    data-testid="input-founded-date"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="founder">Founder</Label>
                  <Input
                    id="founder"
                    name="founder"
                    defaultValue={editingCompany?.founder || ""}
                    data-testid="input-founder"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    placeholder="e.g., Mongolia, China"
                    defaultValue={editingCompany?.country || ""}
                    data-testid="input-country"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">City/Location</Label>
                  <Input
                    id="location"
                    name="location"
                    placeholder="e.g., Ulaanbaatar, Beijing"
                    defaultValue={editingCompany?.location || ""}
                    data-testid="input-location"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo">Logo URL</Label>
                <Input
                  id="logo"
                  name="logo"
                  type="url"
                  placeholder="https://example.com/logo.png"
                  defaultValue={editingCompany?.logo || ""}
                  data-testid="input-logo"
                />
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium mb-3">Contact Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      defaultValue={(editingCompany?.contactInfo as any)?.email || ""}
                      data-testid="input-email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      defaultValue={(editingCompany?.contactInfo as any)?.phone || ""}
                      data-testid="input-phone"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      name="website"
                      type="url"
                      defaultValue={(editingCompany?.contactInfo as any)?.website || ""}
                      data-testid="input-website"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium mb-3">Social Media</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="facebook">Facebook</Label>
                    <Input
                      id="facebook"
                      name="facebook"
                      placeholder="https://facebook.com/..."
                      defaultValue={(editingCompany?.contactInfo as any)?.facebook || ""}
                      data-testid="input-facebook"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input
                      id="instagram"
                      name="instagram"
                      placeholder="https://instagram.com/..."
                      defaultValue={(editingCompany?.contactInfo as any)?.instagram || ""}
                      data-testid="input-instagram"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twitter">Twitter/X</Label>
                    <Input
                      id="twitter"
                      name="twitter"
                      placeholder="https://twitter.com/..."
                      defaultValue={(editingCompany?.contactInfo as any)?.twitter || ""}
                      data-testid="input-twitter"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      name="linkedin"
                      placeholder="https://linkedin.com/company/..."
                      defaultValue={(editingCompany?.contactInfo as any)?.linkedin || ""}
                      data-testid="input-linkedin"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="youtube">YouTube</Label>
                    <Input
                      id="youtube"
                      name="youtube"
                      placeholder="https://youtube.com/..."
                      defaultValue={(editingCompany?.contactInfo as any)?.youtube || ""}
                      data-testid="input-youtube"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  name="isActive"
                  defaultChecked={editingCompany?.isActive ?? true}
                  value="true"
                  data-testid="switch-active"
                />
                <Label htmlFor="isActive">Active</Label>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  data-testid="button-cancel"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  data-testid="button-submit"
                >
                  {editingCompany ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search companies..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          data-testid="input-search"
        />
      </div>

      {filteredCompanies.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          {companies.length === 0
            ? "No company infos yet. Click 'Add Company Info' to create one."
            : "No companies match your search."}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCompanies.map((company) => {
            const contactInfo = company.contactInfo as any || {};
            return (
              <Card key={company.id} data-testid={`card-company-${company.id}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      {company.logo && (
                        <img
                          src={company.logo}
                          alt={company.name}
                          className="h-12 w-12 object-contain mb-2 rounded"
                        />
                      )}
                      <CardTitle>{company.name}</CardTitle>
                      {company.founder && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <User className="h-3 w-3" />
                          <span>Founded by {company.founder}</span>
                        </div>
                      )}
                    </div>
                    <Badge variant={company.isActive ? "default" : "secondary"}>
                      {company.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {company.foundedDate && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{new Date(company.foundedDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  {company.location && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{company.location}</span>
                    </div>
                  )}
                  
                  {(contactInfo.email || contactInfo.phone || contactInfo.website) && (
                    <div className="border-t pt-3 space-y-2">
                      {contactInfo.email && (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="truncate">{contactInfo.email}</span>
                        </div>
                      )}
                      {contactInfo.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{contactInfo.phone}</span>
                        </div>
                      )}
                      {contactInfo.website && (
                        <div className="flex items-center gap-2 text-sm">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <a href={contactInfo.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">
                            Visit Website
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  {(contactInfo.facebook || contactInfo.instagram || contactInfo.twitter || contactInfo.linkedin || contactInfo.youtube) && (
                    <div className="border-t pt-3">
                      <div className="flex gap-2 flex-wrap">
                        {contactInfo.facebook && (
                          <a href={contactInfo.facebook} target="_blank" rel="noopener noreferrer">
                            <Facebook className="h-5 w-5 text-muted-foreground hover:text-primary" />
                          </a>
                        )}
                        {contactInfo.instagram && (
                          <a href={contactInfo.instagram} target="_blank" rel="noopener noreferrer">
                            <Instagram className="h-5 w-5 text-muted-foreground hover:text-primary" />
                          </a>
                        )}
                        {contactInfo.twitter && (
                          <a href={contactInfo.twitter} target="_blank" rel="noopener noreferrer">
                            <Twitter className="h-5 w-5 text-muted-foreground hover:text-primary" />
                          </a>
                        )}
                        {contactInfo.linkedin && (
                          <a href={contactInfo.linkedin} target="_blank" rel="noopener noreferrer">
                            <Linkedin className="h-5 w-5 text-muted-foreground hover:text-primary" />
                          </a>
                        )}
                        {contactInfo.youtube && (
                          <a href={contactInfo.youtube} target="_blank" rel="noopener noreferrer">
                            <Youtube className="h-5 w-5 text-muted-foreground hover:text-primary" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        setEditingCompany(company);
                        setIsDialogOpen(true);
                      }}
                      data-testid={`button-edit-${company.id}`}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => deleteMutation.mutate(company.id)}
                      disabled={deleteMutation.isPending}
                      data-testid={`button-delete-${company.id}`}
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
