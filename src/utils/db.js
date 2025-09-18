import Dexie from 'dexie';

// IndexedDB database
export const db = new Dexie('TalentFlowDB');

db.version(1).stores({
  jobs: '++id, title, slug, status, tags, order, createdAt, updatedAt',
  candidates: '++id, name, email, stage, jobId, createdAt, updatedAt',
  candidateTimeline: '++id, candidateId, stage, notes, createdAt',
  assessments: '++id, jobId, title, sections',
  assessmentResponses: '++id, assessmentId, candidateId, responses, createdAt',
});

// Helper functions
export const clearAllData = async () => {
  await db.transaction('rw', db.jobs, db.candidates, db.candidateTimeline, db.assessments, db.assessmentResponses, async () => {
    await db.jobs.clear();
    await db.candidates.clear();
    await db.candidateTimeline.clear();
    await db.assessments.clear();
    await db.assessmentResponses.clear();
  });
};

export const seedDatabase = async () => {
  // Check if data already exists
  const jobCount = await db.jobs.count();
  if (jobCount > 0) return;

  const jobs = generateJobs();
  const candidates = generateCandidates();
  const assessments = generateAssessments();

  await db.transaction('rw', db.jobs, db.candidates, db.candidateTimeline, db.assessments, async () => {
    // Add jobs
    const jobIds = await db.jobs.bulkAdd(jobs, { allKeys: true });
    
    // Add candidates with references to jobs
    const candidatesWithJobs = candidates.map((candidate, index) => ({
      ...candidate,
      jobId: jobIds[Math.floor(Math.random() * jobIds.length)],
    }));
    const candidateIds = await db.candidates.bulkAdd(candidatesWithJobs, { allKeys: true });
    
    // Add timeline entries for candidates
    const timelineEntries = [];
    candidateIds.forEach((candidateId, index) => {
      const candidate = candidatesWithJobs[index];
      timelineEntries.push({
        candidateId,
        stage: candidate.stage,
        notes: `Initial application for ${candidate.stage} stage`,
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      });
    });
    await db.candidateTimeline.bulkAdd(timelineEntries);
    
    // Add assessments
    const assessmentsWithJobs = assessments.map((assessment, index) => ({
      ...assessment,
      jobId: jobIds[index % jobIds.length],
    }));
    await db.assessments.bulkAdd(assessmentsWithJobs);
  });
};

// Data generation functions
const generateJobs = () => {
  const titles = [
    'Senior Frontend Developer', 'Backend Engineer', 'Full Stack Developer',
    'DevOps Engineer', 'Product Manager', 'UI/UX Designer', 'Data Scientist',
    'Mobile Developer', 'QA Engineer', 'Technical Writer', 'Marketing Manager',
    'Sales Representative', 'Customer Success Manager', 'HR Specialist',
    'Finance Analyst', 'Operations Manager', 'Business Analyst',
    'System Administrator', 'Security Engineer', 'Machine Learning Engineer',
    'Project Manager', 'Scrum Master', 'Content Creator', 'Social Media Manager',
    'Graphic Designer'
  ];

  const tags = ['React', 'Node.js', 'Python', 'JavaScript', 'TypeScript', 'AWS', 'Docker', 'Kubernetes', 'MongoDB', 'PostgreSQL'];
  const locations = ['Remote', 'San Francisco', 'New York', 'London', 'Berlin', 'Toronto'];

  return titles.map((title, index) => ({
    title,
    slug: title.toLowerCase().replace(/\s+/g, '-') + `-${index}`,
    description: `We are looking for a talented ${title} to join our growing team. This is an excellent opportunity to work with cutting-edge technologies and make a significant impact.`,
    requirements: [
      `3+ years of experience in ${title.toLowerCase()}`,
      'Strong problem-solving skills',
      'Excellent communication skills',
      'Team player with leadership potential'
    ],
    location: locations[Math.floor(Math.random() * locations.length)],
    type: Math.random() > 0.3 ? 'Full-time' : 'Contract',
    salary: {
      min: 60000 + Math.floor(Math.random() * 80000),
      max: 100000 + Math.floor(Math.random() * 100000),
      currency: 'USD'
    },
    tags: tags.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 4) + 2),
    status: Math.random() > 0.2 ? JOB_STATUS.ACTIVE : JOB_STATUS.ARCHIVED,
    order: index,
    createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
  }));
};

