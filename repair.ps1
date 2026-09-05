foreach ($i in 0..14) {
    $ver = "202608290000{0:D2}" -f $i
    Write-Host "Repairing $ver"
    npx supabase migration repair --status applied $ver
}
npx supabase db push
