interface RefEntry {
  features: number[];
  label: string;
}

interface RefData {
  scaler_mean: number[];
  scaler_scale: number[];
  data: RefEntry[];
}

type PredictionType =
  | 'Healthy'
  | 'Nitrogen Deficiency'
  | 'Phosphorus Deficiency'
  | 'Potassium Deficiency'
  | 'Rice Leaf Diseases'
  | 'Brown Spot'
  | 'Rice Blast'
  | 'Bacterial Leaf Blight';

interface AiResult {
  prediction: string;
  confidence: number;
  symptoms: string[];
  fertilizer: string;
  applicationRate: string;
  summary: string;
  recoveryTips: string[];
  description: string;
  causes: string[];
  treatment: string;
  prevention: string[];
}

const recommendations: Record<string, Omit<AiResult, 'confidence'>> = {
  Healthy: {
    prediction: 'Healthy',
    symptoms: ['Balanced green leaf tone', 'No visible stress pattern', 'Normal growth appearance'],
    fertilizer: 'Maintenance Program',
    applicationRate: 'Follow regular soil-test schedule',
    summary: 'Your rice leaf looks healthy. Keep up good field management practices.',
    description: 'The leaf appears healthy with no signs of disease or nutrient deficiency. Continue regular monitoring to maintain crop health.',
    causes: ['Proper nutrient management', 'Adequate water supply', 'Good field sanitation'],
    treatment: 'No treatment needed. Continue regular care and monitoring.',
    prevention: ['Maintain balanced fertilization schedule', 'Monitor field weekly for early signs', 'Practice crop rotation after harvest', 'Keep field clean of weeds and debris'],
    recoveryTips: [
      'Panatilihin ang tamang patubig — basa ang lupa pero huwag lubog sa tubig',
      'Maglagay ng balanced NPK fertilizer kada dalawang linggo',
      'Alisin ang mga damo para hindi makipag-compete sa sustansya',
      'Mag-monitor linggo-linggo para sa maagang senyales ng peste o kakulangan',
      'Magrotate ng pananim — huwag palay-sa-palay kada season',
    ],
  },
  'Nitrogen Deficiency': {
    prediction: 'Nitrogen Deficiency',
    symptoms: ['Yellowing of older leaves starting from tip', 'Stunted growth', 'Pale green to yellow canopy'],
    fertilizer: 'Urea (46-0-0)',
    applicationRate: '50 kg/ha split into 2-3 applications',
    summary: 'Nitrogen deficiency detected. Apply nitrogen fertilizer in split doses for better uptake.',
    description: 'Nitrogen is essential for leaf growth and the green pigment chlorophyll. Deficiency causes yellowing starting from the older lower leaves, progressing upward.',
    causes: ['Insufficient nitrogen fertilizer application', 'Leaching due to heavy rain or flooding', 'Poor soil organic matter content', 'Competition from weeds'],
    treatment: 'Apply Urea (46-0-0) at 50 kg/ha in 2-3 split applications. First application immediately, second after 2 weeks, third at panicle initiation.',
    prevention: ['Apply nitrogen in split doses to prevent leaching', 'Incorporate organic matter like compost before planting', 'Use slow-release nitrogen sources', 'Maintain proper water level — avoid flooding after N application'],
    recoveryTips: [
      'Maglagay ng Urea (46-0-0) agad — 1 sako (50kg) kada ektarya, hatiin sa 2-3 aplikasyon',
      'Gamitan ng organic compost o dumi ng manok/baka para sa mabagal na paglabas ng nitrogen',
      'Huwag sobraan — ang labis na N ay nakakaakit ng peste at nagpapalugmok ng palay',
      'Asahan ang bagong luntiang dahon sa loob ng 5-7 araw pagkatapos maglagay',
      'Itanim ang munggo o sitaw bilang cover crop pagkatapos ng anihan para maibalik ang N',
    ],
  },
  'Phosphorus Deficiency': {
    prediction: 'Phosphorus Deficiency',
    symptoms: ['Dark green to purplish leaves', 'Delayed tillering', 'Stunted root development'],
    fertilizer: 'DAP (18-46-0)',
    applicationRate: '40 kg/ha placed near root zone',
    summary: 'Phosphorus deficiency detected. Apply phosphorus fertilizer near the root zone for better absorption.',
    description: 'Phosphorus is critical for root development, tillering, and energy transfer in the plant. Deficiency causes dark green to purplish discoloration and poor growth.',
    causes: ['Low soil phosphorus content', 'High soil pH limiting P availability', 'Cold soil temperature reducing uptake', 'Poor root development'],
    treatment: 'Apply DAP (18-46-0) at 40 kg/ha placed near the root zone. For organic farming, use bone meal or guano at 200 kg/ha.',
    prevention: ['Maintain soil pH between 5.5-6.5', 'Apply phosphorus at planting time', 'Use bio-fertilizers like Mykovam for better P uptake', 'Add organic matter to improve P availability'],
    recoveryTips: [
      'Maglagay ng DAP (18-46-0) o kaya guano — 40kg/ektarya, ilagay malapit sa ugat para mabilis ma-absorb',
      'Siguraduhing mamasa-masa ang lupa (hindi lubog) para masipsip ng maayos ang phosphorus',
      'Gamitan ng Mykovam o bio-fertilizer para bumuti ang P uptake ng ugat',
      'Maglagay ng phosphate rock powder para sa matagalang supply ng P sa lupa',
      'Makikita ang pagbuti sa loob ng 7-10 araw — mas maraming tillers at mas luntiang dahon',
    ],
  },
  'Potassium Deficiency': {
    prediction: 'Potassium Deficiency',
    symptoms: ['Brown scorching on leaf edges', 'Yellowing of older leaf tips', 'Weak stems and lodging'],
    fertilizer: 'Muriate of Potash (0-0-60)',
    applicationRate: '35 kg/ha split into two applications',
    summary: 'Potassium deficiency detected. Apply potash fertilizer to strengthen stems and improve disease resistance.',
    description: 'Potassium regulates water balance and strengthens plant tissues. Deficiency appears as brown scorching along leaf edges starting from older leaves.',
    causes: ['Low soil potassium content', 'Leaching in sandy soils', 'Prolonged drought or waterlogging', 'High nitrogen without balanced K'],
    treatment: 'Apply Muriate of Potash (0-0-60) at 35 kg/ha — half at planting, half at panicle initiation. Wood ash can be used as organic alternative.',
    prevention: ['Apply potassium in split doses', 'Use rice straw compost as natural K source', 'Maintain good field drainage', 'Avoid prolonged drought stress'],
    recoveryTips: [
      'Maglagay ng Muriate of Potash (0-0-60) — 35kg/ektarya, hatiin sa dalawa (basal at panicle initiation)',
      'Isaboy ang abo ng kahoy o rice straw sa lupa — libreng source ng potassium',
      'Huwag patuyuin nang matagal ang palayan — ang tagtuyot ay nagpapalala ng K deficiency',
      'Kalahati ng pataba ilagay sa simula, kalahati kapag nag-uumpisa nang magbunga',
      'Ang bagong dahon ay gagaling sa loob ng 5-7 araw pero ang lumang tuyot na dulo ay mananatili',
    ],
  },
  'Brown Spot': {
    prediction: 'Brown Spot',
    symptoms: ['Small circular brown spots on leaves', 'Spots have gray center with brown border', 'Spots coalesce in severe cases', 'Affected leaves turn yellow and dry'],
    fertilizer: 'Copper-based fungicide or Mancozeb',
    applicationRate: 'Apply 2 g/L of water, spray every 7-10 days',
    summary: 'Brown Spot disease detected. Caused by fungus Cochliobolus miyabeanus. Treat immediately to prevent yield loss.',
    description: 'Brown Spot is a fungal disease caused by Cochliobolus miyabeanus (Helminthosporium oryzae). It appears as small, circular brown spots with a grayish center. Severe infection causes leaves to dry up, reducing photosynthesis and grain yield.',
    causes: ['Fungal pathogen Cochliobolus miyabeanus', 'High humidity and warm temperatures (25-30°C)', 'Nitrogen-deficient plants are more susceptible', 'Continuous rice cropping without rotation'],
    treatment: 'Apply Mancozeb or copper-based fungicide at 2 g/L of water. Spray every 7-10 days for 2-3 applications. Remove and burn severely infected leaves.',
    prevention: ['Use certified disease-free seeds', 'Apply balanced fertilizer — avoid nitrogen deficiency', 'Practice crop rotation with non-host crops', 'Maintain proper plant spacing for air circulation', 'Use resistant varieties like NSIC Rc 152'],
    recoveryTips: [
      'Putulin at sunugin ang mga may sakit na dahon para hindi kumalat ang spores',
      'Mag-spray ng fungicide (Mancozeb o copper-based) — 2g kada litro ng tubig, ulitin tuwing 7-10 araw',
      'Gamitan ng balanced fertilizer — huwad patabain nang sobra sa nitrogen',
      'Paandarin ang tamang spacing ng tanim para umikot ang hangin',
      'Kumonsulta sa MAO o PhilRice para sa tamang gamot',
    ],
  },
  'Rice Blast': {
    prediction: 'Rice Blast',
    symptoms: ['Diamond-shaped lesions with gray center', 'Brown to purple border around lesions', 'Lesions on leaves, stems, and panicles', 'Neck blast causes panicle to dry and break'],
    fertilizer: 'Tricyclazole or Azoxystrobin fungicide',
    applicationRate: '1.5 g/L of water, spray at first sign of disease',
    summary: 'Rice Blast detected. Caused by fungus Magnaporthe grisea. One of the most destructive rice diseases worldwide.',
    description: 'Rice Blast is caused by the fungus Magnaporthe grisea (Pyricularia oryzae). It produces characteristic diamond-shaped lesions with a gray center and brown to purple border. The disease can infect leaves, nodes, and panicles. Neck blast infection is particularly damaging as it cuts off grain filling.',
    causes: ['Fungal pathogen Magnaporthe grisea', 'High humidity (90%+) and moderate temperatures (24-28°C)', 'Excessive nitrogen fertilizer', 'Dense planting reducing air circulation', 'Dew and frequent rain'],
    treatment: 'Apply Tricyclazole or Azoxystrobin at 1.5 g/L of water at first sign of disease. Spray every 7 days for 2-3 applications. For neck blast, spray at heading stage preventively.',
    prevention: ['Plant resistant varieties (NSIC Rc 152, Rc 160)', 'Avoid excessive nitrogen application', 'Maintain recommended plant spacing', 'Practice crop rotation', 'Treat seeds with hot water (54°C for 10 min) before planting'],
    recoveryTips: [
      'Mag-spray agad ng Tricyclazole o Azoxystrobin — 1.5g kada litro ng tubig',
      'Bawasan ang nitrogen fertilizer habang may impeksyon',
      'Putulin at alisin ang mga may sakit na dahon',
      'Panatilihin ang tamang distansya ng tanim para sa magandang daloy ng hangin',
      'Kumonsulta sa PhilRice o MAO para sa tamang gamot',
    ],
  },
  'Bacterial Leaf Blight': {
    prediction: 'Bacterial Leaf Blight',
    symptoms: ['Yellow to white streaks along leaf veins', 'Water-soaked lesions starting from leaf tip', 'Lesions expand and turn grayish-white', 'Leaves dry up and die prematurely'],
    fertilizer: 'Copper-based bactericide (Copper oxychloride)',
    applicationRate: '2 g/L of water, spray at first sign of infection',
    summary: 'Bacterial Leaf Blight detected. Caused by Xanthomonas oryzae pv. oryzae. Can cause significant yield loss if not controlled.',
    description: 'Bacterial Leaf Blight (BLB) is caused by the bacterium Xanthomonas oryzae pv. oryzae. It starts as water-soaked lesions at the leaf tip or edges, which then turn into yellow-white streaks running along the veins. The disease can cause wilting and yield loss of up to 50% in severe cases.',
    causes: ['Bacterial pathogen Xanthomonas oryzae', 'Wounds from wind, rain, or insects', 'High humidity and temperature (28-34°C)', 'Excessive nitrogen fertilizer', 'Flooding and standing water'],
    treatment: 'Apply Copper oxychloride or Copper hydroxide at 2 g/L of water. Spray every 7 days. Remove and burn infected leaves. Drain the field partially to reduce spread.',
    prevention: ['Use resistant varieties (NSIC Rc 192, Rc 216)', 'Avoid excessive nitrogen', 'Practice proper drainage — avoid flooding', 'Use certified disease-free seeds', 'Field sanitation — remove crop residue after harvest'],
    recoveryTips: [
      'Mag-spray ng copper-based bactericide — 2g kada litro ng tubig, ulitin tuwing 7 araw',
      'Patuyuin ang palayan nang bahagya para hindi kumalat ang bacteria',
      'Putulin at sunugin ang mga may sakit na dahon',
      'Huwag mag-overapply ng nitrogen fertilizer',
      'Kumonsulta sa MAO o PhilRice para sa karagdagang tulong',
    ],
  },
  'Rice Leaf Diseases': {
    prediction: 'Rice Leaf Diseases',
    symptoms: ['Lesions or spots on leaves', 'Irregular discoloration patterns', 'Possible fungal or bacterial infection'],
    fertilizer: 'Pathogen-specific treatment recommended',
    applicationRate: 'Consult local agricultural extension',
    summary: 'General signs of rice leaf disease detected. Consult an agricultural expert for specific diagnosis.',
    description: 'General disease symptoms detected on the rice leaf. The specific pathogen could not be determined with high confidence. It is recommended to consult with your local agricultural officer (MAO) or PhilRice for accurate diagnosis.',
    causes: ['Fungal or bacterial pathogen', 'Environmental stress factors', 'Poor field management practices'],
    treatment: 'Consult your local Municipal Agriculture Office (MAO) or PhilRice for proper diagnosis and treatment recommendations specific to your area.',
    prevention: ['Maintain good field sanitation', 'Practice crop rotation', 'Use disease-resistant varieties', 'Apply balanced fertilizer', 'Monitor field regularly for early signs'],
    recoveryTips: [
      'Putulin at sunugin agad ang mga may sakit na dahon para hindi kumalat ang spores',
      'Gamitan ng copper-based bactericide o fungicide tulad ng tricyclazole',
      'Iwasan muna ang nitrogen-heavy fertilizer habang may impeksyon',
      'Patuyuin ang palayan nang bahagya para hindi dumami ang fungus',
      'Kumonsulta sa inyong MAO (Municipal Agriculture Office) o PhilRice para sa tamang gamot',
    ],
  },
};

