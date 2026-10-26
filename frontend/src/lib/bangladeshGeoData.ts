/**
 * Bangladesh Administrative Divisions, Districts, and Thanas/Upazilas.
 * Specially optimized for St. Joseph International School (Narinda, Dhaka) admissions,
 * providing comprehensive coverage across all 8 Divisions, 64 Districts, and Upazilas/Thanas.
 */

export interface BangladeshDivision {
  id: string;
  name: string;
  bnName: string;
  districts: BangladeshDistrict[];
}

export interface BangladeshDistrict {
  id: string;
  name: string;
  bnName: string;
  defaultPostalCode?: string;
  thanas: string[];
}

export const BANGLADESH_DIVISIONS: BangladeshDivision[] = [
  {
    id: 'dhaka',
    name: 'Dhaka',
    bnName: 'ঢাকা',
    districts: [
      {
        id: 'dhaka',
        name: 'Dhaka',
        bnName: 'ঢাকা',
        defaultPostalCode: '1100',
        thanas: [
          'Sutrapur (Old Dhaka / Narinda / Gandaria vicinity)',
          'Wari',
          'Gandaria',
          'Kotwali (Babu Bazar / Sadarghat)',
          'Lalbagh',
          'Chawkbazar',
          'Bangshal',
          'Kamrangirchar',
          'Shyampur',
          'Kadamtali',
          'Jatrabari',
          'Demra',
          'Mugda',
          'Sabujbagh',
          'Motijheel',
          'Paltan',
          'Shahbagh',
          'Ramna',
          'New Market',
          'Dhanmondi',
          'Kalabagan',
          'Hazaribagh',
          'Mohammadpur',
          'Adabor',
          'Sher-e-Bangla Nagar',
          'Tejgaon',
          'Tejgaon Industrial Area',
          'Hatirjheel',
          'Rampura',
          'Khilgaon',
          'Badda',
          'Bhatara (Vatara)',
          'Gulshan',
          'Banani',
          'Cantonment',
          'Kafrul',
          'Mirpur (Model / Sec 1-14)',
          'Pallabi',
          'Rupnagar',
          'Shah Ali',
          'Darussalam',
          'Uttara East',
          'Uttara West',
          'Dakshinkhan',
          'Uttarkhan',
          'Turag',
          'Airport (Bimanbandar)',
          'Khilkhet',
          'Keraniganj (South)',
          'Keraniganj (Model)',
          'Savar',
          'Ashulia',
          'Dhamrai',
          'Dohar',
          'Nawabganj',
        ],
      },
      {
        id: 'narayanganj',
        name: 'Narayanganj',
        bnName: 'নারায়ণগঞ্জ',
        defaultPostalCode: '1400',
        thanas: ['Narayanganj Sadar', 'Fatullah', 'Siddhirganj', 'Bandar', 'Rupganj', 'Sonargaon', 'Araihazar'],
      },
      {
        id: 'gazipur',
        name: 'Gazipur',
        bnName: 'গাজীপুর',
        defaultPostalCode: '1700',
        thanas: ['Gazipur Sadar', 'Tongi (East)', 'Tongi (West)', 'Kaliakair', 'Kapasia', 'Sreepur', 'Kaliganj'],
      },
      {
        id: 'munshiganj',
        name: 'Munshiganj',
        bnName: 'মুন্সীগঞ্জ',
        defaultPostalCode: '1500',
        thanas: ['Munshiganj Sadar', 'Sirajdikhan', 'Sreenagar', 'Lohajang', 'Tongibari', 'Gazaria'],
      },
      {
        id: 'manikganj',
        name: 'Manikganj',
        bnName: 'মানিকগঞ্জ',
        defaultPostalCode: '1800',
        thanas: ['Manikganj Sadar', 'Singair', 'Saturia', 'Shivalaya', 'Ghior', 'Harirampur', 'Daulatpur'],
      },
      {
        id: 'narsingdi',
        name: 'Narsingdi',
        bnName: 'নরসিংদী',
        defaultPostalCode: '1600',
        thanas: ['Narsingdi Sadar', 'Palash', 'Shibpur', 'Raipura', 'Belabo', 'Monohardi'],
      },
      {
        id: 'tangail',
        name: 'Tangail',
        bnName: 'টাঙ্গাইল',
        defaultPostalCode: '1900',
        thanas: ['Tangail Sadar', 'Mirzapur', 'Kalihati', 'Ghatail', 'Madhupur', 'Gopalpur', 'Sakhipur', 'Nagarpur', 'Delduar', 'Basail', 'Bhuapur', 'Dhanbari'],
      },
      {
        id: 'kishoreganj',
        name: 'Kishoreganj',
        bnName: 'কিশোরগঞ্জ',
        defaultPostalCode: '2300',
        thanas: ['Kishoreganj Sadar', 'Bhairab', 'Bajitpur', 'Katiadi', 'Kuliarchar', 'Pakundia', 'Karimganj', 'Hossainpur', 'Tarail', 'Itna', 'Mithamain', 'Austagram', 'Nikli'],
      },
      {
        id: 'faridpur',
        name: 'Faridpur',
        bnName: 'ফরিদপুর',
        defaultPostalCode: '7800',
        thanas: ['Faridpur Sadar', 'Boalmari', 'Alfadanga', 'Madhukhali', 'Bhanga', 'Nagarkanda', 'Charbhadrasan', 'Sadarpur', 'Saltha'],
      },
      {
        id: 'gopalganj',
        name: 'Gopalganj',
        bnName: 'গোপালগঞ্জ',
        defaultPostalCode: '8100',
        thanas: ['Gopalganj Sadar', 'Kashiani', 'Kotalipara', 'Muksudpur', 'Tungipara'],
      },
      {
        id: 'madaripur',
        name: 'Madaripur',
        bnName: 'মাদারীপুর',
        defaultPostalCode: '7900',
        thanas: ['Madaripur Sadar', 'Shibchar', 'Kalkini', 'Rajoir', 'Dasar'],
      },
      {
        id: 'rajbari',
        name: 'Rajbari',
        bnName: 'রাজবাড়ী',
        defaultPostalCode: '7700',
        thanas: ['Rajbari Sadar', 'Goalanda', 'Pangsha', 'Baliakandi', 'Kalukhali'],
      },
      {
        id: 'shariatpur',
        name: 'Shariatpur',
        bnName: 'শরীয়তপুর',
        defaultPostalCode: '8000',
        thanas: ['Shariatpur Sadar', 'Naria', 'Zajira', 'Bhedarganj', 'Damudya', 'Gosairhat'],
      },
    ],
  },
  {
    id: 'chittagong',
    name: 'Chittagong (Chattogram)',
    bnName: 'চট্টগ্রাম',
    districts: [
      {
        id: 'chattogram',
        name: 'Chattogram (Chittagong)',
        bnName: 'চট্টগ্রাম',
        defaultPostalCode: '4000',
        thanas: [
          'Kotwali', 'Panchlaish', 'Khulshi', 'Double Mooring', 'Halishahar', 'Pahartali', 'Bakolia', 'Chandgaon',
          'Patenga', 'Bayazid', 'Agrabad', 'Sitakunda', 'Mirsharai', 'Hathazari', 'Raozan', 'Rangunia', 'Fatikchhari',
          'Patiya', 'Boalkhali', 'Anwara', 'Chandanaish', 'Satkania', 'Lohagara', 'Banshkhali', 'Karnafuli', 'Sandwip',
        ],
      },
      {
        id: 'coxs_bazar',
        name: "Cox's Bazar",
        bnName: 'কক্সবাজার',
        defaultPostalCode: '4700',
        thanas: ["Cox's Bazar Sadar", 'Ramu', 'Chakaria', 'Pekua', 'Ukhiya', 'Teknaf', 'Maheshkhali', 'Kutubdia', 'Eidgaon'],
      },
      {
        id: 'cumilla',
        name: 'Cumilla (Comilla)',
        bnName: 'কুমিল্লা',
        defaultPostalCode: '3500',
        thanas: ['Cumilla Adarsha Sadar', 'Cumilla Sadar Dakshin', 'Barura', 'Chandina', 'Daudkandi', 'Debidwar', 'Homna', 'Laksam', 'Muradnagar', 'Burichang', 'Brahmanpara', 'Chauddagram', 'Meghna', 'Monohargonj', 'Titas', 'Nangalkot', 'Lalmai'],
      },
      {
        id: 'brahmanbaria',
        name: 'Brahmanbaria',
        bnName: 'ব্রাহ্মণবাড়িয়া',
        defaultPostalCode: '3400',
        thanas: ['Brahmanbaria Sadar', 'Kasba', 'Nasirnagar', 'Nabinagar', 'Bancharampur', 'Sarail', 'Ashuganj', 'Akhaura', 'Bijoynagar'],
      },
      {
        id: 'chandpur',
        name: 'Chandpur',
        bnName: 'চাঁদপুর',
        defaultPostalCode: '3600',
        thanas: ['Chandpur Sadar', 'Faridganj', 'Haimchar', 'Haziganj', 'Kachua', 'Matlab Dakshin', 'Matlab Uttar', 'Shahrasti'],
      },
      {
        id: 'feni',
        name: 'Feni',
        bnName: 'ফেনী',
        defaultPostalCode: '3900',
        thanas: ['Feni Sadar', 'Chhagalnaiya', 'Daganbhuiyan', 'Parshuram', 'Fulgazi', 'Sonagazi'],
      },
      {
        id: 'noakhali',
        name: 'Noakhali',
        bnName: 'নোয়াখালী',
        defaultPostalCode: '3800',
        thanas: ['Noakhali Sadar (Sudharam)', 'Begumganj', 'Chatkhil', 'Companiganj', 'Hatiya', 'Senbagh', 'Sonaimuri', 'Subarnachar', 'Kabirhat'],
      },
      {
        id: 'lakshmipur',
        name: 'Lakshmipur',
        bnName: 'লক্ষ্মীপুর',
        defaultPostalCode: '3700',
        thanas: ['Lakshmipur Sadar', 'Raipur', 'Ramganj', 'Ramgati', 'Kamalnagar'],
      },
      {
        id: 'rangamati',
        name: 'Rangamati',
        bnName: 'রাঙ্গামাটি',
        defaultPostalCode: '4500',
        thanas: ['Rangamati Sadar', 'Kaptai', 'Bagaichhari', 'Barkal', 'Langadu', 'Rajasthali', 'Belaichhari', 'Juraichhari', 'Naniarchar', 'Kawkhali'],
      },
      {
        id: 'khagrachhari',
        name: 'Khagrachhari',
        bnName: 'খাগড়াছড়ি',
        defaultPostalCode: '4400',
        thanas: ['Khagrachhari Sadar', 'Dighinala', 'Panchhari', 'Mahalchhari', 'Matiranga', 'Manikchhari', 'Ramgarh', 'Lakshmichhari', 'Guimara'],
      },
      {
        id: 'bandarban',
        name: 'Bandarban',
        bnName: 'বান্দরবান',
        defaultPostalCode: '4600',
        thanas: ['Bandarban Sadar', 'Ruma', 'Thanchi', 'Rowangchhari', 'Lama', 'Alikadam', 'Naikhongchhari'],
      },
    ],
  },
  {
    id: 'sylhet',
    name: 'Sylhet',
    bnName: 'সিলেট',
    districts: [
      {
        id: 'sylhet',
        name: 'Sylhet',
        bnName: 'সিলেট',
        defaultPostalCode: '3100',
        thanas: ['Sylhet Sadar', 'Kotwali', 'Jalalabad', 'South Surma', 'Beanibazar', 'Golapganj', 'Zakiganj', 'Kanaighat', 'Jaintiapur', 'Gowainghat', 'Companiganj', 'Fenchuganj', 'Balaganj', 'Biswanath', 'Osmani Nagar'],
      },
      {
        id: 'moulvibazar',
        name: 'Moulvibazar',
        bnName: 'মৌলভীবাজার',
        defaultPostalCode: '3200',
        thanas: ['Moulvibazar Sadar', 'Sreemangal', 'Kamalganj', 'Kulaura', 'Rajnagar', 'Barlekha', 'Juri'],
      },
      {
        id: 'habiganj',
        name: 'Habiganj',
        bnName: 'হবিগঞ্জ',
        defaultPostalCode: '3300',
        thanas: ['Habiganj Sadar', 'Madhabpur', 'Chunarughat', 'Bahubal', 'Nabiganj', 'Baniachong', 'Lakhai', 'Ajmiriganj', 'Sayestaganj'],
      },
      {
        id: 'sunamganj',
        name: 'Sunamganj',
        bnName: 'সুনামগঞ্জ',
        defaultPostalCode: '3000',
        thanas: ['Sunamganj Sadar', 'Chhatak', 'Jagannathpur', 'Derai', 'Dharampasha', 'Tahirpur', 'Bishwamvarpur', 'Jamalganj', 'Shantiganj', 'Dowarabazar', 'Madhyanagar'],
      },
    ],
  },
  {
    id: 'rajshahi',
    name: 'Rajshahi',
    bnName: 'রাজশাহী',
    districts: [
      {
        id: 'rajshahi',
        name: 'Rajshahi',
        bnName: 'রাজশাহী',
        defaultPostalCode: '6000',
        thanas: ['Boalia', 'Motihar', 'Rajpara', 'Shah Makhdum', 'Chandrima', 'Kashiadanga', 'Katakhali', 'Paba', 'Godagari', 'Tanore', 'Mohanpur', 'Bagmara', 'Durgapur', 'Puthia', 'Charghat', 'Bagha'],
      },
      {
        id: 'bogura',
        name: 'Bogura (Bogra)',
        bnName: 'বগুড়া',
        defaultPostalCode: '5800',
        thanas: ['Bogura Sadar', 'Shajahanpur', 'Sherpur', 'Shibganj', 'Gabtali', 'Kahaloo', 'Nandigram', 'Sonatola', 'Sariakandi', 'Dhunat', 'Adamdighi', 'Dupchanchia'],
      },
      {
        id: 'pabna',
        name: 'Pabna',
        bnName: 'পাবনা',
        defaultPostalCode: '6600',
        thanas: ['Pabna Sadar', 'Ishwardi', 'Sujanagar', 'Santhia', 'Chatmohar', 'Bhangura', 'Faridpur', 'Bera', 'Atgharia'],
      },
      {
        id: 'sirajganj',
        name: 'Sirajganj',
        bnName: 'সিরাজগঞ্জ',
        defaultPostalCode: '6700',
        thanas: ['Sirajganj Sadar', 'Shahjadpur', 'Ullapara', 'Belkuchi', 'Kamarkhanda', 'Kazipur', 'Raiganj', 'Tarash', 'Chauhali'],
      },
      {
        id: 'naogaon',
        name: 'Naogaon',
        bnName: 'নওগাঁ',
        defaultPostalCode: '6500',
        thanas: ['Naogaon Sadar', 'Mohadevpur', 'Patnitala', 'Dhamoirhat', 'Manda', 'Niamatpur', 'Raninagar', 'Atrai', 'Badalgachhi', 'Porsha', 'Sapahar'],
      },
      {
        id: 'natore',
        name: 'Natore',
        bnName: 'নাটোর',
        defaultPostalCode: '6400',
        thanas: ['Natore Sadar', 'Baraigram', 'Bagatipara', 'Gurudaspur', 'Lalpur', 'Singra', 'Naldanga'],
      },
      {
        id: 'chapainawabganj',
        name: 'Chapainawabganj',
        bnName: 'চাঁপাইনবাবগঞ্জ',
        defaultPostalCode: '6300',
        thanas: ['Chapainawabganj Sadar', 'Shibganj', 'Gomastapur', 'Nachole', 'Bholahat'],
      },
      {
        id: 'joypurhat',
        name: 'Joypurhat',
        bnName: 'জয়পুরহাট',
        defaultPostalCode: '5900',
        thanas: ['Joypurhat Sadar', 'Panchbibi', 'Kalai', 'Khetlal', 'Akkelpur'],
      },
    ],
  },
  {
    id: 'khulna',
    name: 'Khulna',
    bnName: 'খুলনা',
    districts: [
      {
        id: 'khulna',
        name: 'Khulna',
        bnName: 'খুলনা',
        defaultPostalCode: '9000',
        thanas: ['Kotwali', 'Sonadanga', 'Khalishpur', 'Daulatpur', 'Khan Jahan Ali', 'Harintana', 'Aranghata', 'Dighalia', 'Rupsha', 'Terokhada', 'Dumuria', 'Batiaghata', 'Dacope', 'Paikgachha', 'Koyra', 'Phultala'],
      },
      {
        id: 'jashore',
        name: 'Jashore (Jessore)',
        bnName: 'যশোর',
        defaultPostalCode: '7400',
        thanas: ['Jashore Sadar', 'Jhikargachha', 'Sharsha', 'Benapole', 'Manirampur', 'Keshabpur', 'Abhaynagar', 'Bagherpara', 'Chaugachha'],
      },
      {
        id: 'kushtia',
        name: 'Kushtia',
        bnName: 'কুষ্টিয়া',
        defaultPostalCode: '7000',
        thanas: ['Kushtia Sadar', 'Kumarkhali', 'Mirpur', 'Bheramara', 'Daulatpur', 'Khoksa'],
      },
      {
        id: 'jhenaidah',
        name: 'Jhenaidah',
        bnName: 'ঝিনাইদহ',
        defaultPostalCode: '7300',
        thanas: ['Jhenaidah Sadar', 'Kaliganj', 'Kotchandpur', 'Maheshpur', 'Shailkupa', 'Harinakunda'],
      },
      {
        id: 'satkhira',
        name: 'Satkhira',
        bnName: 'সাতক্ষীরা',
        defaultPostalCode: '9400',
        thanas: ['Satkhira Sadar', 'Kalaroa', 'Tala', 'Kaliganj', 'Shyamnagar', 'Assasuni', 'Debhata'],
      },
      {
        id: 'bagerhat',
        name: 'Bagerhat',
        bnName: 'বাগেরহাট',
        defaultPostalCode: '9300',
        thanas: ['Bagerhat Sadar', 'Mongla', 'Fakirhat', 'Rampal', 'Morrelganj', 'Sarankhola', 'Kachua', 'Mollahat', 'Chitalmari'],
      },
      {
        id: 'chuadanga',
        name: 'Chuadanga',
        bnName: 'চুয়াডাঙ্গা',
        defaultPostalCode: '7200',
        thanas: ['Chuadanga Sadar', 'Alamdanga', 'Damurhuda', 'Jibannagar', 'Darshana'],
      },
      {
        id: 'meherpur',
        name: 'Meherpur',
        bnName: 'মেহেরপুর',
        defaultPostalCode: '7100',
        thanas: ['Meherpur Sadar', 'Gangni', 'Mujibnagar'],
      },
      {
        id: 'narail',
        name: 'Narail',
        bnName: 'নড়াইল',
        defaultPostalCode: '7500',
        thanas: ['Narail Sadar', 'Lohagara', 'Kalia'],
      },
      {
        id: 'magura',
        name: 'Magura',
        bnName: 'মাগুরা',
        defaultPostalCode: '7600',
        thanas: ['Magura Sadar', 'Sreepur', 'Mohammadpur', 'Shalikha'],
      },
    ],
  },
  {
    id: 'barishal',
    name: 'Barishal',
    bnName: 'বরিশাল',
    districts: [
      {
        id: 'barishal',
        name: 'Barishal',
        bnName: 'বরিশাল',
        defaultPostalCode: '8200',
        thanas: ['Kotwali', 'Airport', 'Kawnia', 'Bakerganj', 'Babuganj', 'Wazirpur', 'Banaripara', 'Gournadi', 'Agailjhara', 'Mehendiganj', 'Muladi', 'Hizla'],
      },
      {
        id: 'patuakhali',
        name: 'Patuakhali',
        bnName: 'পটুয়াখালী',
        defaultPostalCode: '8600',
        thanas: ['Patuakhali Sadar', 'Galachipa', 'Kalapara', 'Bauphal', 'Dashmina', 'Mirzaganj', 'Dumki', 'Rangabali'],
      },
      {
        id: 'bhola',
        name: 'Bhola',
        bnName: 'ভোলা',
        defaultPostalCode: '8300',
        thanas: ['Bhola Sadar', 'Borhanuddin', 'Char Fasson', 'Lalmohan', 'Daulatkhan', 'Tazumuddin', 'Monpura'],
      },
      {
        id: 'pirojpur',
        name: 'Pirojpur',
        bnName: 'পিরোজপুর',
        defaultPostalCode: '8500',
        thanas: ['Pirojpur Sadar', 'Nesarabad (Swarupkathi)', 'Bhandaria', 'Mathbaria', 'Kawkhali', 'Nazirpur', 'Indurkani'],
      },
      {
        id: 'barguna',
        name: 'Barguna',
        bnName: 'বরগুনা',
        defaultPostalCode: '8700',
        thanas: ['Barguna Sadar', 'Amtali', 'Patharghata', 'Betagi', 'Bamna', 'Taltali'],
      },
      {
        id: 'jhalokathi',
        name: 'Jhalokathi',
        bnName: 'ঝালকাঠি',
        defaultPostalCode: '8400',
        thanas: ['Jhalokathi Sadar', 'Nalchity', 'Rajapur', 'Kathalia'],
      },
    ],
  },
  {
    id: 'rangpur',
    name: 'Rangpur',
    bnName: 'রংপুর',
    districts: [
      {
        id: 'rangpur',
        name: 'Rangpur',
        bnName: 'রংপুর',
        defaultPostalCode: '5400',
        thanas: ['Kotwali', 'Tajhat', 'Haragach', 'Mahiganj', 'Parashuram', 'Hazratpur', 'Pirgachha', 'Mithapukur', 'Badarganj', 'Gangachhara', 'Pirganj', 'Kaunia', 'Taraganj'],
      },
      {
        id: 'dinajpur',
        name: 'Dinajpur',
        bnName: 'দিনাজপুর',
        defaultPostalCode: '5200',
        thanas: ['Dinajpur Sadar', 'Birganj', 'Kaharole', 'Birol', 'Bochaganj', 'Parbatipur', 'Fulbari', 'Nawabganj', 'Ghoraghat', 'Hakimpur', 'Birampur', 'Khansama', 'Chirirbandar'],
      },
      {
        id: 'gaibandha',
        name: 'Gaibandha',
        bnName: 'গাইবান্ধা',
        defaultPostalCode: '5700',
        thanas: ['Gaibandha Sadar', 'Gobindaganj', 'Palashbari', 'Sadullapur', 'Sundarganj', 'Saghata', 'Fulchhari'],
      },
      {
        id: 'kurigram',
        name: 'Kurigram',
        bnName: 'কুড়িগ্রাম',
        defaultPostalCode: '5600',
        thanas: ['Kurigram Sadar', 'Nageshwari', 'Bhurungamari', 'Phulbari', 'Rajarhat', 'Ulipur', 'Chilmari', 'Roumari', 'Char Rajibpur'],
      },
      {
        id: 'nilphamari',
        name: 'Nilphamari',
        bnName: 'নীলফামারী',
        defaultPostalCode: '5300',
        thanas: ['Nilphamari Sadar', 'Saidpur', 'Jaldhaka', 'Kishoreganj', 'Domar', 'Dimla'],
      },
      {
        id: 'thakurgaon',
        name: 'Thakurgaon',
        bnName: 'ঠাকুরগাঁও',
        defaultPostalCode: '5100',
        thanas: ['Thakurgaon Sadar', 'Pirganj', 'Baliadangi', 'Ranisankail', 'Haripur'],
      },
      {
        id: 'panchagarh',
        name: 'Panchagarh',
        bnName: 'পঞ্চগড়',
        defaultPostalCode: '5000',
        thanas: ['Panchagarh Sadar', 'Boda', 'Debiganj', 'Atwari', 'Tetulia'],
      },
      {
        id: 'lalmonirhat',
        name: 'Lalmonirhat',
        bnName: 'লালমনিরহাট',
        defaultPostalCode: '5500',
        thanas: ['Lalmonirhat Sadar', 'Hatibandha', 'Patgram', 'Aditmari', 'Kaliganj'],
      },
    ],
  },
  {
    id: 'mymensingh',
    name: 'Mymensingh',
    bnName: 'ময়মনসিংহ',
    districts: [
      {
        id: 'mymensingh',
        name: 'Mymensingh',
        bnName: 'ময়মনসিংহ',
        defaultPostalCode: '2200',
        thanas: ['Kotwali', 'Muktagachha', 'Fulbaria', 'Trishal', 'Bhaluka', 'Gafargaon', 'Nandail', 'Ishwarganj', 'Gouripur', 'Haluaghat', 'Dhobaura', 'Phulpur', 'Tara Khanda'],
      },
      {
        id: 'jamalpur',
        name: 'Jamalpur',
        bnName: 'জামালপুর',
        defaultPostalCode: '2000',
        thanas: ['Jamalpur Sadar', 'Sarishabari', 'Melandaha', 'Islampur', 'Dewanganj', 'Madarganj', 'Baksiganj'],
      },
      {
        id: 'netrokona',
        name: 'Netrokona',
        bnName: 'নেত্রকোণা',
        defaultPostalCode: '2400',
        thanas: ['Netrokona Sadar', 'Kendua', 'Durgapur', 'Mohanganj', 'Kalmakanda', 'Barhatta', 'Purbadhala', 'Atpara', 'Madan', 'Khaliajuri'],
      },
      {
        id: 'sherpur',
        name: 'Sherpur',
        bnName: 'শেরপুর',
        defaultPostalCode: '2100',
        thanas: ['Sherpur Sadar', 'Nakla', 'Nalitabari', 'Sreebardi', 'Jhenaigati'],
      },
    ],
  },
];

/**
 * Helper to find division and district by district name
 */
export function findGeoByDistrict(districtName: string): {
  division: BangladeshDivision | null;
  district: BangladeshDistrict | null;
} {
  const norm = (districtName || '').toLowerCase().trim();
  for (const div of BANGLADESH_DIVISIONS) {
    for (const dist of div.districts) {
      if (
        dist.name.toLowerCase() === norm ||
        dist.id.toLowerCase() === norm ||
        dist.bnName === norm
      ) {
        return { division: div, district: dist };
      }
    }
  }
  return { division: null, district: null };
}
