from fastapi import APIRouter, Body, HTTPException
import requests
import os 
from dotenv import load_dotenv
from pydantic import BaseModel

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

router = APIRouter()

# Request models
class GenerateRequest(BaseModel):
    prompt: str
    api_key: str = None

GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

def generate_gemini_response(system_prompt: str, prompt: str, api_key: str = None):
    # Use provided API key or fallback to default
    if not api_key and not GEMINI_API_KEY:
        raise HTTPException(status_code=400, detail="No API key provided. Please configure your Gemini API key.")
    
    used_api_key = api_key if api_key else GEMINI_API_KEY
    
    headers = {
        "Content-Type": "application/json",
        "X-goog-api-key": used_api_key
    }
    
    payload = {
        "contents": [
            {
                "parts": [
                    {"text": system_prompt} if system_prompt else {},
                    {"text": prompt}
                ]
            }
        ]
    }
    payload['contents'][0]['parts'] = [p for p in payload['contents'][0]['parts'] if p]
    
    try:
        response = requests.post(GEMINI_URL, headers=headers, json=payload)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Error calling Gemini API: {str(e)}")

@router.post("/generatescript")
def generate_script(request: GenerateRequest):
    system_prompt = """
    You are an expert AI assistant for content creators. Your job is to generate full, engaging scripts for YouTube, TikTok, Instagram Reels, and Podcasts.
    Guidelines:
    - Use a friendly, professional tone.
    - Structure the script with an introduction, main content, and conclusion.
    - Include hooks, calls to action, and relevant examples.
    - Adapt the style to the platform (e.g., short and punchy for TikTok, detailed for YouTube).
    - Avoid repetition and keep the content original.
    - Make sure the script is easy to read and perform.
    - Use clear language and avoid jargon unless requested.
    - [Add more instructions here as needed...]
    """
    return generate_gemini_response(system_prompt, request.prompt, request.api_key)

@router.post("/generatetitle")
def generate_title(request: GenerateRequest):
    system_prompt = """
    You are an expert in creating catchy, SEO-rich titles for online content.
    Guidelines:
    - Titles should be attention-grabbing and relevant.
    - Use keywords for SEO optimization.
    - Keep titles concise and clear.
    - Avoid clickbait unless requested.
    - [Add more instructions here as needed...]
    """
    return generate_gemini_response(system_prompt, request.prompt, request.api_key)

@router.post("/generatecaption")
def generate_caption(request: GenerateRequest):
    system_prompt = """
    You write engaging captions for social media posts.
    Guidelines:
    - Captions should match the mood and platform.
    - Use emojis and hashtags where appropriate.
    - Keep captions concise and impactful.
    - [Add more instructions here as needed...]
    """
    return generate_gemini_response(system_prompt, request.prompt, request.api_key)

@router.post("/generatehashtag")
def generate_hashtag(request: GenerateRequest):
    system_prompt = """
    You generate trending and niche-specific hashtags for social media.
    Guidelines:
    - Use relevant and trending hashtags.
    - Mix popular and niche hashtags.
    - Avoid banned or spammy hashtags.
    - [Add more instructions here as needed...]
    """
    return generate_gemini_response(system_prompt, request.prompt, request.api_key)

@router.post("/generateidea")
def generate_idea(request: GenerateRequest):
    system_prompt = """
    You suggest fresh content ideas based on the creator’s niche.
    Guidelines:
    - Ideas should be original and relevant.
    - Consider current trends and audience interests.
    - Provide a variety of ideas for different formats.
    - [Add more instructions here as needed...]
    """
    return generate_gemini_response(system_prompt, request.prompt, request.api_key)