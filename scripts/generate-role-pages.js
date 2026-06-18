const fs = require('fs');
const path = require('path');

const roles = [
  {
    slug: 'ingenjor',
    name: 'ingenjör',
    nameCapital: 'Ingenjör',
    intro: 'Som ingenjör konkurrerar du ofta med många sökande med liknande teknisk bakgrund. Det som skiljer dig åt i det personliga brevet är inte vad du kan — det är vad du har byggt, löst och levererat. Rekryterare inom teknik läser snabbt och letar efter konkreta projekt och mätbara resultat.',
    tips: [
      { title: 'Nämn ett specifikt projekt', text: 'Beskriv ett tekniskt projekt med siffror: vad du byggde, vilken metod du använde och vad resultatet blev. "Designade ett automationssystem som minskade manuell handläggning med 40%" är starkare än "van vid automation".' },
      { title: 'Matcha specialisering mot annonsen', text: 'Ingenjörstitlar varierar mycket — maskiningenjör, civilingenjör, mjukvaruingenjör. Anpassa brevet mot exakt det område annonsen efterfrågar och använd deras terminologi.' },
      { title: 'Visa systemtänk', text: 'Rekryterare för ingenjörsroller vill se att du förstår helheten, inte bara din del. Lyft fram hur ditt arbete påverkade andra team, produkten eller kunden.' },
      { title: 'Certifieringar och verktyg på rätt plats', text: 'Nämn relevanta certifieringar (t.ex. Six Sigma, PMP, ISO-standard) men bara om de är relevanta för rollen. Verktyg (AutoCAD, MATLAB, Python) hör hemma i CV:t — brevet handlar om vad du gjort med dem.' },
    ],
    example: {
      label: 'Exempel — öppningsmening för ingenjör',
      text: 'Under tre år på ABB ledde jag konstruktionen av ett styrsystem för industrirobotar som nu används i sju länder — ett projekt som krävde tätt samarbete med produktion, mjukvara och kund under hela livscykeln. Det är den typen av tvärfunktionellt ansvar jag söker mer av hos er.',
    },
    faqs: [
      { q: 'Hur skriver man ett personligt brev som ingenjör?', a: 'Fokusera på konkreta tekniska projekt och mätbara resultat. Undvik generiska påståenden som "tekniskt kunnig" — beskriv istället vad du byggt, vilket problem det löste och vad utfallet blev.' },
      { q: 'Ska ingenjörer skriva personligt brev?', a: 'Ja, de flesta tekniska tjänster kräver det. Ett bra personligt brev som ingenjör visar inte bara teknisk kompetens utan även förmågan att kommunicera — en egenskap arbetsgivare värderar högt.' },
      { q: 'Hur långt ska ett personligt brev för ingenjör vara?', a: 'Max en A4-sida, gärna 3–4 stycken. Rekryterare inom teknik är vana vid dokumentation och läser effektivt — korthet och precision är en fördel.' },
    ],
    related: [
      { href: '/blogg/personligt-brev-it-utvecklare', text: 'Personligt brev IT-utvecklare' },
      { href: '/blogg/personligt-brev-projektledare', text: 'Personligt brev projektledare' },
    ],
  },
  {
    slug: 'sjukskoterska',
    name: 'sjuksköterska',
    nameCapital: 'Sjuksköterska',
    intro: 'Vården är en sektor med hög efterfrågan på personal — men det betyder inte att personliga brev spelar mindre roll. Tvärtom: ett bra brev visar varför du söker just den här avdelningen och arbetsplatsen, och det skiljer dig från de sökande som skickar samma brev till tio ställen.',
    tips: [
      { title: 'Specificera avdelning och patientgrupp', text: 'Skriv om erfarenheter som är relevanta för just den avdelning du söker — akuten, kirurgi, geriatrik. Generella beskrivningar av omvårdnad imponerar inte lika mycket som specifik erfarenhet av patientgruppen.' },
      { title: 'Lyft kliniska färdigheter med kontext', text: 'Istället för att lista procedurer du kan, beskriv ett scenario: "På IVA ansvarade jag för upp till fyra ventilatorbundna patienter per skift" ger mer än "van vid intensivvård".' },
      { title: 'Visa varför just den här arbetsplatsen', text: 'Nämn något specifikt om sjukhuset, kliniken eller vårdcentralen — ett projekt de driver, deras rykte inom ett specialområde, eller deras approach till teambaserad vård.' },
      { title: 'Ta upp samarbete och kommunikation', text: 'Vård är teamarbete. Rekryterare vill veta hur du fungerar med läkare, undersköterskor och patienter. Ge ett konkret exempel på ett svårt samarbete eller en kommunikationsutmaning du löste.' },
    ],
    example: {
      label: 'Exempel — öppningsmening för sjuksköterska',
      text: 'Efter fyra år på Sahlgrenskas ortopedavdelning, med ansvar för postoperativ smärtbehandling och patientutbildning inför hemgång, söker jag nu en roll där jag kan fördjupa mig inom geriatrisk omvårdnad — ett område jag brinner för och som ni på Änggårdens äldreboende har ett starkt rykte för.',
    },
    faqs: [
      { q: 'Hur skriver man personligt brev som sjuksköterska?', a: 'Koppla dina kliniska erfarenheter till den specifika avdelningen eller patientgruppen du söker. Var konkret om vilka procedurer och ansvar du haft, och förklara varför du söker just den här arbetsplatsen.' },
      { q: 'Behöver sjuksköterskor skriva personligt brev?', a: 'Ja, även om vård har personalbrist. Ett personligt brev visar motivation och att du gjort research om arbetsplatsen — viktiga faktorer för chefer som vill anställa någon som stannar.' },
      { q: 'Vad ska man inte skriva i ett personligt brev som sjuksköterska?', a: 'Undvik klichéer som "brinner för vård" utan att backa upp det med konkreta exempel. Undvik också att fokusera för mycket på schema och förmåner i brevet — spara det till intervjun.' },
    ],
    related: [
      { href: '/blogg/personligt-brev-underskoterskam', text: 'Personligt brev undersköterska' },
      { href: '/blogg/hur-skriver-man-personligt-brev', text: 'Hur skriver man ett personligt brev?' },
    ],
  },
  {
    slug: 'larare',
    name: 'lärare',
    nameCapital: 'Lärare',
    intro: 'Ett personligt brev för lärartjänster är i sig ett prov på din pedagogiska förmåga. Rektorer och rekryterare läser det med ett extra filter: kan den här personen kommunicera tydligt, strukturera ett budskap och anpassa sig till sin målgrupp? Ditt brev svarar på den frågan innan intervjun ens börjat.',
    tips: [
      { title: 'Nämn ämne, stadium och skolform', text: 'Var tydlig med vad du undervisar i och på vilken nivå — grundskola F-3, gymnasium, vuxenutbildning. Om du söker en specifik tjänst, anpassa brevet till just det ämnet och den elevgruppen.' },
      { title: 'Beskriv ett pedagogiskt tillvägagångssätt', text: 'Berätta om en konkret undervisningssituation: ett upplägg som fungerade bra, hur du differentierade för olika nivåer, eller hur du engagerade en svår klass. Konkreta exempel väger tyngre än pedagogisk retorik.' },
      { title: 'Visa att du förstår skolans uppdrag', text: 'Läs om skolan eller kommunens skolplan innan du skriver. Referera till deras fokusområden — om de jobbar med formativ bedömning, extra anpassningar eller ett visst pedagogiskt ramverk, koppla till det.' },
      { title: 'Lärarlegitimation och behörighet tidigt', text: 'Om du har legitimation och behörighet för ämnet och stadiet — nämn det i första eller andra stycket. Det är ofta ett grundkrav och spar rekryteraren tid.' },
    ],
    example: {
      label: 'Exempel — öppningsmening för lärare',
      text: 'I mitt klassrum på Lindblomsskolan i Göteborg läser hälften av eleverna inte svenska som modersmål — det har lärt mig att möta varje elev där de är, inte där läroplanen säger att de borde vara. Den erfarenheten tar jag med mig till er skola i Biskopsgården.',
    },
    faqs: [
      { q: 'Hur skriver man personligt brev för lärartjänst?', a: 'Koppla din pedagogiska metod till skolans specifika kontext. Nämn ämne, stadium och behörighet tidigt. Ge ett konkret exempel på en undervisningssituation som visar hur du tänker och arbetar.' },
      { q: 'Vad värderar rektorer i ett personligt brev?', a: 'Konkreta erfarenheter, förmåga att hantera mångfald i klassrummet, och förståelse för skolans uppdrag. Rektorer ser många ansökningar — ett brev som visar att du gjort research om just deras skola sticker ut.' },
      { q: 'Hur långt ska ett personligt brev för lärare vara?', a: 'Tre till fyra stycken, max en A4-sida. Fokusera på kvalitet snarare än kvantitet — ett välskrivet, kortfattat brev visar samma förmåga du förväntas ha i ett klassrum.' },
    ],
    related: [
      { href: '/blogg/personligt-brev-exempel', text: '5 konkreta exempel på personliga brev' },
      { href: '/blogg/personligt-brev-mall', text: 'Personligt brev mall' },
    ],
  },
  {
    slug: 'ekonom',
    name: 'ekonom',
    nameCapital: 'Ekonom',
    intro: 'Ekonomtjänster spänner över ett brett fält — controlling, analys, redovisning, corporate finance. Det första brevet gör är att tydliggöra var du befinner dig i det spektrumet och varför du passar för just den rollen. Utan den tydligheten fastnar du i högen med "allmänna ekonomer".',
    tips: [
      { title: 'Specificera din ekonomiinriktning', text: 'Controller, business analyst, CFO-stöd, internrevision — var tydlig om din specialisering. "Ekonom" är för brett för att imponera på en rekryterare som söker en specifik kompetens.' },
      { title: 'Koppla analysen till affärsnytta', text: 'Beskriv inte bara att du gjort analyser — beskriv vad analyserna ledde till. "Identifierade kostnadsavvikelser som sparade 1,2 mkr per år" är konkret. "Arbetat med ekonomisk analys" är det inte.' },
      { title: 'Nämn system och verktyg i rätt kontext', text: 'ERP-system (SAP, Navision, Fortnox), Excel, Power BI — nämn dem i sammanhanget av vad du gjort med dem, inte som en lista. Rekryterare för ekonomroller söker ofta exakt matchning på system.' },
      { title: 'Visa förståelse för branschen', text: 'En ekonom i industrin tänker annorlunda än en i en SaaS-startup. Visa att du förstår vilka nyckeltal och utmaningar som är relevanta för den bransch du söker till.' },
    ],
    example: {
      label: 'Exempel — öppningsmening för ekonom',
      text: 'Som controller på Hoist Finance har jag under tre år byggt upp månadsvisa rapporteringspaket som används av ledningsgruppen för att fatta beslut om produktmix och prissättning — ett arbete som kräver att man förstår både siffror och affär. Det är den kombinationen jag vill fortsätta utveckla hos er.',
    },
    faqs: [
      { q: 'Hur skriver man personligt brev som ekonom?', a: 'Var specifik om din inriktning (controlling, analys, redovisning) och lyft konkreta resultat. Nämn relevanta system och verktyg i rätt kontext och visa att du förstår branschen du söker till.' },
      { q: 'Vad ska ett personligt brev för ekonom innehålla?', a: 'Tre till fyra stycken: en specifik öppningsmening, dina mest relevanta erfarenheter med resultat, varför just det här företaget, och en tydlig avslutning med CTA. Inkludera nyckelord från jobbannonsen.' },
      { q: 'Hur skiljer sig personligt brev för controller från ekonom?', a: 'Som controller bör du betona budgetansvar, avvikelserapportering och förmågan att kommunicera siffror till icke-finansiella beslutsfattare. Som analytiker lyfter du datadriven beslutsfattning och metodkompetens.' },
    ],
    related: [
      { href: '/blogg/personligt-brev-redovisningsekonom', text: 'Personligt brev redovisningsekonom' },
      { href: '/blogg/ats-vad-ar-det', text: 'Vad är ATS och hur optimerar du ditt brev?' },
    ],
  },
  {
    slug: 'it-utvecklare',
    name: 'IT-utvecklare',
    nameCapital: 'IT-utvecklare',
    intro: 'Inom IT-branschen är det frestande att låta GitHub och portfolion tala för sig själva — men ett personligt brev är fortfarande avgörande för att förklara ditt fokus, din drivkraft och varför du väljer just det här företaget. Teknisk kompetens är hygienfaktorn; brevet är det som avgör om de vill träffa dig.',
    tips: [
      { title: 'Var specifik om tech stack och kontext', text: 'Beskriv inte bara att du kan React — beskriv vad du byggt med det, hur stort projektet var och vilka utmaningar du löste. "Byggde en komponentbiblioteksarkitektur som används av 12 utvecklare" är mer intressant än "5 år med React".' },
      { title: 'Visa systemdesigntänk', text: 'Seniora roller söker utvecklare som kan se helheten. Nämn hur du bidragit till arkitekturbeslut, skalningslösningar eller tekniska val som påverkat hela produkten.' },
      { title: 'Länka till GitHub eller portfölj om det är relevant', text: 'Nämn i brevet om du har öppen källkod eller ett portföljprojekt som är relevant för rollen — men se till att repot faktiskt är välorganiserat och dokumenterat innan du gör det.' },
      { title: 'Koppla tekniken till produktens påverkan', text: 'De bästa utvecklarbreven visar att personen förstår varför de bygger det de bygger. "Optimerade svarstiden från 1,4s till 0,3s, vilket minskade bounce rate med 18%" är starkare än "förbättrade prestanda".' },
    ],
    example: {
      label: 'Exempel — öppningsmening för IT-utvecklare',
      text: 'Under mina två år på Spotify byggde jag delar av det mikrotjänstelagret som hanterar personalisering för 600 miljoner användare — ett arbete i skärningspunkten mellan skalbarhet, latens och dataintegritet. Det är den typen av tekniska utmaningar jag söker mer av hos er.',
    },
    faqs: [
      { q: 'Behöver IT-utvecklare skriva personligt brev?', a: 'Ja, även om tekniska roller ibland fokuserar mer på kodprov. Brevet förklarar din drivkraft, dina val och varför just det här företaget — saker ett GitHub-repo inte berättar.' },
      { q: 'Vad ska man ta med i ett personligt brev som IT-utvecklare?', a: 'Specifik tech stack med kontext, ett eller två projekt med mätbara resultat, varför du är intresserad av företagets produkt eller tekniska utmaningar, och en tydlig CTA.' },
      { q: 'Hur skriver man personligt brev för juniorutvecklare utan erfarenhet?', a: 'Fokusera på sidoprojekt, examensarbete och bidrag till öppen källkod. Beskriv vad du lärde dig och hur fort — rekryterare för juniorroller letar efter lärhastighet och nyfikenhet mer än erfarenhet.' },
    ],
    related: [
      { href: '/blogg/personligt-brev-ingenjor', text: 'Personligt brev ingenjör' },
      { href: '/blogg/ats-vad-ar-det', text: 'Vad är ATS och hur det påverkar din ansökan' },
    ],
  },
  {
    slug: 'projektledare',
    name: 'projektledare',
    nameCapital: 'Projektledare',
    intro: 'Projektledartjänster attraherar sökande med väldigt olika bakgrunder — tekniska profiler, konsulter, chefer på väg in i en ny roll. Ditt personliga brev måste snabbt svara på: vilken typ av projekt, vilka metoder och vilken kontext du är van vid. Rekryterare för PM-roller letar efter bevis på leverans, inte bara process.',
    tips: [
      { title: 'Specificera projekttyp och skala', text: 'IT-projekt, byggprojekt, förändringsprojekt, produktutveckling — det är fundamentalt olika kompetenser. Var tydlig om din erfarenhet och matcha mot vad annonsen söker. Nämn budget och teamstorlek om det är relevant.' },
      { title: 'Nämn metodologi i rätt sammanhang', text: 'PMP, PRINCE2, Scrum Master, SAFe — nämn certifieringar men koppla dem till hur du faktiskt använt metodiken. "Introducerade Scrum i ett 15-personers team och ökade leveransfrekvensen med 3x" är starkare än "certifierad Scrum Master".' },
      { title: 'Visa att du levererat under press', text: 'De bästa projektledarna hanterar avvikelser. Ge ett exempel på ett projekt som gick fel — och hur du hanterade det. Det visar mer kompetens än ett projekt som löpte perfekt.' },
      { title: 'Stakeholder management är en kompetens', text: 'Beskriv hur du hanterat intressenter med olika agendor, kunder med förändrade krav eller intern opposition. Rekryterare vet att tekniska PM-utmaningar ofta är mänskliga utmaningar.' },
    ],
    example: {
      label: 'Exempel — öppningsmening för projektledare',
      text: 'På Trafikverket ledde jag implementationen av ett nytt trafikledningssystem med 34 miljoner kronors budget och 28 interna och externa intressenter — ett projekt som levererades tre veckor före plan trots ett kritiskt systemfel i fas tre. Den erfarenheten av att navigera komplexitet under tryck är vad jag tar med mig till er.',
    },
    faqs: [
      { q: 'Hur skriver man personligt brev som projektledare?', a: 'Lyft konkreta projekt med siffror: budget, teamstorlek, tidsplan och resultat. Visa att du kan hantera avvikelser och intressenter. Nämn metodologi i rätt kontext, inte som en lista.' },
      { q: 'Vad söker rekryterare i ett PM-brev?', a: 'Bevis på leverans under verkliga förhållanden. De vill se att du hanterat motgångar, kommunicerat uppåt och nedåt, och förstår affärsnyttan av dina projekt — inte bara att du följt en metodik.' },
      { q: 'Ska projektledare ta upp certifieringar i brevet?', a: 'Nämn dem kort, men koppla alltid till praktisk erfarenhet. En PMP-certifiering utan ett projekt att backa upp den med är svag. Omvänt: stark leveranshistorik utan certifiering kan vara mer intressant.' },
    ],
    related: [
      { href: '/blogg/personligt-brev-ingenjor', text: 'Personligt brev ingenjör' },
      { href: '/blogg/personligt-brev-ekonom', text: 'Personligt brev ekonom' },
    ],
  },
  {
    slug: 'saljare',
    name: 'säljare',
    nameCapital: 'Säljare',
    intro: 'Ditt personliga brev som säljare är i sig en säljprocess. Rekryterare för säljroller läser det med precis det filtret: kan den här personen öppna starkt, hålla intresset och stänga med en tydlig CTA? Om brevet är otydligt, passivt eller generiskt — varför skulle de tro att du kan sälja deras produkt?',
    tips: [
      { title: 'Öppna med ett konkret siffrat resultat', text: '"Q3 2024 satte jag bolagets rekord för nykundsanskaffning med 23 signerade enterprise-avtal" är en öppningsmening som stannar. Starta aldrig med "Jag är en driven säljare" — det säger alla.' },
      { title: 'Specificera säljmodell och kundtyp', text: 'B2B vs B2C, SMB vs enterprise, transaktionell vs konsultativ försäljning — det är fundamentalt olika kompetenser. Matcha mot vad annonsen söker och var tydlig om din erfarenhet.' },
      { title: 'Nämn kvot och uppfyllnadsgrad', text: 'De flesta säljrekryterare letar specifikt efter kvotuppfyllnad. "Överträffat kvoten 7 kvartal av 8" ger direkt trovärdighet. Om siffrorna är starka — lyft dem tidigt.' },
      { title: 'Avsluta med en CTA som matchar din säljstil', text: '"Jag ser gärna att vi ses för ett samtal nästa vecka" är tydligare och mer trovärdigt från en säljare än det passiva "hoppas på att höra av er".' },
    ],
    example: {
      label: 'Exempel — öppningsmening för säljare',
      text: 'De senaste tre åren på Salesforce har jag ansvarat för en enterprise-pipeline på 40 mkr och stängt 18 avtal med genomsnittligt ACV på 1,2 mkr — alltid med ett fokus på att förstå kundens affär innan jag pitchar en lösning. Det är den konsultativa säljmodellen jag vill fortsätta utveckla hos er.',
    },
    faqs: [
      { q: 'Hur skriver man personligt brev som säljare?', a: 'Öppna med ett konkret säljresultat. Specificera din säljmodell (B2B/B2C, enterprise/SMB). Nämn kvotuppfyllnad och avsluta med en tydlig CTA. Brevet ska i sig demonstrera dina säljfärdigheter.' },
      { q: 'Vilka siffror ska säljare ta med i sitt personliga brev?', a: 'Kvotuppfyllnad (procent och antal kvartal), ACV eller genomsnittlig affärsstorlek, antal nykundsaffärer, pipeline-storlek och ev. rankning i teamet. Välj de 2–3 mest imponerande.' },
      { q: 'Hur långa personliga brev skickar säljare?', a: 'Kortare är bättre — 3 stycken är idealt. En säljare som kan stänga på tre stycken visar mer kompetens än en som behöver fyra. Ryms det inte på halva A4-sidan, skär ner.' },
    ],
    related: [
      { href: '/blogg/personligt-brev-marknadsfforare', text: 'Personligt brev marknadsförare' },
      { href: '/blogg/foljebrev-jobbansökan', text: 'Följebrev jobbansökan — guide' },
    ],
  },
  {
    slug: 'underskoterskam',
    name: 'undersköterska',
    nameCapital: 'Undersköterska',
    intro: 'Som undersköterska är det personliga mötet med patienten kärnan i arbetet — och det bör synas i ditt brev. Rekryterare inom vård och omsorg letar efter sökande som visar empati, pålitlighet och praktisk kompetens. Det handlar lika mycket om person som om utbildning.',
    tips: [
      { title: 'Specificera vilken vård- eller omsorgsform du söker', text: 'Äldreboende, hemtjänst, sjukhusavdelning, psykiatri eller LSS-boende kräver olika kompetenser och personligheter. Var tydlig om var du har din erfarenhet och vad du söker.' },
      { title: 'Lyft ett konkret patientmöte eller situation', text: 'Beskriv kort en situation där du gjorde skillnad för en patient eller brukare. Det behöver inte vara dramatiskt — det kan vara att du uppmärksammade ett förändrat beteende eller skapade trygghet i en svår situation.' },
      { title: 'Nämn praktiska färdigheter i rätt kontext', text: 'Delegerade arbetsuppgifter, förflyttning, sårvård, läkemedelsdelegering — nämn dem men koppla till var och hur du utfört dem. Undvik att lista procedurer utan sammanhang.' },
      { title: 'Visa att du passar teamet', text: 'Omsorg bygger på teamarbete. Beskriv hur du samarbetar med sjuksköterskor, biståndshandläggare och anhöriga — och hur du hanterar stressiga situationer utan att det påverkar patientsäkerheten.' },
    ],
    example: {
      label: 'Exempel — öppningsmening för undersköterska',
      text: 'Under fyra år på Solhems äldreboende i Malmö har jag lärt mig att omsorg handlar lika mycket om att lyssna som att hjälpa — att se vad en person behöver, inte bara vad journalen säger. Det är den inställningen jag tar med mig till er verksamhet.',
    },
    faqs: [
      { q: 'Hur skriver man personligt brev som undersköterska?', a: 'Specificera vilken omsorgsform du söker och lyft en konkret situation som visar din empatiska och praktiska sida. Berätta varför just den här arbetsplatsen eller patientgruppen lockar dig.' },
      { q: 'Behöver undersköterskor skriva personligt brev?', a: 'Ja, även om vården har personalbrist. Enhetschefer söker personal som stannar och trivs — ett brev som visar motivation och rätt personlighet ger dig en klar fördel.' },
      { q: 'Vad ska man ta med i ett personligt brev som undersköterska?', a: 'Vilken typ av vård och vilken patientgrupp du är van vid, ett konkret exempel på ett patientmöte eller samarbetssituation, och varför just den här arbetsplatsen lockar dig.' },
    ],
    related: [
      { href: '/blogg/personligt-brev-sjukskoterska', text: 'Personligt brev sjuksköterska' },
      { href: '/blogg/hur-skriver-man-personligt-brev', text: 'Hur skriver man ett personligt brev?' },
    ],
  },
  {
    slug: 'marknadsfforare',
    name: 'marknadsförare',
    nameCapital: 'Marknadsförare',
    intro: 'Marknadsföring är ett brett fält med skarpa specialiseringar — content, performance, brand, CRM, growth. Ditt personliga brev måste snabbt kommunicera var du befinner dig i det spektrumet och vad du faktiskt levererat. Rekryterare för marknadsroller är tränade på kommunikation — ett svagt brev är ett rött flagg.',
    tips: [
      { title: 'Specificera din kanal och specialisering', text: 'SEO, Google Ads, Meta, e-post, content, PR, brand — var tydlig om vad du är bäst på. "Marknadsförare" är för brett för att imponera på en rekryterare som söker en specifik kompetens.' },
      { title: 'Lyft kampanjresultat med siffror', text: '"Drev en Google Ads-kampanj som genererade 340 nya leads till en CAC på 280 kr" är konkret och intressant. "Jobbat med digital marknadsföring" är det inte.' },
      { title: 'Visa datadriven approach', text: 'Modern marknadsföring är mätbar — visa att du vet hur. Nämn verktyg du använt (GA4, HubSpot, Klaviyo, Looker) i kontexten av beslut de hjälpt dig fatta.' },
      { title: 'Koppla marknadsföringen till affärsresultat', text: 'Gå ett steg bortom kampanjmätningar och visa att du förstår hur din insats påverkade revenue, churn eller kundens LTV. Det visar att du tänker som en affärsperson, inte bara en kampanjhanterare.' },
    ],
    example: {
      label: 'Exempel — öppningsmening för marknadsförare',
      text: 'Under 18 månader som growth marketer på Voi Technology ökade jag organisk trafik med 240% genom en kombination av teknisk SEO, linkbuilding och produktledda innehållskampanjer — och sänkte CAC för nya app-användare med 31%. Det är den datadriven och affärsnära approach jag tar med mig till er.',
    },
    faqs: [
      { q: 'Hur skriver man personligt brev som marknadsförare?', a: 'Var specifik om din kanal och specialisering. Lyft konkreta kampanjresultat med siffror. Visa att du är datadriven och att du förstår kopplingen mellan marknadsföring och affärsresultat.' },
      { q: 'Vilka nyckeltal ska marknadsförare ta med i sitt brev?', a: 'Välj nyckeltal som matchar rollen: CAC, ROAS, CVR, organisk tillväxt, open rate, MQL, churn-påverkan. Välj 1–2 som är starkast och mest relevanta för jobbet du söker.' },
      { q: 'Ska marknadsförare ta med portfölj i ansökan?', a: 'Ja om du har en. Nämn den kort i brevet ("se bifogad portfölj" eller länka) men se till att den faktiskt är välpresenterad. En dålig portfölj är sämre än ingen.' },
    ],
    related: [
      { href: '/blogg/personligt-brev-saljare', text: 'Personligt brev säljare' },
      { href: '/blogg/personligt-brev-exempel', text: '5 konkreta exempel på personliga brev' },
    ],
  },
  {
    slug: 'redovisningsekonom',
    name: 'redovisningsekonom',
    nameCapital: 'Redovisningsekonom',
    intro: 'Redovisning är ett fält där noggrannhet, systemvana och regelkännedom är kärnkompetenser. Ditt personliga brev behöver snabbt visa att du har rätt verktyg, rätt erfarenhet av bokföringsstandard och — lika viktigt — att du är en person de vill ha i ett litet team med högt ansvar.',
    tips: [
      { title: 'Specificera bokföringsnivå och ansvarsområde', text: 'Löpande bokföring, månadsavslut, årsredovisning, koncernredovisning — det är olika komplexitetsnivåer. Var tydlig om vilken nivå du arbetat på och vilket regelverk du är van vid (K2, K3, IFRS).' },
      { title: 'Nämn ERP-system tidigt', text: 'Fortnox, Visma, SAP, Business Central, Xero — specificera vilka system du arbetat i och i vilken kapacitet. Byta system är tidskrävande, arbetsgivare värderar befintlig systemvana högt.' },
      { title: 'Lyft ett exempel på noggrannhet under press', text: 'Månadsavslut med tight deadline, årsredovisning med revision — beskriv en konkret situation där din noggrannhet och systematik gjorde skillnad. Redovisning handlar om att ha rätt, inte nästan rätt.' },
      { title: 'Visa förmåga att kommunicera siffror', text: 'En bra redovisningsekonom kan förklara vad siffrorna betyder för icke-ekonomer. Om du gjort det — rapporterat till ledning, svarat på revisorsfrågor, utbildat kollegor — nämn det.' },
    ],
    example: {
      label: 'Exempel — öppningsmening för redovisningsekonom',
      text: 'På Lindab AB ansvarar jag för månadsavslut och rapportering för tre juridiska enheter med sammantaget 180 mkr i omsättning, i Fortnox och med K3-redovisning. Att hålla tre parallella processer i fas utan fel — det är den kompetensen jag söker att utveckla vidare hos er.',
    },
    faqs: [
      { q: 'Hur skriver man personligt brev som redovisningsekonom?', a: 'Specificera redovisningsnivå (löpande, månadsavslut, årsredovisning), vilket regelverk du är van vid och vilka system du använt. Lyft ett konkret exempel på ansvar och noggrannhet.' },
      { q: 'Vad söker arbetsgivare i en redovisningsekonoms brev?', a: 'Systemvana (specifika ERP-system), regelkännedom (K2/K3/IFRS), erfarenhet av relevanta processer och en person som är pålitlig och noggrann. Ofta söker de också någon som kan kommunicera med icke-ekonomer.' },
      { q: 'Hur skiljer sig brevet för redovisningsekonom från controller?', a: 'Redovisningsekonom betonar compliance, systemkorrekthet och processkännedom. Controller betonar analys, beslutstöd och framåtblickande rapportering. Anpassa brevet efter vilket fokus tjänsten har.' },
    ],
    related: [
      { href: '/blogg/personligt-brev-ekonom', text: 'Personligt brev ekonom' },
      { href: '/blogg/ats-vad-ar-det', text: 'Vad är ATS och hur optimerar du ditt brev?' },
    ],
  },
];

