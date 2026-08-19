SVOM.OS v25 — NETLIFY + SUPABASE

1. SUPABASE
   - SQL Editor > New query.
   - Zaženi celotno datoteko supabase_setup_v25.sql.
   - Skripta ohrani/ustvari osnovne tabele Delovodnika, centralno state tabelo in zaseben bucket za priponke.

2. CONFIG.JS
   - V config.js vpiši Supabase Project URL in Publishable key.
   - NE uporabljaj service_role / secret ključa.

3. NETLIFY
   - Objavi CELOTNO mapo SVOM_OS_v25_NETLIFY_SUPABASE.
   - Lahko jo povlečeš v Netlify Deploys ali povežeš z repozitorijem.

4. KAJ JE CENTRALNO
   - Delovodnik, uporabniki, vrste dela, kategorije, podkategorije in lokacije: Supabase tabele.
   - Načrt dela, moduli, postavitve, obvezna polja, imena zavihkov in zemljevid: svom_os_state.
   - Priponke: zaseben Supabase Storage bucket svom-os-attachments.

5. POMEMBNO
   - Prijava z inicialkami ostaja enaka kot v v25 in ni prava varnostna avtentikacija.
   - Trenutne RLS politike so namenjene tej obstoječi interni/testni logiki s publishable/anon ključem.
   - Za javno produkcijsko izpostavitev je smiselno pozneje dodati Supabase Auth ali omejiti dostop.

ARSO FIX
- ARSO XML se na produkciji pridobiva prek Netlify Function proxyja.
- Razlog: neposredni browser fetch na meteo.arso.gov.si lahko blokira CORS.
- Function: netlify/functions/arso.js
- Endpoint: /.netlify/functions/arso?src=coast
