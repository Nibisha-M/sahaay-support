// api/safety_resources.js - Vercel Serverless Function Handler
const KERALA_RESOURCES = [
  {
    title: "DISHA Tele-Helpline 1056",
    type: "helpline",
    district: "All Kerala",
    phone: "1056",
    address: "Dept of Health & Family Welfare, Govt of Kerala (24x7 Toll Free)"
  },
  {
    title: "Vimukthi Excise Anti-Narcotic Helpline",
    type: "helpline",
    district: "All Kerala",
    phone: "155300",
    address: "Kerala State Excise Department Control Room"
  },
  {
    title: "National Nasha Mukt Bharat Helpline",
    type: "helpline",
    district: "All Kerala",
    phone: "14446",
    address: "Ministry of Social Justice & Empowerment"
  },
  {
    title: "Vimukthi De-Addiction Centre - Govt MCH",
    type: "hospital",
    district: "Thiruvananthapuram",
    phone: "0471-2528300",
    address: "Medical College Campus, Thiruvananthapuram"
  },
  {
    title: "Govt Mental Health Centre, Peroorkada",
    type: "hospital",
    district: "Thiruvananthapuram",
    phone: "0471-2433297",
    address: "Peroorkada, Thiruvananthapuram"
  },
  {
    title: "Vimukthi Centre - General Hospital Ernakulam",
    type: "hospital",
    district: "Ernakulam",
    phone: "0484-2360051",
    address: "Marine Drive, Kochi, Ernakulam"
  },
  {
    title: "Taluk Head Quarters Hospital De-Addiction Unit",
    type: "hospital",
    district: "Ernakulam",
    phone: "0484-2624241",
    address: "Substation Road, Aluva, Ernakulam"
  },
  {
    title: "Govt Mental Health Centre, Kuthiravattom",
    type: "hospital",
    district: "Kozhikode",
    phone: "0495-2741756",
    address: "Kuthiravattom, Kozhikode"
  },
  {
    title: "Vimukthi Centre - District Hospital Thrissur",
    type: "hospital",
    district: "Thrissur",
    phone: "0487-2423150",
    address: "Palakkad Road, Thrissur"
  }
];

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const district = req.query.district || 'All';
  const filtered = (district === 'All' || district === 'All Kerala') ? 
    KERALA_RESOURCES : 
    KERALA_RESOURCES.filter(r => r.district === 'All Kerala' || r.district === district);

  res.status(200).json({ district: district, count: filtered.length, resources: filtered });
};
