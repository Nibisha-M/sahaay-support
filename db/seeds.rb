# db/seeds.rb
# Official Kerala State De-Addiction Facilities & Tele-Mental Health Resources

puts "Seeding Kerala Safety Resources..."

SafetyResource.destroy_all if defined?(SafetyResource)

resources = [
  {
    title: "DISHA Tele-Helpline 1056",
    resource_type: "helpline",
    district: "All Kerala",
    contact_number: "1056",
    address: "Department of Health & Family Welfare, Govt of Kerala (24x7 Toll Free)",
    latitude: 8.524139,
    longitude: 76.936638
  },
  {
    title: "Vimukthi Excise Control Room & Helpline",
    resource_type: "helpline",
    district: "All Kerala",
    contact_number: "155300",
    address: "State Excise Department Anti-Narcotics Helpline, Kerala",
    latitude: 8.5089,
    longitude: 76.9537
  },
  {
    title: "Nasha Mukt Bharat Abhiyaan Helpline",
    resource_type: "helpline",
    district: "All Kerala",
    contact_number: "14446",
    address: "National Toll Free De-Addiction Helpline, Govt of India",
    latitude: 8.5000,
    longitude: 76.9000
  },
  {
    title: "Vimukthi De-Addiction Centre - Govt Medical College Hospital",
    resource_type: "deaddiction_center",
    district: "Thiruvananthapuram",
    contact_number: "0471-2528300",
    address: "Medical College Campus, Thiruvananthapuram, Kerala 695011",
    latitude: 8.5241,
    longitude: 76.9284
  },
  {
    title: "Government Mental Health Centre, Peroorkada",
    resource_type: "hospital",
    district: "Thiruvananthapuram",
    contact_number: "0471-2433297",
    address: "Peroorkada, Thiruvananthapuram, Kerala 695005",
    latitude: 8.5375,
    longitude: 76.9664
  },
  {
    title: "Vimukthi De-Addiction Centre - General Hospital Ernakulam",
    resource_type: "deaddiction_center",
    district: "Ernakulam",
    contact_number: "0484-2360051",
    address: "Hospital Road, Marine Drive, Kochi, Ernakulam, Kerala 682011",
    latitude: 9.9723,
    longitude: 76.2801
  },
  {
    title: "Taluk Head Quarters Hospital De-Addiction Unit",
    resource_type: "hospital",
    district: "Ernakulam",
    contact_number: "0484-2624241",
    address: "Substation Road, Aluva, Ernakulam, Kerala 683101",
    latitude: 10.1076,
    longitude: 76.3516
  },
  {
    title: "Govt Mental Health Centre, Kuthiravattom",
    resource_type: "hospital",
    district: "Kozhikode",
    contact_number: "0495-2741756",
    address: "Kuthiravattom, Kozhikode, Kerala 673016",
    latitude: 11.2612,
    longitude: 75.8034
  },
  {
    title: "Vimukthi Centre - District Hospital Thrissur",
    resource_type: "deaddiction_center",
    district: "Thrissur",
    contact_number: "0487-2423150",
    address: "Palakkad Road, Thrissur, Kerala 680001",
    latitude: 10.5276,
    longitude: 76.2144
  }
]

resources.each do |res|
  if defined?(SafetyResource)
    SafetyResource.create!(res)
  else
    puts "Loaded resource: #{res[:title]} - #{res[:contact_number]}"
  end
end

puts "Successfully seeded #{resources.size} Kerala crisis safety resources!"
