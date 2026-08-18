// NOTE: Might consider more detailed issue selection.

// e.g. multi-level categories (Billing > Refund), multi-select tags (app crash, GPS, map),
// dynamic fields per issue (station ID picker),
// file upload, contact preference,
// auto-attach context (last booking/station used).

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Mail, User } from 'lucide-react';
import ErrorMessage from '../components/ErrorMessage'
import SuccessMessage from '../components/SuccessMessage'

const API_URL = import.meta.env.VITE_API_URL
const SUPPORT_ENDPOINT = `${API_URL}/support-requests`;
const RECENT_SUCCESS_MESSAGE_LINGER = 5000; // 5 seconds * 1000

export default function SupportRequestForm() {
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [issue, setIssue] = useState('');
  const [description, setDescription] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [isNameEmpty, setIsNameEmpty] = useState(false);
  const [isEmailEmpty, setIsEmailEmpty] = useState(false);
  const [isIssueEmpty, setIsIssueEmpty] = useState(false);
  const [isDescriptionEmpty, setIsDescriptionEmpty] = useState(false);
  const [recentSuccess, setRecentSuccess] = useState(false);

  // Prefill name/email from currentUser if available
  useEffect(() => {
    const raw = localStorage.getItem("currentUser");
    if (!raw) return;
    try {
      const u = JSON.parse(raw);
      const name = [u?.firstName, u?.lastName].filter(Boolean).join(" ").trim();
      setName(name);
      setEmail(u?.email);

    } catch {/* ignore */}
  }, []);

  // auto-clear the warning after 30 seconds so it doesn't linger forever
  useEffect(() => {
    if (recentSuccess) {
      const timer = setTimeout(() => {
        setRecentSuccess(false);
        setSuccess(false);
      }, RECENT_SUCCESS_MESSAGE_LINGER);
      return () => clearTimeout(timer);
    }
  }, [recentSuccess]);


  const handleValidation = (e) => {
    e.preventDefault();

    const isNameEmpty = name.trim() === '';
    const isEmailEmpty = email.trim() === '';
    const isIssueEmpty = issue.trim() === '';
    const isDescriptionEmpty = description.trim() === '';

    setIsNameEmpty(isNameEmpty);
    setIsEmailEmpty(isEmailEmpty);
    setIsIssueEmpty(isIssueEmpty);
    setIsDescriptionEmpty(isDescriptionEmpty);
    setError(null); // Clear previous errors

    if (!isNameEmpty && !isEmailEmpty && !isIssueEmpty && !isDescriptionEmpty) {
      handleSubmit(e);
    }
  };

  const getUserId = () => {
    const raw = localStorage.getItem("currentUser");
    if (!raw) return null;
    try {
      const u = JSON.parse(raw);
      return u?.id || u?._id || null;
    } catch {
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (submitting) return;

    const userId = getUserId();
    if (!userId) {
      setError('Please sign in first.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(SUPPORT_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": String(userId),
        },
        body: JSON.stringify({
          name: name,
          email: email,
          issue: issue,
          description: description,
        }),
      });

      let data;
      try { data = await res.json(); } catch { data = {}; }

      if (!res.ok) {
        throw new Error(data?.message || data?.error || `Submit failed (${res.status})`);
      }

      // Save locally (optional quick UX)
      const prev = JSON.parse(localStorage.getItem("supportRequests") || "[]");
      localStorage.setItem("supportRequests", JSON.stringify([...prev, data]));

      // Clear success message after 5 seconds
      setSuccess(`Support request submitted! ${data.reference ? `Reference: ${data.reference}` : ""}`);
      setRecentSuccess(true);
      
      // Reset form
      setName(name);
      setEmail(email);
      setIssue('');
      setDescription('');
    } catch (err) {
      setError('Unable to submit');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto mt-4 w-full max-w-2xl rounded-lg border border-[#62d48c] bg-[#172235]/85 p-4 text-white shadow-xl backdrop-blur-sm sm:p-5 lg:p-6">
      <h2 className="mb-5 text-center text-2xl font-bold sm:text-3xl lg:text-4xl">Submit a Request</h2>
      
      <form onSubmit={handleValidation} className="flex flex-col">
        {/* Submit Error and Success Messages */}
        {error && (
          <div className="mb-3 rounded-lg border border-red-800 bg-red-100 p-2 text-red-900 [&_.validation]:gap-2">
            <ErrorMessage error={error}/>
          </div>
        )}
        {success && (
          <div className="mb-3 rounded-lg border border-green-800 bg-green-100 p-2 text-green-900 [&_.validation]:gap-2">
            <SuccessMessage message={success}/>
          </div>
        )}
        
        {/* Enter Name */}
        <label className="mb-2 font-medium after:text-red-400 after:content-['_*']">Name</label>
        <div className="relative flex items-center">
          <User className="pointer-events-none absolute left-3 size-5 text-black" />
          <input
            className="w-full rounded-lg border-2 border-white bg-[#d8d8d8] py-2 pr-3 pl-11 text-sm text-black transition placeholder:text-[#363636] hover:border-[#62d48c] focus:border-[#62d48c] focus:bg-white focus:outline-none"
            type="text"
            name="name"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        {/* Name Error Message */}
        {isNameEmpty && (
          <div className="mt-2 rounded-lg border border-red-800 bg-red-100 p-2 text-red-900 [&_.validation]:gap-2">
            <ErrorMessage error='required'/>
          </div>
        )}

        {/* Enter Email */}
        <label className="mt-4 mb-2 font-medium after:text-red-400 after:content-['_*']">Email</label>
        <div className="relative flex items-center">
          <Mail className="pointer-events-none absolute left-3 size-5 text-black" />
          <input
            className="w-full rounded-lg border-2 border-white bg-[#d8d8d8] py-2 pr-3 pl-11 text-sm text-black transition placeholder:text-[#363636] hover:border-[#62d48c] focus:border-[#62d48c] focus:bg-white focus:outline-none"
            type="email"
            name="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}"
          />
        </div>
        {/* Email Error Message */}
        {isEmailEmpty && (
          <div className="mt-2 rounded-lg border border-red-800 bg-red-100 p-2 text-red-900 [&_.validation]:gap-2">
            <ErrorMessage error='required'/>
          </div>
        )}

        {/* Enter Issue */}
        <label className="mt-4 mb-2 font-medium after:text-red-400 after:content-['_*']">Issue Type</label>
        <select
          className="w-full rounded-lg border-2 border-white bg-[#d8d8d8] px-3 py-2 text-sm text-black transition hover:border-[#62d48c] focus:border-[#62d48c] focus:bg-white focus:outline-none"
          name="issue"
          value={issue}
          onChange={(e) => setIssue(e.target.value)}
        >
          <option value="">Select Issue Type</option>
          <option value="station">Can't Find a Station</option>
          <option value="payment">Payment Issue</option>
          <option value="info">Incorrect Station Info</option>
          <option value="other">Other</option>
        </select>
        {/* Issue Error Message */}
        {isIssueEmpty && (
          <div className="mt-2 rounded-lg border border-red-800 bg-red-100 p-2 text-red-900 [&_.validation]:gap-2">
            <ErrorMessage error='required'/>
          </div>
        )}

        {/* Enter Description */}
        <label className="mt-4 mb-2 font-medium after:text-red-400 after:content-['_*']">Description of Issue</label>
        <textarea
          className="min-h-24 w-full resize-y rounded-lg border-2 border-white bg-[#d8d8d8] px-3 py-2 text-sm text-black transition placeholder:text-[#363636] hover:border-[#62d48c] focus:border-[#62d48c] focus:bg-white focus:outline-none"
          name="description"
          placeholder="Describe your issue..."
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {/* Description Error Message */}
        {isDescriptionEmpty && (
          <div className="mt-2 rounded-lg border border-red-800 bg-red-100 p-2 text-red-900 [&_.validation]:gap-2">
            <ErrorMessage error='required'/>
          </div>
        )}

        <button 
          type="submit" 
          className="mt-5 w-full cursor-pointer rounded-lg border-0 bg-linear-to-r from-[#62d48c] via-[#62d48c] to-[#3f795b] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-px hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit Request"}
        </button>
      </form>
    </div>
  );
}
