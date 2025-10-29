import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const token = process.env.REPLICATE_API_TOKEN;
    if (!token) {
      return NextResponse.json(
        {
          error: 'Missing REPLICATE_API_TOKEN environment variable',
          hint: 'Set REPLICATE_API_TOKEN in your root .env.local',
        },
        { status: 500 }
      );
    }

    const body = await req.json();
    const {
      prompt,
      imageUrl,
      imageDataUrl,
      duration,
      seed,
      negative_prompt,
      cfg_scale,
      fps,
      aspect_ratio,
      resolution,
      camera_fixed,
    } = body || {};
    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }
    const finalPrompt = negative_prompt && typeof negative_prompt === 'string' && negative_prompt.trim()
      ? `${prompt.trim()}\nNegative prompt: ${negative_prompt.trim()}`
      : prompt.trim();

    const input: Record<string, any> = { prompt: finalPrompt };
    if (imageDataUrl && typeof imageDataUrl === 'string') {
      input.image = imageDataUrl;
    } else if (imageUrl && typeof imageUrl === 'string' && imageUrl.trim()) {
      input.image = imageUrl.trim();
    }
    if (typeof duration === 'number') input.duration = Math.max(2, Math.min(12, duration));
    if (typeof seed === 'number') input.seed = seed;
    if (typeof fps === 'number') input.fps = fps;
    if (typeof aspect_ratio === 'string' && aspect_ratio) input.aspect_ratio = aspect_ratio;
    if (typeof resolution === 'string' && resolution) input.resolution = resolution;
    if (typeof camera_fixed === 'boolean') input.camera_fixed = camera_fixed;

    // Use Replicate REST API against latest model version
    const createRes = await fetch(
      'https://api.replicate.com/v1/models/bytedance/seedance-1-lite/predictions',
      {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input }),
      }
    );
    const created = await createRes.json();
    if (!createRes.ok) {
      if (createRes.status === 402) {
        return NextResponse.json(
          { error: 'Replicate: Payment Required (insufficient credits). Please add billing or credits to your Replicate account.' },
          { status: 402 }
        );
      }
      const detail = created?.error || created?.detail || created;
      return NextResponse.json(
        {
          error: typeof detail === 'string' ? detail : JSON.stringify(detail),
          status: createRes.status,
        },
        { status: createRes.status || 500 }
      );
    }

    const getUrl: string | undefined = created?.urls?.get;
    const id: string | undefined = created?.id;
    if (!getUrl || !id) {
      return NextResponse.json({ error: 'Invalid prediction response', created }, { status: 500 });
    }

    // Poll until prediction completes
    let status = created.status as string;
    let output: any = created.output;
    const startedAt = Date.now();
    while (!['succeeded', 'failed', 'canceled'].includes(status)) {
      if (Date.now() - startedAt > 120_000) {
        return NextResponse.json({ error: 'Timed out waiting for video generation' }, { status: 504 });
      }
      await new Promise((r) => setTimeout(r, 1500));
      const pollRes = await fetch(getUrl, {
        headers: { 'Authorization': `Token ${token}` },
      });
      const pollJson = await pollRes.json();
      status = pollJson.status;
      output = pollJson.output;
    }

    if (status !== 'succeeded') {
      return NextResponse.json({ error: `Generation ${status}` }, { status: 500 });
    }

    let videoUrl: string | undefined;
    if (typeof output === 'string') {
      videoUrl = output;
    } else if (Array.isArray(output)) {
      videoUrl = output[0];
    } else if (output?.url) {
      videoUrl = output.url;
    }

    if (!videoUrl) {
      return NextResponse.json({ error: 'No video URL in output', output }, { status: 500 });
    }

    return NextResponse.json({ success: true, videoUrl, id });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, endpoint: 'POST /api/text-to-video { prompt }' });
}