const generateCandidates = () => {
  const firstNames = [
    'Aarav', 'Priya', 'Rohan', 'Sneha', 'Kiran', 'Ananya', 'Arjun', 'Kavya',
    'Vikram', 'Pooja', 'Rahul', 'Shreya', 'Rajesh', 'Deepika', 'Amit', 'Sonia',
    'Vishal', 'Meera', 'Suresh', 'Neha', 'Kumar', 'Ritu', 'Pradeep', 'Anita',
    'Manoj', 'Sunita', 'Ravi', 'Kavita', 'Sandeep', 'Poonam', 'Naveen', 'Rekha',
    'Vinod', 'Sarita', 'Ashok', 'Usha', 'Dinesh', 'Geeta', 'Mukesh', 'Lata',
    'Suresh', 'Kamala', 'Ramesh', 'Indira', 'Gopal', 'Sushila', 'Hari', 'Pushpa',
    'Ram', 'Lakshmi', 'Krishna', 'Radha', 'Shiva', 'Parvati', 'Ganesh', 'Saraswati',
    'Hanuman', 'Durga', 'Kartik', 'Ganga', 'Yash', 'Isha', 'Aditya', 'Maya',
    'Rohit', 'Kriti', 'Siddharth', 'Nisha', 'Abhishek', 'Riya', 'Vivek', 'Tanya',
    'Akash', 'Divya', 'Rishabh', 'Pallavi', 'Nikhil', 'Shilpa', 'Rohit', 'Kavya',
    'Sagar', 'Monika', 'Pankaj', 'Rashmi', 'Ankit', 'Suman', 'Vikash', 'Preeti',
    'Rakesh', 'Jyoti', 'Sachin', 'Manju', 'Deepak', 'Sunita', 'Raj', 'Kiran',
    'Amit', 'Pooja', 'Ravi', 'Shreya', 'Kumar', 'Neha', 'Suresh', 'Anita',
    'Manoj', 'Ritu', 'Pradeep', 'Sonia', 'Vishal', 'Meera', 'Rajesh', 'Deepika',
    'Rahul', 'Kavya', 'Arjun', 'Ananya', 'Kiran', 'Sneha', 'Rohan', 'Priya',
    'Aarav', 'Shreya', 'Vikram', 'Pooja', 'Rahul', 'Sonia', 'Amit', 'Deepika',
    'Rajesh', 'Kavya', 'Arjun', 'Ananya', 'Kiran', 'Sneha', 'Rohan', 'Priya'
  ];
  
  const lastNames = [
    'Sharma', 'Kumar', 'Singh', 'Patel', 'Gupta', 'Agarwal', 'Jain', 'Verma',
    'Yadav', 'Mishra', 'Pandey', 'Shah', 'Reddy', 'Nair', 'Iyer', 'Menon',
    'Rao', 'Choudhary', 'Malhotra', 'Arora', 'Bansal', 'Bhatia', 'Chopra', 'Dixit',
    'Goyal', 'Khanna', 'Lal', 'Mehta', 'Nanda', 'Oberoi', 'Puri', 'Rastogi',
    'Saxena', 'Tandon', 'Uppal', 'Vohra', 'Wadhwa', 'Zaveri', 'Ahuja', 'Bajaj',
    'Chandra', 'Dutta', 'Gandhi', 'Hegde', 'Joshi', 'Kakkar', 'Lamba', 'Mittal',
    'Narayan', 'Ojha', 'Prasad', 'Rana', 'Sethi', 'Tiwari', 'Uppal', 'Vyas',
    'Walia', 'Zutshi', 'Agarwal', 'Bhardwaj', 'Chawla', 'Dhingra', 'Garg', 'Handa',
    'Jindal', 'Kohli', 'Luthra', 'Mahajan', 'Narang', 'Oberoi', 'Pahwa', 'Rawat',
    'Sood', 'Thakur', 'Uppal', 'Verma', 'Wadhwa', 'Zaveri', 'Ahuja', 'Bajaj',
    'Chandra', 'Dutta', 'Gandhi', 'Hegde', 'Joshi', 'Kakkar', 'Lamba', 'Mittal',
    'Narayan', 'Ojha', 'Prasad', 'Rana', 'Sethi', 'Tiwari', 'Uppal', 'Vyas',
    'Walia', 'Zutshi', 'Agarwal', 'Bhardwaj', 'Chawla', 'Dhingra', 'Garg', 'Handa',
    'Jindal', 'Kohli', 'Luthra', 'Mahajan', 'Narang', 'Oberoi', 'Pahwa', 'Rawat',
    'Sood', 'Thakur', 'Uppal', 'Verma', 'Wadhwa', 'Zaveri', 'Ahuja', 'Bajaj',
    'Chandra', 'Dutta', 'Gandhi', 'Hegde', 'Joshi', 'Kakkar', 'Lamba', 'Mittal',
    'Narayan', 'Ojha', 'Prasad', 'Rana', 'Sethi', 'Tiwari', 'Uppal', 'Vyas',
    'Walia', 'Zutshi', 'Agarwal', 'Bhardwaj', 'Chawla', 'Dhingra', 'Garg', 'Handa',
    'Jindal', 'Kohli', 'Luthra', 'Mahajan', 'Narang', 'Oberoi', 'Pahwa', 'Rawat',
    'Sood', 'Thakur', 'Uppal', 'Verma', 'Wadhwa', 'Zaveri', 'Ahuja', 'Bajaj',
    'Chandra', 'Dutta', 'Gandhi', 'Hegde', 'Joshi', 'Kakkar', 'Lamba', 'Mittal',
    'Narayan', 'Ojha', 'Prasad', 'Rana', 'Sethi', 'Tiwari', 'Uppal', 'Vyas',
    'Walia', 'Zutshi', 'Agarwal', 'Bhardwaj', 'Chawla', 'Dhingra', 'Garg', 'Handa'
  ];

  const stages = Object.values(CANDIDATE_STAGES);
  const allSkills = [
    'JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'TypeScript', 'Vue.js', 'Angular',
    'Java', 'C#', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin', 'Dart', 'Flutter',
    'AWS', 'Azure', 'Docker', 'Kubernetes', 'Git', 'MongoDB', 'PostgreSQL', 'MySQL',
    'Redis', 'Elasticsearch', 'GraphQL', 'REST API', 'Microservices', 'DevOps', 'CI/CD',
    'Machine Learning', 'Data Science', 'AI', 'Blockchain', 'Web3', 'Mobile Development',
    'UI/UX Design', 'Figma', 'Sketch', 'Adobe Creative Suite', 'Photoshop', 'Illustrator',
    'Project Management', 'Agile', 'Scrum', 'Kanban', 'Jira', 'Confluence', 'Slack',
    'Communication', 'Leadership', 'Team Management', 'Problem Solving', 'Analytical Thinking'
  ];
  
  return Array.from({ length: 1200 }, (_, index) => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const domains = ['gmail.com', 'yahoo.in', 'hotmail.com', 'outlook.com', 'rediffmail.com'];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${index}@${domain}`;
    
    // Weighted stage distribution (more candidates in early stages)
    const stageWeights = {
      [CANDIDATE_STAGES.APPLIED]: 0.35,
      [CANDIDATE_STAGES.SCREENING]: 0.25,
      [CANDIDATE_STAGES.INTERVIEW]: 0.20,
      [CANDIDATE_STAGES.OFFER]: 0.10,
      [CANDIDATE_STAGES.HIRED]: 0.05,
      [CANDIDATE_STAGES.REJECTED]: 0.05,
    };
    
    const random = Math.random();
    let cumulativeWeight = 0;
    let selectedStage = CANDIDATE_STAGES.APPLIED;
    
    for (const [stage, weight] of Object.entries(stageWeights)) {
      cumulativeWeight += weight;
      if (random <= cumulativeWeight) {
        selectedStage = stage;
        break;
      }
    }
    
    return {
      name: `${firstName} ${lastName}`,
      email,
      phone: `+91 ${String(Math.floor(Math.random() * 9000000000) + 1000000000)}`,
      stage: selectedStage,
      resume: `https://drive.google.com/resumes/${firstName.toLowerCase()}-${lastName.toLowerCase()}.pdf`,
      experience: Math.floor(Math.random() * 15) + 1,
      skills: allSkills.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 5) + 2),
      location: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad', 'Remote', 'Gurgaon'][Math.floor(Math.random() * 10)],
      salary: {
        min: 300000 + Math.floor(Math.random() * 1000000),
        max: 800000 + Math.floor(Math.random() * 1200000),
        currency: 'INR'
      },
      createdAt: new Date(Date.now() - Math.random() * 120 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    };
  });
};

