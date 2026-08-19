const SOURCES = {
  coast: [
    'https://meteo.arso.gov.si/uploads/probase/www/fproduct/text/sl/fcast_si-coast_latest.xml'
  ],
  si: [
    'https://meteo.arso.gov.si/uploads/probase/www/fproduct/text/sl/forecast_si_latest.xml'
  ],
  obala: [
    'https://meteo.arso.gov.si/uploads/probase/www/fproduct/text/sl/fcast_SI_OBALA_latest.xml',
    'https://meteo.arso.gov.si/uploads/probase/www/fproduct/text/sl/fcast_SI_OBALNO-KRASKA_latest.xml'
  ]
};

exports.handler = async function(event) {
  const src = event.queryStringParameters?.src || 'coast';
  const candidates = SOURCES[src];

  if (!candidates) {
    return {
      statusCode: 400,
      headers: {'content-type': 'text/plain; charset=utf-8'},
      body: 'Neznan ARSO vir.'
    };
  }

  let lastError = '';

  for (const url of candidates) {
    try {
      const response = await fetch(url, {
        redirect: 'follow',
        headers: {
          'accept': 'application/xml,text/xml;q=0.9,*/*;q=0.5',
          'user-agent': 'SVOM.OS ARSO weather proxy'
        }
      });

      const body = await response.text();

      if (!response.ok) {
        lastError = `${response.status} ${response.statusText}`;
        continue;
      }

      if (!body || body.length < 50) {
        lastError = 'ARSO je vrnil prazen odgovor.';
        continue;
      }

      return {
        statusCode: 200,
        headers: {
          'content-type': 'application/xml; charset=utf-8',
          'cache-control': 'public, max-age=300, s-maxage=600',
          'access-control-allow-origin': '*',
          'x-svom-arso-source': url
        },
        body
      };
    } catch (err) {
      lastError = err?.message || String(err);
    }
  }

  return {
    statusCode: 502,
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'no-store'
    },
    body: `ARSO vir trenutno ni dosegljiv. ${lastError}`
  };
};
