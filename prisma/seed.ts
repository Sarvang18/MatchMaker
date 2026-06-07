import { PrismaClient, Gender, MaritalStatus, YesNoMaybe, FamilyType, DietaryPreference, DrinkingStatus, SmokingStatus, ClientStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Realistic Indian data
const maleFirstNames = ['Arjun', 'Rohan', 'Aditya', 'Karthik', 'Vikram', 'Rahul', 'Aakash', 'Nikhil', 'Siddharth', 'Aman', 'Varun', 'Anuj', 'Harsh', 'Manish', 'Vishal', 'Prateek', 'Kunal', 'Abhishek', 'Gaurav', 'Rajat', 'Sandeep', 'Ajay', 'Deepak', 'Ravi', 'Sameer'];
const femaleFirstNames = ['Priya', 'Ananya', 'Sneha', 'Divya', 'Pooja', 'Kavya', 'Neha', 'Riya', 'Ishita', 'Tanvi', 'Shruti', 'Aarti', 'Meera', 'Simran', 'Anjali', 'Swati', 'Nisha', 'Preeti', 'Aditi', 'Ritu', 'Pallavi', 'Megha', 'Sakshi', 'Komal', 'Sonali'];
const lastNames = ['Sharma', 'Gupta', 'Singh', 'Kumar', 'Patel', 'Reddy', 'Iyer', 'Nair', 'Chopra', 'Mehta', 'Agarwal', 'Joshi', 'Verma', 'Rao', 'Desai', 'Kapoor', 'Malhotra', 'Bhat', 'Kulkarni', 'Shah', 'Menon', 'Pillai', 'Banerjee', 'Chatterjee', 'Das'];

const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Surat'];
const religions = ['Hindu', 'Muslim', 'Sikh', 'Christian', 'Jain'];
const hinduCastes = ['Brahmin', 'Kshatriya', 'Vaishya', 'Maratha', 'Reddy', 'Nair', 'Iyer', 'Iyengar'];
const muslimCastes = ['Sunni', 'Shia', 'Bohra'];
const sikhCastes = ['Jat', 'Ramgarhia', 'Khatri'];
const christianCastes = ['Catholic', 'Protestant', 'Syrian Christian'];
const jainCastes = ['Digambar', 'Shwetambar'];

const companies = ['TCS', 'Infosys', 'Wipro', 'Google', 'Amazon', 'Microsoft', 'Flipkart', 'Zomato', 'Swiggy', 'HDFC Bank', 'ICICI Bank', 'Deloitte', 'Accenture', 'Cognizant', 'PhonePe', 'Paytm', 'Ola', 'Myntra', 'Byjus', 'Adobe'];
const degrees = ['B.Tech', 'MBA', 'MBBS', 'CA', 'B.Com', 'B.Sc', 'M.Tech', 'MCA', 'M.Sc', 'BBA'];
const colleges = ['IIT Bombay', 'IIT Delhi', 'IIM Ahmedabad', 'BITS Pilani', 'VIT Vellore', 'Anna University', 'NIT Trichy', 'Delhi University', 'Mumbai University', 'Pune University', 'XLRI', 'IIT Madras', 'IIT Kanpur', 'SRCC', 'St. Stephens'];

const designations = ['Software Engineer', 'Senior Software Engineer', 'Product Manager', 'Data Analyst', 'Business Analyst', 'Consultant', 'Financial Analyst', 'Marketing Manager', 'HR Manager', 'Operations Manager', 'Team Lead', 'Tech Lead', 'Architect', 'Designer', 'Sales Manager'];

const languagesByRegion: { [key: string]: string[] } = {
  Mumbai: ['Hindi', 'Marathi', 'English'],
  Delhi: ['Hindi', 'Punjabi', 'English'],
  Bangalore: ['Kannada', 'Tamil', 'English', 'Hindi'],
  Hyderabad: ['Telugu', 'Hindi', 'English'],
  Chennai: ['Tamil', 'Telugu', 'English'],
  Pune: ['Marathi', 'Hindi', 'English'],
  Kolkata: ['Bengali', 'Hindi', 'English'],
  Ahmedabad: ['Gujarati', 'Hindi', 'English'],
  Jaipur: ['Hindi', 'Rajasthani', 'English'],
  Surat: ['Gujarati', 'Hindi', 'English']
};

function getCasteByReligion(religion: string): string {
  switch (religion) {
    case 'Hindu': return hinduCastes[Math.floor(Math.random() * hinduCastes.length)];
    case 'Muslim': return muslimCastes[Math.floor(Math.random() * muslimCastes.length)];
    case 'Sikh': return sikhCastes[Math.floor(Math.random() * sikhCastes.length)];
    case 'Christian': return christianCastes[Math.floor(Math.random() * christianCastes.length)];
    case 'Jain': return jainCastes[Math.floor(Math.random() * jainCastes.length)];
    default: return 'General';
  }
}

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateBio(firstName: string, gender: Gender, city: string, company: string, degree: string): string {
  const hobbies = ['reading', 'traveling', 'cooking', 'photography', 'music', 'fitness', 'yoga', 'painting', 'dancing', 'sports'];
  const hobby1 = randomChoice(hobbies);
  const hobby2 = randomChoice(hobbies.filter(h => h !== hobby1));
  
  return `Hi, I'm ${firstName} from ${city}. I work at ${company} and completed my ${degree}. I love ${hobby1} and ${hobby2}. Looking for a meaningful connection with someone who shares similar values.`;
}

async function main() {
  console.log('Starting seed...');

  // Create default matchmaker
  const hashedPassword = await bcrypt.hash('tdc@2025', 10);
  const matchmaker = await prisma.matchmaker.create({
    data: {
      name: 'Priya Sharma',
      email: 'admin@tdc.com',
      passwordHash: hashedPassword,
      role: 'matchmaker',
    },
  });

  console.log('✓ Created matchmaker:', matchmaker.email);

  // Create 50 male profiles
  console.log('Creating 50 male profiles...');
  for (let i = 0; i < 50; i++) {
    const firstName = randomChoice(maleFirstNames) + (i > 24 ? ` ${String.fromCharCode(65 + (i % 26))}` : '');
    const lastName = randomChoice(lastNames);
    const city = randomChoice(cities);
    const religion = randomChoice(religions);
    const college = randomChoice(colleges);
    const degree = randomChoice(degrees);
    const company = randomChoice(companies);
    
    await prisma.client.create({
      data: {
        firstName,
        lastName,
        gender: Gender.MALE,
        dateOfBirth: new Date(randomInt(1988, 1998), randomInt(0, 11), randomInt(1, 28)),
        country: 'India',
        city,
        height: randomInt(165, 185),
        email: `${firstName.toLowerCase().replace(/\s/g, '')}.${lastName.toLowerCase()}${i}@example.com`,
        phone: `+91${randomInt(7000000000, 9999999999)}`,
        undergradCollege: college,
        degree,
        income: randomInt(600000, 8000000),
        currentCompany: company,
        designation: randomChoice(designations),
        maritalStatus: MaritalStatus.NEVER_MARRIED,
        languagesKnown: languagesByRegion[city] || ['Hindi', 'English'],
        siblings: randomInt(0, 3),
        caste: getCasteByReligion(religion),
        religion,
        wantKids: randomChoice([YesNoMaybe.YES, YesNoMaybe.MAYBE, YesNoMaybe.NO]),
        openToRelocate: randomChoice([YesNoMaybe.YES, YesNoMaybe.MAYBE, YesNoMaybe.NO]),
        openToPets: randomChoice([YesNoMaybe.YES, YesNoMaybe.MAYBE, YesNoMaybe.NO]),
        familyType: randomChoice([FamilyType.NUCLEAR, FamilyType.JOINT]),
        motherTongue: languagesByRegion[city]?.[0] || 'Hindi',
        dietaryPreference: randomChoice([DietaryPreference.VEG, DietaryPreference.NON_VEG, DietaryPreference.EGGETARIAN]),
        drinking: randomChoice([DrinkingStatus.NO, DrinkingStatus.OCCASIONALLY, DrinkingStatus.YES]),
        smoking: randomChoice([SmokingStatus.NO, SmokingStatus.OCCASIONALLY]),
        horoscopeRequired: Math.random() > 0.5,
        nriStatus: Math.random() > 0.85,
        bio: generateBio(firstName, Gender.MALE, city, company, degree),
        status: ClientStatus.ACTIVE,
        assignedMatchmakerId: matchmaker.id,
      },
    });
  }

  console.log('✓ Created 50 male profiles');

  // Create 50 female profiles
  console.log('Creating 50 female profiles...');
  for (let i = 0; i < 50; i++) {
    const firstName = randomChoice(femaleFirstNames) + (i > 24 ? ` ${String.fromCharCode(65 + (i % 26))}` : '');
    const lastName = randomChoice(lastNames);
    const city = randomChoice(cities);
    const religion = randomChoice(religions);
    const college = randomChoice(colleges);
    const degree = randomChoice(degrees);
    const company = randomChoice(companies);
    
    await prisma.client.create({
      data: {
        firstName,
        lastName,
        gender: Gender.FEMALE,
        dateOfBirth: new Date(randomInt(1992, 2002), randomInt(0, 11), randomInt(1, 28)),
        country: 'India',
        city,
        height: randomInt(152, 170),
        email: `${firstName.toLowerCase().replace(/\s/g, '')}.${lastName.toLowerCase()}${i}@example.com`,
        phone: `+91${randomInt(7000000000, 9999999999)}`,
        undergradCollege: college,
        degree,
        income: randomInt(600000, 8000000),
        currentCompany: company,
        designation: randomChoice(designations),
        maritalStatus: MaritalStatus.NEVER_MARRIED,
        languagesKnown: languagesByRegion[city] || ['Hindi', 'English'],
        siblings: randomInt(0, 3),
        caste: getCasteByReligion(religion),
        religion,
        wantKids: randomChoice([YesNoMaybe.YES, YesNoMaybe.MAYBE, YesNoMaybe.NO]),
        openToRelocate: randomChoice([YesNoMaybe.YES, YesNoMaybe.MAYBE, YesNoMaybe.NO]),
        openToPets: randomChoice([YesNoMaybe.YES, YesNoMaybe.MAYBE, YesNoMaybe.NO]),
        familyType: randomChoice([FamilyType.NUCLEAR, FamilyType.JOINT]),
        motherTongue: languagesByRegion[city]?.[0] || 'Hindi',
        dietaryPreference: randomChoice([DietaryPreference.VEG, DietaryPreference.NON_VEG, DietaryPreference.EGGETARIAN]),
        drinking: randomChoice([DrinkingStatus.NO, DrinkingStatus.OCCASIONALLY, DrinkingStatus.YES]),
        smoking: randomChoice([SmokingStatus.NO, SmokingStatus.OCCASIONALLY]),
        horoscopeRequired: Math.random() > 0.5,
        nriStatus: Math.random() > 0.85,
        bio: generateBio(firstName, Gender.FEMALE, city, company, degree),
        status: ClientStatus.ACTIVE,
        assignedMatchmakerId: matchmaker.id,
      },
    });
  }

  console.log('✓ Created 50 female profiles');
  console.log('✅ Seed completed successfully!');
  console.log('Total records: 1 matchmaker + 100 clients = 101 records');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