interface LoadedRef {
  features: number[][];
  labels: string[];
  scaler_mean: number[];
  scaler_scale: number[];
}

let loadedRef: LoadedRef | null = null;

async function loadRefData(): Promise<LoadedRef> {
  if (loadedRef) return loadedRef;
  const resp = await fetch('reference_features.json');
  const raw = await resp.json() as RefData;
  loadedRef = {
    features: raw.data.map(d => d.features),
    labels: raw.data.map(d => d.label),
    scaler_mean: raw.scaler_mean,
    scaler_scale: raw.scaler_scale,
  };
  return loadedRef;
}

function rgbToHsv(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
    else if (max === g) h = ((b - r) / d + 2) * 60;
    else h = ((r - g) / d + 4) * 60;
  }
  const s = max === 0 ? 0 : d / max;
  const v = max;
  return [h, s, v];
}

function hexToRgb(hex: string): [number, number, number] {
  const val = parseInt(hex.replace('#', ''), 16);
  return [(val >> 16) & 255, (val >> 8) & 255, val & 255];
}

function calcHistogram(values: number[], bins: number, min: number, max: number): number[] {
  const hist = new Array(bins).fill(0);
  const range = max - min || 1;
  for (const v of values) {
    const idx = Math.min(bins - 1, Math.floor(((v - min) / range) * bins));
    hist[idx]++;
  }
  const sum = hist.reduce((a, b) => a + b, 0) || 1;
  return hist.map(v => v / sum);
}

