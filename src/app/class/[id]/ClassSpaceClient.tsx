'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useMentorStore } from '@/lib/store';
import { useLanguage } from '@/lib/i18n';
import { TIER_CONFIGS } from '@/lib/engine/tierProgression';
import { 
  GraduationCap, 
  Video, 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle2, 
  Upload, 
  Sparkles, 
  ExternalLink, 
  ArrowLeft,
  Flame,
  PlusCircle,
  FileCheck
} from 'lucide-react';

export default function ClassSpaceClient() {
  const params = useParams();
  const classId = params.id as string;
  const { classes, user, deliverables, claimSeat, submitDeliverable, approveDeliverable } = useMentorStore();
  const { language, t } = useLanguage();

  const currentClass = classes.find((c) => c.id === classId);

  const [deliverableTitle, setDeliverableTitle] = useState('');
  const [deliverableUrl, setDeliverableUrl] = useState('');
  const [mentorFeedback, setMentorFeedback] = useState('');
  const [activeTab, setActiveTab] = useState<'roster' | 'deliverables'>('deliverables');
  const [notification, setNotification] = useState<string | null>(null);

  if (!currentClass) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Class Not Found</h1>
        <p className="text-sm text-slate-500">The requested sprint class does not exist or has ended.</p>
        <Link href="/classes" className="inline-block rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white">
          Back to Directory
        </Link>
      </div>
    );
  }

  const isMentor = currentClass.mentorId === user.id;
  const isEnrolled = currentClass.enrolledStudents.some((s) => s.id === user.id);
  const seatsLeft = currentClass.maxSeats - currentClass.enrolledStudents.length;
  const tierConfig = TIER_CONFIGS[currentClass.mentorTier];

  const classDeliverables = deliverables.filter((d) => d.classId === classId);
  const userDeliverable = classDeliverables.find((d) => d.studentId === user.id);

  const handleEnroll = () => {
    const res = claimSeat(currentClass.id);
    setNotification(res.message);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSubmitDeliverable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliverableTitle.trim() || !deliverableUrl.trim()) return;

    submitDeliverable(currentClass.id, deliverableTitle, deliverableUrl);
    setDeliverableTitle('');
    setDeliverableUrl('');
    setNotification('Deliverable submitted for mentor review!');
    setTimeout(() => setNotification(null), 3000);
  };

  const handleApprove = (deliverableId: string) => {
    approveDeliverable(deliverableId, mentorFeedback || 'Verified deliverable meeting mastery standards.');
    setMentorFeedback('');
    setNotification('Deliverable approved! XP awarded & certificate updated.');
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      
      {/* Back Link */}
      <div>
        <Link
          href="/classes"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Classes Directory
        </Link>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200 flex items-center justify-between shadow-sm animate-in fade-in">
          <span>{notification}</span>
        </div>
      )}

      {/* Class Space Header Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-blue-600 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-md">
                {currentClass.subject} • {currentClass.curriculum}
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-extrabold uppercase border ${tierConfig.badgeClass}`}
              >
                <Sparkles className="h-3 w-3" />
                {language === 'mn' ? tierConfig.titleMn : tierConfig.titleEn}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              {currentClass.title}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
              {currentClass.description}
            </p>
          </div>

          {/* Video Launcher */}
          <div className="shrink-0 w-full md:w-auto">
            <a
              href={currentClass.meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-md hover:bg-blue-500 transition-all hover:scale-[1.02] active:scale-95"
            >
              <Video className="h-4 w-4" />
              {t('joinVideoBtn')}
            </a>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="space-y-1">
            <span className="text-slate-500 font-medium">{t('leadMentor')}</span>
            <p className="font-bold text-slate-900 dark:text-white text-sm">
              {currentClass.mentorName}
            </p>
            <p className="text-slate-500">{currentClass.mentorSchool}</p>
          </div>

          <div className="space-y-1">
            <span className="text-slate-500 font-medium">{t('sprintWindow')}</span>
            <p className="font-bold text-slate-900 dark:text-white text-sm">
              {currentClass.durationWeeks} {language === 'mn' ? 'долоо хоног' : 'Weeks'} ({currentClass.startDate} – {currentClass.endDate})
            </p>
            <p className="text-slate-500">{currentClass.scheduleSummary}</p>
          </div>

          <div className="space-y-1">
            <span className="text-slate-500 font-medium">{t('cohortStatus')}</span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 dark:text-white text-sm">
                {currentClass.enrolledStudents.length} / {currentClass.maxSeats} {t('seatsFilled')}
              </span>
              {seatsLeft > 0 ? (
                <span className="text-[11px] font-bold text-emerald-600">
                  ({seatsLeft} {seatsLeft === 1 ? t('seatLeft') : t('seatsLeftPlural')})
                </span>
              ) : (
                <span className="text-[11px] font-bold text-amber-600">({t('classFull')})</span>
              )}
            </div>
            {!isEnrolled && !isMentor && seatsLeft > 0 && (
              <button
                onClick={handleEnroll}
                className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-500"
              >
                {t('claimSeat')} →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs: Deliverables & Roster */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('deliverables')}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'deliverables'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <FileCheck className="h-4 w-4" />
          {t('tabDeliverables')} ({classDeliverables.length})
        </button>

        <button
          onClick={() => setActiveTab('roster')}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'roster'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Users className="h-4 w-4" />
          {t('tabRoster')} ({currentClass.enrolledStudents.length})
        </button>
      </div>

      {/* TAB 1: Deliverables & Proof of Work */}
      {activeTab === 'deliverables' && (
        <div className="space-y-6">
          
          {/* Submit Deliverable Box for Enrolled Students */}
          {isEnrolled && (
            <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-6 shadow-sm dark:border-blue-900 dark:bg-blue-950/20 space-y-4">
              <div className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {t('submitDeliverableTitle')}
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {t('submitDeliverableDesc')}
              </p>

              <form onSubmit={handleSubmitDeliverable} className="space-y-3 pt-2">
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Deliverable Title (e.g. Space Invaders Arcade Game Clone)"
                    value={deliverableTitle}
                    onChange={(e) => setDeliverableTitle(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <input
                    type="url"
                    required
                    placeholder="Link to Artifact (GitHub, Google Drive, or Demo URL)"
                    value={deliverableUrl}
                    onChange={(e) => setDeliverableUrl(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 transition-colors shadow-sm"
                >
                  {t('submitDeliverableBtn')}
                </button>
              </form>
            </div>
          )}

          {/* Pay It Forward Callout (Shown when student has an approved deliverable) */}
          {userDeliverable && userDeliverable.status === 'approved' && (
            <div className="rounded-2xl border-2 border-emerald-400 bg-emerald-50/70 p-6 dark:border-emerald-800 dark:bg-emerald-950/40 space-y-3">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200">
                <Flame className="h-6 w-6 text-amber-500" />
                <h3 className="text-lg font-black tracking-tight">
                  {t('payItForwardTitle')}
                </h3>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed max-w-2xl">
                {t('payItForwardDesc')}
              </p>
              <div className="pt-2">
                <Link
                  href="/classes/create"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-500 transition-all active:scale-95"
                >
                  <PlusCircle className="h-4 w-4" />
                  {t('openClassBtn')}
                </Link>
              </div>
            </div>
          )}

          {/* Deliverables List */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              {t('tabDeliverables')}
            </h3>

            {classDeliverables.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-8 text-center text-xs text-slate-500">
                No deliverables submitted yet for this sprint class.
              </div>
            ) : (
              classDeliverables.map((del) => (
                <div
                  key={del.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {del.title}
                      </h4>
                      <p className="text-xs text-slate-500">
                        Submitted by <strong className="text-slate-700 dark:text-slate-300">{del.studentName}</strong>
                      </p>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
                        del.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {del.status === 'approved' ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5" /> Certified
                        </>
                      ) : (
                        'Under Review'
                      )}
                    </span>
                  </div>

                  <div>
                    <a
                      href={del.urlOrNotes}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
                    >
                      View Artifact Link ↗
                    </a>
                  </div>

                  {del.mentorFeedback && (
                    <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      <strong>{t('mentorFeedbackLabel')}</strong> {del.mentorFeedback}
                    </div>
                  )}

                  {/* Mentor Review Controls */}
                  {isMentor && del.status === 'pending' && (
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                      <input
                        type="text"
                        placeholder="Provide feedback on the deliverable..."
                        value={mentorFeedback}
                        onChange={(e) => setMentorFeedback(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                      <button
                        onClick={() => handleApprove(del.id)}
                        className="rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 transition-colors"
                      >
                        {t('approveDeliverableBtn')}
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

        </div>
      )}

      {/* TAB 2: Class Roster */}
      {activeTab === 'roster' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              {t('tabRoster')} ({currentClass.enrolledStudents.length} / {currentClass.maxSeats})
            </h3>
            {seatsLeft > 0 && (
              <span className="text-xs font-bold text-emerald-600">
                {seatsLeft} {seatsLeft === 1 ? t('seatLeft') : t('seatsLeftPlural')}
              </span>
            )}
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {currentClass.enrolledStudents.map((std, idx) => (
              <div key={std.id} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{std.name}</p>
                    <p className="text-slate-500">
                      {std.grade} • {std.school} ({std.location})
                    </p>
                  </div>
                </div>
                <span className="text-[11px] text-slate-400">Enrolled</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
