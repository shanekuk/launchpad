import os, csv, argparse
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()
supabase = create_client(os.environ["SUPABASE_URL"], os.environ["SUPABASE_SECRET_KEY"])

def load_rows(csv_path):
  rows_by_link = {}

  with open(csv_path, newline="", encoding="utf-8-sig") as f:
    for row in csv.DictReader(f):
      longitude = float(row["Longitude"])
      latitude = float(row["Latitude"])
      link = row["Link"].strip()

      rows_by_link[link] = {
        "organization": row["Organization"].strip(),
        "description": row["Description"].strip(),
        "location": f"POINT({longitude} {latitude})",
        "link": link,
      }

  return list(rows_by_link.values())



if __name__ == "__main__":
  parser = argparse.ArgumentParser(description="Write csv opportunities data to database.")
  parser.add_argument("filepath", help="Path of the csv file")  
  args = parser.parse_args()

  supabase.table("opportunities").upsert(load_rows(args.filepath), on_conflict="link").execute()