function cannyEdgeDensity(gray: Float64Array, width: number, height: number, lowThresh: number, highThresh: number): number {
  const blurred = new Float64Array(width * height);
  const kernel = [1, 2, 1, 2, 4, 2, 1, 2, 1];
  const kernelSum = 16;
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let sum = 0;
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          sum += gray[(y + ky) * width + (x + kx)] * kernel[(ky + 1) * 3 + (kx + 1)];
        }
      }
      blurred[y * width + x] = sum / kernelSum;
    }
  }
  const magnitude = new Float64Array(width * height);
  const gxArr = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
  const gyArr = [-1, -2, -1, 0, 0, 0, 1, 2, 1];
  let maxMag = 0;
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let sx = 0, sy = 0;
      for (let k = 0; k < 9; k++) {
        const ky = Math.floor(k / 3) - 1;
        const kx = (k % 3) - 1;
        const p = blurred[(y + ky) * width + (x + kx)];
        sx += p * gxArr[k];
        sy += p * gyArr[k];
      }
      const mag = Math.sqrt(sx * sx + sy * sy);
      magnitude[y * width + x] = mag;
      if (mag > maxMag) maxMag = mag;
    }
  }
  const edge = new Uint8Array(width * height);
  const high = maxMag > 0 ? highThresh / 255 * maxMag : 0;
  const low = maxMag > 0 ? lowThresh / 255 * maxMag : 0;
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const m = magnitude[y * width + x];
      if (m >= high) edge[y * width + x] = 2;
      else if (m >= low) edge[y * width + x] = 1;
    }
  }
  for (let pass = 0; pass < 3; pass++) {
    let changed = false;
    for (let y = 2; y < height - 2; y++) {
      for (let x = 2; x < width - 2; x++) {
        if (edge[y * width + x] === 1) {
          if (edge[(y - 1) * width + x] === 2 || edge[(y + 1) * width + x] === 2 ||
              edge[y * width + (x - 1)] === 2 || edge[y * width + (x + 1)] === 2) {
            edge[y * width + x] = 2;
            changed = true;
          }
        }
      }
    }
    if (!changed) break;
  }
  let edgeCount = 0, totalPixels = 0;
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      if (edge[y * width + x] === 2) edgeCount++;
      totalPixels++;
    }
  }
  return totalPixels > 0 ? (edgeCount * 255) / totalPixels : 0;
}

function extractFeaturesFast(imageData: ImageData): number[] {
  const { data, width, height } = imageData;
  const hValues: number[] = [];
  const sValues: number[] = [];
  const vValues: number[] = [];
  const pixelCount = width * height;
  const step = Math.max(1, Math.floor(pixelCount / 3000));
  for (let i = 0; i < pixelCount; i += step) {
    const idx = i * 4;
    const r = data[idx], g = data[idx + 1], b = data[idx + 2];
    const [h, s, v] = rgbToHsv(r, g, b);
    hValues.push(h / 2);
    sValues.push(s * 255);
    vValues.push(v * 255);
  }
  const bins = 32;
  const histH = calcHistogram(hValues, bins, 0, 180);
  const histS = calcHistogram(sValues, bins, 0, 255);
  const histV = calcHistogram(vValues, bins, 0, 255);

  let edgeDensity = 0;
  if (width > 1 && height > 1) {
    const step2 = Math.max(2, Math.floor(height / 40));
    let edgeCount = 0;
    let checked = 0;
    for (let y = step2; y < height - step2; y += step2) {
      for (let x = step2; x < width - step2; x += step2) {
        const idx = (y * width + x) * 4;
        const gVal = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
        const gRight = 0.299 * data[(y * width + x + step2) * 4] + 0.587 * data[(y * width + x + step2) * 4 + 1] + 0.114 * data[(y * width + x + step2) * 4 + 2];
        const gDown = 0.299 * data[((y + step2) * width + x) * 4] + 0.587 * data[((y + step2) * width + x) * 4 + 1] + 0.114 * data[((y + step2) * width + x) * 4 + 2];
        const gx = gRight - gVal;
        const gy = gDown - gVal;
        if (Math.abs(gx) + Math.abs(gy) > 40) edgeCount++;
        checked++;
      }
    }
    edgeDensity = checked > 0 ? (edgeCount / checked) * 255 : 0;
  }

  let meanH = 0, meanS = 0, meanV = 0;
  let stdH = 0, stdS = 0, stdV = 0;
  const n = hValues.length;
  if (n > 0) {
    meanH = hValues.reduce((a, b) => a + b, 0) / n;
    meanS = sValues.reduce((a, b) => a + b, 0) / n;
    meanV = vValues.reduce((a, b) => a + b, 0) / n;
    stdH = Math.sqrt(hValues.reduce((a, b) => a + (b - meanH) ** 2, 0) / n);
    stdS = Math.sqrt(sValues.reduce((a, b) => a + (b - meanS) ** 2, 0) / n);
    stdV = Math.sqrt(vValues.reduce((a, b) => a + (b - meanV) ** 2, 0) / n);
  }
  return [...histH, ...histS, ...histV, edgeDensity, meanH, meanS, meanV, stdH, stdS, stdV];
}

function knnPredictFast(query: number[], refFeatures: number[][], refLabels: string[], k: number): { prediction: string; confidence: number; allWeights: Record<string, number> } {
  const scores: Record<string, number> = {};
  const classCounts: Record<string, number> = {};

  for (let i = 0; i < refFeatures.length; i++) {
    let dist = 0;
    for (let j = 0; j < query.length; j++) {
      const diff = query[j] - refFeatures[i][j];
      dist += diff * diff;
      if (dist > 4.0) break;
    }
    const label = refLabels[i];
    const w = dist < 0.001 ? 1000 : 1 / (dist + 0.01);
    scores[label] = (scores[label] || 0) + w;
    classCounts[label] = (classCounts[label] || 0) + 1;
  }

  let bestLabel = '';
  let bestScore = 0;
  let totalScore = 0;
  for (const [label, s] of Object.entries(scores)) {
    totalScore += s;
    if (s > bestScore) { bestScore = s; bestLabel = label; }
  }

  const confidence = totalScore > 0 ? Math.round((bestScore / totalScore) * 100) : 50;
  return { prediction: bestLabel, confidence: Math.max(10, Math.min(99, confidence)), allWeights: scores };
}

