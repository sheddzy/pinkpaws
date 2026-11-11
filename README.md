# Pink Paws Groomers website

Next.js 14, Supabase (database, auth, storage), Resend (email), WhatsApp Cloud API, Netlify hosting.

## Included
Six public pages (Home, About Us, Our Services, Our Approach, Insights with article pages, Contact Us), enquiry and consultation forms, database backed enquiry management, email and WhatsApp notification pipeline with logging and retries, admin dashboard, blog CMS with image upload and categories, editable site text, SEO (titles, descriptions, Open Graph, sitemap, robots, structured data), optional Google Analytics.

## Setup, in order
1. Supabase: create a new project for this client. In the SQL editor run `supabase/schema.sql`.
2. Admin user: Authentication, Users, Add user (email and password). Then run, with your email:
   `insert into admins (user_id, email) select id, email from auth.users where email = 'you@example.com';`
3. Environment variables: use `.env.example` as the list and set them in Netlify. The service role key, Resend key and WhatsApp token are server only. Never prefix them with NEXT_PUBLIC_.
4. Deploy: push to GitHub and import into Netlify (`netlify.toml` is included). Add the client domain so HTTPS is issued.
5. Email: verify a sending domain in Resend, set RESEND_API_KEY and EMAIL_FROM, then set the notification address in Admin, Settings.
6. WhatsApp: see below.
7. Photography: add licensed photos to `public/images` and set the paths in `lib/data.js` (IMAGES). Until then a branded panel shows. Use business, meeting, leadership, training or teamwork photos only. No pet imagery.
8. Confirm with the client: mission, vision and values (marked draft on the site), business email, WhatsApp number, exact address (then set NEXT_PUBLIC_MAP_EMBED_URL).

## WhatsApp notifications
Needs a Meta Business account, a WhatsApp Business Platform number, WHATSAPP_TOKEN and WHATSAPP_PHONE_NUMBER_ID. Business initiated messages outside a 24 hour window need an approved template. Create one with six body variables in this order: name, phone, service, summary, submitted time, dashboard link. Set WHATSAPP_TEMPLATE_NAME and WHATSAPP_TEMPLATE_LANG. Without a template a plain text message is sent, which only delivers inside the 24 hour window. Until credentials exist the dashboard shows WhatsApp as skipped with the reason, and the contact page offers a labelled click-to-chat link.

## Reliability
The enquiry is saved first. Each submission has a unique key, so a browser retry never creates a second record. Email and WhatsApp results are stored one row per enquiry and channel, and admins can retry from the enquiry page. "Sent" means the provider accepted the message.

## Spam protection
Honeypot field, minimum fill time, and 5 submissions per hour per hashed IP. For heavier abuse add Cloudflare Turnstile.

## Not verified yet (needs your credentials)
Real email delivery, real WhatsApp delivery, admin sign in against your Supabase project, image upload to Storage, and a Lighthouse pass on the deployed URL.

## Local run
npm install, copy .env.example to .env.local, npm run dev.
