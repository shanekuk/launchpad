# Scripts


## data_pipeline.py
Extracts volunteering opportunity from a CSV file and writes it to the database.

The CSV file must follow this example format:

| Organization | Description   | Latitude  | Longitude   | Link                         |
| ------------ | ------------- | --------- | ----------- | ---------------------------- |
| Nova         | Tech for good | 34.068921 | -118.445181 | https://www.novaforgood.org/ |

- All columns are required and can't be blank
- `Link` must start with `http://` or `https://`
- Extra columns are ignored

This file can be downloaded from Google Sheet using "File > Download > Comma Separated Values (.csv)"

### How to run the script

First, install all the dependencies:

```bash
cd scripts/
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Then, paste in the database URL and API key into `.env`.

Finally, you can run the script with:
```bash
python data_pipeline.py path/to/opportunities.csv
```
where filepath is the path to the CSV file