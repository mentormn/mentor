'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMentorStore } from '@/lib/store';
import { 
  GraduationCap, 
  Users, 
  Calendar, 
  Video, 
  Clock, 
  BookOpen, 
  ArrowLeft,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';

export default function CreateClassPage() {
  const router = useRouter();
  const { user, createClass } = useMentorStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('Mathematics');
  const [curriculum, setCurriculum] = useState('Cambridge AS/A-Level');
  const [maxSeats, setMaxSeats] = useState<number>(3);
  const [durationWeeks, setDurationWeeks] = useState<number>(2);
  const [startDate, setStartDate] = useState('2026-09-25');
  const [endDate, setEndDate] = useState('2026-10-09');
  const [scheduleSummary, setScheduleSummary] = useState('Tuesdays & Thursdays, 18:30 - 20:00 (MNT)');
  const [meetingLink, setMeetingLink] = useState('https://meet.google.com/new');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newClass = await createClass({
      title,
      description,
      subject,
      curriculum,
      maxSeats,
      durationWeeks,
      startDate,
      endDate,
      scheduleSummary,
      meetingLink,
    });

    router.push(`/class/${newClass.id}`);
  };

  const getCapacityLabel = (seats: number) => {
    if (seats === 1) return '1-on-1 Intensive Mentorship';
    if (seats <= 3) return 'Micro-Pod (Recommended: High collaboration)';
    return 'Small Cohort Class';
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      
      {/* Back button */}
      <div>
        <Link
          href="/classes"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Classes Directory
        </Link>
      </div>

      {/* Header */}
      <div className="space-y-2 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="inline-flex items-center gap-1.5 rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
          <GraduationCap className="h-4 w-4" />
          Mentor Class Creation Wizard
        </div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          Open a Sprint Class
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Teach what you mastered. Pick your seat capacity (1 to 10 seats), schedule your 1–3 week sprint, and help younger peers learn with genuine mastery.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Topic Title */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Class Title & Specific Focus *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Cambridge AS Mathematics: Differentiation Mastery & Mechanics"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:focus:border-blue-400 text-slate-900 dark:text-white"
          />
          <p className="text-[11px] text-slate-500">
            Be specific about the conceptual bottleneck or project you will guide students through.
          </p>
        </div>

        {/* Subject & Curriculum */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Subject Domain *
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:focus:border-blue-400 text-slate-900 dark:text-white"
            >
              <option value="Mathematics">Mathematics</option>
              <option value="Physics">Physics</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Informatics">Informatics & Olympiad</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Robotics">Robotics & Engineering</option>
              <option value="English">Academic English</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Curriculum Standard *
            </label>
            <select
              value={curriculum}
              onChange={(e) => setCurriculum(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:focus:border-blue-400 text-slate-900 dark:text-white"
            >
              <option value="Cambridge AS/A-Level">Cambridge AS/A-Level</option>
              <option value="Mongolian 12-Year">Mongolian 12-Year General Standard</option>
              <option value="National Olympiad">National Olympiad Preparation</option>
              <option value="IB Diploma">IB Diploma</option>
              <option value="Practical Engineering">Practical Project / Engineering</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Sprint Overview & Deliverable Goal *
          </label>
          <textarea
            rows={3}
            required
            placeholder="Explain what problems you will solve together, and what artifact (project, code, or proof set) students will complete by the end of the sprint..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:focus:border-blue-400 text-slate-900 dark:text-white"
          />
        </div>

        {/* Seat Capacity Slider (1 to 10 Seats) */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-900/50 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              Seat Capacity (Cohort Size): <span className="text-blue-600 text-base">{maxSeats} {maxSeats === 1 ? 'Seat' : 'Seats'}</span>
            </label>
            <span className="text-xs font-semibold text-slate-500">
              {getCapacityLabel(maxSeats)}
            </span>
          </div>

          <input
            type="range"
            min={1}
            max={10}
            step={1}
            value={maxSeats}
            onChange={(e) => setMaxSeats(Number(e.target.value))}
            className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer dark:bg-slate-700"
          />

          <div className="flex justify-between text-[10px] font-bold text-slate-400">
            <span>1 Seat (1-on-1)</span>
            <span>3 Seats (Micro-Pod)</span>
            <span>5 Seats</span>
            <span>10 Seats (Cohort)</span>
          </div>
        </div>

        {/* Duration & Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Duration *
            </label>
            <select
              value={durationWeeks}
              onChange={(e) => setDurationWeeks(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:focus:border-blue-400 text-slate-900 dark:text-white"
            >
              <option value={1}>1 Week (Intensive)</option>
              <option value={2}>2 Weeks (Standard Sprint)</option>
              <option value={3}>3 Weeks (Deep Mastery)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Start Date *
            </label>
            <input
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:focus:border-blue-400 text-slate-900 dark:text-white"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              End Date *
            </label>
            <input
              type="date"
              required
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:focus:border-blue-400 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Schedule & Video Link */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Schedule Summary *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Tuesdays & Thursdays, 18:30 - 20:00 (MNT)"
              value={scheduleSummary}
              onChange={(e) => setScheduleSummary(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:focus:border-blue-400 text-slate-900 dark:text-white"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Meeting Video Link *
            </label>
            <input
              type="url"
              required
              placeholder="https://meet.google.com/xyz-abc-123"
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:focus:border-blue-400 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-md hover:bg-blue-500 transition-all hover:scale-[1.01] active:scale-95"
          >
            Publish Sprint Class & Open Seats
          </button>
        </div>

      </form>

    </div>
  );
}