function generatePage(role) {
  const faqJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": role.faqs.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a }
    }))
  });

  const articleJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": `Personligt brev ${role.name} 2026 — exempel och tips`,
    "url": `https://www.snabbrev.se/blogg/personligt-brev-${role.slug}`,
    "publisher": { "@type": "Organization", "name": "Snabbrev", "url": "https://www.snabbrev.se" },
    "datePublished": "2026-06-18",
    "dateModified": "2026-06-18"
  });

  const tipsHtml = role.tips.map(t =>
    `    <h3>${t.title}</h3>\n    <p>${t.text}</p>`
  ).join('\n\n');

  const faqsHtml = role.faqs.map(f =>
    `    <h3>${f.q}</h3>\n    <p>${f.a}</p>`
  ).join('\n\n');

  const relatedHtml = role.related.map(r =>
    `<a href="${r.href}" style="color:var(--a)">${r.text}</a>`
  ).join(' · ');

  return `<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Personligt brev ${role.name} 2026 — exempel och tips | Snabbrev</title>
  <meta name="description" content="Så skriver du ett personligt brev som ${role.name} som faktiskt leder till intervju. Konkreta tips, exempel och mall anpassad för ${role.name}stjänster."/>
  <link rel="canonical" href="https://www.snabbrev.se/blogg/personligt-brev-${role.slug}"/>
  <meta property="og:title" content="Personligt brev ${role.name} 2026 — exempel och tips"/>
  <meta property="og:description" content="Konkreta tips och exempel för att skriva ett personligt brev som ${role.name}."/>
  <meta property="og:url" content="https://www.snabbrev.se/blogg/personligt-brev-${role.slug}"/>
  <meta property="og:type" content="article"/>
  <script type="application/ld+json">${articleJsonLd}</script>
  <script type="application/ld+json">${faqJsonLd}</script>
  <link rel="icon" type="image/svg+xml" href="/favicon.svg"/>
  <script defer src="/_vercel/insights/script.js"></script>
  <style>
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    :root{--bg:#f9f8f6;--s:#fff;--b:#e5e3de;--t:#1a1a18;--m:#6b6963;--a:#2d6a4f;--ah:#245a42;--al:#e8f5ee;--ab:#b7dfc9}
    body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:var(--bg);color:var(--t);line-height:1.7}
    nav{max-width:820px;margin:0 auto;padding:18px 24px;display:flex;align-items:center;justify-content:space-between}
    .logo{font-size:18px;font-weight:700;color:var(--t);text-decoration:none}.logo span{color:var(--a)}
    .nav-cta{font-size:13px;background:var(--a);color:#fff;padding:7px 16px;border-radius:8px;text-decoration:none;font-weight:500}
    .nav-cta:hover{background:var(--ah)}
    article{max-width:680px;margin:0 auto;padding:32px 24px 80px}
    .breadcrumb{font-size:12px;color:var(--m);margin-bottom:24px}
    .breadcrumb a{color:var(--m);text-decoration:none}.breadcrumb a:hover{color:var(--a)}
    h1{font-size:clamp(24px,4vw,38px);font-weight:800;letter-spacing:-.8px;line-height:1.15;margin-bottom:16px}
    .meta{font-size:13px;color:var(--m);margin-bottom:32px;display:flex;gap:16px;flex-wrap:wrap}
    h2{font-size:22px;font-weight:700;letter-spacing:-.3px;margin:40px 0 14px}
    h3{font-size:17px;font-weight:600;margin:28px 0 10px}
    p{font-size:16px;color:var(--t);margin-bottom:16px;line-height:1.75}
    ul,ol{margin:0 0 16px 20px}
    li{font-size:16px;line-height:1.75;margin-bottom:6px}
    strong{font-weight:600}
    .callout{background:var(--al);border-left:3px solid var(--a);border-radius:0 8px 8px 0;padding:16px 20px;margin:24px 0}
    .callout p{margin:0;font-size:15px}
    .example-box{background:var(--s);border:1px solid var(--b);border-radius:12px;padding:24px 28px;margin:24px 0;font-family:Georgia,serif;font-size:15px;line-height:1.85;color:var(--t)}
    .example-label{font-family:-apple-system,sans-serif;font-size:11px;font-weight:700;color:var(--a);text-transform:uppercase;letter-spacing:.06em;margin-bottom:14px;display:block}
    .cta-box{background:var(--a);border-radius:16px;padding:28px 32px;margin:40px 0;text-align:center}
    .cta-box h3{font-size:20px;font-weight:700;color:#fff;margin:0 0 8px}
    .cta-box p{color:rgba(255,255,255,.8);font-size:15px;margin-bottom:20px}
    .cta-link{display:inline-block;background:#fff;color:var(--a);font-weight:700;font-size:15px;padding:12px 28px;border-radius:10px;text-decoration:none}
    .cta-link:hover{background:var(--al)}
    .cta-price{color:rgba(255,255,255,.7);font-size:12px;margin-top:10px}
    footer{text-align:center;font-size:12px;color:var(--m);padding:24px;border-top:1px solid var(--b)}
    footer a{color:var(--m);text-decoration:none}
  </style>
</head>
<body>
<nav>
  <a class="logo" href="/">Snabb<span>rev</span></a>
  <a class="nav-cta" href="/">Generera brev — 49 kr</a>
</nav>
<article>
  <div class="breadcrumb"><a href="/">Snabbrev</a> › <a href="/blogg/hur-skriver-man-personligt-brev">Blogg</a> › Personligt brev ${role.name}</div>

  <h1>Personligt brev ${role.name} 2026 — exempel och tips</h1>
  <div class="meta">
    <span>📅 Juni 2026</span>
    <span>⏱ 6 min läsning</span>
    <span>✍️ Snabbrev</span>
  </div>

  <p>${role.intro}</p>

  <h2>4 tips för ett starkt personligt brev som ${role.name}</h2>

${tipsHtml}

  <h2>Exempel — så kan öppningsmeningen se ut</h2>

  <div class="example-box">
    <span class="example-label">${role.example.label}</span>
    <p>${role.example.text}</p>
  </div>

  <div class="callout">
    <p><strong>Tänk på:</strong> Öppningsmeningen är det viktigaste du skriver. Rekryterare bestämmer inom 10 sekunder om de ska läsa vidare. Testa din öppning på någon och fråga om de vill läsa resten.</p>
  </div>

  <div class="cta-box">
    <h3>Generera ditt personliga brev som ${role.name}</h3>
    <p>Klistra in jobbannonsen och din bakgrund — Snabbrev skriver ett anpassat brev på 30 sekunder.</p>
    <a class="cta-link" href="/">Prova Snabbrev</a>
    <p class="cta-price">49 kr · engångspris · inget konto krävs</p>
  </div>

  <h2>Vanliga frågor om personligt brev som ${role.name}</h2>

${faqsHtml}

  <p>Läs även: ${relatedHtml} · <a href="/blogg/personligt-brev-mall" style="color:var(--a)">Personligt brev mall</a></p>
</article>
<footer>Snabbrev · <a href="/">snabbrev.se</a> · hej@snabbrev.se</footer>
</body>
</html>`;
}

const outDir = path.join(__dirname, '../public/blogg');
roles.forEach(role => {
  const filename = `personligt-brev-${role.slug}.html`;
  fs.writeFileSync(path.join(outDir, filename), generatePage(role), 'utf8');
  console.log(`✓ ${filename}`);
});
console.log(`\nGenererade ${roles.length} sidor.`);
