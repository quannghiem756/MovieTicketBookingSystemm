# movie_vector_service.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import pickle
import os
import requests
import json
from datetime import datetime
import logging
from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_core.documents import Document
import google.generativeai as genai
from openai import OpenAI
import time
from functools import wraps
import threading
import hashlib
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuration
MOVIE_API_URL = os.getenv('MOVIE_API_URL', 'http://localhost:5000/api/movies')
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
GEMINI_API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key={GEMINI_API_KEY}"
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
openai_client = OpenAI(api_key=OPENAI_API_KEY) if OPENAI_API_KEY else None

# Global variables to store vector data
vector_store = None
movies_data = []
movie_ids = []

# Cache for embeddings to avoid repeated API calls
embedding_cache = {}
cache_lock = threading.Lock()

# Cache size limit
MAX_CACHE_SIZE = 10000

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def fetch_movies_from_api():
    """Fetch all movies from the main API"""
    try:
        response = requests.get(MOVIE_API_URL)
        response.raise_for_status()
        return response.json().get('movies', [])
    except Exception as e:
        logger.error(f"Error fetching movies from API: {e}")
        return []

def create_movie_text(movie):
    """Create a text representation of a movie for vectorization"""
    return " ".join([
        movie.get('title', ''),
        movie.get('director', ''),
        " ".join(movie.get('cast', [])),
        movie.get('synopsis', ''),
        " ".join(movie.get('genre', [])),
        movie.get('rating', ''),
    ]).strip()

def retry_with_backoff(func, max_retries=3, base_delay=1):
    """Decorator to retry API calls with exponential backoff"""
    @wraps(func)
    def wrapper(*args, **kwargs):
        for attempt in range(max_retries):
            try:
                return func(*args, **kwargs)
            except Exception as e:
                if attempt == max_retries - 1:  # Last attempt
                    logger.error(f"Failed after {max_retries} attempts: {e}")
                    raise e
                delay = base_delay * (2 ** attempt)  # Exponential backoff
                logger.warning(f"Attempt {attempt + 1} failed: {e}. Retrying in {delay}s...")
                time.sleep(delay)
        return None
    return wrapper

def manage_cache_size():
    """Manage cache size to prevent memory issues"""
    with cache_lock:
        if len(embedding_cache) > MAX_CACHE_SIZE:
            # Remove oldest entries (using insertion order in Python 3.7+ dict)
            keys_to_remove = list(embedding_cache.keys())[:len(embedding_cache) - MAX_CACHE_SIZE + 1000]  # Keep 1000 extra
            for key in keys_to_remove:
                del embedding_cache[key]
            logger.info(f"Cache size managed: removed {len(keys_to_remove)} entries")

def get_embedding_cache_key(text):
    """Generate a cache key for the given text"""
    return hashlib.md5(text.encode('utf-8')).hexdigest()

# Remove manual embedding functions since LangChain handles this

