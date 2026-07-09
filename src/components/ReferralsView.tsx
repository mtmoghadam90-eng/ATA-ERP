import React, { useState } from 'react';
import { 
  Inbox, 
  CheckCircle2, 
  Clock, 
  Send, 
  User, 
  Briefcase, 
  MessageSquare, 
  ChevronLeft,
  FileCheck2,
  Calendar,
  Paperclip
} from 'lucide-react';
import { ProjectCategoryGroup, Project } from '../types';

interface ReferralsViewProps {
  projectCategoryGroups: ProjectCategoryGroup[];
  projects: Project[];
  respondToReferral: (
    categoryGroupId: string,
    activityId: string,
    responseText: string,
    responderName: string,
    attachment?: { name: string; size: string; content?: string } | null
  ) => void;
  currentUser: string;
}

export default function ReferralsView({
  projectCategoryGroups,
  projects,
  respondToReferral,
  currentUser
}: ReferralsViewProps) {
  const [activeTab, setActiveTab] = useState<'toMe' | 'fromMe'>('toMe');
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [replyAttachments, setReplyAttachments] = useState<Record<string, { name: string; size: string; content?: string } | null>>({});
  const [filterProject, setFilterProject] = useState<string>('all');

  // Flatten all referrals with context
  const allReferrals = projectCategoryGroups.flatMap(group => {
    return (group.activities || [])
      .filter(act => act.referral !== null)
      .map(act => ({
        group,
        activity: act,
        referral: act.referral!
      }));
  });

  // Filter based on tab and project filter
  const filteredReferrals = allReferrals.filter(item => {
    const matchesTab = activeTab === 'toMe' 
      ? item.referral.assignedTo === currentUser
      : item.referral.assignedBy === currentUser;

    const matchesProject = filterProject === 'all' || item.group.projectId === filterProject;

    return matchesTab && matchesProject;
  });

  // Extract unique projects for filter dropdown
  const uniqueProjects = Array.from(
    new Map(allReferrals.map(item => [item.group.projectId, item.group.projectId])).values()
  );

  const handleReplySubmit = (groupId: string, activityId: string) => {
    const text = replyText[`${groupId}-${activityId}`];
    if (!text || !text.trim()) {
      alert('لطفاً شرح اقدام انجام شده را وارد کنید.');
      return;
    }

    const attachment = replyAttachments[`${groupId}-${activityId}`] || null;

    respondToReferral(groupId, activityId, text.trim(), currentUser, attachment);
    setReplyText(prev => ({
      ...prev,
      [`${groupId}-${activityId}`]: ''
    }));
    setReplyAttachments(prev => ({
      ...prev,
      [`${groupId}-${activityId}`]: null
    }));
    alert('نتیجه اقدام با موفقیت ثبت شد.');
  };

  return (
    <div className="space-y-6 animate-fade-in text-right" dir="rtl">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">کارتابل ارجاعات و اقدام‌ها</h1>
          <p className="text-slate-500 text-sm mt-1">مدیریت کارهای ارجاع‌شده بین همکاران، ثبت نتایج کارها و پیگیری وضعیت اقدامات پروژه‌ها</p>
        </div>
      </div>

      {/* Controls: Tabs & Project Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-1">
        {/* Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('toMe')}
            className={`py-3 px-6 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
              activeTab === 'toMe'
                ? 'border-sky-500 text-sky-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Inbox size={16} />
            ارجاع‌شده به من
            {allReferrals.filter(r => r.referral.assignedTo === currentUser && r.referral.status === 'در انتظار اقدام').length > 0 && (
              <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold animate-pulse">
                {allReferrals.filter(r => r.referral.assignedTo === currentUser && r.referral.status === 'در انتظار اقدام').length} کار جدید
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('fromMe')}
            className={`py-3 px-6 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
              activeTab === 'fromMe'
                ? 'border-sky-500 text-sky-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Send size={16} />
            ارجاع‌شده توسط من
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 whitespace-nowrap">فیلتر پروژه:</span>
          <select
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
            className="border border-slate-200 rounded-lg text-xs py-2 px-3 bg-white text-right outline-none focus:ring-2 focus:ring-sky-500/20"
          >
            <option value="all">همه پروژه‌ها</option>
            {uniqueProjects.map(projId => {
              const proj = projects.find(p => p.id === projId);
              return (
                <option key={projId} value={projId}>
                  {proj ? `${proj.name} (${proj.code})` : (projId === 'proj-1' ? 'مخازن اهواز ۳' : `کد ${projId}`)}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Referrals List */}
      <div className="space-y-4">
        {filteredReferrals.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm space-y-3">
            <Inbox className="mx-auto text-slate-300" size={48} />
            <p className="text-sm text-slate-500 font-medium">هیچ اقدام یا ارجاعی در این کارتابل یافت نشد.</p>
          </div>
        ) : (
          filteredReferrals.map((item, idx) => {
            const { group, activity, referral } = item;
            const isPending = referral.status === 'در انتظار اقدام';
            const proj = projects.find(p => p.id === group.projectId);

            return (
              <div 
                key={`${group.id}-${activity.id}-${idx}`} 
                className={`bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md ${
                  isPending ? 'border-r-4 border-r-sky-500' : 'border-r-4 border-r-emerald-500 bg-slate-50/20'
                }`}
              >
                {/* Header Context Bar */}
                <div className="bg-slate-50/80 px-6 py-3 border-b border-slate-100 flex flex-wrap justify-between items-center gap-3">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Briefcase size={14} className="text-slate-400" />
                      <span className="font-bold text-slate-700">پروژه:</span>
                      <span className="font-bold text-sky-700">
                        {proj ? `${proj.name} (${proj.code})` : (group.projectId === 'proj-1' ? 'نوسازی مخازن اهواز ۳' : group.projectId)}
                      </span>
                    </div>
                    {proj && (
                      <>
                        <span className="text-slate-300 hidden md:inline">|</span>
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-slate-700">مشتری:</span>
                          <span className="font-semibold text-slate-600">{proj.customerName}</span>
                        </div>
                      </>
                    )}
                    <span className="text-slate-300">|</span>
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-slate-700">دسته‌بندی:</span>
                      <span className="bg-slate-200/80 text-slate-700 px-2 py-0.5 rounded font-bold">{group.categoryName}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      isPending 
                        ? 'bg-sky-50 text-sky-700 border-sky-100 animate-pulse' 
                        : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                    }`}>
                      {referral.status}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                      <Calendar size={12} />
                      {referral.createdAt}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  
                  {/* Origin Activity */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                      <MessageSquare size={14} className="text-slate-400" />
                      <span>فعالیت ثبت‌شده مرجع:</span>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">{activity.text}</p>
                    {activity.attachment && (
                      activity.attachment.content ? (
                        <a
                          href={activity.attachment.content}
                          download={activity.attachment.name}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-sky-50 hover:bg-sky-100 border border-sky-150 text-sky-700 hover:text-sky-800 text-[10px] font-bold mt-1 transition"
                          title="دانلود فایل پیوست"
                        >
                          <Paperclip size={11} />
                          <span>پیوست: {activity.attachment.name}</span>
                          <span className="text-sky-400">({activity.attachment.size})</span>
                        </a>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-sky-50 border border-sky-100 text-sky-700 text-[10px] font-bold mt-1">
                          <Paperclip size={11} />
                          <span>پیوست: {activity.attachment.name}</span>
                          <span className="text-sky-400">({activity.attachment.size})</span>
                        </div>
                      )
                    )}
                  </div>

                  {/* Referral specifics */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <User size={14} className="text-sky-500" />
                      <span>ارجاع‌دهنده: <strong className="text-slate-800">{referral.assignedBy}</strong></span>
                      <ChevronLeft size={12} className="text-slate-400" />
                      <span>ارجاع‌شونده (شما): <strong className="text-slate-800">{referral.assignedTo}</strong></span>
                    </div>

                    <div className="pt-2">
                      <span className="text-xs font-extrabold text-slate-400 block mb-1">اقدام خواسته‌شده:</span>
                      <p className="text-sm font-bold text-slate-800 bg-sky-50/40 p-3 rounded-lg border border-sky-100/50 leading-relaxed">
                        {referral.actionRequired}
                      </p>
                    </div>
                  </div>

                  {/* Reply section */}
                  {isPending ? (
                    currentUser === referral.assignedTo ? (
                      /* Active response form for assignee */
                      <div className="pt-4 border-t border-slate-100 space-y-3">
                        <span className="text-xs font-extrabold text-slate-700 block">ثبت نتیجه اقدام انجام شده:</span>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <div className="flex-1 space-y-2">
                            <textarea
                              rows={2}
                              placeholder="لطفاً جزییات، خروجی و نتیجه بررسی خود را به صورت متنی بنویسید..."
                              value={replyText[`${group.id}-${activity.id}`] || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                setReplyText(prev => ({
                                  ...prev,
                                  [`${group.id}-${activity.id}`]: val
                                }));
                              }}
                              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none text-right placeholder-slate-400"
                            />

                            {/* File upload section */}
                            <div className="flex items-center gap-3">
                              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold transition">
                                <Paperclip size={14} className="text-slate-400" />
                                <span>افزودن فایل پیوست پاسخ</span>
                                <input
                                  type="file"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      if (file.size > 1024 * 1024) {
                                        alert('حداکثر حجم مجاز برای فایل پیوست ۱ مگابایت (1MB) می‌باشد. لطفاً فایل کوچک‌تری انتخاب کنید.');
                                        return;
                                      }
                                      const reader = new FileReader();
                                      reader.onload = () => {
                                        setReplyAttachments(prev => ({
                                          ...prev,
                                          [`${group.id}-${activity.id}`]: {
                                            name: file.name,
                                            size: (file.size / 1024).toFixed(1) + ' KB',
                                            content: reader.result as string
                                          }
                                        }));
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                />
                              </label>

                              {replyAttachments[`${group.id}-${activity.id}`] && (
                                <div className="flex items-center gap-2 bg-sky-50 text-sky-700 text-xs px-2.5 py-1 rounded-lg border border-sky-100 font-medium">
                                  <span>{replyAttachments[`${group.id}-${activity.id}`]?.name} ({replyAttachments[`${group.id}-${activity.id}`]?.size})</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setReplyAttachments(prev => ({
                                        ...prev,
                                        [`${group.id}-${activity.id}`]: null
                                      }));
                                    }}
                                    className="text-rose-500 hover:text-rose-700 font-bold px-1"
                                    title="حذف فایل"
                                  >
                                    ×
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleReplySubmit(group.id, activity.id)}
                            className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-emerald-500/15 flex items-center justify-center gap-1.5 self-end sm:self-stretch min-h-[42px]"
                          >
                            <CheckCircle2 size={15} />
                            ثبت اتمام کار
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Referral is pending, but current user is not the assignee */
                      <div className="pt-4 border-t border-slate-100 py-2 text-slate-400 text-xs italic">
                        در انتظار پاسخ و اقدام توسط {referral.assignedTo}...
                      </div>
                    )
                  ) : (
                    /* Display visually distinct result / response */
                    <div className="pt-4 border-t border-slate-150 space-y-2 bg-emerald-50/30 p-4 rounded-xl border border-dashed border-emerald-200 animate-fade-in">
                      <div className="flex items-center justify-between text-xs font-bold text-emerald-800">
                        <div className="flex items-center gap-1.5">
                          <FileCheck2 size={16} className="text-emerald-600" />
                          <span>پاسخ و نتیجه اقدام ثبت‌شده:</span>
                        </div>
                        <span className="font-mono text-[10px] text-emerald-600">{referral.response?.createdAt}</span>
                      </div>
                      <p className="text-sm text-slate-800 leading-relaxed font-medium bg-white/70 p-3 rounded-lg border border-emerald-100">
                        {referral.response?.text}
                      </p>

                      {/* Response attachment if any */}
                      {referral.response?.attachment && (
                        <div className="pt-1">
                          {referral.response.attachment.content ? (
                            <a
                              href={referral.response.attachment.content}
                              download={referral.response.attachment.name}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-100/60 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 hover:text-emerald-900 text-[10px] font-bold mt-1 transition"
                              title="دانلود فایل پیوست اقدام"
                            >
                              <Paperclip size={11} className="text-emerald-600" />
                              <span>فایل پیوست پاسخ: {referral.response.attachment.name}</span>
                              <span className="text-emerald-500">({referral.response.attachment.size})</span>
                            </a>
                          ) : (
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-bold mt-1">
                              <Paperclip size={11} />
                              <span>فایل پیوست پاسخ: {referral.response.attachment.name}</span>
                              <span className="text-emerald-500">({referral.response.attachment.size})</span>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="text-[10px] text-slate-400">
                        اقدام کننده: <strong className="text-slate-600">{referral.response?.responder}</strong>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
