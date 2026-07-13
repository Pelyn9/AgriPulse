type LangCode = 'en' | 'fil' | 'ceb';

interface TipsLang {
  en: string[];
  fil: string[];
  ceb: string[];
}

const tipsPool: Record<string, TipsLang> = {
  Healthy: {
    en: [
      'Keep soil moist but not flooded — use alternate wetting and drying',
      'Apply balanced NPK fertilizer (14-14-14) every 2 weeks as maintenance',
      'Remove weeds regularly to reduce competition for nutrients',
      'Monitor weekly for early signs of pests or nutrient deficiencies',
      'Rotate crops after harvest — avoid rice-on-rice every season',
      'Add compost or vermicompost to maintain soil organic matter',
      'Maintain proper plant spacing (20×20 cm) for good air circulation',
      'Use loamy soil with good drainage — add organic matter if soil is sandy or clay-heavy',
      'Keep soil pH between 5.5–6.5 for best nutrient availability and root growth',
    ],
    fil: [
      'Panatilihin ang tamang patubig — basa ang lupa pero huwag lubog sa tubig',
      'Maglagay ng balanced NPK fertilizer (14-14-14) kada dalawang linggo',
      'Alisin ang mga damo para hindi makipag-compete sa sustansya ng palay',
      'Mag-monitor linggo-linggo para sa maagang senyales ng peste o kakulangan',
      'Magrotate ng pananim — huwag palay-sa-palay kada season',
      'Maglagay ng compost o dumi ng hayop para mapanatili ang sustansya ng lupa',
      'Panatilihin ang tamang distansya ng tanim (20×20 cm) para sa magandang daloy ng hangin',
      'Gamitin ang mabuhangin-malabong (loam) na lupa — maglagay ng organikong bagay kung mabuhangin o mabigat ang lupa',
      'Panatilihin ang pH ng lupa sa 5.5–6.5 para sa pinakamainam na sustansya at paglaki ng ugat',
    ],
    ceb: [
      'Hupti nga basa ang yuta apan dili lubog — gamiti ang alternate wetting and drying',
      'Butangi og balanced NPK fertilizer (14-14-14) matag duha ka semana',
      'Kuhaa ang mga sagbot aron dili makigkompetensya sa sustansya',
      'Bantayan kada semana ang mga timailhan sa peste o kakulangan',
      'Ilisi ang itanom human ani — ayaw palay-sa-palay kada panahon',
      'Butangi og compost o hugaw sa hayop aron mapadayon ang sustansya sa yuta',
      'Hupti ang hustong gilay-on sa pagtanom (20×20 cm) para maayo ang sirkulasyon sa hangin',
      'Gamiti ang loam nga yuta — butangi og organikong butang kun balason o yutang kulonon ang yuta',
      'Hupti ang pH sa yuta tali sa 5.5–6.5 para sa labing maayong sustansya ug pagtubo sa gamot',
    ],
  },
  'Nitrogen Deficiency': {
    en: [
      'Apply Urea (46-0-0) immediately — 1 sack (50 kg) per hectare, split into 2-3 applications',
      'Use organic compost or chicken manure for slow-release nitrogen',
      'Avoid over-application — excess N attracts pests and causes lodging',
      'New green growth should appear within 5-7 days after application',
      'Plant munggo or cowpea as cover crop after harvest to restore N',
      'Apply vermicompost (1 ton/ha) to improve soil nitrogen content',
      'Use ammonium sulfate (21-0-0) for faster absorption in cold soil',
      'Sandy and loamy soils lose N quickly — add compost to improve nutrient retention',
      'Flood the field lightly after applying urea to prevent N escaping as gas',
    ],
    fil: [
      'Maglagay ng Urea (46-0-0) agad — 1 sako (50 kg) kada ektarya, hatiin sa 2-3 beses',
      'Gamitan ng organic compost o dumi ng manok/baka para sa mabagal na paglabas ng nitrogen',
      'Huwag sobraan — ang labis na N ay nakakaakit ng peste at nagpapalugmok ng palay',
      'Asahan ang bagong luntiang dahon sa loob ng 5-7 araw pagkatapos maglagay',
      'Itanim ang munggo o sitaw pagkatapos ng anihan para maibalik ang nitrogen sa lupa',
      'Maglagay ng vermicompost (1 ton/ektarya) para mapabuti ang nitrogen content',
      'Gamitin ang ammonium sulfate (21-0-0) para sa mabilis na absorption sa malamig na lupa',
      'Ang mabuhangin at mabuhangin-malabong lupa ay mabilis mawalan ng N — maglagay ng compost para tumagal',
      'Bahaing bahagya ang palayan pagkatapos maglagay ng urea para hindi sumingaw ang N bilang gas',
    ],
    ceb: [
      'Butangi og Urea (46-0-0) dayon — 1 sako (50 kg) kada ektarya, bahina sa 2-3 ka higayon',
      'Gamiti og organic compost o hugaw sa manok/baka para anam-anam nga paggawas sa nitrogen',
      'Ayaw sobrahi — ang daghang N makadani sa peste ug makapahigda sa humay',
      'Ang bag-ong lunhaw nga dahon makita sulod sa 5-7 ka adlaw human butangi',
      'Tanom og munggo o sitaw human anihon aron mabalik ang N sa yuta',
      'Butangi og vermicompost (1 ton/ektarya) aron mapaayo ang nitrogen sa yuta',
      'Gamiti og ammonium sulfate (21-0-0) para daling masuyop sa bugnaw nga yuta',
      'Ang balason ug loam nga yuta daling mawad-an og N — butangi og compost aron molungtad',
      'Bahaa og gamay ang humayan human butangi og urea aron dili moalisngaw ang N',
    ],
  },
  'Phosphorus Deficiency': {
    en: [
      'Apply DAP (18-46-0) or guano — 40 kg/ha placed near the root zone',
      'Ensure soil is moist but not flooded for better P absorption',
      'Use Mykovam or bio-fertilizer to improve root P uptake',
      'Apply phosphate rock powder for long-term soil P enrichment',
      'Improvement visible in 7-10 days — more tillers and greener leaves',
      'Add organic matter (compost) to increase phosphorus availability',
      'Maintain soil pH between 5.5-6.5 for optimal phosphorus uptake',
      'Acidic soils (pH below 5.5) lock up phosphorus — apply lime to raise pH if needed',
      'Heavy clay soils need P placed near the root zone since P moves very slowly in clay',
    ],
    fil: [
      'Maglagay ng DAP (18-46-0) o guano — 40 kg/ektarya, ilagay malapit sa ugat',
      'Siguraduhing mamasa-masa ang lupa (hindi lubog) para masipsip ng maayos ang phosphorus',
      'Gamitan ng Mykovam o bio-fertilizer para bumuti ang P uptake ng ugat',
      'Maglagay ng phosphate rock powder para sa matagalang supply ng P sa lupa',
      'Makikita ang pagbuti sa loob ng 7-10 araw — mas maraming tillers at luntiang dahon',
      'Maglagay ng organikong bagay (compost) para tumaas ang phosphorus availability',
      'Panatilihin ang pH ng lupa sa 5.5-6.5 para sa pinakamainam na phosphorus uptake',
      'Ang acidic na lupa (pH mababa sa 5.5) ay nagla-lock ng phosphorus — maglagay ng dayap para itaas ang pH',
      'Sa mabigat na clay soil, ilagay ang P malapit sa ugat dahil napakabagal nito gumalaw sa clay',
    ],
    ceb: [
      'Butangi og DAP (18-46-0) o guano — 40 kg/ektarya, ibutang duol sa gamot',
      'Siguroa nga basa-basa ang yuta (dili lubog) aron masuyop og maayo ang phosphorus',
      'Gamiti og Mykovam o bio-fertilizer aron mouswag ang P uptake sa gamot',
      'Butangi og phosphate rock powder para sa dugay nga suplay sa P sa yuta',
      'Makita ang pag-uswag sulod sa 7-10 ka adlaw — mas daghang tillers ug lunhaw nga dahon',
      'Butangi og organikong butang (compost) aron motaas ang phosphorus availability',
      'Hupti ang pH sa yuta sa 5.5-6.5 para sa labing maayong phosphorus uptake',
      'Ang asidikong yuta (pH ubos sa 5.5) mogapos sa phosphorus — butangi og apog aron itaas ang pH',
      'Sa bug-at nga yutang kulonon, ibutang ang P duol sa gamot kay hinay kaayo kini molihok sa clay',
    ],
  },
  'Potassium Deficiency': {
    en: [
      'Apply Muriate of Potash (0-0-60) — 35 kg/ha, split into two (basal and panicle initiation)',
      'Spread wood ash or rice straw in the field — free natural source of K',
      'Avoid prolonged drought — dry soil stress makes K deficiency worse',
      'Half of fertilizer at planting, half when panicle initiation begins',
      'New leaves recover in 5-7 days but old scorched tips will remain',
      'Maintain good drainage to prevent K leaching from heavy rain',
      'Use potassium sulfate for chloride-sensitive rice varieties',
      'Sandy and peat soils are naturally low in K — increase organic matter to hold potassium',
      'Add rice straw back into the field after harvest to recycle K back into the soil',
    ],
    fil: [
      'Maglagay ng Muriate of Potash (0-0-60) — 35 kg/ektarya, hatiin sa dalawa (basal at panicle initiation)',
      'Isaboy ang abo ng kahoy o rice straw sa palayan — libreng source ng potassium',
      'Huwag patuyuin nang matagal ang palayan — ang tagtuyot ay nagpapalala ng K deficiency',
      'Kalahati ng pataba ilagay sa simula, kalahati kapag nag-uumpisa nang magbunga',
      'Ang bagong dahon ay gagaling sa loob ng 5-7 araw pero ang lumang tuyot na dulo ay mananatili',
      'Panatilihin ang magandang drainage para hindi ma-leach ang potassium sa malakas na ulan',
      'Gamitin ang potassium sulfate para sa chloride-sensitive na varieties ng palay',
      'Ang mabuhangin at peat na lupa ay natural na mababa sa K — dagdagan ng organikong bagay para manatili ang potassium',
      'Isaboy muli ang rice straw sa palayan pagkatapos ng anihan para maibalik ang K sa lupa',
    ],
    ceb: [
      'Butangi og Muriate of Potash (0-0-60) — 35 kg/ektarya, bahina sa duha (basal ug panicle initiation)',
      'Isabwag ang abo sa kahoy o rice straw sa humayan — libreng source sa potassium',
      'Ayaw dugayi og pauga ang humayan — ang huwaw makapasamot sa K deficiency',
      'Katunga sa abono ibutang sa sinugdan, katunga sa pagsugod sa pagpamunga',
      'Ang bag-ong dahon maayo sulod sa 5-7 ka adlaw pero ang daang uga magpabilin',
      'Hupti ang maayong drainage aron dili ma-leach ang potassium sa kusog nga ulan',
      'Gamiti og potassium sulfate para sa chloride-sensitive nga klase sa humay',
      'Ang balason ug peat nga yuta natural nga ubos sa K — dugangi og organikong butang aron mugunit ang potassium',
      'Isabwag ang rice straw sa humayan human anihon aron mabalik ang K sa yuta',
    ],
  },
  'Brown Spot': {
    en: [
      'Cut and burn infected leaves immediately to stop spore spread',
      'Apply Mancozeb or copper-based fungicide at 2 g per liter of water',
      'Avoid nitrogen-heavy fertilizers during active infection',
      'Drain field partially to reduce humidity and fungal growth',
      'Rotate crops — avoid rice-on-rice to break the disease cycle',
      'Use disease-resistant rice varieties (NSIC recommended)',
      'Consult your local MAO (Municipal Agriculture Office) or PhilRice',
      'Waterlogged clay soils promote Brown Spot — add organic matter to improve soil drainage',
      'Apply potassium fertilizer (0-0-60) to strengthen plant resistance against fungal disease',
    ],
    fil: [
      'Putulin at sunugin agad ang mga may sakit na dahon para hindi kumalat ang spores',
      'Mag-spray ng Mancozeb o copper-based fungicide — 2g kada litro ng tubig',
      'Iwasan muna ang nitrogen-heavy fertilizer habang may impeksyon',
      'Patuyuin ang palayan nang bahagya para hindi dumami ang fungus',
      'Magpalit-palit ng pananim — huwag palay-sa-palay',
      'Gamitin ang disease-resistant rice varieties (NSIC recommended)',
      'Kumonsulta sa inyong MAO o PhilRice para sa tamang gamot',
      'Ang binahang clay soil ay nagpapalala ng Brown Spot — maglagay ng organikong bagay para umayos ang drainage',
      'Maglagay ng potassium fertilizer (0-0-60) para lumakas ang resistensya ng halaman laban sa fungus',
    ],
    ceb: [
      'Putla ug sunoga dayon ang mga nag-sakit nga dahon aron dili mokaylap ang spores',
      'Isabwag og Mancozeb o copper fungicide — 2g kada litro sa tubig',
      'Likayi sa nitrogen-heavy fertilizer samtang naay impeksyon',
      'Pahubasa ang humayan og gamay aron dili modaghan ang fungus',
      'Ilisi ang itanom — ayaw palay-sa-palay',
      'Gamiti og disease-resistant nga klase sa humay (NSIC recommended)',
      'Konsultaha ang inyong MAO o PhilRice sa hustong tambal',
      'Ang baha nga yutang kulonon makapasamot sa Brown Spot — butangi og organikong butang aron molambo ang drainage',
      'Butangi og potassium fertilizer (0-0-60) aron molig-on ang resistensya sa tanom batok sa fungus',
    ],
  },
  'Rice Blast': {
    en: [
      'Apply Tricyclazole or Azoxystrobin fungicide at first sign of disease',
      'Reduce nitrogen fertilizer during active infection',
      'Remove and destroy infected leaves and panicles',
      'Maintain proper plant spacing for better air circulation',
      'Plant resistant varieties like NSIC Rc 152, Rc 160',
      'Treat seeds with hot water (54°C for 10 min) before planting',
      'Consult your local agricultural extension officer',
      'Low-lying fields with poor drainage increase blast risk — improve drainage with canals or raised beds',
      'Sandy soils dry out fast and stress plants, making them prone to blast — keep moisture consistent',
    ],
    fil: [
      'Mag-spray ng Tricyclazole o Azoxystrobin sa unang senyales ng sakit',
      'Bawasan ang nitrogen fertilizer habang may impeksyon',
      'Alisin at sunugin ang mga may sakit na dahon at uhay',
      'Panatilihin ang tamang distansya ng tanim para sa magandang daloy ng hangin',
      'Gamitin ang resistant varieties tulad ng NSIC Rc 152, Rc 160',
      'Gamutin ang buto gamit ang mainit na tubig (54°C sa loob ng 10 min)',
      'Kumonsulta sa inyong MAO o PhilRice',
      'Ang mababang lupang may mahinang drainage ay mataas ang risk ng blast — gumawa ng kanal o raised beds',
      'Ang mabuhangin na lupa ay mabilis matuyo at nagpapa-stress sa halaman — panatilihing basa ang lupa',
    ],
    ceb: [
      'Isabwag og Tricyclazole o Azoxystrobin sa unang timailhan sa sakit',
      'Pakunhian ang nitrogen fertilizer samtang naay impeksyon',
      'Kuhaa ug sunoga ang mga nag-sakit nga dahon ug mga uhay',
      'Hupti ang hustong gilay-on sa pagtanom para maayo ang sirkulasyon sa hangin',
      'Gamiti ang resistant nga klase sama sa NSIC Rc 152, Rc 160',
      'Tambali ang binhi gamit ang init nga tubig (54°C sulod sa 10 min)',
      'Konsultaha ang inyong MAO o PhilRice',
      'Ang ubos nga yuta nga dili maayo ang drainage taas og risk sa blast — himo og kanal o raised beds',
      'Ang balason nga yuta daling mamala ug makapa-stress sa tanom — hupti nga kanunay basa ang yuta',
    ],
  },
  'Bacterial Leaf Blight': {
    en: [
      'Apply copper-based bactericide (Copper oxychloride) at 2 g per liter of water',
      'Drain the field partially to slow bacterial spread',
      'Remove and burn infected leaves immediately',
      'Avoid excessive nitrogen fertilizer',
      'Use resistant varieties like NSIC Rc 192, Rc 216',
      'Practice field sanitation — remove crop residue after harvest',
      'Consult your local MAO or PhilRice for proper treatment',
      'Clay loam and silt loam with poor drainage promote BLB — mix in compost and sand to improve drainage',
      'Avoid planting in low-lying waterlogged fields — use raised beds in wet-season rice',
    ],
    fil: [
      'Mag-spray ng copper-based bactericide (Copper oxychloride) — 2g kada litro ng tubig',
      'Patuyuin ang palayan nang bahagya para hindi kumalat ang bacteria',
      'Putulin at sunugin agad ang mga may sakit na dahon',
      'Huwag mag-overapply ng nitrogen fertilizer',
      'Gamitin ang resistant varieties tulad ng NSIC Rc 192, Rc 216',
      'Linisin ang palayan pagkatapos ng anihan',
      'Kumonsulta sa inyong MAO o PhilRice',
      'Ang clay loam at silt loam na may mahinang drainage ay nagpapalala ng BLB — haluan ng compost at buhangin para umayos ang drainage',
      'Iwasang magtanim sa mababang binabahang lupain — gumamit ng raised beds sa tag-ulan',
    ],
    ceb: [
      'Isabwag og copper-based bactericide (Copper oxychloride) — 2g kada litro sa tubig',
      'Pahubasa ang humayan og gamay aron dili mokaylap ang bacteria',
      'Putla ug sunoga dayon ang mga nag-sakit nga dahon',
      'Ayaw sobrahi ang nitrogen fertilizer',
      'Gamiti ang resistant nga klase sama sa NSIC Rc 192, Rc 216',
      'Limpyohi ang humayan human anihon',
      'Konsultaha ang inyong MAO o PhilRice',
      'Ang clay loam ug silt loam nga dili maayo ang drainage makapasamot sa BLB — sagulahin og compost ug balas aron molambo ang drainage',
      'Likayi pagtanom sa ubos nga baha nga yuta — gamiti og raised beds sa ting-ulan',
    ],
  },
  'Rice Leaf Diseases': {
    en: [
      'Cut and burn infected leaves immediately to stop spore spread',
      'Apply copper-based bactericide or fungicide like tricyclazole',
      'Avoid nitrogen-heavy fertilizers during active infection',
      'Drain the field partially to reduce humidity and fungal growth',
      'Rotate crops — avoid rice-on-rice to break the disease cycle in soil',
      'Use disease-resistant rice varieties (NSIC recommended)',
      'Consult your local MAO or PhilRice for proper treatment',
      'Waterlogged and compacted soils breed disease — add organic matter and practice field drying',
      'If soil is heavy clay, add compost and rice hull to improve aeration and drainage',
    ],
    fil: [
      'Putulin at sunugin agad ang mga may sakit na dahon para hindi kumalat ang spores',
      'Gamitan ng copper-based bactericide o fungicide tulad ng tricyclazole',
      'Iwasan muna ang nitrogen-heavy fertilizer habang may impeksyon',
      'Patuyuin ang palayan nang bahagya para hindi dumami ang fungus',
      'Magpalit-palit ng pananim — huwag palay-sa-palay para mawala ang sakit sa lupa',
      'Gamitin ang disease-resistant rice varieties (NSIC recommended)',
      'Kumonsulta sa inyong MAO o PhilRice para sa tamang gamot',
      'Ang binabaha at siksik na lupa ay pugad ng sakit — maglagay ng organikong bagay at patuyuin ang palayan',
      'Kung mabigat ang clay soil, haluan ng compost at rice hull para umayos ang hangin at drainage',
    ],
    ceb: [
      'Putla ug sunoga dayon ang mga nag-sakit nga dahon aron dili mokaylap ang spores',
      'Gamiti og copper-based bactericide o fungicide sama sa tricyclazole',
      'Likayi sa nitrogen-heavy fertilizer samtang naay impeksyon',
      'Pahubasa ang humayan og gamay aron dili modaghan ang fungus',
      'Ilisi ang itanom — ayaw palay-sa-palay aron mawala ang sakit sa yuta',
      'Gamiti og disease-resistant nga klase sa humay (NSIC recommended)',
      'Konsultaha ang inyong MAO o PhilRice sa hustong tambal',
      'Ang baha ug gahi nga yuta pugad sa sakit — butangi og organikong butang ug pahubasa ang humayan',
      'Kung bug-at ang yutang kulonon, sagulahin og compost ug rice hull aron molambo ang aeration ug drainage',
    ],
  },
};

const backendTipsUrl = '/api/tips';

function pickRandom(arr: string[], count: number): string[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export async function fetchTips(
  prediction: string,
  lang: string,
  isOnline: boolean,
): Promise<{ tips: string[]; source: 'online' | 'offline' }> {
  const langCode = lang === 'Filipino' ? 'fil' : lang === 'Cebuano' ? 'ceb' : 'en';

  if (isOnline) {
    try {
      const res = await fetch(`${backendTipsUrl}?prediction=${encodeURIComponent(prediction)}&lang=${langCode}`, { signal: AbortSignal.timeout(5000) });
      if (res.ok) {
        const data = await res.json();
        if (data.tips && Array.isArray(data.tips) && data.tips.length > 0) {
          return { tips: data.tips, source: 'online' };
        }
      }
    } catch {
    }
  }

  const pool = tipsPool[prediction]?.[langCode] ?? tipsPool[prediction]?.en ?? tipsPool['Rice Leaf Diseases'].en;
  return { tips: pickRandom(pool, 5), source: 'offline' };
}