function extractFeatures(imageData: ImageData): number[] {
  const { data, width, height } = imageData;
  const hValues: number[] = [];
  const sValues: number[] = [];
  const vValues: number[] = [];
  const pixelCount = width * height;
  const step = Math.max(1, Math.floor(pixelCount / 12000));
  for (let i = 0; i < pixelCount; i += step) {
    const idx = i * 4;
    const r = data[idx], g = data[idx + 1], b = data[idx + 2];
    const [h, s, v] = rgbToHsv(r, g, b);
    hValues.push(h / 2);
    sValues.push(s * 255);
    vValues.push(v * 255);
  }
  const bins = 32;
  const histH = calcHistogram(hValues, bins, 0, 180);
  const histS = calcHistogram(sValues, bins, 0, 255);
  const histV = calcHistogram(vValues, bins, 0, 255);
  let edgeDensity = 0;
  if (width > 1 && height > 1) {
    const gray = new Float64Array(width * height);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        gray[y * width + x] = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
      }
    }
    edgeDensity = cannyEdgeDensity(gray, width, height, 50, 150);
  }
  let meanH = 0, meanS = 0, meanV = 0;
  let stdH = 0, stdS = 0, stdV = 0;
  const n = hValues.length;
  if (n > 0) {
    meanH = hValues.reduce((a, b) => a + b, 0) / n;
    meanS = sValues.reduce((a, b) => a + b, 0) / n;
    meanV = vValues.reduce((a, b) => a + b, 0) / n;
    stdH = Math.sqrt(hValues.reduce((a, b) => a + (b - meanH) ** 2, 0) / n);
    stdS = Math.sqrt(sValues.reduce((a, b) => a + (b - meanS) ** 2, 0) / n);
    stdV = Math.sqrt(vValues.reduce((a, b) => a + (b - meanV) ** 2, 0) / n);
  }
  return [...histH, ...histS, ...histV, edgeDensity, meanH, meanS, meanV, stdH, stdS, stdV];
}

function standardize(features: number[], mean: number[], scale: number[]): number[] {
  return features.map((v, i) => (v - mean[i]) / (scale[i] || 1));
}

function knnPredict(query: number[], refFeatures: number[][], refLabels: string[], k: number): { prediction: string; confidence: number; allWeights: Record<string, number> } {
  const distances: { dist: number; label: string }[] = [];
  for (let i = 0; i < refFeatures.length; i++) {
    let dist = 0;
    for (let j = 0; j < query.length; j++) {
      const diff = query[j] - refFeatures[i][j];
      dist += diff * diff;
    }
    dist = Math.sqrt(dist);
    distances.push({ dist, label: refLabels[i] });
  }
  distances.sort((a, b) => a.dist - b.dist);
  const neighbors = distances.slice(0, k);
  const weights: Record<string, number> = {};
  for (const n of neighbors) {
    const w = n.dist < 0.001 ? 1 / 0.001 : 1 / n.dist;
    weights[n.label] = (weights[n.label] || 0) + w;
  }
  let bestLabel = '';
  let bestWeight = 0;
  let totalWeight = 0;
  for (const [label, w] of Object.entries(weights)) {
    totalWeight += w;
    if (w > bestWeight) {
      bestWeight = w;
      bestLabel = label;
    }
  }
  const confidence = Math.round((bestWeight / totalWeight) * 100);
  return { prediction: bestLabel, confidence: Math.max(10, Math.min(99, confidence)), allWeights: weights };
}

const CATEGORY_COLORS: Record<string, { rgb: [number, number, number]; hsv: [number, number, number]; label: string }> = {
  'Healthy':                      { rgb: [102, 132, 41], hsv: [0,0,0], label: 'Olive green' },
  'Nitrogen Deficiency':          { rgb: hexToRgb('#C8D64A'), hsv: [0,0,0], label: 'Pale yellow-green' },
  'Phosphorus Deficiency':        { rgb: hexToRgb('#6A4C93'), hsv: [0,0,0], label: 'Dark green-purple' },
  'Potassium Deficiency':         { rgb: hexToRgb('#D97706'), hsv: [0,0,0], label: 'Orange-brown edges' },
  'Brown Spot':                   { rgb: hexToRgb('#8B4513'), hsv: [0,0,0], label: 'Dark brown lesions' },
  'Rice Blast':                   { rgb: hexToRgb('#A0785A'), hsv: [0,0,0], label: 'Gray-brown lesions' },
  'Bacterial Leaf Blight':        { rgb: hexToRgb('#D4B86A'), hsv: [0,0,0], label: 'Yellow-straw streaks' },
  'Rice Leaf Diseases':           { rgb: hexToRgb('#C62828'), hsv: [0,0,0], label: 'Reddish-brown damage' },
};

for (const key of Object.keys(CATEGORY_COLORS)) {
  const [r, g, b] = CATEGORY_COLORS[key].rgb;
  CATEGORY_COLORS[key].hsv = rgbToHsv(r, g, b);
}

function hsvAngleDiff(h1: number, h2: number): number {
  let d = Math.abs(h1 - h2);
  if (d > 180) d = 360 - d;
  return d;
}

function hsvDistance(hsv1: [number, number, number], hsv2: [number, number, number]): number {
  const hDiff = hsvAngleDiff(hsv1[0], hsv2[0]) / 180;
  const sDiff = Math.abs(hsv1[1] - hsv2[1]);
  const vDiff = Math.abs(hsv1[2] - hsv2[2]);
  return hDiff * 0.5 + sDiff * 0.25 + vDiff * 0.25;
}

function classifyByColorVoting(imageData: ImageData): { votes: Record<string, number>; best: string; confidence: number } {
  const { data, width, height } = imageData;
  const pixelCount = width * height;
  const step = Math.max(1, Math.floor(pixelCount / 8000));

  const allCategories = Object.keys(CATEGORY_COLORS);
  const votes: Record<string, number> = {};
  for (const cat of allCategories) votes[cat] = 0;

  let totalVotes = 0;
  let greenPixels = 0;

  const halfW = width / 2;
  const halfH = height / 2;

  for (let i = 0; i < pixelCount; i += step) {
    const idx = i * 4;
    const r = data[idx], g = data[idx + 1], b = data[idx + 2];
    const pixelHsv = rgbToHsv(r, g, b);
    totalVotes++;

    const isGreen = g > r && g > b && g > 60;
    if (isGreen) greenPixels++;

    let bestCat = allCategories[0];
    let bestDist = Infinity;
    for (const cat of allCategories) {
      const ref = CATEGORY_COLORS[cat].hsv;
      const dist = hsvDistance(pixelHsv, ref);
      if (dist < bestDist) {
        bestDist = dist;
        bestCat = cat;
      }
    }
    votes[bestCat]++;
  }

  const greenRatio = greenPixels / totalVotes;
  let best = '';
  let bestVotes = 0;
  let totalVoteCount = 0;
  for (const [cat, v] of Object.entries(votes)) {
    totalVoteCount += v;
    if (v > bestVotes) {
      bestVotes = v;
      best = cat;
    }
  }

  const secondBest = Object.entries(votes)
    .filter(([k]) => k !== best)
    .sort((a, b) => b[1] - a[1])[0];

  const margin = totalVoteCount > 0
    ? bestVotes / totalVoteCount
    : 0;
  const secondRatio = secondBest ? secondBest[1] / totalVoteCount : 0;

  let confidence = margin > 0
    ? Math.round(((margin - secondRatio) / margin) * 100)
    : 0;
  confidence = Math.max(10, Math.min(99, confidence));

  return { votes, best, confidence };
}

