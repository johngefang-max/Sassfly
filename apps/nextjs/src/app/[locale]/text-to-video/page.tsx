"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getTranslations, type Locale } from '../../../lib/i18n';

export default function TextToVideoPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const t = getTranslations(locale as Locale);

  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(5);
  const [seed, setSeed] = useState<number | ''>('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [cfgScale, setCfgScale] = useState<number | ''>('');
  const [fps, setFps] = useState<number>(24);
  const [aspectRatio, setAspectRatio] = useState<string>('16:9');
  const [resolution, setResolution] = useState<string>('720p');
  const [cameraFixed, setCameraFixed] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setVideoUrl(null);
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/text-to-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          imageUrl: imageUrl?.trim() || undefined,
          imageDataUrl: imageDataUrl || undefined,
          duration,
          seed: seed === '' ? undefined : Number(seed),
          negative_prompt: negativePrompt?.trim() || undefined,
          cfg_scale: cfgScale === '' ? undefined : Number(cfgScale),
          fps,
          aspect_ratio: aspectRatio,
          resolution,
          camera_fixed: cameraFixed,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Request failed');
      setVideoUrl(data.videoUrl);
    } catch (err: any) {
      setError(err?.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">{t.textToVideo}</h1>
          <p className="text-gray-600 mt-2">{t.textToVideoDesc}</p>
        </div>

        <form onSubmit={handleGenerate} className="bg-white rounded-lg shadow p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="prompt">
            {t.videoPrompt}
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            className="w-full border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder={t.videoPrompt}
          />

          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-900 mb-3">{t.videoSettings}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1" htmlFor="imageUrl">{t.imageUrl}</label>
                <input
                  id="imageUrl"
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full border rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1" htmlFor="imageFile">{t.uploadImageFile}</label>
                <input
                  id="imageFile"
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () => setImageDataUrl(reader.result as string);
                    reader.readAsDataURL(file);
                  }}
                  className="w-full border rounded-md p-2"
                />
                {(imageDataUrl || imageUrl) && (
                  <div className="mt-2 flex items-center gap-3">
                    {(imageDataUrl || imageUrl) && (
                      <img
                        src={imageDataUrl || imageUrl}
                        alt="preview"
                        className="h-14 w-14 rounded object-cover border"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => { setImageDataUrl(null); setImageUrl(''); }}
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      {t.clearImage}
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1" htmlFor="duration">{t.duration}</label>
                <input id="duration" type="number" min={2} max={12} value={duration} onChange={(e) => setDuration(Number(e.target.value) || 5)} className="w-full border rounded-md p-2" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1" htmlFor="seed">{t.seed}</label>
                <div className="flex gap-2">
                  <input id="seed" type="number" value={seed} onChange={(e) => setSeed(e.target.value === '' ? '' : Number(e.target.value))} className="w-full border rounded-md p-2" />
                  <button type="button" className="px-3 py-2 border rounded-md" onClick={() => setSeed(Math.floor(Math.random() * 1000000))}>{t.randomizeSeed}</button>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1" htmlFor="fps">{t.fps}</label>
                <input id="fps" type="number" min={1} max={60} value={fps} onChange={(e) => setFps(Number(e.target.value) || 24)} className="w-full border rounded-md p-2" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1" htmlFor="aspect">{t.aspectRatio}</label>
                <select id="aspect" value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)} className="w-full border rounded-md p-2">
                  <option value="16:9">16:9</option>
                  <option value="9:16">9:16</option>
                  <option value="1:1">1:1</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1" htmlFor="resolution">{t.resolution}</label>
                <select id="resolution" value={resolution} onChange={(e) => setResolution(e.target.value)} className="w-full border rounded-md p-2">
                  <option value="480p">480p</option>
                  <option value="720p">720p</option>
                </select>
              </div>
              <div className="flex items-center gap-2 mt-6 md:mt-0">
                <input id="cameraFixed" type="checkbox" checked={cameraFixed} onChange={(e) => setCameraFixed(e.target.checked)} />
                <label htmlFor="cameraFixed" className="text-sm text-gray-700">{t.cameraFixed}</label>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm text-gray-700 mb-1" htmlFor="negativePrompt">{t.negativePrompt} ({t.optional})</label>
                <input id="negativePrompt" type="text" value={negativePrompt} onChange={(e) => setNegativePrompt(e.target.value)} className="w-full border rounded-md p-2" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1" htmlFor="cfgScale">{t.cfgScale} ({t.optional})</label>
                <input id="cfgScale" type="number" min={0} max={20} step={0.1} value={cfgScale} onChange={(e) => setCfgScale(e.target.value === '' ? '' : Number(e.target.value))} className="w-full border rounded-md p-2" />
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? t.generatingVideo : t.generateVideo}
            </button>
            <Link href={`/${locale}/`} className="text-gray-600 hover:text-gray-900">
              {t.home}
            </Link>
          </div>
        </form>

        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-3">{t.videoPreview}</h2>
          {error && (
            <div className="p-3 rounded-md bg-red-50 text-red-700 border border-red-200 mb-4">{error}</div>
          )}
          {videoUrl ? (
            <div className="bg-white rounded-lg shadow p-4">
              <video src={videoUrl} controls className="w-full rounded" />
              <a href={videoUrl} download className="mt-3 inline-block text-purple-600 hover:text-purple-800">
                {t.downloadVideo}
              </a>
            </div>
          ) : (
            <div className="text-gray-500">No video yet. Generate to preview.</div>
          )}
        </div>
      </div>
    </div>
  );
}