export interface FieldDefinition {
  profileKey: string;
  synonyms: string[];
  isSensitive?: boolean;
}

export const FIELD_SYNONYMS: Record<string, FieldDefinition> = {
  firstName: {
    profileKey: "personal.firstName",
    synonyms: [
      "first name",
      "given name",
      "fname",
      "first_name",
      "candidate first name",
      "first"
    ]
  },
  lastName: {
    profileKey: "personal.lastName",
    synonyms: [
      "last name",
      "surname",
      "family name",
      "lname",
      "last_name",
      "candidate last name",
      "last"
    ]
  },
  email: {
    profileKey: "personal.email",
    synonyms: [
      "email",
      "email address",
      "e-mail",
      "electronic mail",
      "contact email"
    ]
  },
  phone: {
    profileKey: "personal.phone",
    synonyms: [
      "phone",
      "phone number",
      "mobile",
      "mobile number",
      "telephone",
      "contact number",
      "cell phone"
    ]
  },
  currentLocation: {
    profileKey: "personal.currentLocation",
    synonyms: [
      "current location",
      "city",
      "current city",
      "location",
      "where are you based"
    ]
  },
  address: {
    profileKey: "personal.address",
    synonyms: [
      "street address",
      "address",
      "residence address",
      "home address"
    ]
  },
  country: {
    profileKey: "personal.country",
    synonyms: [
      "country",
      "country of residence",
      "nationality",
      "location country"
    ]
  },
  linkedin: {
    profileKey: "personal.links.linkedin",
    synonyms: [
      "linkedin",
      "linkedin profile",
      "linkedin url",
      "linkedin link"
    ]
  },
  github: {
    profileKey: "personal.links.github",
    synonyms: [
      "github",
      "github profile",
      "github url",
      "github link"
    ]
  },
  portfolio: {
    profileKey: "personal.links.portfolio",
    synonyms: [
      "portfolio",
      "portfolio url",
      "website",
      "personal website",
      "portfolio link"
    ]
  },
  institution: {
    profileKey: "education.institution",
    synonyms: [
      "university",
      "college",
      "institution",
      "school",
      "university name",
      "college name"
    ]
  },
  degree: {
    profileKey: "education.degree",
    synonyms: [
      "degree",
      "degree type",
      "qualification",
      "education level"
    ]
  },
  fieldOfStudy: {
    profileKey: "education.fieldOfStudy",
    synonyms: [
      "field of study",
      "major",
      "branch",
      "specialization",
      "discipline"
    ]
  },
  cgpa: {
    profileKey: "education.cgpa",
    synonyms: [
      "cgpa",
      "gpa",
      "percentage",
      "marks",
      "grade point average"
    ]
  },
  willingToRelocate: {
    profileKey: "preferences.willingToRelocate",
    synonyms: [
      "willing to relocate",
      "open to relocation",
      "relocation preference",
      "are you willing to relocate"
    ]
  },
  preferredContactMethod: {
    profileKey: "preferences.preferredContactMethod",
    synonyms: [
      "preferred contact method",
      "how should we contact you",
      "preferred mode of communication",
      "contact preference"
    ]
  },
  workAuthorizationStatus: {
    profileKey: "preferences.workAuthorizationStatus",
    synonyms: [
      "work authorization",
      "legally authorized to work",
      "visa status",
      "sponsorship requirement",
      "do you require sponsorship"
    ],
    isSensitive: true
  }
};

export const SENSITIVE_KEYWORDS = [
  "work authorization",
  "sponsorship",
  "disability",
  "veteran",
  "race",
  "ethnicity",
  "gender",
  "criminal history",
  "legal status",
  "clearance",
  "ssn",
  "social security"
];
