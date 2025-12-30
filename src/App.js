import React, { useState, useEffect } from "react";
import {
  User,
  FileText,
  Plus,
  Edit,
  Trash2,
  Download,
  LogOut,
  CreditCard,
  Eye,
  EyeOff,
  Briefcase, // For Work Experience
  GraduationCap, // For Education
  Target, // For Career Objective
  Lightbulb, // For Skills
  Globe, // For Languages ← THIS ONE
  Award, // For Other Info
  Palette, // For Customize
  Download as DownloadIcon, // Alias to avoid conflict
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// REPLACE WITH YOUR SUPABASE CREDENTIALS
const supabaseUrl = "https://yfccopfkteoqopvraqkg.supabase.co"; // https://xxxxx.supabase.co
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmY2NvcGZrdGVvcW9wdnJhcWtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwODU1NzgsImV4cCI6MjA4MDY2MTU3OH0.NxbBgN-IV-qUwtwFpeyxEKQP2T-dJcwPEdJhq9s3UtA"; // eyJhbGci...

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function ResumeBuilderApp() {
  // STEP CONFIGURATION
  const RESUME_STEPS = [
    {
      id: "personal",
      label: "Personal Info",
      shortLabel: "Personal",
      icon: User, // Changed from emoji
      required: true,
      description: "Basic contact details",
    },
    {
      id: "experience",
      label: "Work Experience",
      shortLabel: "Experience",
      icon: Briefcase, // Changed from emoji
      required: false,
      multiEntry: true,
      description: "Employment history",
    },
    {
      id: "education",
      label: "Education",
      shortLabel: "Education",
      icon: GraduationCap, // Changed from emoji
      required: false,
      multiEntry: true,
      description: "Academic background",
    },
    {
      id: "objective",
      label: "Career Objective",
      shortLabel: "Objective",
      icon: Target, // Changed from emoji
      required: false,
      aiAssist: true,
      description: "Professional summary",
    },
    {
      id: "skills",
      label: "Skills",
      shortLabel: "Skills",
      icon: Lightbulb, // Changed from emoji
      required: false,
      aiAssist: true,
      description: "Technical & soft skills",
    },
    {
      id: "languages",
      label: "Languages",
      shortLabel: "Languages",
      icon: Globe, // Changed from emoji ← FIXED
      required: false,
      multiEntry: true,
      description: "Language proficiency",
    },
    {
      id: "other",
      label: "Other Info",
      shortLabel: "Other",
      icon: Award, // Changed from emoji
      required: false,
      description: "Awards, certifications, references",
    },
    {
      id: "customize",
      label: "Customize",
      shortLabel: "Customize",
      icon: Palette, // Changed from emoji
      required: false,
      description: "Choose template & preview",
    },
    {
      id: "download",
      label: "Download",
      shortLabel: "Download",
      icon: Download, // Changed from emoji
      required: false,
      description: "Export your resume",
    },
  ];

  // INITIAL FORM DATA STRUCTURE
  const INITIAL_FORM_DATA = {
    personalInfo: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      state: "",
      city: "",
      moreDetails: {
        postcode: "",
        nationality: "Malaysian",
        drivingLicence: "",
        dob: "",
        linkedin: "",
      },
    },

    workExperience: [
      // Will be empty array, user can add entries
    ],

    education: [
      // Will be empty array, user can add entries
    ],

    careerObjective: {
      targetPosition: "",
      summary: "",
    },

    skills: {
      technical: [],
      soft: [],
    },

    languages: [
      // Will be empty array, user can add entries
    ],

    otherInfo: {
      awards: [],
      certifications: [],
      employmentDetails: {
        expectedSalary: "",
        availability: "",
        workingHours: "",
        preferredLocation: "",
      },
      references: [],
    },

    customize: {
      selectedTemplate: "classic",
      sectionOrder: [],
    },
  };

  // HELPER: Create new work experience entry
  const createWorkExperienceEntry = () => ({
    id: Date.now().toString(),
    jobTitle: "",
    company: "",
    startDate: "",
    endDate: "",
    currentlyWorking: false,
    location: "",
    description: "",
    projects: "",
    achievements: "",
  });

  // HELPER: Create new education entry
  const createEducationEntry = () => ({
    id: Date.now().toString(),
    institution: "",
    degree: "",
    major: "",
    cgpa: "",
    city: "",
    state: "",
    startDate: "",
    endDate: "",
    currentlyStudying: false,
    moreDetails: {
      clubs: "",
      position: "",
      achievements: "",
    },
  });

  // HELPER: Create new language entry
  const createLanguageEntry = () => ({
    id: Date.now().toString(),
    language: "",
    level: "",
  });

  // HELPER: Create new award entry
  const createAwardEntry = () => ({
    id: Date.now().toString(),
    date: "",
    name: "",
  });

  // HELPER: Create new certification entry
  const createCertificationEntry = () => ({
    id: Date.now().toString(),
    date: "",
    name: "",
    provider: "",
  });

  // HELPER: Create new reference entry
  const createReferenceEntry = () => ({
    id: Date.now().toString(),
    name: "",
    position: "",
    company: "",
    phone: "",
    email: "",
  });

  // MIGRATION: Convert old flat format to new nested format
  const migrateOldFormat = (oldData) => {
    const newData = { ...INITIAL_FORM_DATA };

    // Migrate personal info
    if (oldData.fullName) {
      const nameParts = oldData.fullName.split(" ");
      newData.personalInfo.firstName = nameParts[0] || "";
      newData.personalInfo.lastName = nameParts.slice(1).join(" ") || "";
    }
    newData.personalInfo.email = oldData.email || "";
    newData.personalInfo.phone = oldData.phone || "";

    // Migrate work experience (convert text to array entry)
    if (oldData.experience) {
      newData.workExperience = [
        {
          id: Date.now().toString(),
          jobTitle: "",
          company: "",
          startDate: "",
          endDate: "",
          currentlyWorking: false,
          location: "",
          description: oldData.experience,
          projects: "",
          achievements: "",
        },
      ];
    }

    // Migrate education (convert text to array entry)
    if (oldData.education) {
      newData.education = [
        {
          id: Date.now().toString(),
          institution: "",
          degree: "",
          major: "",
          cgpa: "",
          city: "",
          state: "",
          startDate: "",
          endDate: "",
          currentlyStudying: false,
          moreDetails: {
            clubs: "",
            position: "",
            achievements: oldData.education,
          },
        },
      ];
    }

    // Migrate career objective
    if (oldData.summary) {
      newData.careerObjective.summary = oldData.summary;
    }

    // Migrate skills (convert comma-separated to array)
    if (oldData.skills) {
      const skillsList = oldData.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      newData.skills.technical = skillsList;
    }

    return newData;
  };
  // State declarations
  const [currentPage, setCurrentPage] = useState("public-builder"); // CHANGED from "login"
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [editingResume, setEditingResume] = useState(null);
  const [formData, setFormData] = useState(() => {
    // Try to load from localStorage first
    const saved = localStorage.getItem("temp_resume");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);

        // Check if it's old format (has fullName property)
        if (parsed.fullName) {
          return migrateOldFormat(parsed);
        }

        // Check if it's new format but missing personalInfo
        if (!parsed.personalInfo) {
          return INITIAL_FORM_DATA;
        }

        return parsed;
      } catch (e) {
        console.error("Error parsing saved data:", e);
        return INITIAL_FORM_DATA;
      }
    }

    // Default: Return fresh structure
    return INITIAL_FORM_DATA;
  });
  const [previewResume, setPreviewResume] = useState(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [emailCheckLoading, setEmailCheckLoading] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [authMode, setAuthMode] = useState("signin");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState("dashboard"); // dashboard, resumes, settings
  const [renamingId, setRenamingId] = useState(null);
  const [newName, setNewName] = useState("");
  const [localSettingsTab, setLocalSettingsTab] = useState("profile");
  const [localProfileData, setLocalProfileData] = useState({
    fullName: "",
    email: "",
  });
  const [localPasswordData, setLocalPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  const [showLogoutSuccess, setShowLogoutSuccess] = useState(false);

  // ADD ALERT STATES:
  const [alertModal, setAlertModal] = useState({
    show: false,
    type: "error", // error, success, warning
    title: "",
    message: "",
    onConfirm: null,
  });

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("loading"); // loading, success, error
  const [isSaving, setIsSaving] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeModal, setUpgradeModal] = useState({
    show: false,
    reason: "general",
  });
  const [deleteConfirm, setDeleteConfirm] = useState(null); // Store resume ID to delete
  const [turnstileToken, setTurnstileToken] = useState("");
  const [menuOpen, setMenuOpen] = useState(null); // Track which menu is open
  const renameInputRef = React.useRef(null);
  const [publicMode, setPublicMode] = useState(false); // Track if building without login
  const [tempResumeData, setTempResumeData] = useState(null); // Store temp data
  const [dashboardReady, setDashboardReady] = useState(false);

  // At top with other useEffects
  const [emailCheckTimeout, setEmailCheckTimeout] = useState(null);

  const [showPassword, setShowPassword] = useState(false);

  // MULTI-STEP FORM STATES
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [isSavingStep, setIsSavingStep] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [showPersonalDetails, setShowPersonalDetails] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  // UI STATE FOR WORK EXPERIENCE ACCORDION
  const [expandedExperience, setExpandedExperience] = useState(null); // Track which experience is expanded
  const [isFocused, setIsFocused] = useState(false); // Start date input focus
  const [isEndFocused, setIsEndFocused] = useState(false); // End date input focus

  // AUTO-SAVE ON FORM DATA CHANGE
  useEffect(() => {
    // Debounce auto-save to avoid too many saves
    const timeoutId = setTimeout(() => {
      if (currentPage === "public-builder" || currentPage === "editor") {
        handleAutoSave();
      }
    }, 3000); // Save 3 second after user stops typing

    return () => clearTimeout(timeoutId);
  }, [formData]); // Trigger when formData changes

  // Check user on mount
  useEffect(() => {
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // Only react to actual auth events, not manual page changes
        if (event === "SIGNED_IN" && session?.user) {
          setUser(session.user);
        } else if (event === "SIGNED_OUT") {
          // DON'T auto redirect on signout
          // Let handleLogout handle it
          setUser(null);
          setProfile(null);
        }
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []); // Empty dependency - run once only

  // ADD THIS NEW useEffect FOR TURNSTILE
  useEffect(() => {
    const handleTurnstileSuccess = (e) => {
      setTurnstileToken(e.detail);
    };

    window.addEventListener("turnstile-success", handleTurnstileSuccess);

    return () => {
      window.removeEventListener("turnstile-success", handleTurnstileSuccess);
    };
  }, []);

  // EMAIL VALIDATION FUNCTION
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const checkEmailExists = async (email) => {
    if (!validateEmail(email)) {
      setEmailExists(false);
      return;
    }

    setEmailCheckLoading(true);

    try {
      // Hanya gunakan RPC. Jangan gunakan signInWithPassword untuk check emel.
      const { data, error } = await supabase.rpc("check_email_exists", {
        email_to_check: email,
      });

      if (error) {
        // Jika RPC error atau tak wujud, jangan set emailExists sebagai true secara melulu
        console.error("RPC Error:", error.message);
        setEmailExists(false);
      } else {
        // Data adalah boolean (true/false) dari Postgres function
        setEmailExists(data === true);
      }
    } catch (err) {
      console.error("Email check error:", err);
      setEmailExists(false);
    }

    setEmailCheckLoading(false);
  };

  const checkUser = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Check if user is in password reset mode
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    if (hashParams.get("type") === "recovery") {
      setCurrentPage("reset-password");
      setLoading(false);
      return;
    }

    // If user already logged in, go to dashboard
    if (session?.user) {
      setUser(session.user);
      await loadUserData(session.user.id);
      setCurrentPage("dashboard");
    } else {
      // Default: Show public builder (no login required)
      setCurrentPage("public-builder");
    }

    setLoading(false);
  };

  const loadUserData = async (userId) => {
    setDashboardReady(false);
    const { data: localProfileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (localProfileData) {
      setProfile(localProfileData);
    }

    const { data: resumesData } = await supabase
      .from("resumes")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    // Filter out any null/undefined items just in case
    const validResumes = (resumesData || []).filter(
      (r) => r !== null && r !== undefined
    );
    setResumes(validResumes);
    setDashboardReady(true);
  };

  const handleGoogleLogin = async () => {
    // Save pending resume before redirect
    if (tempResumeData) {
      localStorage.setItem("pending_resume", JSON.stringify(tempResumeData));
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) alert("Error: " + error.message);
  };

  const handleEmailLogin = async () => {
    // VALIDATE EMAIL FORMAT FIRST
    if (!loginEmail || !validateEmail(loginEmail)) {
      setAlertModal({
        show: true,
        type: "error",
        title: "Email Tidak Sah",
        message: "Sila masukkan alamat email yang sah (contoh: nama@email.com)",
        onConfirm: null,
      });
      return;
    }
    // VALIDATE PASSWORD
    if (!loginPassword || loginPassword.length < 6) {
      setAlertModal({
        show: true,
        type: "warning",
        title: "Password Diperlukan",
        message: "Password mesti sekurang-kurangnya 6 aksara",
        onConfirm: null,
      });
      return;
    }
    setLoading(true);

    if (authMode === "signin") {
      setLoadingMessage("Signing in..."); // SET MESSAGE

      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });
      if (error) {
        setAlertModal({
          show: true,
          type: "error",
          title: "Login Gagal",
          message: error.message,
          onConfirm: null,
        });
        setLoading(false);
        setLoadingMessage(""); // CLEAR
      } else if (data.user) {
        setUser(data.user);

        setLoadingMessage("Loading your data..."); // UPDATE
        await loadUserData(data.user.id);

        const pendingResume = localStorage.getItem("pending_resume");
        if (pendingResume) {
          setLoadingMessage("Saving your resume..."); // UPDATE

          const resumeData = JSON.parse(pendingResume);

          const { data: profileData } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", data.user.id)
            .single();

          const { data: existingResumes } = await supabase
            .from("resumes")
            .select("id")
            .eq("user_id", data.user.id);

          const resumeCount = existingResumes?.length || 0;

          if (profileData?.plan_type === "pro" || resumeCount === 0) {
            await supabase.from("resumes").insert([
              {
                user_id: data.user.id,
                full_name: resumeData.fullName,
                email: resumeData.email,
                phone: resumeData.phone,
                summary: resumeData.summary || "",
                experience: resumeData.experience || "",
                education: resumeData.education || "",
                skills: resumeData.skills || "",
                resume_title: `${resumeData.fullName}'s Resume`,
              },
            ]);

            setLoadingMessage("Loading your dashboard..."); // UPDATE
            await loadUserData(data.user.id);
          }

          localStorage.removeItem("pending_resume");
        }

        setCurrentPage("dashboard");
        setLoading(false);
        setLoadingMessage(""); // CLEAR
      }
    } else {
      // Sign up flow
      setLoadingMessage("Creating your account. This may take a moment...");

      const { data, error } = await supabase.auth.signUp({
        email: loginEmail,
        password: loginPassword,
      });

      if (data?.user) {
        setLoadingMessage("Preparing your dashboard...");
      }

      if (error) {
        setAlertModal({
          show: true,
          type: "error",
          title: "Pendaftaran Gagal",
          message: error.message,
          onConfirm: null,
        });
        setLoading(false);
        setLoadingMessage("");
        return;
      }

      if (!data?.user) return;

      // ✅ SET USER (OK, tapi JANGAN load dashboard di sini)
      setUser(data.user);

      // =======================
      // JANGAN loadUserData DI SINI ❌
      // =======================

      setLoadingMessage("Saving your resume...");

      // CHECK FOR PENDING RESUME
      const pendingResume = localStorage.getItem("pending_resume");

      if (pendingResume) {
        const resumeData = JSON.parse(pendingResume);

        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single();

        const { data: existingResumes } = await supabase
          .from("resumes")
          .select("id")
          .eq("user_id", data.user.id);

        const resumeCount = existingResumes?.length || 0;

        if (profileData?.plan_type === "pro" || resumeCount === 0) {
          await supabase.from("resumes").insert([
            {
              user_id: data.user.id,
              full_name: resumeData.fullName,
              email: resumeData.email,
              phone: resumeData.phone,
              summary: resumeData.summary || "",
              experience: resumeData.experience || "",
              education: resumeData.education || "",
              skills: resumeData.skills || "",
              resume_title: `${resumeData.fullName}'s Resume`,
            },
          ]);
        }

        localStorage.removeItem("pending_resume");
      }

      // =======================
      // ✅ LOAD DATA SEKALI SAHAJA (LEPAS SEMUA INSERT SIAP)
      // =======================
      setLoadingMessage("Preparing your dashboard...");
      await loadUserData(data.user.id);

      // =======================
      // ✅ MASUK DASHBOARD SELEPAS DATA FINAL
      // =======================
      setCurrentPage("dashboard");

      setLoading(false);
      setLoadingMessage("");
    }

    setTurnstileToken("");
  };

  const handleForgotPassword = async () => {
    if (!loginEmail) {
      // REPLACED: alert("Please enter your email");
      setAlertModal({
        show: true,
        type: "warning",
        title: "Email Diperlukan",
        message: "Sila masukkan alamat email anda",
        onConfirm: null,
      });
      return;
    }
    // ADD EMAIL FORMAT VALIDATION
    if (!validateEmail(loginEmail)) {
      setAlertModal({
        show: true,
        type: "error",
        title: "Email Tidak Sah",
        message: "Sila masukkan alamat email yang sah (contoh: nama@email.com)",
        onConfirm: null,
      });
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(loginEmail, {
      redirectTo: window.location.origin + "/reset-password",
    });

    if (error) {
      // REPLACED: alert("Error: " + error.message);
      setAlertModal({
        show: true,
        type: "error",
        title: "Ralat",
        message: error.message,
        onConfirm: null,
      });
    } else {
      // REPLACED: alert("Password reset link sent! Check your email.");
      setAlertModal({
        show: true,
        type: "success",
        title: "Email Telah Dihantar",
        message:
          "Link reset password telah dihantar ke email anda. Sila semak inbox.",
        onConfirm: null,
      });
      setAuthMode("signin");
    }
    setLoading(false);
  };

  const handleSaveResume = async () => {
    if (!formData.fullName || !formData.email || !formData.phone) {
      // REPLACED: alert("Please fill required fields");
      setAlertModal({
        show: true,
        type: "warning",
        title: "Maklumat Tidak Lengkap",
        message: "Sila isi nama, email dan nombor telefon",
        onConfirm: null,
      });
      return;
    }
    // ADD EMAIL FORMAT VALIDATION
    if (!validateEmail(formData.email)) {
      setAlertModal({
        show: true,
        type: "error",
        title: "Email Tidak Sah",
        message: "Sila masukkan alamat email yang sah (contoh: nama@email.com)",
        onConfirm: null,
      });
      return;
    }

    setLoading(true);

    const resumeData = {
      user_id: user.id,
      full_name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      summary: formData.summary || "",
      experience: formData.experience || "",
      education: formData.education || "",
      skills: formData.skills || "",
      resume_title:
        editingResume?.resume_title || `${formData.fullName}'s Resume`, // Add default title
      updated_at: new Date().toISOString(),
    };

    if (editingResume) {
      const { error } = await supabase
        .from("resumes")
        .update(resumeData)
        .eq("id", editingResume.id);

      if (error) {
        // REPLACED: alert("Error updating resume: " + error.message);
        setAlertModal({
          show: true,
          type: "error",
          title: "Gagal Kemaskini",
          message: "Ralat semasa kemaskini resume: " + error.message,
          onConfirm: null,
        });
      } else {
        await loadUserData(user.id);
        setEditingResume(null);
        // Reset state ke asal
        setFormData(INITIAL_FORM_DATA);
        setCompletedSteps([]);
        setCurrentStep(0);
        setShowErrors(false);
        setCurrentPage("dashboard");
      }
    } else {
      if (profile?.plan_type === "free" && resumes.length >= 1) {
        // REPLACED: alert("Free plan: Maximum 1 resume. Upgrade to Pro!");
        setAlertModal({
          show: true,
          type: "warning",
          title: "Had Resume Percuma",
          message:
            "Pelan percuma hanya membenarkan 1 resume. Upgrade ke Pro untuk resume tanpa had!",
          onConfirm: null,
        });
        setLoading(false);
        return;
      }

      const { error } = await supabase.from("resumes").insert([resumeData]);

      if (error) {
        // REPLACED: alert("Error creating resume: " + error.message);
        setAlertModal({
          show: true,
          type: "error",
          title: "Gagal Simpan",
          message: "Ralat semasa simpan resume: " + error.message,
          onConfirm: null,
        });
      } else {
        await loadUserData(user.id);
        // Reset state ke asal
        setFormData(INITIAL_FORM_DATA);
        setCompletedSteps([]);
        setCurrentStep(0);
        setShowErrors(false);
        setCurrentPage("dashboard");
      }
    }
    setLoading(false);
  };

  const handleDeleteConfirmed = async () => {
    if (!deleteConfirm) return;

    setLoading(true);
    const { error } = await supabase
      .from("resumes")
      .delete()
      .eq("id", deleteConfirm.id);

    if (error) {
      // REPLACED: alert("Error deleting resume: " + error.message);
      setAlertModal({
        show: true,
        type: "error",
        title: "Gagal Padam",
        message: "Ralat semasa padam resume: " + error.message,
        onConfirm: null,
      });
    } else {
      await loadUserData(user.id);
    }
    setDeleteConfirm(null);
    setLoading(false);
  };

  const handlePreviewPDF = (resume) => {
    setPreviewResume(resume);
    setCurrentPage("preview");
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  // STEP NAVIGATION HANDLERS
  const handleStepClick = (stepIndex) => {
    // Jika nak pergi ke step depan (lebih dari 0) tapi Personal Info tak lengkap
    if (stepIndex > 0 && !canProceedFromPersonalInfo()) {
      setShowErrors(true);
      setAlertModal({
        show: true,
        type: "warning",
        title: "Maklumat Tidak Lengkap",
        message:
          "Sila lengkapkan maklumat peribadi yang wajib (Nama, Email, Telefon) sebelum ke bahagian lain.",
        onClose: () => {
          setAlertModal({ ...alertModal, show: false });
          setShowErrors(true); // Aktifkan border merah
        },
      });
      return; // Stop navigation
    }

    // NEW: Auto-expand first work experience when navigating to that step
    if (
      stepIndex === 1 &&
      formData.workExperience.length > 0 &&
      !expandedExperience
    ) {
      setExpandedExperience(formData.workExperience[0].id);
    }

    setCurrentStep(stepIndex);
    handleAutoSave();
  };

  const handleNextStep = () => {
    if (currentStep < RESUME_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      handleAutoSave();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      handleAutoSave();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // When saving
  const handleAutoSave = () => {
    try {
      // Save to localStorage
      localStorage.setItem("temp_resume", JSON.stringify(formData));

      // Show saved indicator (update time only)
      const timeString = new Date().toLocaleTimeString("en-MY", {
        hour: "2-digit",
        minute: "2-digit",
      });
      setLastSaved(timeString);

      // Auto-hide indicator after 5 seconds
      setTimeout(() => {
        setLastSaved(null);
      }, 5000);
    } catch (error) {
      console.error("Auto-save error:", error);
    }
  };

  // FORM DATA UPDATE HELPERS
  const updatePersonalInfo = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value,
      },
    }));
  };

  const updatePersonalInfoDetails = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        moreDetails: {
          ...prev.personalInfo.moreDetails,
          [field]: value,
        },
      },
    }));
  };

  const addWorkExperience = () => {
    const newEntry = createWorkExperienceEntry();
    setFormData((prev) => ({
      ...prev,
      workExperience: [...prev.workExperience, newEntry],
    }));

    // Auto-expand the new entry
    setExpandedExperience(newEntry.id);

    return newEntry;
  };

  const updateWorkExperience = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      workExperience: prev.workExperience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  const removeWorkExperience = (id) => {
    setFormData((prev) => ({
      ...prev,
      workExperience: prev.workExperience.filter((exp) => exp.id !== id),
    }));
  };

  const addEducation = () => {
    setFormData((prev) => ({
      ...prev,
      education: [...prev.education, createEducationEntry()],
    }));
  };

  const updateEducation = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    }));
  };

  const updateEducationDetails = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.map((edu) =>
        edu.id === id
          ? {
              ...edu,
              moreDetails: { ...edu.moreDetails, [field]: value },
            }
          : edu
      ),
    }));
  };

  const removeEducation = (id) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }));
  };

  const updateCareerObjective = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      careerObjective: {
        ...prev.careerObjective,
        [field]: value,
      },
    }));
  };

  const addSkill = (type, skill) => {
    setFormData((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        [type]: [...prev.skills[type], skill],
      },
    }));
  };

  const removeSkill = (type, index) => {
    setFormData((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        [type]: prev.skills[type].filter((_, i) => i !== index),
      },
    }));
  };

  const addLanguage = () => {
    setFormData((prev) => ({
      ...prev,
      languages: [...prev.languages, createLanguageEntry()],
    }));
  };

  const updateLanguage = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.map((lang) =>
        lang.id === id ? { ...lang, [field]: value } : lang
      ),
    }));
  };

  const removeLanguage = (id) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.filter((lang) => lang.id !== id),
    }));
  };

  // Add similar helpers for awards, certifications, references
  const addAward = () => {
    setFormData((prev) => ({
      ...prev,
      otherInfo: {
        ...prev.otherInfo,
        awards: [...prev.otherInfo.awards, createAwardEntry()],
      },
    }));
  };

  const updateAward = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      otherInfo: {
        ...prev.otherInfo,
        awards: prev.otherInfo.awards.map((award) =>
          award.id === id ? { ...award, [field]: value } : award
        ),
      },
    }));
  };

  const removeAward = (id) => {
    setFormData((prev) => ({
      ...prev,
      otherInfo: {
        ...prev.otherInfo,
        awards: prev.otherInfo.awards.filter((award) => award.id !== id),
      },
    }));
  };

  // Similar for certifications
  const addCertification = () => {
    setFormData((prev) => ({
      ...prev,
      otherInfo: {
        ...prev.otherInfo,
        certifications: [
          ...prev.otherInfo.certifications,
          createCertificationEntry(),
        ],
      },
    }));
  };

  const updateCertification = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      otherInfo: {
        ...prev.otherInfo,
        certifications: prev.otherInfo.certifications.map((cert) =>
          cert.id === id ? { ...cert, [field]: value } : cert
        ),
      },
    }));
  };

  const removeCertification = (id) => {
    setFormData((prev) => ({
      ...prev,
      otherInfo: {
        ...prev.otherInfo,
        certifications: prev.otherInfo.certifications.filter(
          (cert) => cert.id !== id
        ),
      },
    }));
  };

  // Similar for references
  const addReference = () => {
    setFormData((prev) => ({
      ...prev,
      otherInfo: {
        ...prev.otherInfo,
        references: [...prev.otherInfo.references, createReferenceEntry()],
      },
    }));
  };

  const updateReference = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      otherInfo: {
        ...prev.otherInfo,
        references: prev.otherInfo.references.map((ref) =>
          ref.id === id ? { ...ref, [field]: value } : ref
        ),
      },
    }));
  };

  const removeReference = (id) => {
    setFormData((prev) => ({
      ...prev,
      otherInfo: {
        ...prev.otherInfo,
        references: prev.otherInfo.references.filter((ref) => ref.id !== id),
      },
    }));
  };

  const updateEmploymentDetails = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      otherInfo: {
        ...prev.otherInfo,
        employmentDetails: {
          ...prev.otherInfo.employmentDetails,
          [field]: value,
        },
      },
    }));
  };

  const markStepComplete = (stepId) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    }
  };

  const handleLogout = async () => {
    // Sign out from Supabase
    await supabase.auth.signOut();

    // Clear all user data
    setUser(null);
    setProfile(null);
    setResumes(null);

    // Clear form data - MAKE SURE THIS IS HERE
    setFormData(INITIAL_FORM_DATA);
    setTempResumeData(null);
    setEditingResume(null);
    setPreviewResume(null);

    setCompletedSteps([]); // <--- TAMBAH INI untuk reset progress ke 0%
    setCurrentStep(0); // <--- TAMBAH INI untuk balik ke step pertama
    setShowErrors(false);

    // ADD: Clear modal states
    setShowRegisterModal(false);
    setShowDownloadModal(false);
    setAlertModal({
      show: false,
      type: "error",
      title: "",
      message: "",
      onConfirm: null,
    });

    // Clear localStorage
    localStorage.removeItem("pending_resume");
    localStorage.removeItem("temp_resume");

    // Show logout success page
    setCurrentPage("logout-success");
  };

  // ALERT MODAL COMPONENT
  const AlertModal = ({ show, type, title, message, onClose, onConfirm }) => {
    if (!show) return null;

    const getIcon = () => {
      if (type === "error") {
        return (
          <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        );
      }
      if (type === "success") {
        return (
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        );
      }
      if (type === "warning") {
        return (
          <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-yellow-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        );
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
          <div className="p-6">
            {getIcon()}

            <h3 className="text-xl font-bold text-gray-800 text-center mb-2">
              {title}
            </h3>
            <p className="text-gray-600 text-center mb-6">{message}</p>

            <div className="flex gap-3">
              {onConfirm ? (
                <>
                  <button
                    onClick={onClose}
                    className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
                  >
                    Batal
                  </button>
                  <button
                    onClick={onConfirm}
                    className={`flex-1 py-3 rounded-lg font-semibold transition ${
                      type === "error"
                        ? "bg-red-600 text-white hover:bg-red-700"
                        : "bg-indigo-600 text-white hover:bg-indigo-700"
                    }`}
                  >
                    OK
                  </button>
                </>
              ) : (
                <button
                  onClick={onClose}
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
                >
                  OK
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // STEPPER COMPONENT
  const StepperNavigation = ({
    currentStep,
    steps,
    onStepClick,
    completedSteps,
  }) => {
    const isMobile = window.innerWidth < 768;

    return (
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Progress: {completedSteps.length}/{steps.length} sections
              </span>
              <span className="text-sm font-semibold text-indigo-600">
                {Math.round((completedSteps.length / steps.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${(completedSteps.length / steps.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Stepper */}
          <div className="relative">
            {/* Desktop: Horizontal Stepper */}
            <div className="hidden md:flex items-center justify-between">
              {steps.map((step, index) => {
                const isActive = currentStep === index;
                const isCompleted = completedSteps.includes(step.id);
                // Boleh klik jika:
                // 1. Nak balik ke step belakang (index < currentStep)
                // 2. Personal Info dah lengkap
                const isClickable =
                  index <= currentStep ||
                  (currentStep === 0 ? canProceedFromPersonalInfo() : true);

                return (
                  <div key={step.id} className="flex items-center flex-1">
                    {/* Step Circle */}
                    <button
                      onClick={() => isClickable && onStepClick(index)}
                      disabled={!isClickable}
                      className={`flex flex-col items-center min-w-0 ${
                        isClickable
                          ? "cursor-pointer"
                          : "cursor-not-allowed opacity-50"
                      }`}
                    >
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all mb-2 ${
                          // Completed step = green tick (highest priority)
                          isCompleted
                            ? "bg-green-500 text-white"
                            : // Preview tick (experience / personal with data)
                            (step.id === "experience" &&
                                formData.workExperience?.some(
                                  (exp) => exp.jobTitle || exp.company
                                )) ||
                              (step.id === "personal" &&
                                formData.personalInfo &&
                                formData.personalInfo.firstName?.trim() &&
                                formData.personalInfo.lastName?.trim() &&
                                formData.personalInfo.email?.trim() &&
                                formData.personalInfo.phone?.trim())
                            ? "bg-green-500 text-white ring-4 ring-indigo-100"
                            : // Active step (ONLY if no preview / no completed)
                            isActive
                            ? "bg-indigo-600 text-white ring-4 ring-indigo-100"
                            : // Default inactive empty
                              "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {isCompleted ? (
                          "✓"
                        ) : (step.id === "experience" &&
                            formData.workExperience?.some(
                              (exp) => exp.jobTitle || exp.company
                            )) ||
                          (step.id === "personal" &&
                            formData.personalInfo &&
                            formData.personalInfo.firstName?.trim() &&
                            formData.personalInfo.lastName?.trim() &&
                            formData.personalInfo.email?.trim() &&
                            formData.personalInfo.phone?.trim()) ? (
                          <span className="text-lg font-bold leading-none">
                            ✓
                          </span>
                        ) : (
                          <step.icon className="w-6 h-6" />
                        )}
                      </div>

                      <span
                        className={`text-xs font-medium text-center ${
                          isActive
                            ? "text-indigo-600"
                            : isCompleted
                            ? "text-green-600"
                            : "text-gray-500"
                        }`}
                      >
                        {step.shortLabel}
                      </span>
                    </button>

                    {/* Connector Line */}
                    {index < steps.length - 1 && (
                      <div
                        className="flex-1 h-1 mx-2 relative"
                        style={{ top: "-20px" }}
                      >
                        <div
                          className={`h-full rounded transition-all ${
                            completedSteps.includes(steps[index + 1].id)
                              ? "bg-green-500"
                              : isActive
                              ? "bg-indigo-600"
                              : "bg-gray-200"
                          }`}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Mobile: Horizontal Scroll Stepper */}
            <div className="md:hidden overflow-x-auto scrollbar-hide">
              <div
                className="flex items-center gap-3 pb-2"
                style={{ minWidth: "max-content" }}
              >
                {steps.map((step, index) => {
                  const isActive = currentStep === index;
                  const isCompleted = completedSteps.includes(step.id);

                  return (
                    <button
                      key={step.id}
                      onClick={() => {
                        // Tambah logic check di sini juga untuk mobile
                        const canClick =
                          index <= currentStep ||
                          (currentStep === 0
                            ? canProceedFromPersonalInfo()
                            : true);
                        if (canClick) {
                          onStepClick(index);
                        } else {
                          // Panggil alert yang sama
                          setAlertModal({
                            show: true,
                            type: "warning",
                            title: "Maklumat Tidak Lengkap",
                            message: "Sila lengkapkan maklumat peribadi dulu.",
                            onConfirm: null,
                          });
                        }
                      }}
                      className={`flex flex-col items-center min-w-[70px] ${
                        isActive ? "scale-110" : ""
                      } transition-transform`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-lg mb-1 ${
                          isActive
                            ? "bg-indigo-600 text-white ring-2 ring-indigo-100"
                            : isCompleted
                            ? "bg-green-500 text-white"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {isCompleted ? (
                          "✓"
                        ) : (
                          <step.icon className="w-5 h-5" /> // Changed from {step.icon}
                        )}
                      </div>
                      <span
                        className={`text-xs font-medium text-center ${
                          isActive
                            ? "text-indigo-600"
                            : isCompleted
                            ? "text-green-600"
                            : "text-gray-500"
                        }`}
                      >
                        {step.shortLabel}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Current Step Info */}
          <div className="mt-4 text-center">
            <h2 className="text-xl font-bold text-gray-800">
              {steps[currentStep].label}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {steps[currentStep].description}
            </p>
          </div>
        </div>

        {/* Floating Auto-save Indicator - Static version */}
        {lastSaved && (
          <div className="fixed bottom-6 right-6 bg-white border-2 border-green-500 rounded-full px-4 py-2 shadow-lg flex items-center gap-2 text-sm font-medium text-gray-700 z-50">
            <svg
              className="w-5 h-5 text-green-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="hidden sm:inline">Saved</span>
            <span className="text-xs text-gray-500">{lastSaved}</span>
          </div>
        )}
      </div>
    );
  };

  // VALIDATION HELPERS
  const validatePersonalInfo = (data) => {
    const errors = [];

    if (!data.firstName?.trim()) errors.push("First name is required");
    if (!data.lastName?.trim()) errors.push("Last name is required");
    if (!data.email?.trim()) errors.push("Email is required");
    else if (!validateEmail(data.email)) errors.push("Email format is invalid");
    if (!data.phone?.trim()) errors.push("Phone number is required");

    return errors;
  };

  const canProceedFromPersonalInfo = () => {
    return validatePersonalInfo(formData.personalInfo).length === 0;
  };

  // PERSONAL INFO SECTION COMPONENT
  const PersonalInfoSection = ({
    data,
    onUpdate,
    onUpdateDetails,
    showMoreDetails,
    setShowMoreDetails,
    showErrors,
  }) => {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-indigo-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            Personal Information
          </h3>
          <p className="text-gray-600">
            Let's start with your basic contact details
          </p>
        </div>

        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={data.firstName}
              onChange={(e) => {
                const value = e.target.value;
                const capitalized =
                  value.charAt(0).toUpperCase() + value.slice(1);
                onUpdate("firstName", capitalized);
              }}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${
                showErrors && !data.firstName
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300"
              }`}
              placeholder="Ahmad"
            />
            {showErrors && !data.firstName && (
              <p className="text-xs text-red-600 mt-1">
                Please enter your first name
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={data.lastName}
              onChange={(e) => {
                const value = e.target.value;
                const capitalized =
                  value.charAt(0).toUpperCase() + value.slice(1);
                onUpdate("lastName", capitalized);
              }}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${
                showErrors && !data.lastName
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300"
              }`}
              placeholder="Bin Ali"
            />
            {showErrors && !data.lastName && (
              <p className="text-xs text-red-600 mt-1">
                Please enter your last name
              </p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => onUpdate("email", e.target.value.toLowerCase())}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${
              (showErrors && !data.email) ||
              (data.email && !validateEmail(data.email))
                ? "border-red-500 bg-red-50"
                : "border-gray-300"
            }`}
            placeholder="ahmad@example.com"
          />
          {showErrors && !data.email && (
            <p className="text-xs text-red-600 mt-1">
              Please enter your email address
            </p>
          )}
          {data.email && !validateEmail(data.email) && (
            <p className="text-xs text-red-600 mt-1">
              Please enter a valid email format
            </p>
          )}
        </div>

        {/* Phone */}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={data.phone}
            onChange={(e) => {
              const value = e.target.value;
              const capitalized =
                value.charAt(0).toUpperCase() + value.slice(1);
              onUpdate("phone", capitalized);
            }}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${
              showErrors && !data.phone
                ? "border-red-500 bg-red-50"
                : "border-gray-300"
            }`}
            placeholder="+60 12-345 6789"
          />
          {showErrors && !data.phone && (
            <p className="text-xs text-red-600 mt-1">
              Please enter your phone number
            </p>
          )}
        </div>

        {/* Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State
            </label>
            <select
              value={data.state}
              onChange={(e) => {
                onUpdate("state", e.target.value);
                onUpdate("city", ""); // Reset city when state changes
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            >
              <option value="">Select State</option>
              <option value="Johor">Johor</option>
              <option value="Kedah">Kedah</option>
              <option value="Kelantan">Kelantan</option>
              <option value="Melaka">Melaka</option>
              <option value="Negeri Sembilan">Negeri Sembilan</option>
              <option value="Pahang">Pahang</option>
              <option value="Penang">Penang</option>
              <option value="Perak">Perak</option>
              <option value="Perlis">Perlis</option>
              <option value="Sabah">Sabah</option>
              <option value="Sarawak">Sarawak</option>
              <option value="Selangor">Selangor</option>
              <option value="Terengganu">Terengganu</option>
              <option value="Kuala Lumpur">Kuala Lumpur</option>
              <option value="Labuan">Labuan</option>
              <option value="Putrajaya">Putrajaya</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>
            <input
              type="text"
              value={data.city}
              onChange={(e) => onUpdate("city", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              placeholder={data.state ? "Enter city" : "Select state first"}
              disabled={!data.state}
            />
          </div>
        </div>

        {/* More Details Toggle */}
        <div className="pt-4 border-t">
          <button
            type="button"
            onClick={() => setShowMoreDetails(!showMoreDetails)}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold transition"
          >
            <svg
              className={`w-5 h-5 transition-transform ${
                showMoreDetails ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
            {showMoreDetails ? "Hide" : "Show"} More Details (Optional)
          </button>
        </div>

        {/* More Details Section */}
        {showMoreDetails && (
          <div className="space-y-6 pt-4 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Postcode
                </label>
                <input
                  type="text"
                  value={data?.moreDetails?.postcode || ""}
                  onChange={(e) => onUpdateDetails("postcode", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  placeholder="93350"
                  maxLength={5}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nationality
                </label>
                <select
                  value={data?.moreDetails?.nationality || "Malaysian"}
                  onChange={(e) =>
                    onUpdateDetails("nationality", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                >
                  <option value="Malaysian">Malaysian</option>
                  <option value="Permanent Resident">Permanent Resident</option>
                  <option value="Foreigner">Foreigner</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Driving Licence
                </label>
                <input
                  type="text"
                  value={data?.moreDetails?.drivingLicence || ""}
                  onChange={(e) =>
                    onUpdateDetails(
                      "drivingLicence",
                      e.target.value.toUpperCase()
                    )
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  placeholder="B, D (Optional)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={data?.moreDetails?.dob || ""}
                  onChange={(e) => onUpdateDetails("dob", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  max={new Date().toISOString().split("T")[0]}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                LinkedIn Profile
              </label>
              <input
                type="url"
                value={data?.moreDetails?.linkedin || ""}
                onChange={(e) => onUpdateDetails("linkedin", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                placeholder="https://linkedin.com/in/yourprofile"
              />
              {data.moreDetails.linkedin &&
                !data.moreDetails.linkedin.includes("linkedin.com") && (
                  <p className="text-xs text-yellow-600 mt-1">
                    ⚠️ Make sure this is a valid LinkedIn URL
                  </p>
                )}
            </div>
          </div>
        )}

        {/* Help Text */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
          <p className="text-sm text-blue-800">
            💡 <strong>Tip:</strong> Fields marked with{" "}
            <span className="text-red-500">*</span> are required. Complete all
            required fields to proceed to the next section.
          </p>
        </div>
      </div>
    );
  };

  // WORK EXPERIENCE SECTION COMPONENT
  const WorkExperienceSection = ({
    experiences,
    onAdd,
    onUpdate,
    onRemove,
    expandedId,
    setExpandedId,
  }) => {
    const toggleExpand = (id) => {
      setExpandedId(expandedId === id ? null : id);
    };

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-8 h-8 text-indigo-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            Work Experience
          </h3>
          <p className="text-gray-600">
            Add your employment history and achievements
          </p>
        </div>

        {/* Empty State */}
        {experiences.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
            <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-800 mb-2">
              No work experience added yet
            </h4>
            <p className="text-gray-600 mb-6">
              Add your first job to get started
            </p>
            <button
              onClick={onAdd} // Simple call, no setTimeout
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              <Plus className="w-5 h-5" />
              Add Work Experience
            </button>
          </div>
        )}

        {/* Experience Entries */}
        {experiences.map((exp, index) => {
          const isExpanded = expandedId === exp.id;
          const hasContent = exp.jobTitle || exp.company;

          return (
            <div
              key={exp.id}
              className={`bg-white border-2 rounded-xl transition-all ${
                isExpanded
                  ? "border-indigo-300 shadow-md"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              {/* Collapsed Bar / Header */}
              <div
                className={`flex items-center justify-between p-4 cursor-pointer ${
                  !isExpanded && "hover:bg-gray-50"
                }`}
                onClick={() => toggleExpand(exp.id)}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isExpanded ? "bg-indigo-100" : "bg-gray-100"
                    }`}
                  >
                    <Briefcase
                      className={`w-5 h-5 ${
                        isExpanded ? "text-indigo-600" : "text-gray-600"
                      }`}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    {hasContent ? (
                      <p className="font-semibold text-gray-800 truncate">
                        {exp.jobTitle || "Untitled Position"}
                        {exp.company && (
                          <span className="text-gray-600 font-normal">
                            , {exp.company}
                          </span>
                        )}
                      </p>
                    ) : (
                      <p className="text-gray-500 italic">
                        Experience #{index + 1} (Not filled yet)
                      </p>
                    )}

                    {/* Show dates in collapsed view if available */}
                    {!isExpanded && (exp.startDate || exp.endDate) && (
                      <p className="text-xs text-gray-500 mt-1">
                        {exp.startDate &&
                          new Date(exp.startDate + "-01").toLocaleDateString(
                            "en-US",
                            { year: "numeric", month: "short" }
                          )}
                        {" - "}
                        {exp.currentlyWorking
                          ? "Present"
                          : exp.endDate
                          ? new Date(exp.endDate + "-01").toLocaleDateString(
                              "en-US",
                              { year: "numeric", month: "short" }
                            )
                          : "Present"}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Delete Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(exp.id);
                    }}
                    className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition"
                    title="Remove this experience"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>

                  {/* Expand/Collapse Icon */}
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="p-6 pt-0 space-y-4 animate-fade-in">
                  {/* Job Title & Company */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Job Title
                      </label>
                      <input
                        type="text"
                        value={exp.jobTitle}
                        onChange={(e) =>
                          onUpdate(exp.id, "jobTitle", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                        placeholder="e.g., IT Executive"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company
                      </label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) =>
                          onUpdate(exp.id, "company", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                        placeholder="e.g., ABC Sdn Bhd"
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={exp.location}
                      onChange={(e) =>
                        onUpdate(exp.id, "location", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                      placeholder="e.g., Kuala Lumpur, Malaysia"
                    />
                  </div>

                  {/* Dates with Calendar Icon */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date
                      </label>

                      <div className="relative">
                        <input
                          type="month"
                          value={exp.startDate}
                          onChange={(e) =>
                            onUpdate(exp.id, "startDate", e.target.value)
                          }
                          onFocus={() => setIsFocused(true)}
                          onBlur={() => setIsFocused(false)}
                          className={`w-full px-4 py-3 border border-gray-300 rounded-lg
        focus:ring-2 focus:ring-indigo-500 focus:border-transparent
        transition appearance-none
        ${!exp.startDate ? "text-transparent" : "text-gray-800"}
      `}
                        />

                        {/* Placeholder logic */}
                        {!exp.startDate && !isFocused && (
                          <span
                            className="absolute left-4 top-1/2 -translate-y-1/2
                       text-gray-400 pointer-events-none"
                          >
                            Month, Year
                          </span>
                        )}

                        {/* Calendar icon */}
                        <div
                          className="absolute right-3 top-1/2 -translate-y-1/2
                bg-indigo-100
                w-9 h-9 rounded-full
                flex items-center justify-center
                pointer-events-none"
                        >
                          <svg
                            className="w-4 h-4 text-indigo-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      </div>

                      {!exp.startDate && (
                        <p className="text-xs text-gray-500 mt-1">
                          Click to select month and year
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Date
                      </label>

                      <div className="relative">
                        <input
                          type="month"
                          value={exp.endDate}
                          onChange={(e) =>
                            onUpdate(exp.id, "endDate", e.target.value)
                          }
                          onFocus={() => setIsEndFocused(true)}
                          onBlur={() => setIsEndFocused(false)}
                          disabled={exp.currentlyWorking}
                          className={`w-full px-4 py-3 border border-gray-300 rounded-lg
        focus:ring-2 focus:ring-indigo-500 focus:border-transparent
        transition appearance-none
        disabled:bg-gray-100 disabled:text-gray-500
        ${
          !exp.endDate && !exp.currentlyWorking
            ? "text-transparent"
            : "text-gray-800"
        }
      `}
                        />

                        {/* Placeholder overlay */}
                        {!exp.endDate &&
                          !exp.currentlyWorking &&
                          !isEndFocused && (
                            <span
                              className="absolute left-4 top-1/2 -translate-y-1/2
                       text-gray-400 pointer-events-none"
                            >
                              Month, Year
                            </span>
                          )}

                        {/* Calendar icon */}
                        {!exp.currentlyWorking && (
                          <div
                            className="absolute right-3 top-1/2 -translate-y-1/2
                          bg-indigo-100
                          w-9 h-9 rounded-full
                          flex items-center justify-center
                          pointer-events-none"
                          >
                            <svg
                              className="w-4 h-4 text-indigo-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        )}
                      </div>

                      {!exp.endDate && !exp.currentlyWorking && (
                        <p className="text-xs text-gray-500 mt-1">
                          Click to select month and year
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Currently Working Checkbox */}
                  <div>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={exp.currentlyWorking}
                        onChange={(e) => {
                          onUpdate(
                            exp.id,
                            "currentlyWorking",
                            e.target.checked
                          );
                          if (e.target.checked) {
                            onUpdate(exp.id, "endDate", "");
                          }
                        }}
                        className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        I currently work here
                      </span>
                    </label>
                  </div>

                  {/* Date Validation Warning */}
                  {exp.startDate &&
                    exp.endDate &&
                    exp.startDate > exp.endDate &&
                    !exp.currentlyWorking && (
                      <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3 flex items-start gap-2">
                        <svg
                          className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                        <p className="text-sm text-yellow-800">
                          End date should be after start date
                        </p>
                      </div>
                    )}

                  {/* Job Description with AI Assist */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Job Description
                      </label>
                      <button
                        type="button"
                        className="flex items-center gap-2 text-xs text-indigo-600 hover:text-indigo-700 font-semibold px-3 py-1 rounded-lg hover:bg-indigo-50 transition"
                      >
                        <Lightbulb className="w-4 h-4" />
                        AI Assist
                      </button>
                    </div>
                    <textarea
                      value={exp.description}
                      onChange={(e) =>
                        onUpdate(exp.id, "description", e.target.value)
                      }
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                      placeholder="• Describe your key responsibilities&#10;• Highlight major achievements&#10;• Include relevant metrics or results"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {exp.description?.length || 0} characters
                    </p>
                  </div>

                  {/* Projects (Optional) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Projects (Optional)
                    </label>
                    <textarea
                      value={exp.projects}
                      onChange={(e) =>
                        onUpdate(exp.id, "projects", e.target.value)
                      }
                      rows={2}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                      placeholder="List any notable projects you worked on..."
                    />
                  </div>

                  {/* Achievements (Optional) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Achievements (Optional)
                    </label>
                    <textarea
                      value={exp.achievements}
                      onChange={(e) =>
                        onUpdate(exp.id, "achievements", e.target.value)
                      }
                      rows={2}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                      placeholder="Any awards, recognitions, or major accomplishments..."
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Add Another Button */}
        {experiences.length > 0 && (
          <button
            onClick={onAdd}
            disabled={experiences.some((exp) => !exp.jobTitle && !exp.company)}
            className={`w-full flex items-center justify-center gap-2 border-2 border-dashed px-6 py-4 rounded-lg font-semibold transition
            ${
              experiences.some((exp) => !exp.jobTitle && !exp.company)
                ? "border-gray-300 text-gray-400 cursor-not-allowed"
                : "border-gray-300 text-gray-600 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50"
            }`}
          >
            <Plus className="w-5 h-5" />
            Add Another Experience
          </button>
        )}

        {/* Help Text */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            💡 <strong>Tip:</strong> List your work experience in reverse
            chronological order (most recent first). Use bullet points and
            action verbs to describe your achievements.
          </p>
        </div>
      </div>
    );
  };

  // SIDEBAR COMPONENT
  const Sidebar = () => {
    const menuItems = [
      { id: "dashboard", icon: "📊", label: "Dashboard" },
      { id: "resumes", icon: "📄", label: "My Resumes", count: resumes.length },
      { id: "settings", icon: "⚙️", label: "Settings" },
    ];

    return (
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col relative`}
      >
        {/* Logo/Brand with Toggle Button */}
        <div className="p-6 border-b border-gray-200 relative">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText className="w-6 h-6 text-white" />
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="text-lg font-bold text-gray-800">
                  ResumeSegera
                </h1>
                <p className="text-xs text-gray-500">Resume Builder</p>
              </div>
            )}
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activePage === item.id
                  ? "bg-indigo-50 text-indigo-600 font-semibold"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {sidebarOpen && (
                <span className="flex-1 text-left">{item.label}</span>
              )}
              {sidebarOpen && item.count !== undefined && (
                <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                  {item.count}
                </span>
              )}
            </button>
          ))}

          {/* Upgrade Button (if free) */}
          {profile?.plan_type === "free" && (
            <button
              onClick={() => setCurrentPage("pricing")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold hover:from-yellow-500 hover:to-orange-600 transition-all mt-4"
            >
              <span className="text-xl">💎</span>
              {sidebarOpen && <span>Upgrade to Pro</span>}
            </button>
          )}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-gray-200">
          <div
            className={`flex items-center gap-3 ${
              !sidebarOpen && "justify-center"
            }`}
          >
            <div className="bg-indigo-100 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-indigo-600" />
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {user?.email}
                </p>
                <span
                  className={`text-xs px-2 py-0.5 rounded ${
                    profile?.plan_type === "pro"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {profile?.plan_type === "pro" ? "PRO" : "FREE"}
                </span>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className={`w-full mt-3 flex items-center ${
              sidebarOpen ? "gap-3" : "justify-center"
            } px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all`}
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span className="text-sm">Logout</span>}
          </button>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-20 bg-white border border-gray-200 rounded-full p-1 hover:bg-gray-50"
        >
          <svg
            className={`w-4 h-4 text-gray-600 transition-transform ${
              !sidebarOpen && "rotate-180"
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      </div>
    );
  };

  // TOP BAR COMPONENT
  const TopBar = ({ title, subtitle }) => {
    return (
      <div className="px-8 py-4">
        {" "}
        {/* REMOVED: border-b border-gray-200 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
            {subtitle && (
              <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  // UPGRADE MODAL COMPONENT
  const UpgradeModal = ({ onClose, reason = "general" }) => {
    // Determine message based on reason
    const getTitle = () => {
      if (reason === "ai_credits") return "AI Credits Depleted";
      if (reason === "docx") return "DOCX Export Locked";
      if (reason === "resume_limit") return "Resume Limit Reached";
      return "Upgrade to Pro";
    };

    const getMessage = () => {
      if (reason === "ai_credits")
        return "You've used all 3 AI credits this month";
      if (reason === "docx")
        return "DOCX export is only available for Pro users";
      if (reason === "resume_limit") return "Free plan allows only 1 resume";
      return "Unlock unlimited resumes and premium features";
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 text-center">
            <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-4xl">💎</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{getTitle()}</h3>
            <p className="text-white text-sm">{getMessage()}</p>
          </div>

          {/* Content */}
          <div className="p-6">
            {reason === "ai_credits" && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800 text-center">
                  <strong>Free Plan:</strong> 3 AI uses per month
                  <br />
                  <strong>Pro Plan:</strong> Unlimited AI uses
                </p>
              </div>
            )}

            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <span className="text-green-600 mt-1">✅</span>
                <div>
                  <p className="font-semibold text-gray-800">
                    Unlimited Resumes
                  </p>
                  <p className="text-xs text-gray-600">
                    Create as many as you need
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-600 mt-1">✅</span>
                <div>
                  <p className="font-semibold text-gray-800">
                    10+ Premium Templates
                  </p>
                  <p className="text-xs text-gray-600">
                    ATS-friendly & infographic designs
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-600 mt-1">✅</span>
                <div>
                  <p className="font-semibold text-gray-800">
                    Unlimited AI Features
                  </p>
                  <p className="text-xs text-gray-600">
                    AI writer, cover letters & ATS checker
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-600 mt-1">✅</span>
                <div>
                  <p className="font-semibold text-gray-800">
                    DOCX + PDF Export
                  </p>
                  <p className="text-xs text-gray-600">
                    Download in any format
                  </p>
                </div>
              </div>
            </div>

            {/* Pricing Quick View */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-xs text-gray-600 text-center mb-2">
                Starting from
              </p>
              <p className="text-center">
                <span className="text-3xl font-bold text-indigo-600">
                  RM9.90
                </span>
                <span className="text-sm text-gray-600">/7 days</span>
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowUpgradeModal(false);
                  setCurrentPage("pricing");
                }}
                className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-3 rounded-lg font-bold hover:from-yellow-500 hover:to-orange-600 transition"
              >
                View Plans
              </button>
              <button
                onClick={onClose}
                className="px-6 border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // DELETE CONFIRMATION MODAL
  const DeleteConfirmModal = ({ resume, onConfirm, onCancel }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
          <div className="p-6">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8 text-red-600" />
            </div>

            <h3 className="text-xl font-bold text-gray-800 text-center mb-2">
              Delete Resume?
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to delete{" "}
              <strong>"{resume.resume_title || resume.full_name}"</strong>? This
              action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // MAIN LAYOUT WRAPPER
  const DashboardLayout = ({ children }) => {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">{children}</div>

        {/* Global Upgrade Modal */}
        {upgradeModal.show && (
          <UpgradeModal
            onClose={() => setUpgradeModal({ show: false, reason: "general" })}
            reason={upgradeModal.reason}
          />
        )}
        {/* ADD ALERT MODAL HERE */}
        <AlertModal
          show={alertModal.show}
          type={alertModal.type}
          title={alertModal.title}
          message={alertModal.message}
          onClose={() => setAlertModal({ ...alertModal, show: false })}
          onConfirm={alertModal.onConfirm}
        />
      </div>
    );
  };

  // FORGOT PASSWORD PAGE
  if (authMode === "forgot") {
    if (loading) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-700 font-medium text-lg">
              Sending reset link...
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
          {/* Back Button - FIXED */}
          <button
            onClick={() => {
              setAuthMode("signin"); // Reset to signin mode
              setCurrentPage("public-builder"); // Go back to builder
            }}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 text-sm"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Kembali ke Builder
          </button>

          <div className="text-center mb-8">
            <div className="bg-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Reset Password</h1>
            <p className="text-gray-600 mt-2">
              Enter your email to receive reset link
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleForgotPassword()}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  loginEmail && !validateEmail(loginEmail)
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="your@email.com"
              />
              {loginEmail && !validateEmail(loginEmail) && (
                <p className="text-xs text-red-600 mt-1">
                  Format email tidak sah
                </p>
              )}
            </div>

            <button
              onClick={handleForgotPassword}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Send Reset Link
            </button>

            <button
              onClick={() => setAuthMode("signin")}
              className="w-full text-gray-600 hover:text-gray-800 text-sm"
            >
              ← Back to Sign In
            </button>
          </div>
        </div>

        {/* ADD ALERT MODAL HERE */}
        <AlertModal
          show={alertModal.show}
          type={alertModal.type}
          title={alertModal.title}
          message={alertModal.message}
          onClose={() => setAlertModal({ ...alertModal, show: false })}
          onConfirm={alertModal.onConfirm}
        />
      </div>
    );
  }

  // LOGIN PAGE
  if (currentPage === "login") {
    if (loading) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-700 font-medium text-lg">
              {loadingMessage ||
                (authMode === "signin"
                  ? "Signing in..."
                  : "Creating account...")}
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
          {/* ADD BACK BUTTON - NEW */}
          <button
            onClick={() => setCurrentPage("public-builder")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 text-sm"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Kembali ke Builder
          </button>

          <div className="text-center mb-8">
            <div className="bg-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">ResumeSegera</h1>
            <p className="text-gray-600 mt-2">
              Build professional resumes in minutes
            </p>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition mb-4"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or continue with email
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => {
                  setLoginEmail(e.target.value);

                  if (emailExists) {
                    setEmailExists(false);
                  }

                  // Clear previous timeout
                  if (emailCheckTimeout) {
                    clearTimeout(emailCheckTimeout);
                  }

                  // Only check if in signup mode and email looks complete
                  if (authMode === "signup" && e.target.value.includes("@")) {
                    const timeout = setTimeout(() => {
                      if (validateEmail(e.target.value)) {
                        checkEmailExists(e.target.value);
                      }
                    }, 500); // Wait 500ms after user stops typing

                    setEmailCheckTimeout(timeout);
                  }
                }}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  loginEmail && !validateEmail(loginEmail)
                    ? "border-red-500"
                    : emailExists
                    ? "border-orange-500"
                    : "border-gray-300"
                }`}
                placeholder="your@email.com"
              />

              {/* Email validation error */}
              {loginEmail && !validateEmail(loginEmail) && (
                <p className="text-xs text-red-600 mt-1">
                  Format email tidak sah
                </p>
              )}

              {/* Email exists warning - ONLY show in signup mode */}
              {authMode === "signup" && emailCheckLoading && (
                <p className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                  <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Checking availability...
                </p>
              )}

              {authMode === "signup" && emailExists && !emailCheckLoading && (
                <div className="mt-1">
                  <p className="text-xs text-orange-600 font-semibold">
                    Alamat emel telah didaftarkan. Sila Sign In.
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                {" "}
                {/* Tambah wrapper relative */}
                <input
                  type={showPassword ? "text" : "password"} // Dinamik type
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleEmailLogin()}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent pr-12" // Tambah pr-12
                  placeholder="••••••••"
                />
                {/* Butang Mata */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {authMode === "signin" && (
                <div className="text-right mt-2">
                  <button
                    onClick={() => setAuthMode("forgot")}
                    className="text-sm text-indigo-600 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}
            </div>

            {/* CLOUDFLARE TURNSTILE WIDGET - ADD THIS 
            <div
              className="cf-turnstile"
              data-sitekey="0x4AAAAAACG9PsZ0qj_ESaMc"
              data-callback="onTurnstileSuccess"
              data-theme="light"
            ></div> */}

            <button
              onClick={handleEmailLogin}
              disabled={
                authMode === "signup" && (emailExists || emailCheckLoading)
              }
              className={`w-full py-3 rounded-lg font-semibold transition ${
                authMode === "signup" && (emailExists || emailCheckLoading)
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              {authMode === "signin" ? "Sign In" : "Sign Up"}
            </button>
          </div>

          <p className="text-center text-sm text-gray-600 mt-6">
            {authMode === "signin"
              ? "Don't have an account? "
              : "Already have an account? "}
            <button
              onClick={() => {
                const newMode = authMode === "signin" ? "signup" : "signin";
                setAuthMode(newMode);

                // DON'T reset emailExists - keep it
                // If switching back to signup with same email, re-check
                if (
                  newMode === "signup" &&
                  loginEmail &&
                  validateEmail(loginEmail)
                ) {
                  checkEmailExists(loginEmail);
                }
              }}
              className="text-indigo-600 font-semibold hover:underline"
            >
              {authMode === "signin" ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>
        {/* ADD ALERT MODAL HERE */}
        <AlertModal
          show={alertModal.show}
          type={alertModal.type}
          title={alertModal.title}
          message={alertModal.message}
          onClose={() => setAlertModal({ ...alertModal, show: false })}
          onConfirm={alertModal.onConfirm}
        />
      </div>
    );
  }

  // DASHBOARD
  // DASHBOARD MAIN CONTENT
  if (currentPage === "dashboard") {
    // DEBUG - TEMPORARY
    console.log("Dashboard render - resumes:", resumes);
    console.log("Dashboard render - profile:", profile);
    // ADD LOADING CHECK - Don't render until data ready
    if (!profile || (profile && resumes === null)) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-700 font-medium text-lg">
              Loading dashboard...
            </p>
          </div>
        </div>
      );
    }
    // DASHBOARD PAGE
    if (activePage === "dashboard") {
      return (
        <DashboardLayout>
          <TopBar
            title="Dashboard"
            subtitle="Overview of your resume building activity"
          />

          <div className="flex-1 overflow-auto p-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Total Resumes */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-indigo-100 w-12 h-12 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-indigo-600" />
                  </div>
                  <span className="text-2xl">📄</span>
                </div>
                <h3 className="text-gray-600 text-sm font-medium mb-1">
                  Total Resumes
                </h3>
                <p className="text-3xl font-bold text-gray-800">
                  {resumes ? resumes.length : "..."}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {profile?.plan_type === "free"
                    ? "Free: Max 1 resume"
                    : "Unlimited resumes"}
                </p>
              </div>

              {/* Cover Letters */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-2xl">✉️</span>
                </div>
                <h3 className="text-gray-600 text-sm font-medium mb-1">
                  Cover Letters
                </h3>
                <p className="text-3xl font-bold text-gray-800">0</p>
                <p className="text-xs text-gray-500 mt-2">Coming soon</p>
              </div>

              {/* Plan Status Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`${
                      profile?.plan_type === "pro"
                        ? "bg-yellow-100"
                        : "bg-gray-100"
                    } w-12 h-12 rounded-lg flex items-center justify-center`}
                  >
                    <CreditCard
                      className={`w-6 h-6 ${
                        profile?.plan_type === "pro"
                          ? "text-yellow-600"
                          : "text-gray-600"
                      }`}
                    />
                  </div>
                  <span className="text-2xl">💎</span>
                </div>
                <h3 className="text-gray-600 text-sm font-medium mb-1">
                  Current Plan
                </h3>
                <p className="text-3xl font-bold text-gray-800 mb-2">
                  {profile?.plan_type === "pro" ? "PRO" : "FREE"}
                </p>

                {profile?.plan_type === "free" ? (
                  <div>
                    {/* AI Credits Display */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-blue-800">
                          AI Credits
                        </span>
                        <span className="text-xs font-bold text-blue-900">
                          {profile?.ai_credits_used || 0}/3
                        </span>
                      </div>
                      <div className="w-full bg-blue-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{
                            width: `${
                              ((profile?.ai_credits_used || 0) / 3) * 100
                            }%`,
                          }}
                        />
                      </div>
                      <p className="text-xs text-blue-600 mt-1">
                        Resets{" "}
                        {new Date(
                          profile?.ai_credits_reset_date || new Date()
                        ).toLocaleDateString("en-MY", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>

                    <button
                      onClick={() => setCurrentPage("pricing")}
                      className="text-xs text-indigo-600 hover:underline font-semibold"
                    >
                      Upgrade for unlimited AI →
                    </button>
                  </div>
                ) : (
                  <div>
                    {profile?.plan_expires_at && (
                      <p className="text-xs text-gray-500">
                        Expires:{" "}
                        {new Date(profile.plan_expires_at).toLocaleDateString()}
                      </p>
                    )}
                    <p className="text-xs text-green-600 font-semibold mt-1">
                      ✓ Unlimited AI Credits
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Resumes */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-800">
                  Recent Resumes
                </h2>
                <button
                  onClick={() => setActivePage("resumes")}
                  className="text-sm text-indigo-600 hover:underline"
                >
                  View all →
                </button>
              </div>

              {/* FIXED: Add null check */}
              {!resumes || resumes === null ? (
                // Still loading
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading resumes...</p>
                </div>
              ) : resumes.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No resumes yet</p>
                  <button
                    onClick={() => {
                      if (
                        profile?.plan_type === "free" &&
                        resumes.length >= 1
                      ) {
                        setUpgradeModal({ show: true, reason: "resume_limit" }); // Changed from alert
                        return;
                      }
                      setActivePage("resumes");
                      setEditingResume(null);
                      setFormData({});
                      setCurrentPage("editor");
                    }}
                    className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
                  >
                    <Plus className="w-5 h-5" />
                    Create First Resume
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {resumes
                    .filter((resume) => resume !== null) // ADD THIS FILTER
                    .slice(0, 5)
                    .map((resume) => (
                      <div
                        key={resume.id}
                        className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition"
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-indigo-100 w-10 h-10 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-indigo-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">
                              {resume.resume_title || resume.full_name}
                            </p>
                            <p className="text-xs text-gray-500">
                              Created{" "}
                              {new Date(resume.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingResume(resume);
                              setFormData({
                                fullName: resume.full_name,
                                email: resume.email,
                                phone: resume.phone,
                                summary: resume.summary,
                                experience: resume.experience,
                                education: resume.education,
                                skills: resume.skills,
                              });
                              setCurrentPage("editor");
                            }}
                            className="text-gray-600 hover:text-indigo-600 p-2"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handlePreviewPDF(resume)}
                            className="text-gray-600 hover:text-indigo-600 p-2"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </DashboardLayout>
      );
    }

    // MY RESUMES PAGE
    if (activePage === "resumes") {
      const handleRename = async (resumeId, newValue) => {
        const nameToSave = newValue || newName;

        if (!nameToSave.trim()) {
          alert("Please enter a name");
          return;
        }

        // Close input FIRST (before any async operations)
        setRenamingId(null);
        setNewName("");

        // Update local state immediately
        setResumes(
          resumes.map((r) =>
            r.id === resumeId ? { ...r, resume_title: nameToSave } : r
          )
        );

        // Then save to DB in background
        setLoading(true);
        const { error } = await supabase
          .from("resumes")
          .update({ resume_title: nameToSave })
          .eq("id", resumeId);

        if (error) {
          alert("Error renaming: " + error.message);
          await loadUserData(user.id); // Rollback on error
        }
        setLoading(false);
      };

      const handleDuplicate = async (resume) => {
        if (profile?.plan_type === "free") {
          setUpgradeModal({ show: true, reason: "resume_limit" });
          return;
        }

        setLoading(true);
        const duplicatedResume = {
          user_id: user.id,
          full_name: resume.full_name,
          email: resume.email,
          phone: resume.phone,
          summary: resume.summary,
          experience: resume.experience,
          education: resume.education,
          skills: resume.skills,
          resume_title: `${resume.resume_title || resume.full_name} (Copy)`,
          template_type: resume.template_type,
        };

        const { error } = await supabase
          .from("resumes")
          .insert([duplicatedResume]);

        if (error) {
          alert("Error duplicating resume: " + error.message);
        } else {
          await loadUserData(user.id);
        }
        setLoading(false);
        setMenuOpen(null);
      };

      return (
        <DashboardLayout>
          <TopBar
            title="My Resumes"
            subtitle={`${resumes ? resumes.length : 0} ${
              resumes && resumes.length === 1 ? "resume" : "resumes"
            } created`}
          />

          <div className="flex-1 overflow-auto p-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  {profile?.plan_type === "free"
                    ? `Free plan: ${resumes ? resumes.length : 0}/1 resume used`
                    : "Unlimited resumes with Pro plan"}
                </p>
              </div>
              <button
                onClick={() => {
                  if (profile?.plan_type === "free" && resumes.length >= 1) {
                    setUpgradeModal({ show: true, reason: "resume_limit" }); // Changed from alert
                    return;
                  }
                  setEditingResume(null);
                  setFormData({});
                  setCurrentPage("editor");
                }}
                className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
              >
                <Plus className="w-5 h-5" />
                Create Resume
              </button>
            </div>

            {!resumes ? (
              // Loading state
              <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading resumes...</p>
              </div>
            ) : resumes.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border-2 border-dashed border-gray-300 p-12 text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  No resumes yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Create your first professional resume
                </p>
                <button
                  onClick={() => {
                    setEditingResume(null);
                    setFormData({});
                    setCurrentPage("editor");
                  }}
                  className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
                >
                  <Plus className="w-5 h-5" />
                  Create Resume
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resumes
                  .filter((resume) => resume !== null) // ADD THIS FILTER
                  .map((resume) => (
                    <div
                      key={resume.id}
                      className="bg-white rounded-xl shadow-sm border hover:shadow-md transition p-6 relative"
                    >
                      {/* Resume Title/Name - Editable */}
                      {renamingId === resume.id ? (
                        <div className="mb-4">
                          <input
                            ref={renameInputRef}
                            type="text"
                            defaultValue={newName}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleRename(resume.id, e.target.value);
                              } else if (e.key === "Escape") {
                                setRenamingId(null);
                                setNewName("");
                              }
                            }}
                            className="w-full px-3 py-2 border border-indigo-500 rounded-lg focus:ring-2 focus:ring-indigo-500 font-bold text-lg"
                            placeholder="e.g., Marketing Resume"
                            autoFocus
                          />
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() =>
                                handleRename(
                                  resume.id,
                                  renameInputRef.current?.value
                                )
                              }
                              className="flex-1 bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setRenamingId(null);
                                setNewName("");
                              }}
                              className="flex-1 bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-300"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg text-gray-800 pr-8">
                              {resume.resume_title || resume.full_name}
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">
                              File name
                            </p>
                          </div>

                          {/* Three-Dot Menu Button */}
                          <div className="relative">
                            <button
                              onClick={() =>
                                setMenuOpen(
                                  menuOpen === resume.id ? null : resume.id
                                )
                              }
                              className="text-gray-400 hover:text-gray-600 transition p-1"
                              title="More options"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <circle cx="12" cy="5" r="2" />
                                <circle cx="12" cy="12" r="2" />
                                <circle cx="12" cy="19" r="2" />
                              </svg>
                            </button>

                            {/* Dropdown Menu */}
                            {menuOpen === resume.id && (
                              <>
                                {/* Backdrop to close menu */}
                                <div
                                  className="fixed inset-0 z-10"
                                  onClick={() => setMenuOpen(null)}
                                />

                                {/* Menu Items */}
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                                  <button
                                    onClick={() => {
                                      setRenamingId(resume.id);
                                      setNewName(
                                        resume.resume_title || resume.full_name
                                      );
                                      setMenuOpen(null);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                                  >
                                    <Edit className="w-4 h-4" />
                                    <span>Rename File</span>
                                  </button>

                                  <button
                                    onClick={() => handleDuplicate(resume)}
                                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                                  >
                                    <svg
                                      className="w-4 h-4"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                      />
                                    </svg>
                                    <span>Duplicate File</span>
                                    {profile?.plan_type === "free" && (
                                      <span className="text-xs ml-auto">
                                        🔒
                                      </span>
                                    )}
                                  </button>

                                  <div className="border-t border-gray-200 my-1"></div>

                                  <button
                                    onClick={() => {
                                      setDeleteConfirm(resume);
                                      setMenuOpen(null);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                    <span>Delete Resume</span>
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Resume Owner Info */}
                      <div className="mb-4 pb-4 border-b border-gray-200">
                        <p className="text-sm text-gray-700 font-medium">
                          {resume.full_name}
                        </p>
                        <p className="text-xs text-gray-600">{resume.email}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          Created:{" "}
                          {new Date(resume.created_at).toLocaleDateString()}
                        </p>
                      </div>

                      {/* Action Buttons - 4 buttons only */}
                      <div className="grid grid-cols-4 gap-2">
                        {/* Edit Button */}
                        <button
                          onClick={() => {
                            setEditingResume(resume);
                            setFormData({
                              fullName: resume.full_name,
                              email: resume.email,
                              phone: resume.phone,
                              summary: resume.summary,
                              experience: resume.experience,
                              education: resume.education,
                              skills: resume.skills,
                            });
                            setCurrentPage("editor");
                          }}
                          className="flex flex-col items-center justify-center gap-1 bg-gray-100 text-gray-700 p-3 rounded-lg hover:bg-gray-200 transition"
                          title="Edit resume content"
                        >
                          <Edit className="w-5 h-5" />
                          <span className="text-xs font-medium">Edit</span>
                        </button>

                        {/* PDF Button */}
                        <button
                          onClick={() => handlePreviewPDF(resume)}
                          className="flex flex-col items-center justify-center gap-1 bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 transition"
                          title="Download PDF"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6zm2-8h8v2H8v-2zm0 4h8v2H8v-2z" />
                          </svg>
                          <span className="text-xs font-medium">PDF</span>
                        </button>

                        {/* DOCX Button */}
                        <button
                          onClick={() => {
                            if (profile?.plan_type === "free") {
                              setUpgradeModal({ show: true, reason: "docx" });
                            } else {
                              alert("DOCX download - Coming soon!");
                            }
                          }}
                          className={`flex flex-col items-center justify-center gap-1 p-3 rounded-lg transition ${
                            profile?.plan_type === "free"
                              ? "bg-gray-100 text-gray-400 hover:bg-gray-200 cursor-pointer"
                              : "bg-blue-600 text-white hover:bg-blue-700"
                          }`}
                          title={
                            profile?.plan_type === "free"
                              ? "Upgrade to Pro for DOCX"
                              : "Download DOCX"
                          }
                        >
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 11h-2v2h-2v-2H7v-2h2v-2h2v2h2v2zm2-6V3.5L18.5 7H15z" />
                          </svg>
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-medium">Word</span>
                            {profile?.plan_type === "free" && (
                              <span className="text-xs">🔒</span>
                            )}
                          </div>
                        </button>

                        {/* TXT Button */}
                        <button
                          onClick={() => {
                            const txtContent = `${resume.full_name}
${resume.email} | ${resume.phone}

PROFESSIONAL SUMMARY
${resume.summary || "N/A"}

WORK EXPERIENCE
${resume.experience || "N/A"}

EDUCATION
${resume.education || "N/A"}

SKILLS
${resume.skills || "N/A"}

---
Generated by ResumeSegera.my`;

                            const blob = new Blob([txtContent], {
                              type: "text/plain",
                            });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = `${
                              resume.resume_title || resume.full_name
                            }_Resume.txt`;
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            URL.revokeObjectURL(url);
                          }}
                          className="flex flex-col items-center justify-center gap-1 bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition"
                          title="Download as plain text"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M13 9h5.5L13 3.5V9M6 2h8l6 6v12c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2m0 18h12V9h-6V3H6v17z" />
                          </svg>
                          <span className="text-xs font-medium">Text</span>
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
          {/* Delete Confirmation Modal */}
          {deleteConfirm && (
            <DeleteConfirmModal
              resume={deleteConfirm}
              onConfirm={handleDeleteConfirmed}
              onCancel={() => setDeleteConfirm(null)}
            />
          )}
        </DashboardLayout>
      );
    }

    // SETTINGS COMPONENT (separate to avoid hooks issues)
    const SettingsPage = () => {
      const [localSettingsTab, setLocalSettingsTab] = useState("plan");

      // IMPORTANT: Initial value set ONCE, never update from parent
      const [localProfileData] = useState({
        fullName: profile?.full_name || "",
        email: user?.email || "",
      });
      const [actualProfileData, setActualProfileData] =
        useState(localProfileData);

      const [localPasswordData, setLocalPasswordData] = useState({
        newPassword: "",
        confirmPassword: "",
      });
      const [showModal, setShowModal] = useState(false);
      const [modalMessage, setModalMessage] = useState("");
      const [modalType, setModalType] = useState("loading");
      const [isSaving, setIsSaving] = useState(false);

      const handleUpdateProfile = async () => {
        setIsSaving(true);
        setModalType("loading");
        setModalMessage("Saving your data...");
        setShowModal(true);

        const { error } = await supabase
          .from("profiles")
          .update({ full_name: actualProfileData.fullName })
          .eq("id", user.id);

        if (error) {
          setModalType("error");
          setModalMessage("Error: " + error.message);
          setIsSaving(false);
        } else {
          setModalType("success");
          setModalMessage("Profile updated successfully!");
          setIsSaving(false);
          // Don't call loadUserData - no need!
        }
      };

      const handleUpdatePassword = async () => {
        if (
          localPasswordData.newPassword !== localPasswordData.confirmPassword
        ) {
          setModalType("error");
          setModalMessage("Passwords do not match!");
          setShowModal(true);
          return;
        }

        if (localPasswordData.newPassword.length < 6) {
          setModalType("error");
          setModalMessage("Password must be at least 6 characters");
          setShowModal(true);
          return;
        }

        setModalType("loading");
        setModalMessage("Updating password...");
        setShowModal(true);

        const { error } = await supabase.auth.updateUser({
          password: localPasswordData.newPassword,
        });

        if (error) {
          setModalType("error");
          setModalMessage("Error: " + error.message);
        } else {
          setModalType("success");
          setModalMessage("Password updated successfully!");
          setLocalPasswordData({ newPassword: "", confirmPassword: "" });
        }
      };

      return (
        <DashboardLayout>
          <TopBar title="Settings" subtitle="Manage your account settings" />

          <div className="flex-1 overflow-auto p-8">
            <div className="max-w-3xl mx-auto">
              {/* Tabs - UPDATED */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
                <div className="flex">
                  <button
                    onClick={() => setLocalSettingsTab("plan")}
                    className={`flex-1 px-6 py-4 text-sm font-semibold transition rounded-tl-xl ${
                      localSettingsTab === "plan"
                        ? "bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    💎 Plan Status
                  </button>
                  <button
                    onClick={() => setLocalSettingsTab("profile")}
                    className={`flex-1 px-6 py-4 text-sm font-semibold transition ${
                      localSettingsTab === "profile"
                        ? "bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    👤 Profile
                  </button>
                  <button
                    onClick={() => setLocalSettingsTab("password")}
                    className={`flex-1 px-6 py-4 text-sm font-semibold transition rounded-tr-xl ${
                      localSettingsTab === "password"
                        ? "bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    🔒 Password
                  </button>
                </div>

                {/* PLAN STATUS TAB - NEW FIRST TAB */}
                {localSettingsTab === "plan" && (
                  <div className="p-6 space-y-6">
                    {/* Current Plan Display */}
                    <div className="text-center py-8 border-b border-gray-200">
                      <div
                        className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
                          profile?.plan_type === "pro"
                            ? "bg-yellow-100"
                            : "bg-gray-100"
                        }`}
                      >
                        <span className="text-4xl">
                          {profile?.plan_type === "pro" ? "💎" : "🆓"}
                        </span>
                      </div>

                      <h2 className="text-3xl font-bold text-gray-800 mb-2">
                        {profile?.plan_type === "pro"
                          ? "PRO PLAN"
                          : "FREE PLAN"}
                      </h2>

                      {profile?.plan_type === "pro" ? (
                        <div>
                          <p className="text-gray-600 mb-4">
                            You have full access to all premium features
                          </p>
                          {profile?.plan_expires_at && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 inline-block">
                              <p className="text-sm text-yellow-800">
                                <strong>Expires:</strong>{" "}
                                {new Date(
                                  profile.plan_expires_at
                                ).toLocaleDateString("en-MY", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div>
                          <p className="text-gray-600 mb-2">
                            Limited features. Upgrade for unlimited access!
                          </p>

                          {/* AI Credits Display for Free Users */}
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 inline-block mb-6">
                            <p className="text-sm text-blue-800">
                              <strong>AI Credits:</strong>{" "}
                              {profile?.ai_credits_used || 0}/3 used this month
                            </p>
                            <p className="text-xs text-blue-600 mt-1">
                              Resets:{" "}
                              {new Date(
                                profile?.ai_credits_reset_date || new Date()
                              ).toLocaleDateString("en-MY", {
                                month: "short",
                                day: "numeric",
                              })}
                            </p>
                          </div>

                          <div>
                            <button
                              onClick={() => setCurrentPage("pricing")}
                              className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-yellow-500 hover:to-orange-600 transition shadow-lg"
                            >
                              <span>💎</span>
                              Upgrade to Pro
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Feature Comparison Table */}
                    <div>
                      <h3 className="font-bold text-lg text-gray-800 mb-4 text-center">
                        What You Get
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                Feature
                              </th>
                              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                                Free
                              </th>
                              <th className="px-4 py-3 text-center text-sm font-semibold text-indigo-600">
                                Pro
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            <tr className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm text-gray-800">
                                Resumes
                              </td>
                              <td className="px-4 py-3 text-center text-sm text-gray-600">
                                1
                              </td>
                              <td className="px-4 py-3 text-center text-sm font-semibold text-indigo-600">
                                Unlimited
                              </td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm text-gray-800">
                                Templates
                              </td>
                              <td className="px-4 py-3 text-center text-sm text-gray-600">
                                1 Basic
                              </td>
                              <td className="px-4 py-3 text-center text-sm font-semibold text-indigo-600">
                                10+ Premium
                              </td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm text-gray-800">
                                PDF Download
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span className="text-green-600">✓</span>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span className="text-green-600">✓</span>
                              </td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm text-gray-800">
                                DOCX Download
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span className="text-red-500">✗</span>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span className="text-green-600">✓</span>
                              </td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm text-gray-800">
                                AI Writer
                              </td>
                              <td className="px-4 py-3 text-center text-sm text-gray-600">
                                3/month
                              </td>
                              <td className="px-4 py-3 text-center text-sm font-semibold text-indigo-600">
                                Unlimited
                              </td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm text-gray-800">
                                AI Cover Letter
                              </td>
                              <td className="px-4 py-3 text-center text-sm text-gray-600">
                                1
                              </td>
                              <td className="px-4 py-3 text-center text-sm font-semibold text-indigo-600">
                                Unlimited
                              </td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm text-gray-800">
                                ATS Checker
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span className="text-red-500">✗</span>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span className="text-green-600">✓</span>
                              </td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm text-gray-800">
                                Plain Text Export
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span className="text-green-600">✓</span>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span className="text-green-600">✓</span>
                              </td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm text-gray-800">
                                Sharing Links
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span className="text-red-500">✗</span>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span className="text-green-600">✓</span>
                              </td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm text-gray-800">
                                Job Parser
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span className="text-red-500">✗</span>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span className="text-green-600">✓</span>
                              </td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm text-gray-800">
                                Template Switch
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span className="text-red-500">✗</span>
                              </td>
                              <td className="px-4 py-3 text-center text-sm font-semibold text-indigo-600">
                                ATS+Infographic
                              </td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm text-gray-800">
                                Support
                              </td>
                              <td className="px-4 py-3 text-center text-sm text-gray-600">
                                Email
                              </td>
                              <td className="px-4 py-3 text-center text-sm font-semibold text-indigo-600">
                                Priority 24h
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Pricing Preview */}

                    {profile?.plan_type === "free" && (
                      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 border border-indigo-200">
                        <h4 className="font-bold text-gray-800 mb-4 text-center">
                          Pro Plan Pricing
                        </h4>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                          <div className="bg-white rounded-lg p-3 text-center border border-gray-200">
                            <p className="text-xl font-bold text-indigo-600">
                              RM9.90
                            </p>
                            <p className="text-xs text-gray-600">7 days</p>
                          </div>
                          <div className="bg-indigo-600 text-white rounded-lg p-3 text-center shadow-md">
                            <p className="text-xl font-bold">RM19.90</p>
                            <p className="text-xs opacity-90">30 days</p>
                            <span className="inline-block text-xs bg-white text-indigo-600 px-2 py-0.5 rounded-full mt-1 font-semibold">
                              Popular
                            </span>
                          </div>
                          <div className="bg-white rounded-lg p-3 text-center border border-gray-200">
                            <p className="text-xl font-bold text-indigo-600">
                              RM49.90
                            </p>
                            <p className="text-xs text-gray-600">90 days</p>
                          </div>
                          <div className="bg-white rounded-lg p-3 text-center border border-gray-200">
                            <p className="text-xl font-bold text-indigo-600">
                              RM99.90
                            </p>
                            <p className="text-xs text-gray-600">365 days</p>
                          </div>
                        </div>
                        <div className="text-center mt-4">
                          <button
                            onClick={() => setCurrentPage("pricing")}
                            className="text-sm text-indigo-600 hover:underline font-semibold"
                          >
                            View all plans →
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Profile Tab - NOW SECOND */}
                {localSettingsTab === "profile" && (
                  <div className="p-6 space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={actualProfileData.fullName}
                        onChange={(e) =>
                          setActualProfileData({
                            ...actualProfileData,
                            fullName: e.target.value,
                          })
                        }
                        disabled={isSaving}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                        placeholder="Your full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={actualProfileData.email}
                        disabled
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Email cannot be changed
                      </p>
                    </div>

                    <button
                      onClick={handleUpdateProfile}
                      disabled={isSaving}
                      className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
                    >
                      {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                )}

                {/* Password Tab - NOW THIRD (keep unchanged) */}
                {localSettingsTab === "password" && (
                  <div className="p-6 space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                      <p className="text-sm text-blue-800">
                        🔐 Create a strong password with at least 6 characters
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={localPasswordData.newPassword}
                        onChange={(e) =>
                          setLocalPasswordData({
                            ...localPasswordData,
                            newPassword: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        placeholder="••••••••"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={localPasswordData.confirmPassword}
                        onChange={(e) =>
                          setLocalPasswordData({
                            ...localPasswordData,
                            confirmPassword: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        placeholder="••••••••"
                      />
                    </div>

                    <button
                      onClick={handleUpdatePassword}
                      disabled={isSaving}
                      className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
                    >
                      {isSaving ? "Updating..." : "Update Password"}
                    </button>
                  </div>
                )}
              </div>

              {/* Account Actions - keep unchanged */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Account Actions
                </h3>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* MODAL */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
                {modalType === "loading" && (
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-700 font-medium text-lg">
                      {modalMessage}
                    </p>
                  </div>
                )}

                {modalType === "success" && (
                  <div className="text-center">
                    <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      Success!
                    </h3>
                    <p className="text-gray-600 mb-6">{modalMessage}</p>
                    <button
                      onClick={() => setShowModal(false)}
                      className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
                    >
                      OK
                    </button>
                  </div>
                )}

                {modalType === "error" && (
                  <div className="text-center">
                    <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-red-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      Error
                    </h3>
                    <p className="text-gray-600 mb-6">{modalMessage}</p>
                    <button
                      onClick={() => setShowModal(false)}
                      className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </DashboardLayout>
      );
    };

    // SETTINGS PAGE
    if (activePage === "settings") {
      return <SettingsPage key={profile?.id} />;
    }

    // If no active page matched, default to dashboard
    return null;
  }

  // EDITOR PAGE
  if (currentPage === "editor") {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Top Bar - No Sidebar */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">
              {editingResume ? "Edit Resume" : "Create Resume"}
            </h1>
            <button
              onClick={() => {
                setCurrentPage("dashboard");
                setActivePage("resumes");
              }}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-medium"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Resumes
            </button>
          </div>
        </div>

        {/* Editor Content - Full Width */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-sm border p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.fullName || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                    formData.email && !validateEmail(formData.email)
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="john@example.com"
                />
                {formData.email && !validateEmail(formData.email) && (
                  <p className="text-xs text-red-600 mt-1">
                    Format email tidak sah
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone *
              </label>
              <input
                type="tel"
                value={formData.phone || ""}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="+60 12-345 6789"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Professional Summary
              </label>
              <textarea
                value={formData.summary || ""}
                onChange={(e) =>
                  setFormData({ ...formData, summary: e.target.value })
                }
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="Brief overview of your professional background..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Work Experience
              </label>
              <textarea
                value={formData.experience || ""}
                onChange={(e) =>
                  setFormData({ ...formData, experience: e.target.value })
                }
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="Job Title - Company Name (Year)&#10;- Achievement 1&#10;- Achievement 2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Education
              </label>
              <textarea
                value={formData.education || ""}
                onChange={(e) =>
                  setFormData({ ...formData, education: e.target.value })
                }
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="Degree - University (Year)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skills
              </label>
              <input
                type="text"
                value={formData.skills || ""}
                onChange={(e) =>
                  setFormData({ ...formData, skills: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="JavaScript, React, Node.js, etc."
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={handleSaveResume}
                disabled={loading}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {loading
                  ? "Saving..."
                  : editingResume
                  ? "Update Resume"
                  : "Create Resume"}
              </button>

              <button
                onClick={() => {
                  setCurrentPage("dashboard");
                  setActivePage("resumes");
                }}
                className="px-8 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
        {/* ADD ALERT MODAL HERE */}
        <AlertModal
          show={alertModal.show}
          type={alertModal.type}
          title={alertModal.title}
          message={alertModal.message}
          onClose={() => setAlertModal({ ...alertModal, show: false })}
          onConfirm={alertModal.onConfirm}
        />
      </div>
    );
  }

  // PUBLIC BUILDER PAGE (No Auth Required)
  if (currentPage === "public-builder") {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Top Bar */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 w-10 h-10 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  ResumeSegera
                </h1>
                <p className="text-xs text-gray-500">
                  Buat resume profesional percuma
                </p>
              </div>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setAuthMode("signup");
                  setCurrentPage("login");
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition text-sm"
              >
                Daftar Akaun Baru
              </button>

              <button
                onClick={() => {
                  setAuthMode("signin");
                  setCurrentPage("login");
                }}
                className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition text-sm"
              >
                Log Masuk
              </button>
            </div>
          </div>
        </div>

        {/* Stepper Navigation */}
        {StepperNavigation({
          currentStep: currentStep,
          steps: RESUME_STEPS,
          onStepClick: handleStepClick,
          completedSteps: completedSteps,
        })}

        {/* Form Content */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-sm border p-8">
            {/* STEP CONTENT - DYNAMIC BASED ON CURRENT STEP */}
            {currentStep === 0 &&
              PersonalInfoSection({
                data: formData.personalInfo || INITIAL_FORM_DATA.personalInfo,
                onUpdate: updatePersonalInfo,
                onUpdateDetails: updatePersonalInfoDetails,
                showMoreDetails: showPersonalDetails,
                setShowMoreDetails: setShowPersonalDetails,
                showErrors: showErrors,
              })}

            {currentStep === 1 &&
              WorkExperienceSection({
                experiences: formData.workExperience || [],
                onAdd: addWorkExperience,
                onUpdate: updateWorkExperience,
                onRemove: removeWorkExperience,
                expandedId: expandedExperience,
                setExpandedId: setExpandedExperience,
              })}

            {currentStep !== 0 && currentStep !== 1 && (
              // Placeholder for other steps
              <div className="text-center py-12">
                <div className="text-6xl mb-4">
                  {React.createElement(RESUME_STEPS[currentStep].icon, {
                    className: "w-24 h-24 mx-auto text-indigo-600",
                  })}
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {RESUME_STEPS[currentStep].label}
                </h3>
                <p className="text-gray-600 mb-6">
                  {RESUME_STEPS[currentStep].description}
                </p>
                <p className="text-sm text-gray-500 italic">
                  Form section coming soon...
                </p>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 pt-6 border-t mt-8">
              {/* Previous Button */}
              <button
                onClick={() => {
                  if (currentStep > 0) setCurrentStep(currentStep - 1);
                }}
                disabled={currentStep === 0}
                className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Previous
                {currentStep > 0 && (
                  <span className="hidden md:inline">
                    : {RESUME_STEPS[currentStep - 1].shortLabel}
                  </span>
                )}
              </button>

              {/* Next Button */}
              <button
                onClick={() => {
                  // Only validate Personal Info step
                  if (currentStep === 0) {
                    const errors = validatePersonalInfo(formData.personalInfo);
                    if (errors.length > 0) {
                      setShowErrors(true);
                      setAlertModal({
                        show: true,
                        type: "warning",
                        title: "Incomplete Information",
                        message:
                          "Please fill in all required fields before proceeding.",
                        onClose: () =>
                          setAlertModal({ ...alertModal, show: false }),
                      });
                      return;
                    }
                  }
                  // Simply go to next step
                  if (currentStep < RESUME_STEPS.length - 1)
                    setCurrentStep(currentStep + 1);
                }}
                disabled={currentStep === RESUME_STEPS.length - 1}
                className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                {currentStep < RESUME_STEPS.length - 1 && (
                  <span className="hidden md:inline">
                    : {RESUME_STEPS[currentStep + 1].shortLabel}
                  </span>
                )}
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-6 mt-6 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <span className="text-green-600">✓</span> 100% Percuma
            </span>
            <span className="flex items-center gap-2">
              <span className="text-green-600">✓</span> Tiada kad kredit
              diperlukan
            </span>
            <span className="flex items-center gap-2">
              <span className="text-green-600">✓</span> Data selamat
            </span>
          </div>
        </div>

        {/* Alert Modal */}
        <AlertModal
          show={alertModal.show}
          type={alertModal.type}
          title={alertModal.title}
          message={alertModal.message}
          onClose={() => setAlertModal({ ...alertModal, show: false })}
          onConfirm={alertModal.onConfirm}
        />
      </div>
    );
  }

  // PUBLIC PREVIEW PAGE (Before Registration)
  if (currentPage === "public-preview") {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Top Bar */}
        <div className="bg-white shadow-sm border-b print:hidden">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 w-10 h-10 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  Resume Anda Siap!
                </h1>
                <p className="text-xs text-gray-500">Preview resume anda</p>
              </div>
            </div>

            <button
              onClick={() => {
                // Clear modals when going back to builder
                setShowRegisterModal(false);
                setShowDownloadModal(false);
                setCurrentPage("public-builder");
              }}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              ← Kembali Edit
            </button>
          </div>
        </div>

        {/* Action Bar - UPDATED with 2 buttons */}
        <div className="bg-indigo-50 border-b border-indigo-200 py-4 print:hidden">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
              {/* Save Resume Button */}
              <button
                onClick={() => setShowRegisterModal(true)}
                className="w-full md:w-auto flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-indigo-700 transition shadow-lg"
              >
                <User className="w-5 h-5" />
                Save Resume
              </button>

              {/* Download PDF Button */}
              <button
                onClick={() => setShowDownloadModal(true)}
                className="w-full md:w-auto flex items-center justify-center gap-2 bg-white border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-50 transition"
              >
                <Download className="w-5 h-5" />
                Download PDF
              </button>
            </div>

            {/* Trust signal - UPDATED */}
            <p className="text-center text-sm text-gray-600 mt-3">
              💡 <strong>Daftar percuma</strong> untuk simpan & edit resume
              tanpa had
            </p>
          </div>
        </div>

        {/* Resume Preview */}
        <div className="max-w-4xl mx-auto p-8">
          <div id="resume-content" className="bg-white shadow-lg p-12">
            <div className="text-center border-b-2 border-gray-300 pb-6 mb-6">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {tempResumeData?.fullName}
              </h1>
              <p className="text-gray-600">
                {tempResumeData?.email} | {tempResumeData?.phone}
              </p>
            </div>

            {tempResumeData?.summary && (
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-300 pb-2">
                  Ringkasan Profesional
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {tempResumeData.summary}
                </p>
              </div>
            )}

            {tempResumeData?.experience && (
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-300 pb-2">
                  Pengalaman Kerja
                </h2>
                <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {tempResumeData.experience}
                </div>
              </div>
            )}

            {tempResumeData?.education && (
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-300 pb-2">
                  Pendidikan
                </h2>
                <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {tempResumeData.education}
                </div>
              </div>
            )}

            {tempResumeData?.skills && (
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-300 pb-2">
                  Kemahiran
                </h2>
                <p className="text-gray-700">{tempResumeData.skills}</p>
              </div>
            )}

            {/* Watermark for unregistered users */}
            <div className="text-center mt-12 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-400">
                Dicipta dengan ResumeSegera.my - Daftar percuma untuk buang
                watermark
              </p>
            </div>
          </div>
        </div>

        {/* Register Modal - UPDATED */}
        {showRegisterModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-center rounded-t-xl">
                <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-4xl">💾</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Simpan Resume Anda
                </h3>
                <p className="text-white text-sm">
                  Daftar percuma untuk akses penuh
                </p>
              </div>

              <div className="p-6">
                {/* Benefits List - NEW */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-green-800 font-semibold mb-3">
                    Dengan daftar, anda dapat:
                  </p>
                  <ul className="text-sm text-green-700 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">✓</span>
                      <span>Simpan & edit resume bila-bila masa</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">✓</span>
                      <span>Download tanpa watermark</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">✓</span>
                      <span>Buat cover letter</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">✓</span>
                      <span>Akses dari mana-mana peranti</span>
                    </li>
                  </ul>
                </div>

                {/* Google Sign Up */}
                <button
                  onClick={async () => {
                    localStorage.setItem(
                      "pending_resume",
                      JSON.stringify(tempResumeData)
                    );
                    await handleGoogleLogin();
                  }}
                  className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition mb-3"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Sign Up with Google
                </button>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      atau dengan emel
                    </span>
                  </div>
                </div>

                {/* Email Sign Up */}
                <button
                  onClick={() => {
                    localStorage.setItem(
                      "pending_resume",
                      JSON.stringify(tempResumeData)
                    );
                    setLoginEmail(tempResumeData?.email || ""); // Pre-fill email
                    setAuthMode("signup");
                    setCurrentPage("login");
                  }}
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
                >
                  Sign Up with Email
                </button>

                <button
                  onClick={() => setShowRegisterModal(false)}
                  className="w-full mt-3 text-gray-600 hover:text-gray-800 text-sm"
                >
                  Tutup
                </button>

                {/* Already have account */}
                <p className="text-center text-xs text-gray-500 mt-4">
                  Sudah ada akaun?{" "}
                  <button
                    onClick={() => {
                      localStorage.setItem(
                        "pending_resume",
                        JSON.stringify(tempResumeData)
                      );
                      setAuthMode("signin");
                      setCurrentPage("login");
                    }}
                    className="text-indigo-600 hover:underline font-semibold"
                  >
                    Log In
                  </button>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Download Modal - UPDATED */}
        {showDownloadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-center rounded-t-xl">
                <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Download className="w-8 h-8 text-orange-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Download Resume
                </h3>
                <p className="text-white text-sm">Pilih cara download anda</p>
              </div>

              <div className="p-6">
                {/* Benefits List - NEW */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-800 font-semibold mb-3">
                    Dengan daftar, anda dapat:
                  </p>
                  <ul className="text-sm text-blue-700 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">✓</span>
                      <span>Simpan & edit resume bila-bila masa</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">✓</span>
                      <span>Download tanpa watermark</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">✓</span>
                      <span>Buat cover letter</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">✓</span>
                      <span>Akses dari mana-mana peranti</span>
                    </li>
                  </ul>
                </div>

                {/* Create Account Button */}
                <button
                  onClick={() => {
                    localStorage.setItem(
                      "pending_resume",
                      JSON.stringify(tempResumeData)
                    );
                    setLoginEmail(tempResumeData?.email || ""); // Pre-fill email
                    setAuthMode("signup");
                    setCurrentPage("login");
                  }}
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition mb-3"
                >
                  Create Account
                </button>

                <div className="relative my-3">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">atau</span>
                  </div>
                </div>

                {/* Download Anyway Button */}
                <button
                  onClick={() => {
                    setShowDownloadModal(false);
                    window.print();
                  }}
                  className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  Download PDF Anyway
                </button>
                <p className="text-xs text-center text-gray-500 mt-2">
                  (dengan watermark kecil)
                </p>

                <button
                  onClick={() => setShowDownloadModal(false)}
                  className="w-full mt-3 text-gray-600 hover:text-gray-800 text-sm"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // PREVIEW & DOWNLOAD
  if (currentPage === "preview" && previewResume) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="bg-white shadow-sm border-b print:hidden">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">Preview</h1>
            <div className="flex gap-4">
              <button
                onClick={handleDownloadPDF}
                className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
              >
                <Download className="w-5 h-5" />
                Download PDF
              </button>
              <button
                onClick={() => setCurrentPage("dashboard")}
                className="text-gray-600 hover:text-gray-800"
              >
                ← Back
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-8">
          <div id="resume-content" className="bg-white shadow-lg p-12">
            <div className="text-center border-b-2 border-gray-300 pb-6 mb-6">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {previewResume.full_name}
              </h1>
              <p className="text-gray-600">
                {previewResume.email} | {previewResume.phone}
              </p>
            </div>

            {previewResume.summary && (
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-300 pb-2">
                  Summary
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {previewResume.summary}
                </p>
              </div>
            )}

            {previewResume.experience && (
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-300 pb-2">
                  Experience
                </h2>
                <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {previewResume.experience}
                </div>
              </div>
            )}

            {previewResume.education && (
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-300 pb-2">
                  Education
                </h2>
                <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {previewResume.education}
                </div>
              </div>
            )}

            {previewResume.skills && (
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-300 pb-2">
                  Skills
                </h2>
                <p className="text-gray-700">{previewResume.skills}</p>
              </div>
            )}

            {profile?.plan_type === "free" && (
              <div className="text-center mt-12 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-400">
                  Created with ResumeSegera.my
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // RESET PASSWORD PAGE (when user clicks email link)
  if (currentPage === "reset-password") {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleResetPassword = async () => {
      if (newPassword !== confirmPassword) {
        // REPLACED: alert("Passwords do not match!");
        setAlertModal({
          show: true,
          type: "error",
          title: "Password Tidak Sama",
          message: "Password dan confirm password tidak sepadan",
          onConfirm: null,
        });
        return;
      }

      if (newPassword.length < 6) {
        // REPLACED: alert("Password must be at least 6 characters");
        setAlertModal({
          show: true,
          type: "warning",
          title: "Password Terlalu Pendek",
          message: "Password mesti sekurang-kurangnya 6 aksara",
          onConfirm: null,
        });
        return;
      }

      setLoading(true);
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        // REPLACED: alert("Error: " + error.message);
        setAlertModal({
          show: true,
          type: "error",
          title: "Ralat",
          message: error.message,
          onConfirm: null,
        });
      } else {
        // REPLACED: alert("Password updated successfully!");
        setAlertModal({
          show: true,
          type: "success",
          title: "Berjaya!",
          message: "Password anda telah dikemaskini",
          onConfirm: null,
        });
        setCurrentPage("login");
      }
      setLoading(false);
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="bg-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">New Password</h1>
            <p className="text-gray-600 mt-2">Enter your new password</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleResetPassword()}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="••••••••"
              />
            </div>

            <button
              onClick={handleResetPassword}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </div>
        {/* ADD ALERT MODAL HERE */}
        <AlertModal
          show={alertModal.show}
          type={alertModal.type}
          title={alertModal.title}
          message={alertModal.message}
          onClose={() => setAlertModal({ ...alertModal, show: false })}
          onConfirm={alertModal.onConfirm}
        />
      </div>
    );
  }

  // PRICING PAGE
  if (currentPage === "pricing") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">
              Choose Your Plan
            </h1>
            <button
              onClick={() => setCurrentPage("dashboard")}
              className="text-gray-600 hover:text-gray-800"
            >
              ← Back
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-gray-600 text-lg">
              One-time payment. No subscriptions. No hidden fees.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* 7 Days */}
            <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6 hover:shadow-xl transition">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">7 Days</h3>
                <div className="mb-4">
                  <span className="text-5xl font-bold text-indigo-600">9</span>
                  <span className="text-2xl font-bold text-indigo-600">
                    .90
                  </span>
                  <span className="text-gray-600 ml-1">RM</span>
                </div>
                <p className="text-sm text-gray-500">
                  Perfect for quick job hunt
                </p>
              </div>
              <button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition mb-4">
                Get Started
              </button>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span> 7 days full access
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span> All Pro features
                </li>
              </ul>
            </div>

            {/* 30 Days - POPULAR */}
            <div className="bg-white rounded-xl shadow-2xl border-4 border-indigo-600 p-6 relative transform scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-indigo-600 text-white px-6 py-1 rounded-full text-sm font-bold shadow-lg">
                  MOST POPULAR
                </span>
              </div>
              <div className="text-center mb-6 mt-2">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  30 Days
                </h3>
                <div className="mb-2">
                  <span className="text-5xl font-bold text-indigo-600">19</span>
                  <span className="text-2xl font-bold text-indigo-600">
                    .90
                  </span>
                  <span className="text-gray-600 ml-1">RM</span>
                </div>
                <p className="text-xs text-green-600 font-semibold">Save 33%</p>
                <p className="text-sm text-gray-500 mt-2">
                  Best for active job seekers
                </p>
              </div>
              <button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition mb-4">
                Get Started
              </button>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span> 30 days full access
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span> All Pro features
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span> Priority support
                </li>
              </ul>
            </div>

            {/* 90 Days */}
            <div className="bg-white rounded-xl shadow-lg border-2 border-yellow-400 p-6 hover:shadow-xl transition relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-yellow-400 text-gray-800 px-6 py-1 rounded-full text-sm font-bold shadow-lg">
                  BEST VALUE
                </span>
              </div>
              <div className="text-center mb-6 mt-2">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  90 Days
                </h3>
                <div className="mb-2">
                  <span className="text-5xl font-bold text-indigo-600">49</span>
                  <span className="text-2xl font-bold text-indigo-600">
                    .90
                  </span>
                  <span className="text-gray-600 ml-1">RM</span>
                </div>
                <p className="text-xs text-green-600 font-semibold">Save 44%</p>
                <p className="text-sm text-gray-500 mt-2">
                  Great for career transitions
                </p>
              </div>
              <button className="w-full bg-yellow-400 text-gray-800 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition mb-4">
                Get Started
              </button>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span> 90 days full access
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span> All Pro features
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span> Priority support
                </li>
              </ul>
            </div>

            {/* 365 Days */}
            <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6 hover:shadow-xl transition">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  365 Days
                </h3>
                <div className="mb-2">
                  <span className="text-5xl font-bold text-indigo-600">99</span>
                  <span className="text-2xl font-bold text-indigo-600">
                    .90
                  </span>
                  <span className="text-gray-600 ml-1">RM</span>
                </div>
                <p className="text-xs text-green-600 font-semibold">Save 62%</p>
                <p className="text-sm text-gray-500 mt-2">
                  Ultimate peace of mind
                </p>
              </div>
              <button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition mb-4">
                Get Started
              </button>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span> Full year access
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span> All Pro features
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span> VIP support
                </li>
              </ul>
            </div>
          </div>

          {/* Feature Comparison Table */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-center">
              <h3 className="text-2xl font-bold text-white mb-2">
                Feature Comparison
              </h3>
              <p className="text-indigo-100">
                Everything you need to create stunning resumes
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Feature
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                      Free
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-indigo-600">
                      Pro
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                      Resume Templates
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">
                      1 Basic
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-indigo-600 font-semibold">
                      10+ Premium
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                      Number of Resumes
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">
                      1 Resume
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-indigo-600 font-semibold">
                      Unlimited
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                      PDF Download
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-green-600 text-xl">✓</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-green-600 text-xl">✓</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                      DOCX Download
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-red-500 text-xl">✗</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-green-600 text-xl">✓</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                      AI Resume Writer
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">
                      3 uses/month
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-indigo-600 font-semibold">
                      Unlimited
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                      AI Cover Letter
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">
                      1 Letter
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-indigo-600 font-semibold">
                      Unlimited
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                      ATS Score Checker
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-red-500 text-xl">✗</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-green-600 text-xl">✓</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                      Plain Text Export
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-green-600 text-xl">✓</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-green-600 text-xl">✓</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                      Resume Sharing Links
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-red-500 text-xl">✗</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-green-600 text-xl">✓</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                      Job Description Parser
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-red-500 text-xl">✗</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-green-600 text-xl">✓</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                      Template Switching
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-red-500 text-xl">✗</span>
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-indigo-600 font-semibold">
                      ATS + Infographic
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                      Support
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">
                      Email
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-indigo-600 font-semibold">
                      Priority 24h
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ or Trust Signals */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              Trusted by 1,000+ job seekers in Malaysia 🇲🇾
            </p>
            <div className="flex justify-center gap-8 text-sm text-gray-500">
              <span>✓ Secure Payment</span>
              <span>✓ No Auto-Renewal</span>
              <span>✓ Instant Access</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // LOGOUT SUCCESS PAGE
  if (currentPage === "logout-success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center">
            {/* Success Icon */}
            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            {/* Message */}
            <h1 className="text-3xl font-bold text-gray-800 mb-3">
              Log Keluar Berjaya
            </h1>
            <p className="text-gray-600 mb-8">
              Anda telah berjaya log keluar dari akaun anda.
            </p>

            {/* Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => {
                  setAuthMode("signin");
                  setCurrentPage("login");
                }}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
              >
                Log Masuk Semula
              </button>

              <button
                onClick={() => {
                  // Clear form data when going back to builder
                  setFormData(INITIAL_FORM_DATA);
                  setTempResumeData(null);
                  setEditingResume(null);
                  localStorage.removeItem("temp_resume");

                  setCompletedSteps([]); // <--- TAMBAH INI
                  setCurrentStep(0); // <--- TAMBAH INI

                  // ADD: Clear modal states
                  setShowRegisterModal(false);
                  setShowDownloadModal(false);
                  setAlertModal({
                    show: false,
                    type: "error",
                    title: "",
                    message: "",
                    onConfirm: null,
                  });

                  setCurrentPage("public-builder");
                }}
                className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Kembali ke Laman Utama
              </button>
            </div>

            {/* Additional Info */}
            <p className="text-xs text-gray-500 mt-6">
              Terima kasih kerana menggunakan ResumeSegera
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ADD ALERT MODAL HERE (before return null):
  return (
    <>
      {AlertModal({
        show: alertModal.show,
        type: alertModal.type,
        title: alertModal.title,
        message: alertModal.message,
        onClose: () => setAlertModal({ ...alertModal, show: false }),
        onConfirm: alertModal.onConfirm,
      })}
    </>
  );
  // return null;

  // return null;
}
