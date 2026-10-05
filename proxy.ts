import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request: { headers: request.headers } })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const isAdminPath = request.nextUrl.pathname.startsWith('/admin')
  const isLoginPath = request.nextUrl.pathname === '/admin/login'
  // Link uit de reset-mail: sessie komt pas client-side binnen
  const isResetPath = request.nextUrl.pathname === '/admin/wachtwoord'

  if (isAdminPath && !isLoginPath && !isResetPath) {
    if (!user) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    // Ingelogd is niet genoeg: alleen gebruikers in public.admins mogen beheren
    const { data: admin } = await supabase
      .from('admins')
      .select('user_id')
      .eq('user_id', user.id)
      .maybeSingle()
    if (!admin) {
      await supabase.auth.signOut()
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  if (isLoginPath && user) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*'],
}
