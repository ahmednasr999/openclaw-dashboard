#!/bin/bash
# Fix Google Sheet HYPERLINK formulas

SPREADSHEET_ID="10HMT9ZjFk9eUyCJJR5iVxMXS6iGV6RBS2XTL1K6DhrA"
TOKEN=$(/root/.openclaw/agents/main/workspace/get_token.sh)

# Job folder mappings
 declare -A JOB_FOLDERS=(
    ["01"]="job_01_techglobal_solutions"
    ["02"]="job_02_cloudfirst_consulting"
    ["03"]="job_03_smalltech_llc"
    ["04"]="job_04_emirates_digital_bank"
    ["05"]="job_05_mckinsey_company"
    ["06"]="job_06_adcb"
    ["07"]="job_07_bcg"
    ["08"]="job_08_mashreq_bank"
    ["09"]="job_09_deloitte"
    ["10"]="job_10_fab"
    ["11"]="job_11_kpmg"
    ["12"]="job_12_dubai_islamic_bank"
    ["13"]="job_13_pwc"
    ["14"]="job_14_saudi_national_bank"
    ["15"]="job_15_oliver_wyman"
    ["16"]="job_16_noor_bank"
    ["17"]="job_17_ey"
    ["18"]="job_18_rakbank"
    ["19"]="job_19_accenture"
    ["20"]="job_20_qatar_national_bank"
    ["21"]="job_21_bain_company"
    ["22"]="job_22_sharjah_islamic_bank"
    ["23"]="job_23_ibm_consulting"
    ["24"]="job_24_ajman_bank"
    ["25"]="job_25_roland_berger"
    ["26"]="job_26_cbd_bank"
    ["27"]="job_27_capgemini"
    ["28"]="job_28_al_hilal_bank"
    ["29"]="job_29_oliver_wyman"
    ["30"]="job_30_al_masraf_bank"
    ["31"]="job_31_strategy"
    ["32"]="job_32_doha_bank"
    ["33"]="job_33_at_kearney"
    ["34"]="job_34_national_bank_of_oman"
    ["35"]="job_35_ahli_bank"
    ["36"]="job_36_monitor_deloitte"
    ["37"]="job_37_bank_of_sharjah"
    ["38"]="job_38_infosys_consulting"
    ["39"]="job_39_united_arab_bank"
    ["40"]="job_40_arthur_d_little"
    ["41"]="job_41_mena_fintech"
    ["42"]="job_42_gulf_bank"
    ["43"]="job_43_booz_allen_hamilton"
    ["44"]="job_44_boubyan_bank"
    ["45"]="job_45_warba_bank"
    ["46"]="job_46_bearingpoint"
    ["47"]="job_47_al_ahli_bank_of_kuwait"
    ["48"]="job_48_tech_mahindra"
    ["49"]="job_49_cognizant"
    ["50"]="job_50_wipro"
)

GITHUB_BASE="https://raw.githubusercontent.com/ahmednasr999/openclaw-dashboard/main/applications"

echo "Preparing batch update for HYPERLINK formulas..."

# Build the batch update request
# We need to update rows 10-59 (the 50 batch job rows)

REQUEST_FILE=$(mktemp)
echo '{"valueInputOption": "USER_ENTERED", "data": [' > "$REQUEST_FILE"

FIRST=true

# Read current sheet data to map job numbers to rows
SHEET_DATA=$(curl -s "https://sheets.googleapis.com/v4/spreadsheets/$SPREADSHEET_ID/values/Sheet1!A10:M60" \
  -H "Authorization: Bearer $TOKEN")

