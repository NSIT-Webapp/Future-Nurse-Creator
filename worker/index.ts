/**
 * Cloudflare Worker for Future Nurse Creator
 * 
 * Responsibilities:
 * 1. Serves the static SPA frontend (built Vite app in ./dist) via Cloudflare Worker Static Assets.
 * 2. Provides Single-Page Application (SPA) routing so direct visits and refreshes return index.html.
 * 3. Preserves the D1 Database binding `env.DB` for analytics events and session tracking.
 * 4. Provides API endpoints (/api/health, /api/events, /api/stats, /api/export.csv).
 */

interface Env {
  DB: D1Database;
  ASSETS: Fetcher;
}

function jsonResponse(data: unknown, status = 200, headers: HeadersInit = {}): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json;charset=UTF-8',
      'access-control-allow-origin': '*',
      'access-control-allow-headers': 'content-type, authorization',
      'access-control-allow-methods': 'GET, POST, OPTIONS',
      ...headers,
    },
  });
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'access-control-allow-origin': '*',
          'access-control-allow-headers': 'content-type, authorization',
          'access-control-allow-methods': 'GET, POST, OPTIONS',
        },
      });
    }

    // ── API Routes ─────────────────────────────────────────────────────────────
    if (url.pathname.startsWith('/api/')) {
      // Health check endpoint verifying Worker & D1 binding
      if (url.pathname === '/api/health') {
        let dbOk = false;
        try {
          if (env.DB) {
            const res = await env.DB.prepare('SELECT 1 as alive').first();
            dbOk = res?.alive === 1;
          }
        } catch (_e) {
          dbOk = false;
        }

        return jsonResponse({
          status: 'ok',
          service: 'future-nurse-creator',
          d1_binding: Boolean(env.DB),
          db_connected: dbOk,
          timestamp: new Date().toISOString(),
        });
      }

      // Record analytics events
      if (url.pathname === '/api/events' && request.method === 'POST') {
        try {
          const body = await request.json() as Record<string, any>;
          const eventType = body.event_type;
          const sessionId = body.session_id || `sess_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
          const createdAt = body.created_at || new Date().toISOString();
          const metadata = body.metadata ? JSON.stringify(body.metadata) : JSON.stringify(body);

          if (env.DB) {
            // Upsert session
            await env.DB.prepare(
              `INSERT INTO sessions (id, started_at, avatar_style, primary_path, secondary_path, strength_family)
               VALUES (?, ?, ?, ?, ?, ?)
               ON CONFLICT(id) DO UPDATE SET
                 avatar_style = COALESCE(excluded.avatar_style, sessions.avatar_style),
                 primary_path = COALESCE(excluded.primary_path, sessions.primary_path),
                 secondary_path = COALESCE(excluded.secondary_path, sessions.secondary_path),
                 strength_family = COALESCE(excluded.strength_family, sessions.strength_family)`
            )
              .bind(
                sessionId,
                createdAt,
                body.future_look || body.avatar_style || null,
                body.primary_path || null,
                body.secondary_path || null,
                body.strength_family || null
              )
              .run();

            // Insert event
            await env.DB.prepare(
              `INSERT INTO events (session_id, event_type, created_at, metadata)
               VALUES (?, ?, ?, ?)`
            )
              .bind(sessionId, eventType || 'unknown', createdAt, metadata)
              .run();

            // Update session counter flags if applicable
            if (eventType === 'card_created') {
              await env.DB.prepare('UPDATE sessions SET card_created = 1 WHERE id = ?').bind(sessionId).run();
            } else if (eventType === 'card_saved') {
              await env.DB.prepare('UPDATE sessions SET card_saved = 1 WHERE id = ?').bind(sessionId).run();
            } else if (eventType === 'card_shared') {
              await env.DB.prepare('UPDATE sessions SET card_shared = 1 WHERE id = ?').bind(sessionId).run();
            }
          }

          return jsonResponse({ ok: true, session_id: sessionId }, 201);
        } catch (err: any) {
          return jsonResponse({ error: 'Failed to record event', details: err?.message }, 500);
        }
      }

      // Analytics stats
      if (url.pathname === '/api/stats' && request.method === 'GET') {
        try {
          if (!env.DB) {
            return jsonResponse({ error: 'D1 database binding not available' }, 503);
          }

          const [totalSessions, totalEvents, pathCounts] = await Promise.all([
            env.DB.prepare('SELECT COUNT(*) as count FROM sessions').first<{ count: number }>(),
            env.DB.prepare('SELECT COUNT(*) as count FROM events').first<{ count: number }>(),
            env.DB.prepare('SELECT primary_path, COUNT(*) as count FROM sessions WHERE primary_path IS NOT NULL GROUP BY primary_path').all<{ primary_path: string; count: number }>(),
          ]);

          return jsonResponse({
            total_sessions: totalSessions?.count || 0,
            total_events: totalEvents?.count || 0,
            by_path: pathCounts?.results || [],
          });
        } catch (err: any) {
          return jsonResponse({ error: 'Failed to fetch stats', details: err?.message }, 500);
        }
      }

      return jsonResponse({ error: 'Not found', path: url.pathname }, 404);
    }

    // ── Static Assets (Vite SPA) ───────────────────────────────────────────────
    // Fetch static asset from ./dist. If not found and request is for an HTML navigation,
    // fallback to index.html to support SPA client-side routing.
    try {
      const response = await env.ASSETS.fetch(request);
      if (response.status === 404 && request.headers.get('accept')?.includes('text/html')) {
        const indexRequest = new Request(new URL('/', request.url).toString(), request);
        return await env.ASSETS.fetch(indexRequest);
      }
      return response;
    } catch (_err) {
      // Fallback: request index.html directly
      const indexRequest = new Request(new URL('/', request.url).toString(), request);
      return await env.ASSETS.fetch(indexRequest);
    }
  },
};
