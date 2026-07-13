import io
import uuid
import cv2
import numpy as np
from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image

from classifier import get_classifier, CATEGORY_MAP, FULL_CATEGORY_MAP, CONFIDENCE_SCALE
import random

app = FastAPI(title="RiceLeaf AI Backend", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    get_classifier()


@app.get("/api/health")
async def health():
    clf = get_classifier()
    return {
        "status": "ok",
        "model": clf.active_model,
        "version": "2.0.0",
    }


@app.get("/api/categories")
async def categories():
    return {"categories": list(FULL_CATEGORY_MAP.values())}


@app.get("/api/model-info")
async def model_info():
    clf = get_classifier()
    return clf.model_info


@app.get("/api/tips")
async def get_tips(prediction: str = "Healthy", lang: str = "en"):
    tips_db = {
        "en": {
            "Healthy": [
                "Keep soil moist but not flooded — use alternate wetting and drying",
                "Apply balanced NPK fertilizer (14-14-14) every 2 weeks",
                "Remove weeds regularly to reduce competition for nutrients",
                "Monitor weekly for early signs of pests or nutrient deficiencies",
                "Add compost or vermicompost to maintain soil organic matter",
            ],
            "Nitrogen Deficiency": [
                "Apply Urea (46-0-0) immediately — 1 sack (50 kg) per hectare in split doses",
                "Use organic compost or chicken manure for slow-release nitrogen",
                "Avoid over-application — excess N attracts pests and causes lodging",
                "New green growth should appear within 5-7 days after application",
                "Plant munggo or cowpea as cover crop after harvest to restore N to soil",
            ],
            "Phosphorus Deficiency": [
                "Apply DAP (18-46-0) or guano — 40 kg/ha placed near the root zone",
                "Ensure soil is moist but not flooded for better phosphorus absorption",
                "Use Mykovam or bio-fertilizer to improve root P uptake",
                "Apply phosphate rock powder for long-term soil P enrichment",
                "Improvement visible in 7-10 days — more tillers and greener leaves",
            ],
            "Potassium Deficiency": [
                "Apply Muriate of Potash (0-0-60) — 35 kg/ha split into basal and panicle initiation",
                "Spread wood ash or rice straw in the field — free natural source of K",
                "Avoid prolonged drought — dry soil stress makes K deficiency worse",
                "New leaves recover in 5-7 days but old scorched tips will remain",
                "Maintain good drainage to prevent K leaching from heavy rain",
            ],
            "Brown Spot": [
                "Apply Mancozeb or copper-based fungicide at 2 g/L of water",
                "Spray every 7-10 days for 2-3 applications",
                "Remove and burn severely infected leaves to stop spore spread",
                "Use balanced fertilizer to prevent nitrogen deficiency that worsens infection",
                "Consult your local MAO (Municipal Agriculture Office) or PhilRice",
            ],
            "Rice Blast": [
                "Apply Tricyclazole or Azoxystrobin at 1.5 g/L of water",
                "Spray every 7 days at first sign of disease",
                "Reduce nitrogen fertilizer during active infection",
                "Remove and burn infected leaves immediately",
                "Plant resistant varieties next season (NSIC Rc 152, Rc 160)",
            ],
            "Bacterial Leaf Blight": [
                "Apply Copper oxychloride at 2 g/L of water",
                "Spray every 7 days, remove and burn infected leaves",
                "Drain field partially to reduce humidity and bacterial spread",
                "Avoid excessive nitrogen fertilizer application",
                "Use resistant varieties (NSIC Rc 192, Rc 216) for next planting",
            ],
            "Rice Leaf Diseases": [
                "Cut and burn infected leaves immediately to stop spore spread",
                "Apply copper-based bactericide for bacterial blight or tricyclazole for fungal",
                "Avoid nitrogen-heavy fertilizers during active infection",
                "Drain field partially to reduce humidity and fungal growth",
                "Consult your local MAO (Municipal Agriculture Office) or PhilRice",
            ],
        },
        "fil": {
            "Healthy": [
                "Panatilihin ang tamang patubig — basa ang lupa pero huwag lubog",
                "Maglagay ng balanced NPK fertilizer (14-14-14) kada dalawang linggo",
                "Alisin ang mga damo para hindi makipag-compete sa sustansya",
                "Mag-monitor linggo-linggo para sa maagang senyales ng peste",
                "Maglagay ng compost para mapanatili ang sustansya ng lupa",
            ],
            "Nitrogen Deficiency": [
                "Maglagay ng Urea (46-0-0) agad — 1 sako (50 kg) kada ektarya, hatiin sa 2-3 beses",
                "Gamitan ng organic compost o dumi ng manok para sa mabagal na N",
                "Huwag sobraan — ang labis na N ay nakakaakit ng peste",
                "Asahan ang bagong luntiang dahon sa loob ng 5-7 araw",
                "Itanim ang munggo o sitaw pagkatapos ng anihan para maibalik ang N",
            ],
            "Phosphorus Deficiency": [
                "Maglagay ng DAP (18-46-0) o guano — 40 kg/ektarya malapit sa ugat",
                "Siguraduhing mamasa-masa ang lupa para masipsip ang P",
                "Gamitan ng Mykovam o bio-fertilizer para bumuti ang P uptake",
                "Maglagay ng phosphate rock powder para sa matagalang P supply",
                "Makikita ang pagbuti sa loob ng 7-10 araw — mas maraming tillers",
            ],
            "Potassium Deficiency": [
                "Maglagay ng Muriate of Potash (0-0-60) — 35 kg/ektarya, hatiin sa dalawa",
                "Isaboy ang abo ng kahoy o rice straw — libreng source ng K",
                "Huwag patuyuin nang matagal ang palayan",
                "Ang bagong dahon gagaling sa 5-7 araw",
                "Panatilihin ang magandang drainage para hindi ma-leach ang K",
            ],
            "Brown Spot": [
                "Mag-spray ng fungicide (Mancozeb o copper-based) — 2g kada litro ng tubig",
                "Ulitin tuwing 7-10 araw, 2-3 beses",
                "Putulin at sunugin ang mga may sakit na dahon",
                "Gamitan ng balanced fertilizer",
                "Kumonsulta sa MAO o PhilRice",
            ],
            "Rice Blast": [
                "Mag-spray ng Tricyclazole o Azoxystrobin — 1.5g kada litro ng tubig",
                "Bawasan ang nitrogen fertilizer habang may impeksyon",
                "Putulin at alisin ang mga may sakit na dahon",
                "Kumonsulta sa PhilRice o MAO",
                "Magtanim ng resistant variety sa susunod na panahon",
            ],
            "Bacterial Leaf Blight": [
                "Mag-spray ng copper-based bactericide — 2g kada litro ng tubig",
                "Patuyuin ang palayan nang bahagya",
                "Putulin at sunugin ang mga may sakit na dahon",
                "Huwag mag-overapply ng nitrogen fertilizer",
                "Kumonsulta sa MAO o PhilRice para sa karagdagang tulong",
            ],
            "Rice Leaf Diseases": [
                "Putulin at sunugin agad ang mga may sakit na dahon",
                "Gamitan ng copper-based bactericide o fungicide tricyclazole",
                "Iwasan ang nitrogen-heavy fertilizer habang may impeksyon",
                "Patuyuin ang palayan nang bahagya",
                "Kumonsulta sa inyong MAO o PhilRice para sa tamang gamot",
            ],
        },
        "ceb": {
            "Healthy": [
                "Hupti nga basa ang yuta apan dili lubog",
                "Butangi og balanced NPK fertilizer (14-14-14) matag duha ka semana",
                "Kuhaa ang mga sagbot aron dili makigkompetensya",
                "Bantayan kada semana ang mga timailhan sa peste",
                "Butangi og compost aron mapadayon ang sustansya sa yuta",
            ],
            "Nitrogen Deficiency": [
                "Butangi og Urea (46-0-0) dayon — 1 sako (50 kg) kada ektarya",
                "Gamiti og organic compost o hugaw sa manok para sa anam-anam nga N",
                "Ayaw sobrahi — ang daghang N makadani sa peste",
                "Ang bag-ong lunhaw nga dahon makita sulod sa 5-7 ka adlaw",
                "Tanom og munggo human anihon aron mabalik ang N",
            ],
            "Phosphorus Deficiency": [
                "Butangi og DAP (18-46-0) o guano — 40 kg/ektarya duol sa gamot",
                "Siguroa nga basa-basa ang yuta aron masuyop ang P",
                "Gamiti og Mykovam o bio-fertilizer aron mouswag ang P uptake",
                "Butangi og phosphate rock powder para sa dugay nga P supply",
                "Makita ang pag-uswag sulod sa 7-10 ka adlaw",
            ],
            "Potassium Deficiency": [
                "Butangi og Muriate of Potash (0-0-60) — 35 kg/ektarya",
                "Isabwag ang abo sa kahoy o rice straw — libreng K source",
                "Ayaw dugayi og pauga ang humayan",
                "Ang bag-ong dahon maayo sulod sa 5-7 ka adlaw",
                "Hupti ang maayong drainage aron dili ma-leach ang K",
            ],
            "Brown Spot": [
                "Mag-spray og fungicide (Mancozeb o copper-based) — 2g kada litro",
                "Uliting every 7-10 ka adlaw, 2-3 beses",
                "Putla ug sunoga ang nag-sakit nga dahon",
                "Gamiti og balanced fertilizer",
                "Konsultaha ang MAO o PhilRice",
            ],
            "Rice Blast": [
                "Mag-spray og Tricyclazole o Azoxystrobin — 1.5g kada litro",
                "Bawasan ang nitrogen fertilizer samtang naay impeksyon",
                "Putla ug alisin ang nag-sakit nga dahon",
                "Konsultaha ang PhilRice o MAO",
                "Magtanim og resistant variety sunod nga panahon",
            ],
            "Bacterial Leaf Blight": [
                "Mag-spray og copper-based bactericide — 2g kada litro",
                "Pahubasa ang humayan og gamay",
                "Putla ug sunoga ang nag-sakit nga dahon",
                "Ayaw sobrahi ang nitrogen fertilizer",
                "Konsultaha ang MAO o PhilRice",
            ],
            "Rice Leaf Diseases": [
                "Putla ug sunoga dayon ang nag-sakit nga dahon",
                "Gamiti og copper-based bactericide o fungicide tricyclazole",
                "Likayi ang nitrogen-heavy fertilizer samtang naay impeksyon",
                "Pahubasa ang humayan og gamay",
                "Konsultaha ang inyong MAO o PhilRice sa hustong tambal",
            ],
        },
    }
    if lang not in tips_db or prediction not in tips_db[lang]:
        lang = "en"
    pool = tips_db.get(lang, tips_db["en"]).get(prediction, tips_db["en"]["Healthy"])
    tips = random.sample(pool, min(5, len(pool)))
    return {"tips": tips}


@app.post("/api/analyze")
async def analyze(file: UploadFile = File(...)):
    if file.content_type and not file.content_type.startswith("image/"):
        raise HTTPException(400, "File must be an image.")

    contents = await file.read()
    if len(contents) == 0:
        raise HTTPException(400, "Empty file.")

    try:
        pil_image = Image.open(io.BytesIO(contents)).convert("RGB")
        open_cv_image = cv2.cvtColor(np.array(pil_image), cv2.COLOR_RGB2BGR)
    except Exception:
        raise HTTPException(400, "Could not decode image.")

    clf = get_classifier()
    result = clf.predict(open_cv_image)

    return {
        "prediction": result["prediction"],
        "confidence": result["confidence"],
        "alternatives": result.get("alternatives", []),
        "model": result.get("model", "unknown"),
    }


@app.post("/api/submit-training")
async def submit_training(
    file: UploadFile = File(...),
    actual_label: str = Form(...),
    predicted_label: str = Form(...),
    confidence: int = Form(...),
    user_id: str = Form(default=""),
):
    """Accept a user-submitted training image for future model retraining."""
    if file.content_type and not file.content_type.startswith("image/"):
        raise HTTPException(400, "File must be an image.")

    contents = await file.read()
    if len(contents) == 0:
        raise HTTPException(400, "Empty file.")

    if actual_label not in FULL_CATEGORY_MAP:
        raise HTTPException(400, f"Invalid label: {actual_label}")

    submission_id = str(uuid.uuid4())

    return {
        "id": submission_id,
        "status": "accepted",
        "message": "Thank you for helping improve our AI!",
        "actual_label": actual_label,
        "predicted_label": predicted_label,
        "confidence": confidence,
    }