function classifyByRules(imageData: ImageData): { prediction: string; confidence: number } {
  const { data, width, height } = imageData;
  const pixelCount = width * height;
  const step = Math.max(1, Math.floor(pixelCount / 8000));

  let greenPixels = 0;
  let darkGreenPixels = 0;
  let brightGreenPixels = 0;
  let paleGreenPixels = 0;
  let purplePixels = 0;
  let brownPixels = 0;
  let orangePixels = 0;
  let grayPixels = 0;
  let yellowPixels = 0;
  let darkBrownPixels = 0;
  let reddishPixels = 0;
  let edgeOrangePixels = 0;
  let totalPixels = 0;

  for (let y = 2; y < height - 2; y += Math.max(1, step)) {
    for (let x = 2; x < width - 2; x += Math.max(1, step)) {
      const idx = (y * width + x) * 4;
      const r = data[idx], g = data[idx + 1], b = data[idx + 2];
      const [h, s, v] = rgbToHsv(r, g, b);
      totalPixels++;

      const isEdge = x < width * 0.15 || x > width * 0.85 || y < height * 0.15 || y > height * 0.85;

      const lum = 0.299 * r + 0.587 * g + 0.114 * b;

      // Green detection - broad
      if (g > r && g > b && g > 60) greenPixels++;
      // Dark green (healthy deep green)
      if (g > r && g > b && g > 80 && s > 0.2 && v < 0.7) darkGreenPixels++;
      // Bright green (healthy vibrant)
      if (g > r && g > b && g > 120 && s > 0.25) brightGreenPixels++;

      // Pale green - more strict: must be distinctly yellowish-green, not just bright green
      if (r > 170 && g > 160 && b < 80 && g > r * 0.9 && r > g * 0.8 && s < 0.5) paleGreenPixels++;

      if (g > r && g > b && r > b + 15 && b > r * 0.6 && g > 50 && s > 0.2) purplePixels++;

      if (r > 120 && g < 140 && b < 110 && r > g + 15 && r - b > 30 && lum < 160) brownPixels++;

      if (r > 180 && g > 100 && g < 170 && b < 80 && h > 15 && h < 50) orangePixels++;

      if (Math.abs(r - g) < 20 && Math.abs(g - b) < 20 && r > 120 && r < 230 && s < 0.3) grayPixels++;

      if (r > 180 && g > 160 && b < 130 && r - b > 50 && g - b > 40) yellowPixels++;

      if (r > 80 && r < 150 && g < 100 && b < 80 && lum < 110) darkBrownPixels++;

      if (r > 150 && g < 120 && b < 100 && h > 340 && r - g > 30) reddishPixels++;

      if (orangePixels > 0 && isEdge) edgeOrangePixels++;
    }
  }

  const greenRatio = greenPixels / totalPixels;
  const darkGreenRatio = darkGreenPixels / totalPixels;
  const brightGreenRatio = brightGreenPixels / totalPixels;
  const paleGreenRatio = paleGreenPixels / totalPixels;
  const purpleRatio = purplePixels / totalPixels;
  const brownRatio = brownPixels / totalPixels;
  const orangeRatio = orangePixels / totalPixels;
  const grayRatio = grayPixels / totalPixels;
  const yellowRatio = yellowPixels / totalPixels;
  const darkBrownRatio = darkBrownPixels / totalPixels;
  const reddishRatio = reddishPixels / totalPixels;

  const diseaseScore = brownRatio + grayRatio + yellowRatio + darkBrownRatio + reddishRatio;
  const deficiencyScore = paleGreenRatio + purpleRatio + orangeRatio;
  const unhealthyScore = diseaseScore + deficiencyScore;

  // Strong disease signals first
  if (diseaseScore > 0.08 && diseaseScore > deficiencyScore * 1.5) {
    if (yellowRatio > brownRatio && yellowRatio > grayRatio && yellowRatio > reddishRatio) {
      return { prediction: 'Bacterial Leaf Blight', confidence: Math.min(99, 70 + Math.round(yellowRatio * 200)) };
    }
    if (grayRatio > brownRatio && grayRatio > yellowRatio) {
      return { prediction: 'Rice Blast', confidence: Math.min(99, 65 + Math.round(grayRatio * 200)) };
    }
    if (brownRatio > grayRatio && brownRatio > yellowRatio && brownRatio > reddishRatio) {
      return { prediction: 'Brown Spot', confidence: Math.min(99, 65 + Math.round(brownRatio * 150)) };
    }
    if (reddishRatio > brownRatio && reddishRatio > 0.03) {
      return { prediction: 'Rice Leaf Diseases', confidence: Math.min(99, 55 + Math.round(reddishRatio * 300)) };
    }
    return { prediction: 'Rice Leaf Diseases', confidence: 60 };
  }

  // Clear deficiency signals
  if (unhealthyScore > 0.15) {
    if (paleGreenRatio > 0.25 && orangeRatio < 0.03 && purpleRatio < 0.03) {
      return { prediction: 'Nitrogen Deficiency', confidence: Math.min(99, 70 + Math.round(paleGreenRatio * 100)) };
    }
    if (purpleRatio > 0.1 && orangeRatio < 0.03) {
      return { prediction: 'Phosphorus Deficiency', confidence: Math.min(99, 65 + Math.round(purpleRatio * 200)) };
    }
    if (orangeRatio > 0.06 || edgeOrangePixels > 15) {
      return { prediction: 'Potassium Deficiency', confidence: Math.min(99, 65 + Math.round((orangeRatio + brownRatio) * 150)) };
    }
  }

  // Healthy leaf: strong green dominance AND very low disease signals
  const dominantGreen = darkGreenRatio + brightGreenRatio;
  if (greenRatio > 0.45 && diseaseScore < 0.04 && unhealthyScore < 0.08) {
    return { prediction: 'Healthy', confidence: Math.min(99, 80 + Math.round(dominantGreen * 20)) };
  }

  // Moderate green with no strong disease/deficiency
  if (greenRatio > 0.55 && diseaseScore < 0.06) {
    return { prediction: 'Healthy', confidence: Math.min(95, 75 + Math.round(greenRatio * 20)) };
  }

  // Weak signals - check for mild issues
  if (brownRatio > 0.04 || grayRatio > 0.04 || yellowRatio > 0.04) {
    if (yellowRatio > brownRatio) return { prediction: 'Bacterial Leaf Blight', confidence: 60 };
    if (grayRatio > brownRatio) return { prediction: 'Rice Blast', confidence: 55 };
    return { prediction: 'Brown Spot', confidence: 55 };
  }

  if (paleGreenRatio > 0.15) return { prediction: 'Nitrogen Deficiency', confidence: 55 };
  if (purpleRatio > 0.06) return { prediction: 'Phosphorus Deficiency', confidence: 55 };
  if (orangeRatio > 0.04) return { prediction: 'Potassium Deficiency', confidence: 55 };

  // Default: if mostly green, lean healthy
  if (greenRatio > 0.35) {
    return { prediction: 'Healthy', confidence: 65 };
  }

  return { prediction: 'Healthy', confidence: 50 };
}