const generateAssessments = () => {
  const assessmentTitles = [
    'Frontend Developer Assessment', 'Backend Engineer Challenge', 'Full Stack Technical Interview',
    'DevOps Engineer Evaluation', 'Data Scientist Assessment', 'Product Manager Interview',
    'UI/UX Designer Portfolio Review', 'Mobile Developer Challenge', 'QA Engineer Test',
    'System Administrator Assessment', 'Security Engineer Evaluation', 'Machine Learning Engineer Challenge'
  ];

  return assessmentTitles.map((title, index) => ({
    title,
    description: `${title} - Comprehensive evaluation of candidate skills, knowledge, and experience`,
    sections: generateAssessmentSections(title),
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
  }));
};

const generateAssessmentSections = (assessmentTitle) => {
  const baseSections = [
    {
      id: 'section-1',
      title: 'Technical Knowledge',
      questions: [
        {
          id: 'q1',
          type: QUESTION_TYPES.SINGLE_CHOICE,
          title: 'What is the time complexity of binary search?',
          required: true,
          options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(n²)'],
          correctAnswer: 1
        },
        {
          id: 'q2',
          type: QUESTION_TYPES.MULTI_CHOICE,
          title: 'Which of the following are JavaScript frameworks?',
          required: true,
          options: ['React', 'Angular', 'Vue.js', 'Laravel', 'Express', 'Django'],
          correctAnswers: [0, 1, 2]
        },
        {
          id: 'q3',
          type: QUESTION_TYPES.SHORT_TEXT,
          title: 'What is your favorite programming language and why?',
          required: true,
          maxLength: 200
        },
        {
          id: 'q4',
          type: QUESTION_TYPES.SINGLE_CHOICE,
          title: 'Which HTTP method is used for creating new resources?',
          required: true,
          options: ['GET', 'POST', 'PUT', 'DELETE'],
          correctAnswer: 1
        }
      ]
    },
    {
      id: 'section-2',
      title: 'Problem Solving',
      questions: [
        {
          id: 'q5',
          type: QUESTION_TYPES.LONG_TEXT,
          title: 'Describe how you would approach debugging a performance issue in a web application.',
          required: true,
          maxLength: 1000
        },
        {
          id: 'q6',
          type: QUESTION_TYPES.NUMERIC_RANGE,
          title: 'Rate your experience with React (1-10)',
          required: true,
          min: 1,
          max: 10
        },
        {
          id: 'q7',
          type: QUESTION_TYPES.SINGLE_CHOICE,
          title: 'Have you worked with TypeScript?',
          required: true,
          options: ['Yes', 'No'],
          conditional: {
            showQuestionId: 'q8',
            showIfAnswer: 0
          }
        },
        {
          id: 'q8',
          type: QUESTION_TYPES.SHORT_TEXT,
          title: 'What do you like most about TypeScript?',
          required: false,
          maxLength: 300,
          dependsOn: 'q7'
        },
        {
          id: 'q9',
          type: QUESTION_TYPES.LONG_TEXT,
          title: 'Explain the concept of closures in JavaScript with an example.',
          required: true,
          maxLength: 800
        }
      ]
    },
    {
      id: 'section-3',
      title: 'System Design',
      questions: [
        {
          id: 'q10',
          type: QUESTION_TYPES.LONG_TEXT,
          title: 'How would you design a URL shortener service like bit.ly?',
          required: true,
          maxLength: 1500
        },
        {
          id: 'q11',
          type: QUESTION_TYPES.SINGLE_CHOICE,
          title: 'Which database would you choose for a high-traffic e-commerce site?',
          required: true,
          options: ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'It depends on the use case'],
          correctAnswer: 4
        },
        {
          id: 'q12',
          type: QUESTION_TYPES.MULTI_CHOICE,
          title: 'Which of the following are important for scalability?',
          required: true,
          options: ['Load balancing', 'Caching', 'Database indexing', 'Code optimization', 'All of the above'],
          correctAnswers: [0, 1, 2, 3, 4]
        }
      ]
    },
    {
      id: 'section-4',
      title: 'Experience & Portfolio',
      questions: [
        {
          id: 'q13',
          type: QUESTION_TYPES.FILE_UPLOAD,
          title: 'Please upload your portfolio or code samples',
          required: false,
          acceptedTypes: ['.pdf', '.zip', '.github', '.gitlab']
        },
        {
          id: 'q14',
          type: QUESTION_TYPES.LONG_TEXT,
          title: 'Tell us about a challenging project you worked on and how you overcame the obstacles.',
          required: true,
          maxLength: 1500
        },
        {
          id: 'q15',
          type: QUESTION_TYPES.NUMERIC_RANGE,
          title: 'Years of professional experience',
          required: true,
          min: 0,
          max: 20
        },
        {
          id: 'q16',
          type: QUESTION_TYPES.SHORT_TEXT,
          title: 'What is your biggest professional achievement?',
          required: true,
          maxLength: 400
        }
      ]
    },
    {
      id: 'section-5',
      title: 'Behavioral & Culture Fit',
      questions: [
        {
          id: 'q17',
          type: QUESTION_TYPES.LONG_TEXT,
          title: 'Describe a time when you had to work with a difficult team member. How did you handle it?',
          required: true,
          maxLength: 1000
        },
        {
          id: 'q18',
          type: QUESTION_TYPES.SINGLE_CHOICE,
          title: 'How do you prefer to receive feedback?',
          required: true,
          options: ['In person', 'Written', 'During regular 1:1s', 'Immediately when issues arise', 'All of the above'],
          correctAnswer: 4
        },
        {
          id: 'q19',
          type: QUESTION_TYPES.SHORT_TEXT,
          title: 'What motivates you in your work?',
          required: true,
          maxLength: 300
        },
        {
          id: 'q20',
          type: QUESTION_TYPES.NUMERIC_RANGE,
          title: 'Rate your communication skills (1-10)',
          required: true,
          min: 1,
          max: 10
        }
      ]
    }
  ];

  return baseSections;
};

// Import types
import { JOB_STATUS, CANDIDATE_STAGES, QUESTION_TYPES } from '../types/index.js';