# Process each row
echo "$SHEET_DATA" | jq -r '.values | to_entries[] | [.key + 10, .value[0]] | @tsv' | while IFS=$'\t' read -r row_idx company; do
    # Skip empty rows
    [ -z "$company" ] && continue
    
    # Extract job number from company name or skip
    job_num=""
    case "$company" in
        "TechGlobal Solutions") job_num="01" ;;
        "CloudFirst Consulting") job_num="02" ;;
        "SmallTech LLC") job_num="03" ;;
        "Emirates Digital Bank") job_num="04" ;;
        "McKinsey & Company") job_num="05" ;;
        "ADCB") job_num="06" ;;
        "BCG") job_num="07" ;;
        "Mashreq Bank") job_num="08" ;;
        "Deloitte") job_num="09" ;;
        "FAB") job_num="10" ;;
        "KPMG") job_num="11" ;;
        "Dubai Islamic Bank") job_num="12" ;;
        "PwC") job_num="13" ;;
        "Saudi National Bank") job_num="14" ;;
        "Oliver Wyman") 
            # Oliver Wyman appears twice - rows 15 and 29
            if [ "$row_idx" -lt 20 ]; then
                job_num="15"
            else
                job_num="29"
            fi
            ;;
        "Noor Bank") job_num="16" ;;
        "EY") job_num="17" ;;
        "RAKBANK") job_num="18" ;;
        "Accenture") job_num="19" ;;
        "Qatar National Bank") job_num="20" ;;
        "Bain & Company") job_num="21" ;;
        "Sharjah Islamic Bank") job_num="22" ;;
        "IBM Consulting") job_num="23" ;;
        "Ajman Bank") job_num="24" ;;
        "Roland Berger") job_num="25" ;;
        "CBD Bank") job_num="26" ;;
        "Capgemini") job_num="27" ;;
        "Al Hilal Bank") job_num="28" ;;
        "Al Masraf Bank") job_num="30" ;;
        "Strategy&") job_num="31" ;;
        "Doha Bank") job_num="32" ;;
        "AT Kearney") job_num="33" ;;
        "National Bank of Oman") job_num="34" ;;
        "Ahli Bank") job_num="35" ;;
        "Monitor Deloitte") job_num="36" ;;
        "Bank of Sharjah") job_num="37" ;;
        "Infosys Consulting") job_num="38" ;;
        "United Arab Bank") job_num="39" ;;
        "Arthur D. Little") job_num="40" ;;
        "MENA Fintech") job_num="41" ;;
        "Gulf Bank") job_num="42" ;;
        "Booz Allen Hamilton") job_num="43" ;;
        "Boubyan Bank") job_num="44" ;;
        "Warba Bank") job_num="45" ;;
        "BearingPoint") job_num="46" ;;
        "Al Ahli Bank of Kuwait") job_num="47" ;;
        "Tech Mahindra") job_num="48" ;;
        "Cognizant") job_num="49" ;;
        "Wipro") job_num="50" ;;
    esac
    
    [ -z "$job_num" ] && continue
    
    folder="${JOB_FOLDERS[$job_num]}"
    [ -z "$folder" ] && continue
    
    # Calculate actual sheet row number (row_idx is 0-based from A10)
    sheet_row=$((row_idx + 1))
    
    # Job URL formula (Column I)
    # Since we don't have actual job URLs, use LinkedIn search as placeholder
    job_url="https://www.linkedin.com/jobs/search/?keywords=${company// /+}"
    job_formula="=HYPERLINK(\"$job_url\", \"🔗 View Job\")"
    
    # CV Link formula (Column M)
    cv_url="$GITHUB_BASE/$folder/CV.pdf"
    cv_formula="=HYPERLINK(\"$cv_url\", \"📄 View CV (PDF)\")"
    
    # Add to request
    if [ "$FIRST" = true ]; then
        FIRST=false
    else
        echo "," >> "$REQUEST_FILE"
    fi
    
    cat >> "$REQUEST_FILE" << EOF
    {"range": "Sheet1!I$sheet_row", "values": [["$job_formula"]]},
    {"range": "Sheet1!M$sheet_row", "values": [["$cv_formula"]]}
EOF
    
    echo "Row $sheet_row: $company -> $folder"
done

echo ']}' >> "$REQUEST_FILE"

echo ""
echo "Sending batch update..."

# Send the batch update
curl -s -X POST "https://sheets.googleapis.com/v4/spreadsheets/$SPREADSHEET_ID/values:batchUpdate" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d @"$REQUEST_FILE" | jq '{updatedCells: .totalUpdatedCells, updatedRows: .totalUpdatedRows, updatedColumns: .totalUpdatedColumns}'

rm "$REQUEST_FILE"

echo ""
echo "✅ HYPERLINK formulas applied!"
