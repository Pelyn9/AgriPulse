import type { AiResult } from '../types';

const API_BASE = '/api';

const recommendations: Record<string, Omit<AiResult, 'confidence'>> = {
  Healthy: {
    prediction: 'Healthy',
    symptoms: ['Balanced green leaf tone', 'No visible stress pattern', 'Normal growth appearance'],
    fertilizer: 'Maintenance Program',
    applicationRate: 'Follow regular soil-test schedule',
    summary: 'Your rice leaf looks healthy. Keep up good field management practices.',
    description: 'The leaf appears healthy with no signs of disease or nutrient deficiency.',
    causes: ['Proper nutrient management', 'Adequate water supply', 'Good field sanitation'],
    treatment: 'No treatment needed. Continue regular care and monitoring.',
    prevention: ['Maintain balanced fertilization schedule', 'Monitor field weekly', 'Practice crop rotation'],
    recoveryTips: [
      'Panatilihin ang tamang patubig — basa ang lupa pero huwag lubog sa tubig',
      'Maglagay ng balanced NPK fertilizer kada dalawang linggo',
      'Alisin ang mga damo para hindi makipag-compete sa sustansya',
      'Gamitin ang loamy soil at panatilihin ang pH 5.5-6.5',
    ],
  },
  'Nitrogen Deficiency': {
    prediction: 'Nitrogen Deficiency',
    symptoms: ['Yellowing older leaves', 'Slow growth', 'Pale leaf canopy'],
    fertilizer: 'Urea (46-0-0)',
    applicationRate: '50 kg/ha',
    summary: 'Nitrogen stress detected. Apply nitrogen in split doses.',
    description: 'Nitrogen is essential for leaf growth. Deficiency causes yellowing from older leaves upward.',
    causes: ['Insufficient nitrogen fertilizer', 'Leaching from heavy rain', 'Low soil organic matter'],
    treatment: 'Apply Urea (46-0-0) at 50 kg/ha in 2-3 split applications.',
    prevention: ['Apply nitrogen in split doses', 'Use organic compost', 'Maintain proper water level'],
    recoveryTips: [
      'Maglagay ng Urea (46-0-0) agad — 1 sako (50kg) kada ektarya, hatiin sa 2-3 aplikasyon',
      'Gamitan ng organic compost o dumi ng manok/baka para sa mabagal na paglabas ng nitrogen',
      'Huwag sobraan — ang labis na N ay nakakaakit ng peste at nagpapalugmok ng palay',
      'Ang mabuhangin at loamy soil ay mabilis mawalan ng N — maglagay ng compost para tumagal',
    ],
  },
  'Phosphorus Deficiency': {
    prediction: 'Phosphorus Deficiency',
    symptoms: ['Dark green leaves', 'Purplish discoloration', 'Delayed tillering'],
    fertilizer: 'DAP (18-46-0)',
    applicationRate: '40 kg/ha',
    summary: 'Phosphorus uptake looks limited. Apply near the root zone.',
    description: 'Phosphorus is critical for root development and tillering. Deficiency causes purplish leaves.',
    causes: ['Low soil phosphorus', 'High soil pH', 'Cold soil temperature'],
    treatment: 'Apply DAP (18-46-0) at 40 kg/ha placed near the root zone.',
    prevention: ['Maintain soil pH 5.5-6.5', 'Apply phosphorus at planting', 'Use bio-fertilizers'],
    recoveryTips: [
      'Maglagay ng DAP (18-46-0) o kaya guano — 40kg/ektarya, ilagay malapit sa ugat',
      'Siguraduhing mamasa-masa ang lupa para masipsip ng maayos ang phosphorus',
      'Gamitan ng Mykovam o bio-fertilizer para bumuti ang P uptake',
      'Ang acidic soil (pH mababa sa 5.5) ay nagla-lock ng phosphorus — maglagay ng dayap',
    ],
  },
  'Potassium Deficiency': {
    prediction: 'Potassium Deficiency',
    symptoms: ['Brown leaf edges', 'Weak stems', 'Scorched older leaf tips'],
    fertilizer: 'Muriate of Potash (0-0-60)',
    applicationRate: '35 kg/ha',
    summary: 'Potassium deficiency detected. Strengthen crop resilience.',
    description: 'Potassium regulates water balance. Deficiency shows as brown scorching on leaf edges.',
    causes: ['Low soil potassium', 'Leaching in sandy soils', 'Prolonged drought'],
    treatment: 'Apply Muriate of Potash (0-0-60) at 35 kg/ha split into two applications.',
    prevention: ['Apply potassium in split doses', 'Use rice straw compost', 'Maintain good drainage'],
    recoveryTips: [
      'Maglagay ng Muriate of Potash (0-0-60) — 35kg/ektarya, hatiin sa dalawa',
      'Isaboy ang abo ng kahoy o rice straw — libreng source ng potassium',
      'Huwag patuyuin nang matagal ang palayan',
      'Ang mabuhangin at peat soil ay natural na mababa sa K — dagdagan ng organikong bagay',
    ],
  },
  'Brown Spot': {
    prediction: 'Brown Spot',
    symptoms: ['Small circular brown spots on leaves', 'Spots have gray center', 'Leaves turn yellow and dry'],
    fertilizer: 'Copper-based fungicide or Mancozeb',
    applicationRate: '2 g/L of water, spray every 7-10 days',
    summary: 'Brown Spot fungal disease detected. Treat immediately to prevent yield loss.',
    description: 'Brown Spot is caused by Cochliobolus miyabeanus. Small circular brown spots with gray centers appear on leaves.',
    causes: ['Fungal pathogen Cochliobolus miyabeanus', 'High humidity', 'Nitrogen-deficient plants'],
    treatment: 'Apply Mancozeb or copper fungicide at 2 g/L of water. Spray every 7-10 days.',
    prevention: ['Use disease-free seeds', 'Apply balanced fertilizer', 'Practice crop rotation'],
    recoveryTips: [
      'Putulin at sunugin ang mga may sakit na dahon',
      'Mag-spray ng fungicide — 2g kada litro ng tubig, ulitin tuwing 7-10 araw',
      'Gamitan ng balanced fertilizer',
      'Kumonsulta sa MAO o PhilRice',
      'Patuyuin ang palayan — ang binabahang clay soil ay nagpapalala ng fungus',
    ],
  },
  'Rice Blast': {
    prediction: 'Rice Blast',
    symptoms: ['Diamond-shaped lesions with gray center', 'Brown to purple border', 'Lesions on leaves and stems'],
    fertilizer: 'Tricyclazole or Azoxystrobin fungicide',
    applicationRate: '1.5 g/L of water, spray at first sign',
    summary: 'Rice Blast detected. One of the most destructive rice diseases.',
    description: 'Rice Blast is caused by Magnaporthe grisea. Diamond-shaped lesions with gray centers and brown borders.',
    causes: ['Fungal pathogen Magnaporthe grisea', 'High humidity', 'Excessive nitrogen'],
    treatment: 'Apply Tricyclazole or Azoxystrobin at 1.5 g/L of water. Spray every 7 days.',
    prevention: ['Plant resistant varieties', 'Avoid excessive nitrogen', 'Maintain plant spacing'],
    recoveryTips: [
      'Mag-spray ng Tricyclazole o Azoxystrobin — 1.5g kada litro ng tubig',
      'Bawasan ang nitrogen fertilizer habang may impeksyon',
      'Putulin ang mga may sakit na dahon',
      'Kumonsulta sa PhilRice o MAO',
      'Ang mabuhangin na lupa ay mabilis matuyo — panatilihing basa para hindi ma-stress ang halaman',
    ],
  },
  'Bacterial Leaf Blight': {
    prediction: 'Bacterial Leaf Blight',
    symptoms: ['Yellow to white streaks along veins', 'Water-soaked lesions from leaf tip', 'Leaves dry up'],
    fertilizer: 'Copper-based bactericide (Copper oxychloride)',
    applicationRate: '2 g/L of water, spray at first sign',
    summary: 'Bacterial Leaf Blight detected. Can cause significant yield loss.',
    description: 'BLB is caused by Xanthomonas oryzae. Yellow-white streaks along veins starting from leaf tips.',
    causes: ['Bacterium Xanthomonas oryzae', 'High humidity and temperature', 'Excessive nitrogen'],
    treatment: 'Apply Copper oxychloride at 2 g/L of water. Spray every 7 days. Drain field partially.',
    prevention: ['Use resistant varieties', 'Avoid excessive nitrogen', 'Proper drainage', 'Field sanitation'],
    recoveryTips: [
      'Mag-spray ng copper-based bactericide — 2g kada litro ng tubig',
      'Patuyuin ang palayan nang bahagya',
      'Putulin at sunugin ang mga may sakit na dahon',
      'Kumonsulta sa MAO o PhilRice',
      'Ang clay loam at silt loam na may mahinang drainage ay nagpapalala ng BLB — haluan ng compost at buhangin',
    ],
  },
  'Rice Leaf Diseases': {
    prediction: 'Rice Leaf Diseases',
    symptoms: ['Lesions or spots on leaves', 'Irregular discoloration patterns', 'Possible infection'],
    fertilizer: 'Consult local agricultural extension',
    applicationRate: 'Pathogen-specific treatment needed',
    summary: 'General disease signs detected. Consult an agricultural expert.',
    description: 'General disease symptoms detected. Consult MAO or PhilRice for accurate diagnosis.',
    causes: ['Fungal or bacterial pathogen', 'Environmental stress', 'Poor field management'],
    treatment: 'Consult your local Municipal Agriculture Office or PhilRice for proper diagnosis.',
    prevention: ['Maintain field sanitation', 'Practice crop rotation', 'Use resistant varieties'],
    recoveryTips: [
      'Putulin at sunugin ang mga may sakit na dahon',
      'Kumonsulta sa MAO o PhilRice para sa tamang gamot',
      'Iwasan muna ang nitrogen-heavy fertilizer',
      'Patuyuin ang palayan nang bahagya',
    ],
  },
};

