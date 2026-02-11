#!/usr/bin/env node
/**
 * Populate Google Sheet with Batch 2 Jobs (1-41)
 */

const { google } = require('googleapis');
const fs = require('fs');

const SPREADSHEET_ID = '10HMT9ZjFk9eUyCJJR5iVxMXS6iGV6RBS2XTL1K6DhrA';
const SHEET_NAME = 'Sheet1';
const SERVICE_ACCOUNT_PATH = '/home/openclaw/.openclaw/config/google-sheets-sa.json';

// Base URL for CV links
const BASE_CV_URL = 'https://ahmednasr999.github.io/openclaw-dashboard/applications';

// All 41 jobs data
const JOBS = [
    // Jobs 1-4 (already exist, update links)
    { num: 1, company: 'RAKBANK', role: 'VP - Frontline Experience & Onboarding', folder: 'job_01_rakbank_vp_frontline' },
    { num: 2, company: 'JEX', role: 'Group Head of IT Systems', folder: 'job_02_jex_group_head_it' },
    { num: 3, company: 'Al Ghurair', role: 'AI/ML Architect', folder: 'job_03_alghurair_ai_ml_architect' },
    { num: 4, company: 'CNS', role: 'Senior Manager - Applications', folder: 'job_04_cns_senior_manager_apps' },
    
    // Jobs 5-10
    { num: 5, company: 'HiringPlug', role: 'Channel Manager - Digital Partnerships', folder: 'job_05_hiringplug_channel_manager' },
    { num: 6, company: 'Khalifa Fund', role: 'Strategic Advisor - Digital Transformation', folder: 'job_06_khalifa_strategic_advisor' },
    { num: 7, company: 'Arcus Consulting', role: 'PMO Consultant', folder: 'job_07_arcus_pmo_consultant' },
    { num: 8, company: 'Madison Partners', role: 'Strategy Consultant', folder: 'job_08_madison_strategy_consultant' },
    { num: 9, company: 'Khazna Data Centers', role: 'Change Manager', folder: 'job_09_khazna_change_manager' },
    { num: 10, company: 'Adecco', role: 'Data Center Project Manager', folder: 'job_10_adecco_datacenter_pm' },
    
    // Jobs 11-20
    { num: 11, company: 'Logistics Group', role: 'Chief Operating Officer', folder: 'job_11_coo_logistics' },
    { num: 12, company: 'Government Entity', role: 'Digital Transformation Senior Officer', folder: 'job_12_digital_transformation_officer' },
    { num: 13, company: 'Major Bank', role: 'Customer Management Framework Lead', folder: 'job_13_customer_framework_lead' },
    { num: 14, company: 'NymCard', role: 'Head of Product Solutions', folder: 'job_14_nymcard_head_product' },
    { num: 15, company: 'Middle East Enterprise', role: 'Director - Business Operations', folder: 'job_15_director_business_ops' },
    { num: 16, company: 'Axian Telecom', role: 'Platform Strategy Senior Manager', folder: 'job_16_platform_strategy_manager' },
    { num: 17, company: 'iGaming Operator', role: 'Portfolio Manager - iGaming', folder: 'job_17_portfolio_manager_igaming' },
    { num: 18, company: 'Kagool', role: 'Senior Project Manager', folder: 'job_18_senior_pm_kagool' },
    { num: 19, company: 'Power International', role: 'EPMO Director', folder: 'job_19_epmo_director_power' },
    { num: 20, company: 'Qatar Enterprise', role: 'Strategy/Transformation/PMO Lead', folder: 'job_20_strategy_pm_roles_doha' },
    
    // Jobs 21-30
    { num: 21, company: 'Financial Institution', role: 'Chief Information Officer', folder: 'job_21_cio_financial' },
    { num: 22, company: 'Digital Agency', role: 'Senior Project Manager', folder: 'job_22_senior_pm_digital_agency' },
    { num: 23, company: 'Media Republic KSA', role: 'Managing Director', folder: 'job_23_md_media_republic_ksa' },
    { num: 24, company: 'Sustainable Wealth Group', role: 'Board Advisor', folder: 'job_24_board_advisor_swg' },
    { num: 25, company: 'KN International', role: 'Project Manager - Yas Marina', folder: 'job_25_pm_kn_yas_marina' },
    { num: 26, company: 'NymCard', role: 'Head of Business Intelligence', folder: 'job_26_head_bi_nymcard' },
    { num: 27, company: 'Private Office', role: 'Chief of Staff', folder: 'job_27_chief_of_staff' },
    { num: 28, company: 'Dubai Holding Entertainment', role: 'VP - Infrastructure', folder: 'job_28_vp_infrastructure_dhe' },
    { num: 29, company: 'Conglomerate', role: 'Chief Technology & Digital Enablement Officer', folder: 'job_29_cto_digital_enablement' },
    { num: 30, company: 'Media Platform', role: 'Head of Advertiser Relations', folder: 'job_30_head_advertiser_relations' },
    
    // Jobs 31-41
    { num: 31, company: 'NextEra', role: 'Delivery Excellence Lead', folder: 'job_31_delivery_lead_nextera' },
    { num: 32, company: 'Entertainment Venue', role: 'Delivery Lead - Venue Technology', folder: 'job_32_delivery_lead_venue_tech' },
    { num: 33, company: 'Aviation Group', role: 'Head of Technology & Digital Transformation', folder: 'job_33_head_tech_aviation' },
    { num: 34, company: 'Infrastructure Provider', role: 'Senior Director - Data Centre Transformation', folder: 'job_34_sr_director_datacenter' },
    { num: 35, company: 'Boxon', role: 'Director - Business Growth', folder: 'job_35_director_growth_boxon' },
    { num: 36, company: 'Retail Group', role: 'Senior Technology Manager', folder: 'job_36_sr_tech_manager_retail' },
    { num: 37, company: 'Government Entity', role: 'Executive Director - Shared Services', folder: 'job_37_exec_director_shared_services' },
    { num: 38, company: 'Investment Firm', role: 'Chief Executive Officer', folder: 'job_38_ceo_investment_firm' },
    { num: 39, company: 'Healthcare Network', role: 'Director of Digital Transformation', folder: 'job_39_transformation_director_healthcare' },
    { num: 40, company: 'FinTech Unicorn', role: 'VP - Operations', folder: 'job_40_vp_operations_fintech' },
    { num: 41, company: 'Retail Conglomerate', role: 'Chief Digital Officer', folder: 'job_41_chief_digital_officer' },
];

