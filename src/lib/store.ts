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
import { supabase } from './supabase/client';

export function useMentorStore() {
  const [user, setUser] = useState<User>(CURRENT_USER);
  const [classes, setClasses] = useState<SprintClass[]>(INITIAL_CLASSES);
  const [deliverables, setDeliverables] = useState<Deliverable[]>(INITIAL_DELIVERABLES);
  const [certificates, setCertificates] = useState<Certificate[]>(INITIAL_CERTIFICATES);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isRealAuth, setIsRealAuth] = useState(false);

  // Load from Supabase or Fallback
  useEffect(() => {
    async function loadData() {
      try {
        // 1. Check real Supabase user
        const { data: authData } = await supabase.auth.getUser();
        if (authData?.user) {
          setIsRealAuth(true);
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authData.user.id)
            .single();

          if (profile) {
            setUser({
              id: profile.id,
              name: profile.name,
              email: profile.email,
              avatar: profile.avatar_url || CURRENT_USER.avatar,
              gender: profile.gender || 'Prefer not to say',
              age: profile.age || 17,
              grade: profile.grade || '11th Grade',
              school: profile.school || 'General Education School',
              location: profile.location || 'Ulaanbaatar',
              specializations: profile.specializations || [],
              learningGoals: profile.learning_goals || [],
              mentorStatus: profile.mentor_status || 'none',
              achievements: profile.achievements || [],
              mentorTier: profile.mentor_tier || 'JUNIOR_MENTOR',
              mentorXp: profile.mentor_xp || 0,
              totalStudentsMentored: profile.total_students || 0,
              completedClasses: profile.completed_classes || 0,
              enrolledClassIds: [],
            });
          }
        }

        // 2. Fetch classes from Supabase
        const { data: dbClasses } = await supabase
          .from('sprint_classes')
          .select('*, class_enrollments(*, profiles(*))')
          .order('created_at', { ascending: false });

        if (dbClasses && dbClasses.length > 0) {
          const mapped: SprintClass[] = dbClasses.map((c: any) => ({
            id: c.id,
            title: c.title,
            description: c.description,
            mentorId: c.mentor_id,
            mentorName: c.mentor_name,
            mentorTier: c.mentor_tier,
            mentorSchool: c.mentor_school,
            subject: c.subject,
            curriculum: c.curriculum,
            maxSeats: c.max_seats,
            priceMnt: c.price_mnt || 0,
            enrollmentMode: c.enrollment_mode || 'instant',
            missions: c.missions || [],
            startDate: c.start_date,
            endDate: c.end_date,
            durationWeeks: c.duration_weeks,
            scheduleSummary: c.schedule_summary,
            meetingLink: c.meeting_link,
            status: c.status,
            createdAt: c.created_at,
            enrolledStudents: (c.class_enrollments || []).map((e: any) => ({
              id: e.student_id,
              name: e.profiles?.name || 'Student',
              school: e.profiles?.school || 'School',
              location: e.profiles?.location || 'Mongolia',
              grade: e.profiles?.grade || 'High School',
              enrolledAt: e.enrolled_at,
              status: e.status || 'confirmed',
            })),
          }));
          setClasses(mapped);
        }

        // 3. Fetch deliverables
        const { data: dbDeliverables } = await supabase
          .from('deliverables')
          .select('*')
          .order('submitted_at', { ascending: false });

        if (dbDeliverables && dbDeliverables.length > 0) {
          setDeliverables(
            dbDeliverables.map((d: any) => ({
              id: d.id,
              classId: d.class_id,
              studentId: d.student_id,
              studentName: d.student_name,
              title: d.title,
              urlOrNotes: d.url_or_notes,
              mentorFeedback: d.mentor_feedback,
              status: d.status,
              submittedAt: d.submitted_at,
              approvedAt: d.approved_at,
            }))
          );
        }

        // 4. Fetch certificates
        const { data: dbCerts } = await supabase
          .from('certificates')
          .select('*')
          .order('created_at', { ascending: false });

        if (dbCerts && dbCerts.length > 0) {
          setCertificates(
            dbCerts.map((c: any) => ({
              id: c.id,
              mentorId: c.mentor_id,
              mentorName: c.mentor_name,
              mentorSchool: c.mentor_school,
              tier: c.tier,
              totalHours: c.total_hours,
              studentsImpacted: c.students_impacted,
              classTitle: c.class_title,
              subject: c.subject,
              sha256Hash: c.sha256_hash,
              issuedDate: c.issued_date,
              verificationUrl: `https://mentor.mn/verify/${c.id}`,
            }))
          );
        }
      } catch (e) {
        console.warn('Using local store fallback:', e);
      } finally {
        setIsLoaded(true);
      }
    }

    loadData();
  }, []);

  /**
   * Claim an open seat in a sprint class
   */
  const claimSeat = async (classId: string): Promise<{ success: boolean; message: string }> => {
    const targetClass = classes.find((c) => c.id === classId);
    if (!targetClass) return { success: false, message: 'Class not found' };

    if (targetClass.enrolledStudents.some((s) => s.id === user.id)) {
      return { success: false, message: 'You are already enrolled in this class' };
    }

    if (targetClass.enrolledStudents.length >= targetClass.maxSeats) {
      return { success: false, message: 'Class is already full' };
    }

    // Try Supabase insert
    try {
      await supabase.from('class_enrollments').insert({
        class_id: classId,
        student_id: user.id,
      });
    } catch (e) {
      console.warn('Local enrollment fallback');
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
        status: 'confirmed' as const,
      },
    ];

    const isFull = updatedEnrolled.length >= targetClass.maxSeats;

    setClasses((prev) =>
      prev.map((c) =>
        c.id === classId
          ? {
              ...c,
              enrolledStudents: updatedEnrolled,
              status: isFull ? 'full' : c.status,
            }
          : c
      )
    );

    setUser((prev) => ({
      ...prev,
      enrolledClassIds: [...prev.enrolledClassIds, classId],
    }));

    return { success: true, message: 'Successfully enrolled in sprint class!' };
  };

  /**
   * Create a new sprint class
   */
  const createClass = async (
    newClassData: Omit<
      SprintClass,
      'id' | 'mentorId' | 'mentorName' | 'mentorTier' | 'mentorSchool' | 'enrolledStudents' | 'status' | 'createdAt'
    >
  ): Promise<SprintClass> => {
    let generatedId = `class-${Date.now()}`;

    try {
      const { data } = await supabase
        .from('sprint_classes')
        .insert({
          title: newClassData.title,
          description: newClassData.description,
          mentor_id: user.id,
          mentor_name: user.name,
          mentor_school: user.school,
          mentor_tier: user.mentorTier,
          subject: newClassData.subject,
          curriculum: newClassData.curriculum,
          max_seats: newClassData.maxSeats,
          price_mnt: newClassData.priceMnt || 0,
          enrollment_mode: newClassData.enrollmentMode || 'instant',
          missions: newClassData.missions || [],
          start_date: newClassData.startDate,
          end_date: newClassData.endDate,
          duration_weeks: newClassData.durationWeeks,
          schedule_summary: newClassData.scheduleSummary,
          meeting_link: newClassData.meetingLink,
          status: 'open',
        })
        .select()
        .single();

      if (data) {
        generatedId = data.id;
      }
    } catch (e) {
      console.warn('Local class creation fallback');
    }

    const newClass: SprintClass = {
      ...newClassData,
      id: generatedId,
      mentorId: user.id,
      mentorName: user.name,
      mentorTier: user.mentorTier,
      mentorSchool: user.school,
      enrolledStudents: [],
      status: 'open',
      createdAt: new Date().toISOString(),
    };

    setClasses((prev) => [newClass, ...prev]);
    return newClass;
  };

  /**
   * Submit deliverable
   */
  const submitDeliverable = async (classId: string, title: string, urlOrNotes: string): Promise<Deliverable> => {
    let generatedId = `del-${Date.now()}`;

    try {
      const { data } = await supabase
        .from('deliverables')
        .insert({
          class_id: classId,
          student_id: user.id,
          student_name: user.name,
          title,
          url_or_notes: urlOrNotes,
          status: 'pending',
        })
        .select()
        .single();

      if (data) generatedId = data.id;
    } catch (e) {
      console.warn('Local deliverable submission fallback');
    }

    const newDeliverable: Deliverable = {
      id: generatedId,
      classId,
      studentId: user.id,
      studentName: user.name,
      title,
      urlOrNotes,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };

    setDeliverables((prev) => [newDeliverable, ...prev]);
    return newDeliverable;
  };

  /**
   * Approve deliverable & issue certificate
   */
  const approveDeliverable = async (deliverableId: string, feedback: string) => {
    const del = deliverables.find((d) => d.id === deliverableId);
    if (!del) return;

    try {
      await supabase
        .from('deliverables')
        .update({
          status: 'approved',
          mentor_feedback: feedback,
          approved_at: new Date().toISOString(),
        })
        .eq('id', deliverableId);
    } catch (e) {
      console.warn('Local deliverable approval fallback');
    }

    setDeliverables((prev) =>
      prev.map((d) =>
        d.id === deliverableId
          ? {
              ...d,
              status: 'approved' as const,
              mentorFeedback: feedback,
              approvedAt: new Date().toISOString(),
            }
          : d
      )
    );

    const cls = classes.find((c) => c.id === del.classId);
    if (cls && cls.mentorId === user.id) {
      const earnedXp = calculateSprintXp(1, 1, 1);
      const newXp = user.mentorXp + earnedXp;
      const newStudents = user.totalStudentsMentored + 1;
      const newClassesCount = user.completedClasses + 1;
      const newTier = calculateMentorTier(newXp, newClassesCount, newStudents);

      try {
        await supabase
          .from('profiles')
          .update({
            mentor_xp: newXp,
            total_students: newStudents,
            completed_classes: newClassesCount,
            mentor_tier: newTier,
          })
          .eq('id', user.id);
      } catch (e) {}

      setUser((prev) => ({
        ...prev,
        mentorXp: newXp,
        totalStudentsMentored: newStudents,
        completedClasses: newClassesCount,
        mentorTier: newTier,
      }));

      // Issue certificate
      const certId = generateCertificateId();
      const issuedDate = new Date().toISOString().split('T')[0];
      const certHours = cls.durationWeeks * 6;
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

      try {
        await supabase.from('certificates').insert({
          id: certId,
          mentor_id: user.id,
          mentor_name: user.name,
          mentor_school: user.school,
          tier: newTier,
          total_hours: certHours,
          students_impacted: newStudents,
          class_title: cls.title,
          subject: cls.subject,
          sha256_hash: sha256,
          issued_date: issuedDate,
        });
      } catch (e) {}

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

      setCertificates((prev) => [newCert, ...prev]);
    }
  };

  return {
    user,
    classes,
    deliverables,
    certificates,
    isLoaded,
    isRealAuth,
    claimSeat,
    createClass,
    submitDeliverable,
    approveDeliverable,
  };
}