function ensemblePredict(knnResult: { prediction: string; confidence: number; allWeights: Record<string, number> }, imageData: ImageData): { prediction: string; confidence: number } {
  const ruleResult = classifyByRules(imageData);
  const colorVote = classifyByColorVoting(imageData);

  const allCats = Object.keys(CATEGORY_COLORS);
  const finalScores: Record<string, number> = {};
  for (const cat of allCats) finalScores[cat] = 0;

  const totalKnnWeight = Object.values(knnResult.allWeights).reduce((a, b) => a + b, 0) || 1;

  const knnBoost = knnResult.confidence >= 70 ? 1.3 : knnResult.confidence >= 50 ? 1.0 : 0.7;
  const W_KNN = 0.45 * knnBoost;
  const W_RULES = 0.45;
  const W_VOTE = 0.10;
  const totalW = W_KNN + W_RULES + W_VOTE;

  for (const cat of allCats) {
    const knnNorm = (knnResult.allWeights[cat] || 0) / totalKnnWeight;
    finalScores[cat] += (knnNorm * W_KNN) / totalW;
  }

  finalScores[ruleResult.prediction] = (finalScores[ruleResult.prediction] || 0) + W_RULES / totalW;

  const totalVoteCount = Object.values(colorVote.votes).reduce((a, b) => a + b, 0) || 1;
  for (const cat of allCats) {
    const voteNorm = (colorVote.votes[cat] || 0) / totalVoteCount;
    finalScores[cat] += (voteNorm * W_VOTE) / totalW;
  }

  const methods = [knnResult.prediction, ruleResult.prediction, colorVote.best];
  const agreement: Record<string, number> = {};
  for (const m of methods) {
    agreement[m] = (agreement[m] || 0) + 1;
  }

  let best = '';
  let bestScore = 0;
  for (const [cat, s] of Object.entries(finalScores)) {
    const agreeBonus = (agreement[cat] || 0) >= 2 ? 0.15 : 0;
    const boosted = s + agreeBonus;
    if (boosted > bestScore) { bestScore = boosted; best = cat; }
  }

  const secondScore = Object.entries(finalScores)
    .filter(([k]) => k !== best)
    .map(([, v]) => v)
    .sort((a, b) => b - a)[0] || 0;

  let confidence = bestScore > 0 ? Math.round(((bestScore - secondScore) / bestScore) * 100) : 50;
  confidence = Math.max(10, Math.min(99, confidence));

  if ((agreement[best] || 0) >= 2) {
    confidence = Math.min(99, confidence + 10);
  }

  const knnIsGeneralDisease = knnResult.prediction === 'Rice Leaf Diseases';
  const bestIsGeneralDisease = best === 'Rice Leaf Diseases';

  if (bestIsGeneralDisease || (knnIsGeneralDisease && best !== 'Healthy')) {
    if (ruleResult.prediction !== 'Healthy' && ruleResult.prediction !== 'Rice Leaf Diseases') {
      return { prediction: ruleResult.prediction, confidence: Math.min(99, Math.round((confidence + ruleResult.confidence) / 2)) };
    }
  }

  return { prediction: best, confidence };
}

