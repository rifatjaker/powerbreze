UPDATE clients
SET is_published = 1
WHERE is_published = 0
  AND name IN (
    'Dhaka Power Distribution Company Limited (DPDC) North',
    'Dockyard & Engineering Works Ltd. (An Enterprise of Bangladesh Navy)',
    'Bangladesh University of Professionals (BUP)',
    'Dhaka Power Distribution Company Limited (DPDC), North Project Division-2',
    'Bangladesh Power Development Board (BPDB)',
    'Agrani Bank Limited Head Office',
    'Southeast Bank Limited, Bangshal Branch',
    'University of Dhaka',
    'National Housing Authority (NHA)',
    'Sher-e-Bangla Agricultural University',
    'Public Works Department, Chandpur',
    'Education Engineering Department',
    'Bangladesh Telecommunications Company Ltd. (BTCL)',
    'Hajee Mohammad Danesh Science and Technology University',
    'Mawlana Bhashani Science and Technology University',
    'Institute of Child and Mother Health',
    'Jagannath University',
    'Jahangirnagar University',
    'Bangladesh University of Engineering and Technology (BUET)',
    'Wuhan Fiberhome Technical Services Co., Ltd.',
    'Gas Transmission Company Limited (GTCL)',
    'Bangladesh China Friendship Exhibition Center Project, Export Promotion Bureau',
    'Dhaka Power Distribution Company Limited (DPDC) South'
  );
