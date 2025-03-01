"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import {
  Save,
  Loader2,
  User,
  Mail,
  Github,
  Twitter,
  Linkedin,
  FileText,
} from "lucide-react";
import { ImageUpload } from "@/components/ui/image-upload";

export default function ProfilePage() {
  const router = useRouter();
  const profile = useQuery(api.profile.get);
  const updateProfile = useMutation(api.profile.upsert);

  const [formData, setFormData] = useState({
    name: "",
    title: "",
    bio: "",
    avatar: "",
    email: "",
    github: "",
    twitter: "",
    linkedin: "",
    resume: "",
    skills: [] as string[],
  });

  const [skillInput, setSkillInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        title: profile.title || "",
        bio: profile.bio || "",
        avatar: profile.avatar || "",
        email: profile.email || "",
        github: profile.github || "",
        twitter: profile.twitter || "",
        linkedin: profile.linkedin || "",
        resume: profile.resume || "",
        skills: profile.skills || [],
      });
    }
  }, [profile]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage("");

    try {
      await updateProfile(formData);
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-12">
      <h1 className="text-4xl font-bold mb-8">Edit Profile</h1>

      {profile === undefined ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="space-y-8 bg-card p-6 rounded-lg shadow-sm border"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium mb-1"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium mb-1"
                    >
                      Professional Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
                      placeholder="e.g. Full Stack Developer"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium mb-1"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Profile Avatar
                    </label>
                    <ImageUpload
                      value={formData.avatar ? [formData.avatar] : []}
                      onChange={(urls) => {
                        if (urls.length > 0) {
                          setFormData((prev) => ({ ...prev, avatar: urls[0] }));
                        }
                      }}
                      onRemove={() => {
                        setFormData((prev) => ({ ...prev, avatar: "" }));
                      }}
                      endpoint="profileAvatar"
                      projectSlug="profile"
                    />
                    {!formData.avatar && (
                      <p className="text-xs text-red-500 mt-1">
                        A profile avatar is required
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="resume"
                      className="block text-sm font-medium mb-1"
                    >
                      Resume URL (Optional)
                    </label>
                    <input
                      type="url"
                      id="resume"
                      name="resume"
                      value={formData.resume}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
                      placeholder="https://example.com/resume.pdf"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="bio"
                      className="block text-sm font-medium mb-1"
                    >
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
                      placeholder="Write a short bio about yourself..."
                    ></textarea>
                  </div>

                  <div>
                    <label
                      htmlFor="github"
                      className="block text-sm font-medium mb-1"
                    >
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      id="github"
                      name="github"
                      value={formData.github}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
                      placeholder="https://github.com/yourusername"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="twitter"
                      className="block text-sm font-medium mb-1"
                    >
                      Twitter URL
                    </label>
                    <input
                      type="url"
                      id="twitter"
                      name="twitter"
                      value={formData.twitter}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
                      placeholder="https://twitter.com/yourusername"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="linkedin"
                      className="block text-sm font-medium mb-1"
                    >
                      LinkedIn URL
                    </label>
                    <input
                      type="url"
                      id="linkedin"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
                      placeholder="https://linkedin.com/in/yourusername"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Skills</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.skills.map((skill) => (
                    <div
                      key={skill}
                      className="bg-primary/10 text-primary px-3 py-1 rounded-full flex items-center gap-1"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-primary/70 hover:text-primary"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    className="flex-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
                    placeholder="Add a skill (e.g. React, Node.js, TypeScript)"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4">
                <div>
                  {successMessage && (
                    <p className="text-green-600 dark:text-green-400">
                      {successMessage}
                    </p>
                  )}
                </div>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => router.push("/admin")}
                    className="px-6 py-2 border rounded-md hover:bg-muted"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        <span>Save Profile</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Profile Preview */}
          <div className="lg:col-span-1">
            <div className="bg-card p-6 rounded-lg shadow-sm border">
              <h2 className="text-xl font-semibold mb-4">Profile Preview</h2>
              <div className="space-y-6">
                <div className="flex flex-col items-center">
                  {formData.avatar ? (
                    <img
                      src={formData.avatar}
                      alt={formData.name}
                      className="w-32 h-32 rounded-full object-cover border-4 border-primary/10"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center">
                      <User className="h-16 w-16 text-muted-foreground" />
                    </div>
                  )}
                  <h3 className="text-xl font-bold mt-4">
                    {formData.name || "Your Name"}
                  </h3>
                  <p className="text-muted-foreground">
                    {formData.title || "Your Title"}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-card-foreground leading-relaxed">
                    {formData.bio || "Your bio will appear here..."}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Skills</h4>
                  <div className="flex flex-wrap gap-1">
                    {formData.skills.length > 0 ? (
                      formData.skills.map((skill) => (
                        <span
                          key={skill}
                          className="text-xs bg-muted px-2 py-1 rounded-full"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        No skills added yet
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Contact</h4>
                  <div className="space-y-1">
                    {formData.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-card-foreground">
                          {formData.email}
                        </span>
                      </div>
                    )}
                    {formData.github && (
                      <div className="flex items-center gap-2 text-sm">
                        <Github className="h-4 w-4 text-muted-foreground" />
                        <span className="text-card-foreground">GitHub</span>
                      </div>
                    )}
                    {formData.twitter && (
                      <div className="flex items-center gap-2 text-sm">
                        <Twitter className="h-4 w-4 text-muted-foreground" />
                        <span className="text-card-foreground">Twitter</span>
                      </div>
                    )}
                    {formData.linkedin && (
                      <div className="flex items-center gap-2 text-sm">
                        <Linkedin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-card-foreground">LinkedIn</span>
                      </div>
                    )}
                    {formData.resume && (
                      <div className="flex items-center gap-2 text-sm">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-card-foreground">Resume</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
