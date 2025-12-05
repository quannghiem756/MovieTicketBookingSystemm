#!/usr/bin/env python3
"""
Script to check all data in the ChromaDB vector database
"""

import chromadb
from chromadb.config import Settings
import sys
import os

# Add the current directory to path to import configuration
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def check_vector_database():
    """Check all data in the ChromaDB vector database"""
    print("Checking ChromaDB vector database...")

    try:
        # Connect to the ChromaDB instance
        client = chromadb.PersistentClient(path="./chroma_data", settings=Settings(anonymized_telemetry=False))

        print("Connected to ChromaDB successfully!")

        # List all collections
        collections = client.list_collections()
        print(f"Found {len(collections)} collection(s): {[col.name for col in collections]}")

        if not collections:
            print("No collections found in the database!")
            return

        # Get the movies collection (assuming it's named 'movies')
        try:
            collection = client.get_collection(name="movies")
            print(f"\nAccessing collection: {collection.name}")

            # Get basic information about the collection
            count = collection.count()
            print(f"Total number of movies in collection: {count}")

            if count == 0:
                print("Collection is empty!")
                return

            # Get all data from the collection
            all_data = collection.get()

            print(f"\nRetrieved {len(all_data['ids'])} items from the collection")
            print(f"Keys in retrieved data: {list(all_data.keys())}")

            # Display all entries (full details)
            print(f"\nAll {len(all_data['ids'])} entries in the database:")
            print("-" * 80)

            for i in range(len(all_data['ids'])):
                movie_id = all_data['ids'][i]
                metadata = all_data['metadatas'][i] if all_data['metadatas'] else None
                document = all_data['documents'][i] if all_data['documents'] else None

                print(f"Entry {i+1}:")
                print(f"  ID: {movie_id}")

                if metadata:
                    print(f"  Metadata:")
                    for key, value in metadata.items():
                        print(f"    {key}: {value}")

                if document:
                    print(f"  Document: {document}")

                print()

            # Show detailed info about collection properties
            print("=" * 80)
            print("COLLECTION SUMMARY:")
            print(f"  Name: {collection.name}")
            print(f"  Total items: {count}")
            print(f"  Has metadata: {all_data['metadatas'] is not None and len(all_data['metadatas']) > 0}")
            print(f"  Has documents: {all_data['documents'] is not None and len(all_data['documents']) > 0}")
            print(f"  Has embeddings: {all_data['embeddings'] is not None and len(all_data['embeddings']) > 0}")

            if all_data['embeddings']:
                print(f"  Embedding dimensions: {len(all_data['embeddings'][0]) if all_data['embeddings'] else 'N/A'}")

            # Show all unique metadata keys
            if all_data['metadatas']:
                all_keys = set()
                for metadata in all_data['metadatas']:
                    all_keys.update(metadata.keys())
                print(f"  Metadata keys: {sorted(all_keys)}")

        except Exception as e:
            print(f"Error accessing 'movies' collection: {e}")

            # List all collections with their details
            print("\nAvailable collections in the database:")
            for col in collections:
                col_info = client.get_collection(col.name)
                print(f"  - {col.name}: {col_info.count()} items")

    except Exception as e:
        print(f"Error connecting to ChromaDB: {e}")
        print("Make sure you're running this script from the same directory as the vector service")
        print("and that the chroma_data directory exists.")

def search_movies_in_db(search_term=None):
    """Search for specific movies in the database"""
    try:
        client = chromadb.PersistentClient(path="./chroma_data", settings=Settings(anonymized_telemetry=False))
        collection = client.get_collection(name="movies")

        if search_term:
            print(f"\nSearching for movies containing: '{search_term}'")

            # Try to find movies that match the search term
            results = collection.get(where_document={"$contains": search_term})

            if results['ids']:
                print(f"Found {len(results['ids'])} movie(s) matching '{search_term}':")
                for i, movie_id in enumerate(results['ids'][:10]):  # Show first 10 results
                    metadata = results['metadatas'][i] if results['metadatas'] else None
                    print(f"  {i+1}. ID: {movie_id}")
                    if metadata:
                        print(f"     Title: {metadata.get('title', 'N/A')}")
                        print(f"     Director: {metadata.get('director', 'N/A')}")
            else:
                print(f"No movies found containing '{search_term}'")
        else:
            # If no search term provided, just show collection info
            print(f"\nTotal movies in database: {collection.count()}")

    except Exception as e:
        print(f"Error searching in ChromaDB: {e}")

if __name__ == "__main__":
    print("Vector Database Checker")
    print("=" * 50)

    if len(sys.argv) > 1:
        # If a search term is provided as command line argument
        search_term = " ".join(sys.argv[1:])
        check_vector_database()
        search_movies_in_db(search_term)
    else:
        # Check the database without searching
        check_vector_database()
        search_movies_in_db()