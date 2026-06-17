import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const TO_EMAIL = 'mh.boddaert@gmail.com'

export async function POST(req: NextRequest) {
  try {
    const { naam, email, onderwerp, bericht } = await req.json()

    if (!naam || !email || !bericht) {
      return NextResponse.json({ error: 'Verplichte velden ontbreken.' }, { status: 400 })
    }

    const { error } = await resend.emails.send({
      from: 'Contactformulier Marie <onboarding@resend.dev>',
      to: TO_EMAIL,
      replyTo: email,
      subject: onderwerp || `Bericht van ${naam}`,
      text: `Naam: ${naam}\nE-mail: ${email}\n\n${bericht}`,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json({ error: 'Versturen mislukt.' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Contact route error:', err)
    return NextResponse.json({ error: 'Onverwachte fout.' }, { status: 500 })
  }
}