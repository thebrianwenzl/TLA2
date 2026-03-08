'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import type { Term, Industry } from '@/types';

interface TermFormProps {
  term?: Term;
  industries: Industry[];
}

export default function TermForm({ term, industries }: TermFormProps) {
  const router = useRouter();
  const isEdit = !!term;
  const [form, setForm] = useState({
    term:         term?.term         ?? '',
    fullForm:     term?.fullForm     ?? '',
    definition:   term?.definition   ?? '',
    exampleJargon:term?.exampleJargon?? '',
    examplePlain: term?.examplePlain ?? '',
    difficulty:   term?.difficulty   ?? 1,
    industryId:   term?.industryId   ?? (industries[0]?.id ?? ''),
  });
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  function set(key: string, value: string | number) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleGenerate() {
    if (!form.term || !form.industryId) return;
    const industry = industries.find((i) => i.id === form.industryId);
    if (!industry) return;
    setGenerating(true);
    setError('');
    try {
      const res = await fetch('/api/admin/generate-term', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ term: form.term, industryName: industry.name }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setForm((f) => ({
        ...f,
        fullForm:      data.fullForm     ?? f.fullForm,
        definition:    data.definition   ?? f.definition,
        exampleJargon: data.exampleJargon?? f.exampleJargon,
        examplePlain:  data.examplePlain ?? f.examplePlain,
        difficulty:    data.difficulty   ?? f.difficulty,
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed — fill in fields manually.');
    } finally {
      setGenerating(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = { ...form, fullForm: form.fullForm || null };
      const res = await fetch(
        isEdit ? `/api/admin/terms/${term!.id}` : '/api/admin/terms',
        {
          method: isEdit ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) throw new Error(await res.text());
      router.push('/admin/terms');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  const field = 'flex flex-col gap-1';
  const label = 'font-body text-sm text-charcoal/70';
  const input = 'border border-charcoal/20 rounded px-3 py-2 font-body text-charcoal bg-ivory focus:outline-none focus:border-cobalt';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg">
      <div className={field}>
        <label className={label}>Industry</label>
        <select className={input} value={form.industryId} onChange={(e) => set('industryId', e.target.value)} required>
          {industries.map((i) => (
            <option key={i.id} value={i.id}>{i.name}</option>
          ))}
        </select>
      </div>

      <div className={field}>
        <label className={label}>Term / Acronym</label>
        <div className="flex gap-2">
          <input
            className={`${input} flex-1`}
            value={form.term}
            onChange={(e) => set('term', e.target.value)}
            required
          />
          <Button
            type="button"
            variant="secondary"
            size="sm"
            loading={generating}
            onClick={handleGenerate}
            disabled={!form.term || !form.industryId}
          >
            Generate with AI
          </Button>
        </div>
      </div>

      <div className={field}>
        <label className={label}>Full Form (leave blank if not an acronym)</label>
        <input className={input} value={form.fullForm} onChange={(e) => set('fullForm', e.target.value)} placeholder="e.g. Key Performance Indicator" />
      </div>

      <div className={field}>
        <label className={label}>Definition</label>
        <textarea className={`${input} resize-none h-20`} value={form.definition} onChange={(e) => set('definition', e.target.value)} required />
      </div>

      <div className={field}>
        <label className={label}>Example (jargon)</label>
        <textarea className={`${input} resize-none h-16`} value={form.exampleJargon} onChange={(e) => set('exampleJargon', e.target.value)} required />
      </div>

      <div className={field}>
        <label className={label}>Example (plain English)</label>
        <textarea className={`${input} resize-none h-16`} value={form.examplePlain} onChange={(e) => set('examplePlain', e.target.value)} required />
      </div>

      <div className={field}>
        <label className={label}>Difficulty</label>
        <select className={input} value={form.difficulty} onChange={(e) => set('difficulty', parseInt(e.target.value))}>
          <option value={1}>1 – Beginner</option>
          <option value={2}>2 – Intermediate</option>
          <option value={3}>3 – Advanced</option>
        </select>
      </div>

      {error && <p className="text-crimson font-body text-sm">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" loading={saving}>{isEdit ? 'Save changes' : 'Create term'}</Button>
        <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
      </div>
    </form>
  );
}