def build_vector_index():
    """Build vector index from movies data and store in ChromaDB with batch processing"""
    global movies_data, movie_ids, vector_store

    # Try OpenAI embeddings first
    openai_api_key = os.getenv('OPENAI_API_KEY')
    gemini_api_key = os.getenv('GEMINI_API_KEY')

    embeddings = None

    if openai_api_key:
        try:
            embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
            logger.info("Using OpenAI embeddings")
        except Exception as e:
            logger.error(f"Error initializing OpenAI embeddings: {e}")
    elif gemini_api_key:
        try:
            embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key=gemini_api_key)
            logger.info("Using Google Generative AI embeddings as fallback")
        except Exception as e:
            logger.error(f"Error initializing Google embeddings: {e}")
    else:
        logger.error("No API keys found - neither OPENAI_API_KEY nor GEMINI_API_KEY are set")
        return False

    if not embeddings:
        logger.error("No valid embedding provider available")
        return False

    logger.info("Fetching movies from main API...")
    movies = fetch_movies_from_api()

    if not movies:
        logger.warning("No movies found from API")
        return False

    movies_data = movies
    movie_ids = [movie.get('id') for movie in movies]

    # Create text representations for all movies
    movie_texts = [create_movie_text(movie) for movie in movies]

    # Prepare documents with metadata for LangChain
    documents = []
    for i, movie in enumerate(movies):
        doc = Document(
            page_content=movie_texts[i],
            metadata={
                'id': str(movie.get('id')),
                'title': movie.get('title', ''),
                'director': movie.get('director', ''),
                'cast': ', '.join(movie.get('cast', [])),
                'synopsis': movie.get('synopsis', ''),
                'genre': ', '.join(movie.get('genre', [])),
                'rating': movie.get('rating', '')
            }
        )
        documents.append(doc)

    # Create the vector store with LangChain
    try:
        # Create the vector store from documents
        vector_store = Chroma.from_documents(
            documents=documents,
            embedding=embeddings,
            persist_directory="./chroma_data",
            collection_name="movies"
        )

        logger.info(f"Built vector index with {len(movies)} movies and stored in ChromaDB using LangChain")
        return True
    except Exception as e:
        logger.error(f"Error creating vector store: {e}")
        return False

def search_similar_movies(query, top_k=10):
    """Search for similar movies based on the query using LangChain ChromaDB with rate limiting"""
    global vector_store

    if vector_store is None:
        logger.error("LangChain vector store not initialized")
        return []

    # Add small delay to avoid query rate limiting
    time.sleep(0.05)

    try:
        # Use LangChain's similarity_search method
        docs = vector_store.similarity_search(query, k=top_k)

        # Format results to match the original function's output
        formatted_results = []
        for i, doc in enumerate(docs):
            # Get the original movie data from metadatas
            metadata = doc.metadata
            movie_id = metadata.get('id')

            # Find the original movie data by ID
            original_movie = next((movie for movie in movies_data if str(movie.get('id')) == movie_id), None)
            if original_movie is None:
                # If not found in current movies_data, reconstruct from metadata
                original_movie = {
                    'id': metadata.get('id'),
                    'title': metadata.get('title'),
                    'director': metadata.get('director'),
                    'cast': metadata.get('cast', '').split(', ') if metadata.get('cast') else [],
                    'synopsis': metadata.get('synopsis'),
                    'genre': metadata.get('genre', '').split(', ') if metadata.get('genre') else [],
                    'rating': metadata.get('rating')
                }

            result = {
                'movie': original_movie,
                'similarity': 0.0,  # Placeholder for similarity - LangChain doesn't return this directly
                'rank': len(formatted_results) + 1
            }
            formatted_results.append(result)

        return formatted_results

    except Exception as e:
        logger.error(f"Error querying LangChain vector store: {e}")
        return []

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'})

@app.route('/rebuild-index', methods=['POST'])
def rebuild_index():
    """Rebuild the vector index from the movie database"""
    success = build_vector_index()
    if success:
        return jsonify({'status': 'success', 'message': 'Vector index rebuilt successfully'})
    else:
        return jsonify({'status': 'error', 'message': 'Failed to rebuild vector index'}), 500

@app.route('/search', methods=['POST'])
def search_movies():
    """Search for movies similar to the query"""
    try:
        data = request.get_json()
        query = data.get('query', '')

        if not query:
            return jsonify({'error': 'Query is required'}), 400

        results = search_similar_movies(query, top_k=10)

        # Prepare the response with just the relevant movie data
        relevant_movies = [result['movie'] for result in results]

        return jsonify({
            'query': query,
            'results': results,
            'movies': relevant_movies,
            'count': len(relevant_movies)
        })

    except Exception as e:
        logger.error(f"Error in search_movies: {e}")
        return jsonify({'error': str(e)}), 500

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser

