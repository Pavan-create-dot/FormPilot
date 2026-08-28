export interface User {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthUserResponse {
  user: User;
  token: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
  cgpa?: string;
  percentage?: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  jobTitle: string;
  startDate: string;
  endDate?: string;
  description: string;
  skillsUsed: string[];
}

export interface Project {
  id: string;
  projectName: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
}

export interface Links {
  linkedin?: string;
  github?: string;
  portfolio?: string;
  other?: string[];
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  currentLocation: string;
  address: string;
  country: string;
  links: Links;
}

export interface UserPreferences {
  willingToRelocate: boolean;
  preferredLocations: string[];
  workAuthorizationStatus: string;
  preferredContactMethod: 'email' | 'phone' | 'linkedin' | string;
}

export interface UserSkills {
  technicalSkills: string[];
  softSkills: string[];
  programmingLanguages: string[];
  frameworks: string[];
  tools: string[];
}

export interface Profile {
  id: string;
  userId: string;
  personal: PersonalInfo;
  education: Education[];
  experience: WorkExperience[];
  projects: Project[];
  skills: UserSkills;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export type CustomFieldType =
  | "text"
  | "textarea"
  | "select"
  | "radio"
  | "checkbox"
  | "boolean";

export interface CustomAnswer {
  id: string;
  userId: string;
  originalQuestion: string;
  normalizedIntent?: string;
  answer: string | string[] | boolean;
  fieldType: CustomFieldType;
  options?: string[];
  createdAt: Date;
  lastUsedAt?: Date;
}

export type ElementType =
  | "input"
  | "textarea"
  | "select"
  | "radio"
  | "checkbox";

export interface DetectedField {
  id: string;
  elementType: ElementType;
  inputType?: string;
  name?: string;
  domId?: string;
  placeholder?: string;
  label?: string;
  ariaLabel?: string;
  nearbyText?: string;
  required: boolean;
  options?: string[];
  xpath?: string;
  cssSelector?: string;
}

export type StrategyType = "rule" | "semantic" | "ai" | "custom-answer";

export interface MatchResult {
  fieldId: string;
  matched: boolean;
  profileField?: string;
  suggestedValue?: string | string[] | boolean;
  confidence: number;
  strategy: StrategyType;
  explanation?: string;
  isSensitive?: boolean;
  shouldAskUser?: boolean;
  options?: string[];
  originalQuestion?: string;
}

export interface FieldClassification {
  intent: string;
  confidence: number;
  requiredProfileField?: string;
  isSensitive: boolean;
  shouldAskUser: boolean;
  reasoning?: string;
}

export interface ApplicationHistory {
  id: string;
  userId: string;
  company?: string;
  jobTitle?: string;
  applicationUrl?: string;
  appliedAt: Date;
  fieldsFilled: number;
  fieldsAsked: number;
  unknownFields: number;
  status: 'draft' | 'reviewed' | 'submitted';
}

export interface ScanMatchResponse {
  matches: MatchResult[];
  profileCompleteness: number;
}
