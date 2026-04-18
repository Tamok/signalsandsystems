# PowerShell script to batch rename remaining TFP resources

$resourcesPath = "d:\Coding Shenanigans\signals-and-systems\sastro\src\content\tfp\resources"

# Define remaining mappings
$renameMappings = @{
    "1-s2.0-S0306452216304018-am_assets" = "2016-clark-surfing-uncertainty"
    "2024-naep-student-cohorts_assets" = "2024-naep-student-achievement-trends"
    "24-013_d9b45b68-9e74-42d6-a1c6-c72fb70c7282_assets" = "2024-mckinsey-generative-ai-productivity"
    "3544548.3580919_assets" = "2023-reiss-chatgpt-education-impact"
    "Artificial Intelligence and Law_ An Overview_assets" = "2023-ai-law-overview"
    "junco2012_assets" = "2012-junco-facebook-academic-performance"
    "ophir_et_al_cognitive_control_assets" = "2009-ophir-media-multitasking-cognitive-control"
    "pnas.202105061_assets" = "2021-pnas-cognitive-offloading-study"
    "s10614-020-10042-0_assets" = "2020-springer-ai-economic-modeling"
    "September_2016_TICS_V20N9_assets" = "2016-tics-cognitive-control-review"
    "societies-15-00006_assets" = "2024-societies-ai-social-impact"
    "ssrn-5250447_assets" = "2024-ssrn-generative-ai-workplace"
    "storm-stone-2014_assets" = "2014-storm-stone-internet-cognition"
    "topol2019_assets" = "2019-topol-ai-medicine-human-touch"
    "w31161_assets" = "2023-nber-ai-labor-economics"
    "zpq15583_assets" = "2015-zpq-digital-technology-cognition"
}

Set-Location $resourcesPath

foreach ($mapping in $renameMappings.GetEnumerator()) {
    $oldName = $mapping.Key
    $newName = $mapping.Value
    
    if (Test-Path $oldName) {
        Write-Host "Renaming: $oldName -> $newName"
        
        # Rename directory
        Rename-Item $oldName $newName
        
        # Find and rename files within the directory
        $files = Get-ChildItem $newName -File
        
        foreach ($file in $files) {
            if ($file.Extension -eq ".pdf" -or $file.Extension -eq ".mdx") {
                $newFileName = "$newName$($file.Extension)"
                $newFilePath = Join-Path $newName $newFileName
                
                Write-Host "  Renaming file: $($file.Name) -> $newFileName"
                Rename-Item $file.FullName $newFilePath
            }
        }
        
        Write-Host "  Completed: $newName"
    } else {
        Write-Host "Directory not found: $oldName"
    }
}

Write-Host "Batch renaming completed!"
