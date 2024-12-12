##KCRN Quarterly Data Load Process
Requirements: node.js https://nodejs.org/en/download/
Clasp https://github.com/google/clasp

Sunsetted project - quarterly King County Reengagement Network reporting project. Originally hosted on a Wordpress site administered by a third-party contractor, with ETL in Python. Shifted to Google Sheets data entry, powered by Google App Scripts, created by Max Meshnick. Property of the Community Center for Education Results.

#Instructions

1. Fetch master, create new branch  
2. 2a) Update and run script in apps scripts - 'Concat data' that corresponds to the quarter and year.
	- For version control-- in powershell: (cd to rmp/kcrn)
		- `clasp login`
		- `clasp pull`
		- edit in text editory and then 'clasp push' or edit in app scripts and 'clasp pull' again
 2b) Download the created 'MasterFile' as a .tsv file
	- Save copies here:
		-  `S:\Data\Opportunity Youth\Quarterly Reporting\Data_Providers`
		-  `S:\Data\Data System\RawSourceFiles\KC Reengagement Network Qtrly Data`
3. Update rmp.psm1  
	- SeedFile: add table and path references, so Import-RmpTable knows where to find the corresponding input file
		AggRaw.Raw_KCRN_...  **In this line you need to reference the path of the .tsv file**
		AggRaw.Raw_KCRNReOpp_...
		AggRaw.Raw_KCRNSEA_...
5. Create versions of NWEA & ReOpp scripts (make sure you are referencing correct file name, NWEA vs SEA)  
	- PreprocessingScripts: add python Scripts (don't need for main KCRN)
		create_KCRNReOpp_2019Q4.py
		create_KCRNSEA_2019Q4.py
6. (In PowerShell) make sure that you are in the directory of the ccer-rmp-db repo
	- cd "ccer-rmp-db" 
	Run: `Import-Module -Force .\rmp\PowerShell\RMP` (or, regardless of current directory: `Import-Module -Force C:\Users\MMeshnick\GitHub\ccer-rmp-db\rmp\PowerShell\RMP` )
	- if you don't update rmp.psm1 beforehand, it will not take in the changes  
7. (in PowerShell) You only need to do this once:  
   `Initialize-RmpPreprocessingEnv`
  - activate the virtual env
   ` Enable-RmpPreprocessingEnv` (if that doesn't work, `. $HOME\rmp_env\scripts\Activate.ps1`)
   - run the script
    `Invoke-RmpPreprocessingScript create_KCRNReOpp_2022Q1.py `
	- repeat for NWEA (KCRNNWEA)
8. (In PowerShell) `Import-RmpTable AggRaw.Raw_KCRN_2022Q1 -CreateTable -DBHost sqldb-dev-02   -Database RMPDev -Force`
	- repeat for ReOpp & SEA
	- if you are updating the table, use `-ReplaceRows` (after `-Force`)
	- if you do not update rmp.psm1, you need to specify a -Path parameter
9. Open schema.yml and add new tables to schema  
9b) Open `C:\Users\MMeshnick\GitHub\ccer-rmp-db\rmp\dbt\models\Stage\Stg_KCRNQuarterly_AllYears.sql`
	Copy last union and replace with most recent quarter.
9c) Repeat step 9a and b with KCRNReOpp and KCRNSea (KCRNNWEA.sql and KCRNReOpp.sql)
10. ONLY ONCE: In terminal, run `Initialize-RmpDbtEnv`
	- If error, add pycryptodomex==3.9.9 to requirements.txt (make sure to delete rmp_env folder first)
11. In terminal, run `Enable-RmpDbtEnv` (if this doesn't work, `. $HOME\rmp_env\scripts\Activate.ps1`)
11a) cd into .\rmp\dbt. You're ready to run your models!
12. Run: `dbt run -m +KCRNQuarterly +KCRNReOpp +KCRNNWEA`
13. Corrections: Manually add data corrections to Stg_KCRNQuarterly. Reach out to programs to receive corrections, and check the initial entries in gravityforms (sometimes downloads wrong)
14. In terminal:  `dbt test -m +KCRNQuarterly +KCRNReOpp +KCRNNWEA`
	- if you find errors, CHECK THEIR FORM ENTRIES-- sometimes they enter data and it's saved differently.
15. COMMIT TO GITHUB :) Pull request when 100% done with branch.
16. Once approved, etc, run in RMPProd! So steps 8 and 12, but replace RMPDev with RMPPRod
	16a) `Invoke-RmpDbt run -t prod -m +KCRNQuarterly +KCRNReOpp +KCRNNWEA`

---------------------------------------------------------------------------------------------------------------------

https://interworks.com/blog/tladd/2013/08/22/automated-pdf-email-distribution-tableau-views-using-powershell-and-tabcmd
https://tek-jedi.com/2019/12/01/schedule-tableau-pdf-reports-using-powershell-tabcmd-and-windows-task-scheduler/
