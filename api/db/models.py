from sqlalchemy import create_engine, MetaData, Table
from sqlalchemy.orm import sessionmaker
from .config import DATABASE_URL

# Create engine and metadata
engine = create_engine(DATABASE_URL)
metadata = MetaData()

# Tables
sensors = Table('sensors', metadata, autoload_with=engine)
metrics = Table('metrics', metadata, autoload_with=engine)

# Create session
Session = sessionmaker(bind=engine)
session = Session()