async function getAuth() {
    const credentials = JSON.parse(fs.readFileSync(SERVICE_ACCOUNT_PATH, 'utf8'));
    const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });
    return auth;
}

async function writeSheet(sheets, range, values) {
    const response = await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: range,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values }
    });
    return response;
}

function generateRow(job) {
    const cvUrl = `${BASE_CV_URL}/${job.folder}/CV.html`;
    return [
        job.company,           // A: Company
        job.role,              // B: Role
        'Research',            // C: Status
        'High',                // D: Priority
        'Yes',                 // E: CV Ready
        'No',                  // F: Applied
        '',                    // G: Applied Date
        '',                    // H: Follow-up Date
        '',                    // I: Job URL (to be filled)
        `Batch 2 Job ${job.num}`, // J: Notes
        '18+ years experience, Digital transformation track record, PMP, MBA', // K: Competitive Advantages
        '',                    // L: Deadline/Next Step
        cvUrl                  // M: CV Link
    ];
}

async function main() {
    console.log('='.repeat(60));
    console.log('Google Sheet Population - Batch 2 Jobs');
    console.log('='.repeat(60));

    const auth = await getAuth();
    const sheets = google.sheets({ version: 'v4', auth });

    console.log(`\n[1/3] Preparing data for ${JOBS.length} jobs...`);
    
    const rows = JOBS.map(generateRow);
    
    console.log(`[2/3] Writing to sheet range ${SHEET_NAME}!A2:M42...`);
    
    try {
        await writeSheet(sheets, `${SHEET_NAME}!A2:M42`, rows);
        console.log('✓ Successfully wrote all job data to sheet');
    } catch (error) {
        console.error('✗ Error writing to sheet:', error.message);
        return;
    }

    console.log('\n[3/3] Verification summary:');
    console.log(`  - Jobs populated: ${rows.length}`);
    console.log(`  - Sheet range: A2:M42`);
    console.log(`  - Base CV URL: ${BASE_CV_URL}`);
    
    console.log('\n' + '='.repeat(60));
    console.log('✓ Google Sheet updated successfully!');
    console.log('='.repeat(60));
}

main().catch(console.error);