async function analyzeWithBackend(imageBlob: Blob): Promise<AiResult> {
  const formData = new FormData();
  formData.append('file', imageBlob, 'leaf.jpg');

  const response = await fetch(`${API_BASE}/analyze`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Backend returned ${response.status}`);
  }

  const data = await response.json();
  const prediction = data.prediction as string;
  const confidence = data.confidence as number;
  const alternatives = data.alternatives as { prediction: string; confidence: number }[] | undefined;
  const model = data.model as string | undefined;

  if (!recommendations[prediction]) {
    throw new Error(`Unknown prediction: ${prediction}`);
  }

  return {
    ...recommendations[prediction],
    confidence,
    alternatives,
    model,
  } as AiResult;
}

async function analyzeWithMock(imageBlob?: Blob): Promise<AiResult> {
  const { analyzeRiceLeaf } = await import('./mockAiService');
  return analyzeRiceLeaf(imageBlob);
}

async function analyzeWithMockFast(imageBlob: Blob): Promise<AiResult> {
  const { analyzeRiceLeafFast } = await import('./mockAiService');
  return analyzeRiceLeafFast(imageBlob);
}

export async function analyzeRiceLeaf(imageBlob?: Blob): Promise<AiResult> {
  if (imageBlob) {
    try {
      return await analyzeWithBackend(imageBlob);
    } catch {
      console.warn('AI backend unavailable, falling back to mock.');
    }
  }
  return analyzeWithMock(imageBlob);
}

export async function analyzeRiceLeafFast(imageBlob: Blob): Promise<AiResult> {
  try {
    return await analyzeWithBackend(imageBlob);
  } catch {
    return analyzeWithMockFast(imageBlob);
  }
}