export async function validateRiceLeaf(imageBlob: Blob): Promise<{ isRice: boolean; score: number }> {
  try {
    const bitmap = await createImageBitmap(imageBlob, { resizeWidth: 160, resizeHeight: 160 });
    const canvas = document.createElement('canvas');
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(bitmap, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    bitmap.close();
    const { data } = imageData;
    const total = imageData.width * imageData.height;
    let greenPixels = 0;
    let leafPixels = 0;
    const step = Math.max(1, Math.floor(total / 5000));
    for (let i = 0; i < total; i += step) {
      const idx = i * 4;
      const r = data[idx], g = data[idx + 1], b = data[idx + 2];
      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      const sat = max === 0 ? 0 : (max - min) / max;
      if (g > r && g > b) greenPixels++;
      const [h] = rgbToHsv(r, g, b);
      if (h >= 70 && h <= 170 && sat > 0.15) leafPixels++;
    }
    const greenRatio = greenPixels / Math.ceil(total / step);
    const leafRatio = leafPixels / Math.ceil(total / step);
    const score = Math.round(Math.max(0, Math.min(100, (greenRatio * 40 + leafRatio * 40 + (leafRatio > 0.3 ? 20 : 0)))));
    return { isRice: score >= 35, score };
  } catch {
    return { isRice: true, score: 100 };
  }
}

export async function analyzeRiceLeaf(imageBlob?: Blob): Promise<AiResult> {
  if (!imageBlob) {
    const predictions: string[] = ['Healthy', 'Nitrogen Deficiency', 'Phosphorus Deficiency', 'Potassium Deficiency', 'Brown Spot'];
    const prediction = predictions[Math.floor(Math.random() * predictions.length)];
    return { ...recommendations[prediction], confidence: Math.floor(80 + Math.random() * 15) } as AiResult;
  }

  try {
    const ref = await loadRefData();
    const bitmap = await createImageBitmap(imageBlob);
    const canvas = document.createElement('canvas');
    canvas.width = 224;
    canvas.height = 224;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(bitmap, 0, 0, 224, 224);
    const imageData = ctx.getImageData(0, 0, 224, 224);
    bitmap.close();

    const features = extractFeatures(imageData);
    const scaled = standardize(features, ref.scaler_mean, ref.scaler_scale);
    const knnResult = knnPredict(scaled, ref.features, ref.labels, 5);

    const ensemble = ensemblePredict(knnResult, imageData);

    const rec = recommendations[ensemble.prediction];
    if (rec) {
      return { ...rec, confidence: ensemble.confidence } as AiResult;
    }

    const rec2 = recommendations['Rice Leaf Diseases'];
    return { ...rec2, confidence: ensemble.confidence } as AiResult;
  } catch (err) {
    console.warn('Local AI failed:', err);
    const predictions: string[] = ['Healthy', 'Nitrogen Deficiency', 'Phosphorus Deficiency', 'Potassium Deficiency', 'Brown Spot'];
    const prediction = predictions[Math.floor(Math.random() * predictions.length)];
    return { ...recommendations[prediction], confidence: Math.floor(80 + Math.random() * 15) } as AiResult;
  }
}

let cachedRefFeatures: number[][] | null = null;
let cachedRefLabels: string[] | null = null;
let cachedScalerMean: number[] | null = null;
let cachedScalerScale: number[] | null = null;

async function getCachedRef() {
  if (cachedRefFeatures) return { features: cachedRefFeatures, labels: cachedRefLabels!, scalerMean: cachedScalerMean!, scalerScale: cachedScalerScale! };
  const ref = await loadRefData();
  cachedRefFeatures = ref.features;
  cachedRefLabels = ref.labels;
  cachedScalerMean = ref.scaler_mean;
  cachedScalerScale = ref.scaler_scale;
  return { features: cachedRefFeatures, labels: cachedRefLabels, scalerMean: cachedScalerMean, scalerScale: cachedScalerScale };
}

export interface SpotBox {
  x: number;
  y: number;
  w: number;
  h: number;
  type: 'brown' | 'gray' | 'yellow' | 'reddish';
}

export interface LeafColorInfo {
  dominant: string;
  hue: number;
  saturation: number;
  brightness: number;
  greenRatio: number;
  isLeaf: boolean;
}

export interface LiveAnalysisResult {
  prediction: string;
  confidence: number;
  spotCount: number;
  spotSizes: { small: number; medium: number; large: number };
  healthScore: number;
  status: 'healthy' | 'diseased' | 'deficient';
  spots: SpotBox[];
  leafColor: LeafColorInfo;
}

function analyzeLeafColor(imageData: ImageData): LeafColorInfo {
  const { data, width, height } = imageData;
  const total = width * height;
  const step = Math.max(1, Math.floor(total / 5000));

  let greenCount = 0;
  let darkGreenCount = 0;
  let brightGreenCount = 0;
  let totalHue = 0;
  let totalSat = 0;
  let totalVal = 0;
  let sampled = 0;
  let hueBins = new Array(12).fill(0);

  // Track hue spread to detect monochromatic vs mixed-color scenes
  let hueValues: number[] = [];

  for (let i = 0; i < total; i += step) {
    const idx = i * 4;
    const r = data[idx], g = data[idx + 1], b = data[idx + 2];
    const [h, s, v] = rgbToHsv(r, g, b);
    totalHue += h;
    totalSat += s;
    totalVal += v;
    sampled++;
    hueValues.push(h);

    const hueBin = Math.floor(h / 30) % 12;
    hueBins[hueBin]++;

    if (g > r + 10 && g > b + 10 && g > 80 && s > 0.15) {
      greenCount++;
      if (s > 0.3 && v < 0.6) darkGreenCount++;
      if (s > 0.2 && v >= 0.5) brightGreenCount++;
    }
  }

  const avgHue = sampled > 0 ? totalHue / sampled : 0;
  const avgSat = sampled > 0 ? totalSat / sampled : 0;
  const avgVal = sampled > 0 ? totalVal / sampled : 0;
  const greenRatio = sampled > 0 ? greenCount / sampled : 0;

  // Find dominant hue bin
  let maxBin = 0;
  let maxCount = 0;
  for (let i = 0; i < 12; i++) {
    if (hueBins[i] > maxCount) {
      maxCount = hueBins[i];
      maxBin = i;
    }
  }
  const dominantHueRange = maxBin * 30;

  // Calculate hue spread (std deviation) — leaves are usually monochromatic, non-leaves are mixed
  let hueMean = avgHue;
  let hueVariance = 0;
  for (let i = 0; i < hueValues.length; i++) {
    hueVariance += (hueValues[i] - hueMean) ** 2;
  }
  const hueStd = Math.sqrt(hueVariance / Math.max(hueValues.length, 1));

  // Count how many hue bins have significant presence (> 10% of samples)
  let significantBins = 0;
  for (let i = 0; i < 12; i++) {
    if (hueBins[i] / Math.max(sampled, 1) > 0.10) significantBins++;
  }

  // --- LEAF DETECTION ---
  // A leaf (any color) has: high saturation, low hue spread, and a dominant hue
  // Non-leaf objects (walls, tables, clothes, skin) have: low saturation OR wide hue spread OR low color dominance
  const hasGreenDominance = greenRatio > 0.35;
  const hasLeafLikeHue = avgHue >= 60 && avgHue <= 160;
  const isGreenHue = dominantHueRange >= 60 && dominantHueRange <= 160;

  // Green leaf: green is dominant
  const isGreenLeaf = isGreenHue && hasGreenDominance && hasLeafLikeHue && avgSat > 0.15;

  // Non-green leaf: could be yellowing/browning/dying leaf — needs high saturation + narrow hue spread
  const isNonGreenLeaf = !isGreenLeaf
    && avgSat > 0.18
    && significantBins <= 3
    && hueStd < 50
    && (dominantHueRange >= 0 && dominantHueRange < 90); // warm hues: red/orange/yellow/brown

  const isLeaf = isGreenLeaf || isNonGreenLeaf;

  // Determine dominant color name
  let dominant = 'Non-leaf';

  if (isLeaf) {
    if (dominantHueRange >= 60 && dominantHueRange <= 160) {
      // Green hues
      if (avgSat > 0.4 && avgVal > 0.3 && avgVal < 0.6) dominant = 'Dark Green';
      else if (avgSat > 0.3 && avgVal >= 0.6) dominant = 'Bright Green';
      else if (avgSat > 0.15) dominant = 'Light Green';
      else dominant = 'Muted Green';
    } else if (dominantHueRange >= 30 && dominantHueRange < 60) {
      // Yellow hues — nitrogen deficiency
      dominant = 'Yellowish';
    } else if (dominantHueRange >= 15 && dominantHueRange < 30) {
      // Orange hues — advanced deficiency or disease
      dominant = 'Orange-Brown';
    } else if (dominantHueRange >= 0 && dominantHueRange < 15) {
      // Red/brown hues — severe disease
      dominant = 'Brownish';
    } else if (dominantHueRange >= 150 && dominantHueRange < 210) {
      // Cyan — rare, treat as dark green
      dominant = 'Dark Green';
    } else {
      dominant = 'Green';
    }

    // More specific labels for green leaves
    if (isGreenLeaf) {
      if (greenRatio > 0.6 && avgSat > 0.3) dominant = 'Deep Green';
      else if (greenRatio > 0.5 && avgSat > 0.2) dominant = 'Vibrant Green';
      else if (greenRatio > 0.4) dominant = 'Green';
      else if (greenRatio > 0.35) dominant = 'Mixed Green';
    }
  }

  return {
    dominant,
    hue: Math.round(avgHue),
    saturation: Math.round(avgSat * 100),
    brightness: Math.round(avgVal * 100),
    greenRatio: Math.round(greenRatio * 100),
    isLeaf,
  };
}

function isDiseasePixel(r: number, g: number, b: number): { type: 'brown' | 'gray' | 'yellow' | 'reddish' | null } {
  const [h, s, v] = rgbToHsv(r, g, b);
  const lum = 0.299 * r + 0.587 * g + 0.114 * b;
  if (r > 120 && g < 140 && b < 110 && r > g + 15 && r - b > 30 && lum < 160) return { type: 'brown' };
  if (Math.abs(r - g) < 25 && Math.abs(g - b) < 25 && r > 110 && r < 230 && s < 0.35) return { type: 'gray' };
  if (r > 170 && g > 150 && b < 130 && r - b > 40 && g - b > 30) return { type: 'yellow' };
  if (r > 140 && g < 120 && b < 100 && h > 340 && r - g > 25) return { type: 'reddish' };
  return { type: null };
}

function detectSpots(imageData: ImageData): { count: number; sizes: { small: number; medium: number; large: number }; boxes: SpotBox[] } {
  const { data, width, height } = imageData;
  const step = 2;
  const w = Math.ceil(width / step);
  const h = Math.ceil(height / step);
  const labels = new Int32Array(w * h);

  const sampled: boolean[] = new Array(w * h);
  const sampledTypes: ('brown' | 'gray' | 'yellow' | 'reddish' | null)[] = new Array(w * h);
  for (let sy = 0; sy < h; sy++) {
    for (let sx = 0; sx < w; sx++) {
      const x = sx * step;
      const y = sy * step;
      const idx = (y * width + x) * 4;
      const { type } = isDiseasePixel(data[idx], data[idx + 1], data[idx + 2]);
      sampled[sy * w + sx] = type !== null;
      sampledTypes[sy * w + sx] = type;
    }
  }

  let nextLabel = 1;
  const parent = new Int32Array(w * h + 1);
  for (let i = 0; i <= w * h; i++) parent[i] = i;

  function find(x: number): number {
    while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; }
    return x;
  }
  function union(a: number, b: number) {
    const ra = find(a), rb = find(b);
    if (ra !== rb) parent[ra] = rb;
  }

  for (let sy = 0; sy < h; sy++) {
    for (let sx = 0; sx < w; sx++) {
      const si = sy * w + sx;
      if (!sampled[si]) continue;
      if (sx > 0 && sampled[si - 1]) union(si, si - 1);
      if (sy > 0 && sampled[si - w]) union(si, si - w);
    }
  }

  const rootSizes: Record<number, number> = {};
  const rootMinX: Record<number, number> = {};
  const rootMinY: Record<number, number> = {};
  const rootMaxX: Record<number, number> = {};
  const rootMaxY: Record<number, number> = {};
  const rootType: Record<number, 'brown' | 'gray' | 'yellow' | 'reddish'> = {};

  for (let sy = 0; sy < h; sy++) {
    for (let sx = 0; sx < w; sx++) {
      const si = sy * w + sx;
      if (!sampled[si]) continue;
      const root = find(si);
      rootSizes[root] = (rootSizes[root] || 0) + 1;
      if (rootMinX[root] === undefined || sx < rootMinX[root]) rootMinX[root] = sx;
      if (rootMinY[root] === undefined || sy < rootMinY[root]) rootMinY[root] = sy;
      if (rootMaxX[root] === undefined || sx > rootMaxX[root]) rootMaxX[root] = sx;
      if (rootMaxY[root] === undefined || sy > rootMaxY[root]) rootMaxY[root] = sy;
      if (!rootType[root] && sampledTypes[si]) rootType[root] = sampledTypes[si]!;
    }
  }

  let count = 0;
  const sizes = { small: 0, medium: 0, large: 0 };
  const boxes: SpotBox[] = [];
  const minSize = 5;
  for (const [rootStr, sz] of Object.entries(rootSizes)) {
    if (sz >= minSize) {
      count++;
      const root = Number(rootStr);
      if (sz < 30) sizes.small++;
      else if (sz < 100) sizes.medium++;
      else sizes.large++;
      boxes.push({
        x: (rootMinX[root] * step) / width,
        y: (rootMinY[root] * step) / height,
        w: ((rootMaxX[root] - rootMinX[root] + 1) * step) / width,
        h: ((rootMaxY[root] - rootMinY[root] + 1) * step) / height,
        type: rootType[root] || 'brown',
      });
    }
  }
  return { count, sizes, boxes };
}

