'use client';

import { useState, useEffect } from 'react';
import { User, SprintClass, Deliverable, Certificate } from './types';
import {
  CURRENT_USER,
  INITIAL_CLASSES,
  INITIAL_DELIVERABLES,
  INITIAL_CERTIFICATES,
} from './mockData';
import { calculateSprintXp, calculateMentorTier } from './engine/tierProgression';
import { generateCertificateId, generateCertificateSha256 } from './engine/certificate';

const STORAGE_KEYS = {
  USER: 'mentor_mn_user',
  CLASSES: 'mentor_mn_classes',
  DELIVERABLES: 'mentor_mn_deliverables',
  CERTIFICATES: 'mentor_mn_certificates',
};

export function useMentorStore() {
  const [user, setUser] = useState<User>(CURRENT_USER);
  const [classes, setClasses] = useState<SprintClass[]>(INITIAL_CLASSES);
  const [deliverables, setDeliverables] = useState<Deliverable[]>(INITIAL_DELIVERABLES);
  const [certificates, setCertificates] = useState<Certificate[]>(INITIAL_CERTIFICATES);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
      const savedClasses = localStorage.getItem(STORAGE_KEYS.CLASSES);
      const savedDeliverables = localStorage.getItem(STORAGE_KEYS.DELIVERABLES);
      const savedCertificates = localStorage.getItem(STORAGE_KEYS.CERTIFICATES);

      if (savedUser) {
        try { setUser(JSON.parse(savedUser)); } catch {}
      }
      if (savedClasses) {
        try { setClasses(JSON.parse(savedClasses)); } catch {}
      }
      if (savedDeliverables) {
        try { setDeliverables(JSON.parse(savedDeliverables)); } catch {}
      }
      if (savedCertificates) {
        try { setCertificates(JSON.parse(savedCertificates)); } catch {}
      }
      setIsLoaded(true);
    }
  }, []);

  // Sync to localStorage
  const saveUser = (newUser: User) => {
    setUser(newUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
    }
  };

  const saveClasses = (newClasses: SprintClass[]) => {
    setClasses(newClasses);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(newClasses));
    }
  };

  const saveDeliverables = (newDeliverables: Deliverable[]) => {
    setDeliverables(newDeliverables);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.DELIVERABLES, JSON.stringify(newDeliverables));
    }
  };

  const saveCertificates = (newCertificates: Certificate[]) => {
    setCertificates(newCertificates);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.CERTIFICATES, JSON.stringify(newCertificates));
    }
  };

  /**
   * Learner claims an open seat in a class
   */
  const claimSeat = (classId: string): { success: boolean; message: string } => {
    const targetClass = classes.find((c) => c.id === classId);
    if (!targetClass) return { success: false, message: 'Class not found' };

    if (targetClass.enrolledStudents.some((s) => s.id === user.id)) {
      return { success: false, message: 'You are already enrolled in this class' };
    }

    if (targetClass.enrolledStudents.length >= targetClass.maxSeats) {
      return { success: false, message: 'Class is already full' };
    }

    const updatedEnrolled = [
      ...targetClass.enrolledStudents,
      {
        id: user.id,
        name: user.name,
        school: user.school,
        location: user.location,
        grade: user.grade,
        enrolledAt: new Date().toISOString(),
      },
    ];

    const isFull = updatedEnrolled.length >= targetClass.maxSeats;

    const updatedClasses = classes.map((c) =>
      c.id === classId
        ? {
            ...c,
            enrolledStudents: updatedEnrolled,
            status: isFull ? ('full' as const) : c.status,
          }
        : c
    );

    const updatedUser: User = {
      ...user,
      enrolledClassIds: [...user.enrolledClassIds, classId],
    };

    saveClasses(updatedClasses);
    saveUser(updatedUser);

    return { success: true, message: 'Successfully enrolled in sprint class!' };
  };

  /**
   * Mentor creates a new sprint class
   */
  const createClass = (newClassData: Omit<SprintClass, 'id' | 'mentorId' | 'mentorName' | 'mentorTier' | 'mentorSchool' | 'enrolledStudents' | 'status' | 'createdAt'>): SprintClass => {
    const newClass: SprintClass = {
      ...newClassData,
      id: `class-${Date.now()}`,
      mentorId: user.id,
      mentorName: user.name,
      mentorTier: user.mentorTier,
      mentorSchool: user.school,
      enrolledStudents: [],
      status: 'open',
      createdAt: new Date().toISOString(),
    };

    const updatedClasses = [newClass, ...classes];
    saveClasses(updatedClasses);
    return newClass;
  };

  /**
   * Learner submits a deliverable for a class
   */
  const submitDeliverable = (classId: string, title: string, urlOrNotes: string): Deliverable => {
    const newDeliverable: Deliverable = {
      id: `del-${Date.now()}`,
      classId,
      studentId: user.id,
      studentName: user.name,
      title,
      urlOrNotes,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };

    const updated = [newDeliverable, ...deliverables];
    saveDeliverables(updated);
    return newDeliverable;
  };

  /**
   * Mentor approves a deliverable and awards XP / generates certificate if class complete
   */
  const approveDeliverable = async (deliverableId: string, feedback: string) => {
    const del = deliverables.find((d) => d.id === deliverableId);
    if (!del) return;

    const updatedDeliverables = deliverables.map((d) =>
      d.id === deliverableId
        ? {
            ...d,
            status: 'approved' as const,
            mentorFeedback: feedback,
            approvedAt: new Date().toISOString(),
          }
        : d
    );
    saveDeliverables(updatedDeliverables);

    // Reward mentor with XP
    const cls = classes.find((c) => c.id === del.classId);
    if (cls && cls.mentorId === user.id) {
      const earnedXp = calculateSprintXp(1, 1, 1); // 60 XP for approving deliverable
      const newXp = user.mentorXp + earnedXp;
      const newStudents = user.totalStudentsMentored + 1;
      const newClassesCount = user.completedClasses + 1;
      const newTier = calculateMentorTier(newXp, newClassesCount, newStudents);

      const updatedUser: User = {
        ...user,
        mentorXp: newXp,
        totalStudentsMentored: newStudents,
        completedClasses: newClassesCount,
        mentorTier: newTier,
      };
      saveUser(updatedUser);

      // Issue an official certificate
      const certId = generateCertificateId();
      const issuedDate = new Date().toISOString().split('T')[0];
      const certHours = cls.durationWeeks * 6; // 6 hours/week
      const sha256 = await generateCertificateSha256({
        id: certId,
        mentorName: user.name,
        mentorSchool: user.school,
        tier: newTier,
        totalHours: certHours,
        studentsImpacted: newStudents,
        classTitle: cls.title,
        issuedDate,
      });

      const newCert: Certificate = {
        id: certId,
        mentorId: user.id,
        mentorName: user.name,
        mentorSchool: user.school,
        tier: newTier,
        totalHours: certHours,
        studentsImpacted: newStudents,
        classTitle: cls.title,
        subject: cls.subject,
        sha256Hash: sha256,
        issuedDate,
        verificationUrl: `https://mentor.mn/verify/${certId}`,
      };

      saveCertificates([newCert, ...certificates]);
    }
  };

  return {
    user,
    classes,
    deliverables,
    certificates,
    isLoaded,
    claimSeat,
    createClass,
    submitDeliverable,
    approveDeliverable,
    saveUser,
  };
}
