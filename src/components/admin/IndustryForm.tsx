'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import type { Industry } from '@/types';

interface IndustryFormProps {
  industry?: Industry;
}

export default function IndustryForm({ industry }: IndustryFormProps) {
  const router = useRouter();
  const isEdit = !!industry;
  const [form, setForm] = useState({
    name:        industry?.name        ?? '',
    slug:        industry?.slug        ?? '',
    description: industry?.description ?? '',
    icon:        industry?.icon        ?? '',
    isActive:    industry?.isActive    ?? true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function set(key: string, value: string | boolean) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const res = await fetch(
        isEdit ? `/api/admin/industries/${industry!.id}` : '/api/admin/industries',
        {
          method: isEdit ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        }
      );
      if (!res.ok) throw new Error(await res.text());
      router.push('/admin/industries');
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
        <label className={label}>Name</label>
        <input className={input} value={form.name} onChange={(e) => set('name', e.target.value)} required />
      </div>
      <div className={field}>
        <label className={label}>Slug (URL-safe)</label>
        <input className={input} value={form.slug} onChange={(e) => set('slug', e.target.value)} required pattern="[a-z0-9-]+" />
      </div>
      <div className={field}>
        <label className={label}>Description</label>
        <textarea className={`${input} resize-none h-20`} value={form.description} onChange={(e) => set('description', e.target.value)} required />
      </div>
      <div className={field}>
        <label className={label}>Icon (emoji)</label>
        <input className={input} value={form.icon} onChange={(e) => set('icon', e.target.value)} required />
      </div>
      <label className="flex items-center gap-2 font-body text-sm text-charcoal cursor-pointer">
        <input type="checkbox" checked={form.isActive} onChange={(e) => set('isActive', e.target.checked)} />
        Active
      </label>
      {error && <p className="text-crimson font-body text-sm">{error}</p>}
      <div className="flex gap-3">
        <Button type="submit" loading={saving}>{isEdit ? 'Save changes' : 'Create industry'}</Button>
        <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
      </div>
    </form>
  );
}