@app.route('/recommend', methods=['POST'])
def get_recommendations():
    """Get recommendations using LangChain LLM with retrieved context"""
    try:
        data = request.get_json()
        query = data.get('query', '')

        if not query:
            return jsonify({'error': 'Query is required'}), 400

        # Get relevant movies using vector search
        results = search_similar_movies(query, top_k=10)
        relevant_movies = [result['movie'] for result in results]

        if not relevant_movies:
            return jsonify({
                'query': query,
                'recommendations': [],
                'total': 0,
                'message': 'No movies match your criteria. Try mentioning genres like action, comedy, drama or specific actors/directors you like!'
            })

        # Create context from relevant movies for LLM
        context = "Retrieved Movies:\n" + "\n\n".join([
            f"ID: {movie['id']}, Title: {movie['title']}, Genre: {', '.join(movie.get('genre', []))}, "
            f"Rating: {movie.get('rating', 'N/A')}, Director: {movie.get('director', 'N/A')}, "
            f"Cast: {', '.join(movie.get('cast', []))}, Synopsis: {movie.get('synopsis', 'N/A')[:200]}..."
            for movie in relevant_movies
        ])

        # Create prompt for LLM
        prompt_template = """Based on the user query: "{query}", I've retrieved the following movies that are most contextually relevant.
        Please recommend movies that best match the user's preferences.
        Consider genres, ratings, director, cast, and plot descriptions when making recommendations.

        {context}

        Just return the movie IDs as a JSON array of strings with no additional text or explanation:"""

        # Choose LLM based on available API keys
        if GEMINI_API_KEY:
            # Use Google's Gemini
            llm = ChatGoogleGenerativeAI(model="gemini-flash-latest", google_api_key=GEMINI_API_KEY)
        elif OPENAI_API_KEY:
            # Use OpenAI's GPT
            llm = ChatOpenAI(model="gpt-3.5-turbo", api_key=OPENAI_API_KEY)
        else:
            # Fallback to just the retrieved results
            recommendations = relevant_movies[:5]  # Take top 5 from retrieval
            return jsonify({
                'query': query,
                'recommendations': recommendations,
                'total': len(recommendations),
                'source': 'retrieval_only'
            })

        # Create a chain with the prompt and LLM
        prompt = PromptTemplate(
            input_variables=["query", "context"],
            template=prompt_template
        )

        chain = prompt | llm

        # Run the chain
        response = chain.invoke({"query": query, "context": context})

        # Extract the response text
        # Handle different possible response formats from different LLM providers
        if hasattr(response, 'content'):
            response_text = response.content
        elif isinstance(response, str):
            response_text = response
        elif hasattr(response, 'text'):
            response_text = response.text
        elif isinstance(response, dict):
            # Handle cases where response might be a dictionary
            response_text = str(response)
        else:
            response_text = str(response)

        # Ensure response_text is a string
        if isinstance(response_text, list):
            # Convert any items in the list to strings before joining
            response_text = ' '.join(str(item) for item in response_text)
        elif not isinstance(response_text, str):
            response_text = str(response_text)

        # Extract movie IDs from LLM's response
        import re
        import ast

        # Clean the response to extract JSON
        cleaned_response = response_text.replace('```json', '').replace('```', '').strip()

        try:
            # Try to parse as JSON directly
            recommended_ids = json.loads(cleaned_response)
        except json.JSONDecodeError:
            # Try to extract with regex
            matches = re.search(r'\[(.*?)\]', cleaned_response)
            if matches:
                try:
                    # Evaluate the array string safely
                    recommended_ids = ast.literal_eval(f"[{matches.group(1)}]")
                except:
                    recommended_ids = []
            else:
                recommended_ids = []

        # Ensure recommended_ids is a list of strings
        if not isinstance(recommended_ids, list):
            recommended_ids = []

        # Filter movies based on recommended IDs
        if recommended_ids:
            recommended_movies = [movie for movie in relevant_movies if str(movie['id']) in [str(id) for id in recommended_ids]]
        else:
            # Fallback to top retrieved results
            recommended_movies = relevant_movies[:5]

        return jsonify({
            'query': query,
            'recommendations': recommended_movies,
            'total': len(recommended_movies),
            'source': 'llm_with_retrieval'
        })

    except Exception as e:
        logger.error(f"Error in get_recommendations: {e}")
        # Fallback to just the retrieved results
        results = search_similar_movies(query, top_k=5)
        recommendations = [result['movie'] for result in results]
        return jsonify({
            'query': query,
            'recommendations': recommendations,
            'total': len(recommendations),
            'source': 'retrieval_fallback',
            'error': str(e)
        })