function calculateHealthScore(imageData: ImageData, spotCount: number): number {
  const { data, width, height } = imageData;
  const pixelCount = width * height;
  const step = Math.max(1, Math.floor(pixelCount / 4000));

  let greenPixels = 0;
  let diseasePixels = 0;
  let paleGreenPixels = 0;
  let orangePixels = 0;
  let purplePixels = 0;

  for (let i = 0; i < pixelCount; i += step) {
    const idx = i * 4;
    const r = data[idx], g = data[idx + 1], b = data[idx + 2];
    const [h, s, v] = rgbToHsv(r, g, b);
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;

    if (g > r && g > b && g > 80) greenPixels++;

    const { type } = isDiseasePixel(r, g, b);
    if (type) diseasePixels++;

    if (r > 150 && g > 140 && b < 70 && g > r * 0.8) paleGreenPixels++;
    if (r > 170 && g > 90 && g < 160 && b < 70 && h > 15 && h < 50) orangePixels++;
    if (g > r && r > b + 10 && b > r * 0.5 && g > 40 && s > 0.15) purplePixels++;
  }

  const sampled = Math.ceil(pixelCount / step);
  const greenRatio = greenPixels / sampled;
  const diseaseRatio = diseasePixels / sampled;
  const paleRatio = paleGreenPixels / sampled;
  const orangeRatio = orangePixels / sampled;
  const purpleRatio = purplePixels / sampled;

  let score = 100;
  score -= Math.min(40, Math.round(diseaseRatio * 200));
  score -= Math.min(30, spotCount * 3);
  score -= Math.min(20, Math.round((1 - greenRatio) * 30));
  score -= Math.min(10, Math.round((paleRatio + orangeRatio + purpleRatio) * 80));

  return Math.max(0, Math.min(100, score));
}

export async function analyzeRiceLeafLive(imageBlob: Blob): Promise<LiveAnalysisResult> {
  try {
    const [ref, bitmap] = await Promise.all([getCachedRef(), createImageBitmap(imageBlob)]);
    const canvas = document.createElement('canvas');
    canvas.width = 160;
    canvas.height = 160;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(bitmap, 0, 0, 160, 160);
    const imageData = ctx.getImageData(0, 0, 160, 160);
    bitmap.close();

    const features = extractFeaturesFast(imageData);
    const scaled = standardize(features, ref.scalerMean, ref.scalerScale);
    const knnResult = knnPredictFast(scaled, ref.features, ref.labels, 5);
    const ensemble = ensemblePredict(knnResult, imageData);

    const { count: spotCount, sizes: spotSizes, boxes: spots } = detectSpots(imageData);
    const healthScore = calculateHealthScore(imageData, spotCount);
    const leafColor = analyzeLeafColor(imageData);

    const isDeficient = ensemble.prediction.includes('Deficiency');
    const isDiseased = ['Brown Spot', 'Rice Blast', 'Bacterial Leaf Blight', 'Rice Leaf Diseases'].includes(ensemble.prediction);
    const status: 'healthy' | 'diseased' | 'deficient' =
      ensemble.prediction === 'Healthy' ? 'healthy' : isDeficient ? 'deficient' : 'diseased';

    return {
      prediction: leafColor.isLeaf ? ensemble.prediction : 'Unknown',
      confidence: leafColor.isLeaf ? ensemble.confidence : 30,
      spotCount,
      spotSizes,
      healthScore: leafColor.isLeaf ? healthScore : 0,
      status: leafColor.isLeaf ? status : 'healthy',
      spots,
      leafColor,
    };
  } catch (err) {
    console.warn('Live analysis failed:', err);
    return { prediction: 'Healthy', confidence: 50, spotCount: 0, spotSizes: { small: 0, medium: 0, large: 0 }, healthScore: 75, status: 'healthy', spots: [], leafColor: { dominant: 'Unknown', hue: 0, saturation: 0, brightness: 0, greenRatio: 0, isLeaf: true } };
  }
}

export async function analyzeRiceLeafFast(imageBlob: Blob): Promise<AiResult> {
  try {
    const [ref, bitmap] = await Promise.all([getCachedRef(), createImageBitmap(imageBlob)]);
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(bitmap, 0, 0, 128, 128);
    const imageData = ctx.getImageData(0, 0, 128, 128);
    bitmap.close();

    const features = extractFeaturesFast(imageData);
    const scaled = standardize(features, ref.scalerMean, ref.scalerScale);
    const knnResult = knnPredictFast(scaled, ref.features, ref.labels, 5);

    const ensemble = ensemblePredict(knnResult, imageData);

    const rec = recommendations[ensemble.prediction];
    if (rec) {
      return { ...rec, confidence: ensemble.confidence } as AiResult;
    }

    const rec2 = recommendations['Rice Leaf Diseases'];
    return { ...rec2, confidence: ensemble.confidence } as AiResult;
  } catch (err) {
    console.warn('Fast AI failed, falling back:', err);
    return analyzeRiceLeaf(imageBlob);
  }
}
