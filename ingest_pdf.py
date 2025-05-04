import os
from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
import chromadb # Import ChromaDB client library

# Load environment variables from .env file (especially OPENAI_API_KEY)
load_dotenv()

# --- Configuration ---
PDF_PATH = "knowledge/California-Tenants-Guide.pdf"
CHROMA_DB_PATH = "./chroma_db" # Directory to store persistent ChromaDB
COLLECTION_NAME = "california_tenant_guide"
CHUNK_SIZE = 1000 # Text chunk size
CHUNK_OVERLAP = 200 # Overlap between chunks

# --- Check if DB already exists ---
if os.path.exists(CHROMA_DB_PATH):
    print(f"ChromaDB already exists at {CHROMA_DB_PATH}. Checking collection...")
    try:
        client = chromadb.PersistentClient(path=CHROMA_DB_PATH)
        # Try to get the collection, if it exists, exit.
        client.get_collection(name=COLLECTION_NAME)
        print(f"Collection '{COLLECTION_NAME}' already exists. Skipping ingestion.")
        # Optional: Delete existing collection if you want to re-ingest
        # print(f"Deleting existing collection '{COLLECTION_NAME}'...")
        # client.delete_collection(name=COLLECTION_NAME)
        # print("Collection deleted. Proceeding with ingestion...")
        exit() # Exit if collection exists and we don't want to re-ingest
    except Exception as e: # Catch specific exception if ChromaDB changes API, broad for now
        print(f"Collection '{COLLECTION_NAME}' not found or error checking: {e}. Proceeding with ingestion...")
        # If client was created, ensure it's reset or let Chroma.from_documents handle it
        client = None # Reset client just in case

# --- Load and Split PDF ---
print(f"Loading PDF from: {PDF_PATH}")
loader = PyPDFLoader(PDF_PATH)
documents = loader.load()
if not documents:
    print("Error: Could not load documents from PDF.")
    exit()
print(f"Loaded {len(documents)} pages from PDF.")

print("Splitting documents into chunks...")
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=CHUNK_SIZE,
    chunk_overlap=CHUNK_OVERLAP
)
chunks = text_splitter.split_documents(documents)
print(f"Split into {len(chunks)} chunks.")

# --- Embedding and Storing in ChromaDB ---
print("Initializing OpenAI embeddings...")
# Ensure OPENAI_API_KEY is loaded from .env via load_dotenv()
embedding_function = OpenAIEmbeddings()

print(f"Creating/loading ChromaDB collection '{COLLECTION_NAME}' at {CHROMA_DB_PATH}...")
# This will create the directory if it doesn't exist and persist the data
# It handles embedding the chunks and adding them to the collection
vector_store = Chroma.from_documents(
    documents=chunks,
    embedding=embedding_function,
    collection_name=COLLECTION_NAME,
    persist_directory=CHROMA_DB_PATH
)

# Optional: Explicitly persist if needed, though from_documents usually handles it for new collections
# print("Persisting vector store...")
# vector_store.persist()

print(f"--- Ingestion Complete ---")
print(f"PDF processed: {PDF_PATH}")
print(f"Chunks created: {len(chunks)}")
print(f"Collection '{COLLECTION_NAME}' created/updated in {CHROMA_DB_PATH}") 