@app.route('/movies', methods=['GET'])
def get_movies():
    """Get all indexed movies from LangChain ChromaDB"""
    if vector_store is None:
        return jsonify({
            'movies': [],
            'count': 0
        })

    # Get all documents from the vector store
    try:
        # Using similarity search with an empty query to get all docs would be inefficient
        # Instead, we can use the underlying collection
        chroma_collection = vector_store._collection  # Access the underlying Chroma collection
        all_movies = chroma_collection.get()

        # Extract movie data from metadata
        movies = []
        for metadata in all_movies.get('metadatas', []):
            movie = {
                'id': metadata.get('id'),
                'title': metadata.get('title'),
                'director': metadata.get('director'),
                'cast': metadata.get('cast', '').split(', ') if metadata.get('cast') else [],
                'synopsis': metadata.get('synopsis'),
                'genre': metadata.get('genre', '').split(', ') if metadata.get('genre') else [],
                'rating': metadata.get('rating')
            }
            movies.append(movie)

        return jsonify({
            'movies': movies,
            'count': len(movies)
        })
    except Exception as e:
        logger.error(f"Error retrieving movies from vector store: {e}")
        return jsonify({
            'movies': [],
            'count': 0
        })

@app.route('/cache/clear', methods=['POST'])
def clear_cache():
    """Clear the embedding cache"""
    global embedding_cache
    with cache_lock:
        cache_size_before = len(embedding_cache)
        embedding_cache.clear()
    logger.info(f"Cache cleared: {cache_size_before} entries removed")
    return jsonify({
        'status': 'success',
        'message': f'Cache cleared: {cache_size_before} entries removed'
    })

@app.route('/cache/stats', methods=['GET'])
def cache_stats():
    """Get cache statistics"""
    with cache_lock:
        cache_size = len(embedding_cache)
    return jsonify({
        'cache_size': cache_size,
        'max_cache_size': MAX_CACHE_SIZE,
        'status': 'active'
    })

def initialize_chroma():
    """Initialize LangChain vector store with fallback options"""
    global vector_store

    # Try OpenAI embeddings first
    openai_api_key = os.getenv('OPENAI_API_KEY')
    gemini_api_key = os.getenv('GEMINI_API_KEY')

    embeddings = None

    if openai_api_key:
        try:
            embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
            logger.info("Using OpenAI embeddings")
        except Exception as e:
            logger.error(f"Error initializing OpenAI embeddings: {e}")
    elif gemini_api_key:
        try:
            embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key=gemini_api_key)
            logger.info("Using Google Generative AI embeddings as fallback")
        except Exception as e:
            logger.error(f"Error initializing Google embeddings: {e}")
    else:
        logger.error("No API keys found - neither OPENAI_API_KEY nor GEMINI_API_KEY are set")
        return

    if not embeddings:
        logger.error("No valid embedding provider available")
        vector_store = None
        return

    # Create the vector store instance (it will be populated in build_vector_index)
    try:
        # Create an empty vector store initially
        vector_store = Chroma(
            collection_name="movies",
            embedding_function=embeddings,
            persist_directory="./chroma_data"
        )
        logger.info("LangChain vector store initialized successfully")
    except Exception as e:
        logger.error(f"Error initializing LangChain vector store: {e}")
        vector_store = None


if __name__ == '__main__':
    # Initialize the LangChain vector store when starting the service
    logger.info("Initializing LangChain vector store...")
    initialize_chroma()

    # Initialize the vector index when starting the service
    logger.info("Initializing vector index...")
    build_vector_index()

    # Run the Flask app
    app.run(debug=False, host='0.0.0.0', port=5001)