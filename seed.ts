import { api } from "encore.dev/api";
import { studentDB } from "./db";

// Seed data for 7th semester students
export const seedSeventhSemData = api<void, { message: string }>(
  { expose: true, method: "POST", path: "/students/seed/7th-sem" },
  async () => {
    const students = [
      { name: "Aditya S", usn: "4PM22CG001", tenth: 81.78, puc: 78, sem1: 68.62, sem2: 73.25, sem3: 84.89, sem4: 80.12, sem5: 80.34, sem6: 87.23, aggregate: 79.075, backlogs: 0 },
      { name: "Aiman Baig", usn: "4PM22CG002", tenth: 83, puc: 81, sem1: 71, sem2: 65, sem3: 77, sem4: 73, sem5: 81, sem6: 80, aggregate: 74, backlogs: 0 },
      { name: "Akshay v", usn: "4PM22CG003", tenth: 74.64, puc: 84.68, sem1: 68.95, sem2: 73.65, sem3: 83.28, sem4: 74.52, sem5: 72.31, sem6: 78.89, aggregate: 75.8, backlogs: 0 },
      { name: "Ananya k", usn: "4PM22CG004", tenth: 96, puc: 85, sem1: 88.5, sem2: 92.5, sem3: 90, sem4: 84.7, sem5: 88.2, sem6: 77.6, aggregate: 87.6, backlogs: 0 },
      { name: "Arpitha R", usn: "4PM22CG005", tenth: 81, puc: 71, sem1: 80, sem2: 83, sem3: 93, sem4: 86, sem5: 86, sem6: 86, aggregate: 86, backlogs: 0 },
      { name: "Arpitha.S", usn: "4PM22CG006", tenth: 88.48, puc: 76.33, sem1: 66.65, sem2: 76.12, sem3: 80.66, sem4: 82.2, sem5: 85.44, sem6: 86.44, aggregate: 79.58, backlogs: 0 },
      { name: "Bhoomika.R", usn: "4PM22CG007", tenth: 75.36, puc: 69.83, sem1: 68.75, sem2: 76.25, sem3: 87.77, sem4: 83.44, sem5: 81.44, sem6: 83.77, aggregate: 80.55, backlogs: 0 },
      { name: "Bi Bi Mariyam", usn: "4PM22CG009", tenth: 93, puc: 94, sem1: 76, sem2: 79, sem3: 90, sem4: 83, sem5: 84, sem6: 86, aggregate: 83, backlogs: 0 },
      { name: "Chandana cs", usn: "4PM22CG010", tenth: 72, puc: 82, sem1: 54, sem2: 67, sem3: 82, sem4: 75, sem5: 77, sem6: 82, aggregate: 73, backlogs: 0 },
      { name: "Charan kashayp M", usn: "4PM22CG011", tenth: 84.64, puc: 69.90, sem1: 60, sem2: 57.60, sem3: 61.20, sem4: 72.20, sem5: 68.20, sem6: 74.50, aggregate: 72.30, backlogs: 2 },
      { name: "Darshan S", usn: "4pm22cg012", tenth: 84, puc: 82, sem1: 69, sem2: 71.5, sem3: 81, sem4: 79.58, sem5: 80, sem6: 84, aggregate: 77.5, backlogs: 0 },
      { name: "Deekshitha DN", usn: "4PM22CG013", tenth: 86.4, puc: 79.4, sem1: 73.5, sem2: 78, sem3: 78.6, sem4: 76.3, sem5: 82.3, sem6: 84.4, aggregate: 78.85, backlogs: 0 },
      { name: "Deekshitha R", usn: "4PM22CG014", tenth: 75.84, puc: 68.66, sem1: 57.71, sem2: 67.50, sem3: 74.88, sem4: 66.77, sem5: 74.11, sem6: 76.44, aggregate: 70, backlogs: 0 },
      { name: "Gopika E L", usn: "4PM22CG015", tenth: 79.6, puc: 80, sem1: 65.25, sem2: 70.37, sem3: 86.33, sem4: 83.33, sem5: 83.77, sem6: 86.55, aggregate: 79.71, backlogs: 0 },
      { name: "Hafsa Noorain Amjed", usn: "4PM22CG016", tenth: 70, puc: 80, sem1: 72.87, sem2: 79.87, sem3: 88.88, sem4: 79, sem5: 83.11, sem6: 85.22, aggregate: 84, backlogs: 0 },
      { name: "Hasan Raza", usn: "4PM22CG017", tenth: 80, puc: 58, sem1: 46.55, sem2: 60.61, sem3: 54.15, sem4: 68.5, sem5: 74.86, sem6: 71.91, aggregate: 62.58, backlogs: 0 },
      { name: "Hithaishi U", usn: "4PM22CG018", tenth: 89.5, puc: 87, sem1: 68, sem2: 71, sem3: 86, sem4: 78, sem5: 76, sem6: 70, aggregate: 75, backlogs: 0 },
      { name: "Karthik.k.r", usn: "4PM22CG020", tenth: 77, puc: 60.5, sem1: 58, sem2: 67, sem3: 81, sem4: 77, sem5: 79, sem6: 77, aggregate: 79, backlogs: 0 },
      { name: "Kartik Gopal Madivala", usn: "4PM22CG021", tenth: 84.14, puc: 82, sem1: 73.37, sem2: 79.75, sem3: 87.77, sem4: 82.6, sem5: 83.22, sem6: 85.88, aggregate: 82.07, backlogs: 0 },
      { name: "Kruthika B I", usn: "4PM22CG022", tenth: 93, puc: 91, sem1: 78, sem2: 87, sem3: 84, sem4: 85, sem5: 88, sem6: 91, aggregate: 85.30, backlogs: 0 },
      { name: "Manju Madhav V A", usn: "4PM22CG023", tenth: 91.36, puc: 57.5, sem1: 72.25, sem2: 77.25, sem3: 83.5, sem4: 84.3, sem5: 82.77, sem6: 88.6, aggregate: 81.34, backlogs: 0 },
      { name: "Meghana KM", usn: "4PM22CG024", tenth: 78, puc: 67, sem1: 61.49, sem2: 63.20, sem3: 67.70, sem4: 70.00, sem5: 69.30, sem6: 69.50, aggregate: 71.56, backlogs: 0 },
      { name: "Nandhitha G P", usn: "4PM22CG025", tenth: 86.8, puc: 83.45, sem1: 80, sem2: 84.5, sem3: 86.72, sem4: 85, sem5: 84, sem6: 92.45, aggregate: 87, backlogs: 0 },
      { name: "Nishant", usn: "4PM22CG027", tenth: 83.6, puc: 85, sem1: 67, sem2: 66, sem3: 75, sem4: 74, sem5: 77, sem6: 75, aggregate: 73, backlogs: 0 },
      { name: "NISHANTH K R", usn: "4PM22CG028", tenth: 79, puc: 76, sem1: 61.50, sem2: 73, sem3: 77.60, sem4: 75.30, sem5: 83.60, sem6: 78.90, aggregate: 75.10, backlogs: 0 },
      { name: "Nithin A B", usn: "4PM22CG029", tenth: 95, puc: 92, sem1: 80.37, sem2: 77.37, sem3: 88.11, sem4: 81.67, sem5: 85.11, sem6: 88.24, aggregate: 86.557, backlogs: 0 },
      { name: "Nivedita Shankar Gouda", usn: "4PM22CG030", tenth: 82.72, puc: 67.17, sem1: 57, sem2: 71, sem3: 70.1, sem4: 71, sem5: 76.5, sem6: 72.4, aggregate: 69.58, backlogs: 0 },
      { name: "Padmini V", usn: "4PM22CG031", tenth: 74.9, puc: 59.8, sem1: 55, sem2: 60, sem3: 63, sem4: 70, sem5: 76, sem6: 81, aggregate: 78, backlogs: 0 },
      { name: "Poornashree SV", usn: "4PM22CG032", tenth: 93, puc: 75.39, sem1: 69.25, sem2: 74.12, sem3: 84.23, sem4: 83.12, sem5: 89.34, sem6: 87.12, aggregate: 83.20, backlogs: 0 },
      { name: "PRATHAMESHA C SHETTY", usn: "4PM22CG033", tenth: 87, puc: 81, sem1: 79, sem2: 77.50, sem3: 74.80, sem4: 76, sem5: 75, sem6: 76, aggregate: 76, backlogs: 0 },
      { name: "Prerana Ashok Raikar", usn: "4PM22CG034", tenth: 79.04, puc: 68.33, sem1: 71.50, sem2: 74.00, sem3: 76.30, sem4: 74.00, sem5: 77.09, sem6: 81.90, aggregate: 79.04, backlogs: 0 },
      { name: "Priya y m", usn: "4PM22CG035", tenth: 88.80, puc: 81, sem1: 79.50, sem2: 85.50, sem3: 81, sem4: 75.70, sem5: 79, sem6: 78.40, aggregate: 75.90, backlogs: 0 },
      { name: "Rohan K Rajoli", usn: "4PM22CG036", tenth: 63, puc: 55.50, sem1: 62.50, sem2: 67.50, sem3: 65.20, sem4: 70, sem5: 75, sem6: 67.20, aggregate: 67.90, backlogs: 0 },
      { name: "Sachin k", usn: "4PM22CG037", tenth: 67, puc: 56, sem1: 60, sem2: 60, sem3: 60, sem4: 60, sem5: 60, sem6: 60, aggregate: 60, backlogs: 13 },
      { name: "Sakshi S Y", usn: "4PM22CG038", tenth: 85.00, puc: 76, sem1: 56.00, sem2: 70.00, sem3: 74, sem4: 68.50, sem5: 79, sem6: 75.10, aggregate: 77, backlogs: 1 },
      { name: "Sanjana NA", usn: "4PM22CG039", tenth: 69.12, puc: 63, sem1: 52.25, sem2: 61.25, sem3: 70.1, sem4: 70.2, sem5: 70.22, sem6: 73.22, aggregate: 66.19, backlogs: 5 },
      { name: "Shadabur Rahaman", usn: "4PM22CG040", tenth: 91.2, puc: 84, sem1: 77.13, sem2: 77.88, sem3: 87.77, sem4: 83.11, sem5: 83.66, sem6: 90.88, aggregate: 83.63, backlogs: 0 },
      { name: "Shamanth s Kumbar", usn: "4PM22CG041", tenth: 60, puc: 55, sem1: 52.9, sem2: 71.6, sem3: 68.4, sem4: 67.4, sem5: 79, sem6: 67, aggregate: 67.9, backlogs: 1 },
      { name: "Shankar", usn: "4PM22CG042", tenth: 86.2, puc: 73, sem1: 79.38, sem2: 86.13, sem3: 91.33, sem4: 87.33, sem5: 86.22, sem6: 89.89, aggregate: 86.87, backlogs: 0 },
      { name: "Shashank vs", usn: "4PM22CG043", tenth: 65, puc: 65, sem1: 60, sem2: 65, sem3: 67, sem4: 61, sem5: 74, sem6: 71, aggregate: 70, backlogs: 0 },
      { name: "Shivshankar Awate", usn: "4PM22CG044", tenth: 83.52, puc: 84.66, sem1: 63.50, sem2: 67.80, sem3: 70.10, sem4: 67.90, sem5: 69.70, sem6: 72.50, aggregate: 68.60, backlogs: 0 },
      { name: "Shreya Janardhan Madival", usn: "4PM22CG045", tenth: 89.28, puc: 63.33, sem1: 76, sem2: 79.88, sem3: 87.22, sem4: 84.60, sem5: 85.70, sem6: 88.40, aggregate: 83.60, backlogs: 0 },
      { name: "Sinchana NS", usn: "4pm22cg046", tenth: 89.44, puc: 91.83, sem1: 84, sem2: 82, sem3: 84.8, sem4: 84.7, sem5: 86.8, sem6: 83.3, aggregate: 84.26, backlogs: 0 },
      { name: "Sourabh Patil", usn: "4PM22CG047", tenth: 69, puc: 85, sem1: 86.5, sem2: 88.8, sem3: 84, sem4: 78, sem5: 85.1, sem6: 85, aggregate: 84.56, backlogs: 0 },
      { name: "Srushti GP", usn: "4PM22CG048", tenth: 70, puc: 73, sem1: 79, sem2: 79, sem3: 79, sem4: 81, sem5: 81, sem6: 82, aggregate: 81, backlogs: 0 },
      { name: "Srushti N Y", usn: "4PM22CG049", tenth: 86, puc: 59.60, sem1: 61.50, sem2: 68.90, sem3: 83.40, sem4: 77.80, sem5: 84.10, sem6: 86, aggregate: 78, backlogs: 0 },
      { name: "Subhash chandra kowshik hs", usn: "4PM22CG050", tenth: 72, puc: 56, sem1: 58, sem2: 59.875, sem3: 72.33, sem4: 65.857, sem5: 74.125, sem6: 70.285, aggregate: 66.745, backlogs: 3 },
      { name: "Supritha GC", usn: "4PM22CG051", tenth: 91.68, puc: 85, sem1: 67, sem2: 72, sem3: 85, sem4: 82, sem5: 79, sem6: 80, aggregate: 79, backlogs: 0 },
      { name: "Suraj.v", usn: "4PM22CG052", tenth: 90.24, puc: 90.16, sem1: 76.5, sem2: 81.12, sem3: 88.44, sem4: 84.56, sem5: 82.34, sem6: 87.23, aggregate: 83.36, backlogs: 0 },
      { name: "Sushma KV", usn: "4PM22CG053", tenth: 96.32, puc: 83.83, sem1: 73.6, sem2: 80.2, sem3: 82.6, sem4: 83.2, sem5: 79.1, sem6: 75, aggregate: 78.8, backlogs: 0 },
      { name: "Sushmitha M J", usn: "4PM22CG054", tenth: 65, puc: 67, sem1: 65, sem2: 76, sem3: 73, sem4: 82, sem5: 82, sem6: 83, aggregate: 76.9, backlogs: 0 },
      { name: "Thanuja C N", usn: "4PM22CG055", tenth: 89, puc: 74, sem1: 61, sem2: 67, sem3: 71, sem4: 73, sem5: 74, sem6: 81.22, aggregate: 72, backlogs: 1 },
      { name: "Thoofik Usmaan A", usn: "4PM22CG056", tenth: 64, puc: 62, sem1: 61, sem2: 68, sem3: 82, sem4: 80, sem5: 78, sem6: 82, aggregate: 75, backlogs: 0 },
      { name: "U GOUTHAM KRISHNA", usn: "4PM22CG057", tenth: 70, puc: 72, sem1: 74, sem2: 78, sem3: 74, sem4: 74, sem5: 74, sem6: 65, aggregate: 70, backlogs: 0 },
      { name: "Uday P", usn: "4PM22CG058", tenth: 83, puc: 68, sem1: 60, sem2: 61, sem3: 60, sem4: 61, sem5: 62, sem6: 60, aggregate: 65, backlogs: 0 },
      { name: "Vaishnavi G K", usn: "4PM22CG059", tenth: 95.6, puc: 78, sem1: 68, sem2: 73, sem3: 78, sem4: 78, sem5: 77, sem6: 81, aggregate: 76, backlogs: 0 },
      { name: "Vanishree M", usn: "4PM22CG060", tenth: 73.33, puc: 83.33, sem1: 75.25, sem2: 79.62, sem3: 86.33, sem4: 82.66, sem5: 85.55, sem6: 86, aggregate: 82.76, backlogs: 0 },
      { name: "Varsha S", usn: "4PM22CG061", tenth: 75.40, puc: 58, sem1: 62.25, sem2: 73.12, sem3: 81, sem4: 76.50, sem5: 78.30, sem6: 79.40, aggregate: 72.01, backlogs: 0 }
    ];

    for (const student of students) {
      const placementEligible = student.aggregate >= 50 && student.backlogs === 0;
      
      // Determine placement status
      let placementStatus = 'Not Placed';
      if (['Shankar', 'Vaishnavi G K', 'Kartik Gopal Madivala'].includes(student.name)) {
        placementStatus = 'Placed';
      }
      
      await studentDB.exec`
        INSERT INTO students (
          name, usn, batch, tenth_percentage, puc_percentage,
          sem1_percentage, sem2_percentage, sem3_percentage, sem4_percentage,
          sem5_percentage, sem6_percentage, aggregate_percentage,
          active_backlogs, placement_eligible, placement_status
        ) VALUES (
          ${student.name}, ${student.usn}, '7th-sem', ${student.tenth}, ${student.puc},
          ${student.sem1}, ${student.sem2}, ${student.sem3}, ${student.sem4},
          ${student.sem5}, ${student.sem6}, ${student.aggregate},
          ${student.backlogs}, ${placementEligible}, ${placementStatus}
        )
        ON CONFLICT (usn) DO UPDATE SET
          name = EXCLUDED.name,
          tenth_percentage = EXCLUDED.tenth_percentage,
          puc_percentage = EXCLUDED.puc_percentage,
          sem1_percentage = EXCLUDED.sem1_percentage,
          sem2_percentage = EXCLUDED.sem2_percentage,
          sem3_percentage = EXCLUDED.sem3_percentage,
          sem4_percentage = EXCLUDED.sem4_percentage,
          sem5_percentage = EXCLUDED.sem5_percentage,
          sem6_percentage = EXCLUDED.sem6_percentage,
          aggregate_percentage = EXCLUDED.aggregate_percentage,
          active_backlogs = EXCLUDED.active_backlogs,
          placement_eligible = EXCLUDED.placement_eligible,
          placement_status = EXCLUDED.placement_status,
          updated_at = CURRENT_TIMESTAMP
      `;
    }

    return { message: `Successfully seeded ${students.length} 7th semester students` };
  }
);

// Seed data for 5th semester students
export const seedFifthSemData = api<void, { message: string }>(
  { expose: true, method: "POST", path: "/students/seed/5th-sem" },
  async () => {
    const students = [
      { name: "Koushik b k", usn: "4PM23CG020", tenth: 75, puc: 82, sem1: 67, sem2: 71.6, sem3: 76.3, sem4: 69.1, backlogs: 0 },
      { name: "Kishan-B", usn: "4PM23CG019", tenth: 63, puc: 65, sem1: 65, sem2: 66, sem3: 67, sem4: 64, backlogs: 0 },
      { name: "Sakshi M C", usn: "4PM23CG041", tenth: 73.2, puc: 87, sem1: 72.5, sem2: 77, sem3: 71.4, sem4: 72.6, backlogs: 0 },
      { name: "Kevin Tennison", usn: "4PM23CG018", tenth: 66, puc: 84.5, sem1: 79, sem2: 80.7, sem3: 85.7, sem4: 74.7, backlogs: 0 },
      { name: "H Rajath", usn: "4PM23CG015", tenth: 88, puc: 91, sem1: 82, sem2: 85, sem3: 85, sem4: 77, backlogs: 0 },
      { name: "KRUTHI M", usn: "4PM23CG021", tenth: 86, puc: 81, sem1: 78, sem2: 79.3, sem3: 80, sem4: 82.6, backlogs: 0 },
      { name: "Amith N", usn: "4PM23CG003", tenth: 75, puc: 74, sem1: 65, sem2: 64, sem3: 75, sem4: 70, backlogs: 0 },
      { name: "Sinchana G P", usn: "4PM23CG050", tenth: 72, puc: 60, sem1: 66, sem2: 72.5, sem3: 72.4, sem4: 70.5, backlogs: 0 },
      { name: "Sandya NH", usn: "4PM23CG042", tenth: 89, puc: 92, sem1: 73.1, sem2: 82.2, sem3: 76.7, sem4: 76.8, backlogs: 0 },
      { name: "Rakshitha A", usn: "4PM23CG036", tenth: 78, puc: 65, sem1: 81.50, sem2: 85, sem3: 81.00, sem4: 75.00, backlogs: 0 },
      { name: "Prathibha j mirajkar", usn: "4PM23CG033", tenth: 90, puc: 73, sem1: 64, sem2: 70, sem3: 76.7, sem4: 76.4, backlogs: 1 },
      { name: "Sahana A S", usn: "4PM23CG040", tenth: 50, puc: 65.50, sem1: 54.10, sem2: 56, sem3: 67.10, sem4: 58.40, backlogs: 6 },
      { name: "Ankitha L", usn: "4PM23CG005", tenth: 89.44, puc: 88, sem1: 78.75, sem2: 81.37, sem3: 80.88, sem4: 79.44, backlogs: 0 },
      { name: "Shambhavi M Y", usn: "4PM23CG045", tenth: 86.08, puc: 79.67, sem1: 88.00, sem2: 91.50, sem3: 90.00, sem4: 89.50, backlogs: 0 },
      { name: "Vijeta Vijaykumar Naik", usn: "4PM23CGO57", tenth: 97.6, puc: 90, sem1: 90, sem2: 95, sem3: 93.3, sem4: 88.4, backlogs: 0 },
      { name: "Rachana M", usn: "4pm23cg034", tenth: 69, puc: 78.50, sem1: 65, sem2: 70, sem3: 82, sem4: 78, backlogs: 0 },
      { name: "Shashank Vinay Hegde", usn: "4PM23CG046", tenth: 89.45, puc: 80, sem1: 76.6, sem2: 82.2, sem3: 83.8, sem4: 78.1, backlogs: 0 },
      { name: "Mithun P", usn: "4PM23CG023", tenth: 95.68, puc: 72.33, sem1: 77, sem2: 82, sem3: 84.3, sem4: 77.4, backlogs: 0 },
      { name: "Soujanya Vishnu Shanbhag", usn: "4PM23CG052", tenth: 91.36, puc: 85.33, sem1: 93.5, sem2: 95, sem3: 87.3, sem4: 89.5, backlogs: 0 },
      { name: "Yashaswini R", usn: "4PM23CG060", tenth: 89.12, puc: 81.83, sem1: 79.50, sem2: 83.50, sem3: 82.40, sem4: 81.10, backlogs: 0 },
      { name: "T P.Rohit", usn: "4PM23CG055", tenth: 61, puc: 80, sem1: 61.75, sem2: 64.12, sem3: 66.40, sem4: 58.70, backlogs: 0 },
      { name: "Rajath Ravikumar", usn: "4PM23CG035", tenth: 85.5, puc: 85, sem1: 85.5, sem2: 86.3, sem3: 83.3, sem4: 80.1, backlogs: 1 },
      { name: "Karthik AP", usn: "4PM23CG017", tenth: 89.50, puc: 88.94, sem1: 73.5, sem2: 75.5, sem3: 75.55, sem4: 75, backlogs: 0 },
      { name: "Sharanya", usn: "4PM24CG402", tenth: 77.6, puc: 81.7, sem1: 0, sem2: 0, sem3: 75.2, sem4: 72.1, backlogs: 0 },
      { name: "Srujana J", usn: "4PM23CG053", tenth: 88.8, puc: 85.5, sem1: 78.5, sem2: 82, sem3: 85, sem4: 75.3, backlogs: 0 },
      { name: "Sanjana R V", usn: "4PM23CG044", tenth: 84, puc: 67.66, sem1: 65.25, sem2: 72, sem3: 81.66, sem4: 75.66, backlogs: 0 },
      { name: "Deekshitha M R", usn: "4pm23cg012", tenth: 78, puc: 80, sem1: 78.50, sem2: 82, sem3: 84.30, sem4: 79.50, backlogs: 0 },
      { name: "Ashritha R", usn: "4PM23CG006", tenth: 89, puc: 89.5, sem1: 78, sem2: 90, sem3: 84.3, sem4: 85.3, backlogs: 0 },
      { name: "Neeli Chandrika", usn: "4PM23CG027", tenth: 100, puc: 96.4, sem1: 81, sem2: 89, sem3: 86.2, sem4: 84.2, backlogs: 0 },
      { name: "chandana T E", usn: "4PM23CG009", tenth: 84.96, puc: 87.3, sem1: 73.5, sem2: 76.25, sem3: 83.11, sem4: 82.33, backlogs: 0 },
      { name: "Aditya M", usn: "4PM23CGOO2", tenth: 71, puc: 68, sem1: 69.5, sem2: 66.3, sem3: 75.7, sem4: 65.1, backlogs: 1 },
      { name: "Suhas G Kashyap", usn: "4PM23CG054", tenth: 69, puc: 84, sem1: 46.5, sem2: 62, sem3: 57.1, sem4: 63.7, backlogs: 1 },
      { name: "prasanna Kumar.k", usn: "4PM23CGO31", tenth: 76, puc: 67, sem1: 67.5, sem2: 63.6, sem3: 69, sem4: 65.7, backlogs: 0 },
      { name: "Ananya A S", usn: "4PM23CG004", tenth: 89, puc: 92, sem1: 55, sem2: 71, sem3: 76, sem4: 68, backlogs: 0 },
      { name: "Praneeth R S", usn: "4PM23CG030", tenth: 87, puc: 83, sem1: 73, sem2: 78.3, sem3: 79, sem4: 78.3, backlogs: 0 },
      { name: "AAKANKSHA B", usn: "4PM23CG001", tenth: 79, puc: 91, sem1: 63, sem2: 75, sem3: 76, sem4: 74, backlogs: 0 },
      { name: "Vinayprakash", usn: "4PM23CG058", tenth: 79, puc: 85, sem1: 71, sem2: 81, sem3: 75, sem4: 78, backlogs: 0 },
      { name: "Poorvi V S", usn: "4PM23CG029", tenth: 75, puc: 70, sem1: 69, sem2: 70, sem3: 71, sem4: 75, backlogs: 0 },
      { name: "Yashaswini G D", usn: "4PM23CG059", tenth: 68.9, puc: 88.8, sem1: 64.6, sem2: 64.6, sem3: 79.4, sem4: 70.4, backlogs: 1 },
      { name: "Poornima R Haranagiri", usn: "4PM23CG028", tenth: 90.72, puc: 84.6, sem1: 81, sem2: 84, sem3: 76, sem4: 80, backlogs: 0 },
      { name: "Nachiketha P K", usn: "4PM23CG026", tenth: 88.8, puc: 79, sem1: 85, sem2: 85, sem3: 77.6, sem4: 73.2, backlogs: 0 },
      { name: "Divya R.Revankar", usn: "4PM23CG013", tenth: 85, puc: 75, sem1: 74.5, sem2: 82.5, sem3: 83.8, sem4: 83.7, backlogs: 0 },
      { name: "Mohammed Kaif", usn: "4PM23CG024", tenth: 73, puc: 85.5, sem1: 69.8, sem2: 72.25, sem3: 73.8, sem4: 71, backlogs: 0 },
      { name: "Lekhana B", usn: "4PM23CG022", tenth: 82.72, puc: 75.16, sem1: 74.5, sem2: 86, sem3: 90, sem4: 91, backlogs: 0 },
      { name: "Ayisha tuba", usn: "4PM23CG007", tenth: 82, puc: 89, sem1: 77.37, sem2: 79.37, sem3: 85, sem4: 75, backlogs: 0 },
      { name: "Sachith R", usn: "4PM23CG039", tenth: 84, puc: 74, sem1: 64.12, sem2: 71.5, sem3: 76.4, sem4: 72.11, backlogs: 0 },
      { name: "Moulya NR", usn: "4PM23CG025", tenth: 95.52, puc: 84.5, sem1: 77.5, sem2: 85.62, sem3: 85, sem4: 85.11, backlogs: 0 },
      { name: "Deeksha SK", usn: "4PM23CG011", tenth: 84, puc: 90.8, sem1: 70.87, sem2: 78.25, sem3: 82.66, sem4: 81.66, backlogs: 0 },
      { name: "Bhoomika P", usn: "4PM23CG008", tenth: 80, puc: 87, sem1: 63.27, sem2: 72.37, sem3: 75.55, sem4: 70.55, backlogs: 0 },
      { name: "Darshan survase", usn: "4PM23CG010", tenth: 77.33, puc: 69.2, sem1: 70, sem2: 70, sem3: 60.5, sem4: 60, backlogs: 1 },
      { name: "Sindhu B S", usn: "4PM23CG051", tenth: 80, puc: 83.1, sem1: 61.5, sem2: 67.75, sem3: 78.33, sem4: 70.44, backlogs: 0 },
      { name: "Shivani NS", usn: "4pm23cg047", tenth: 84, puc: 81, sem1: 73.62, sem2: 80.80, sem3: 86, sem4: 81.80, backlogs: 0 },
      { name: "Prashant", usn: "4PM23CG032", tenth: 71, puc: 84, sem1: 70, sem2: 81, sem3: 82, sem4: 80, backlogs: 0 },
      { name: "Avinash H C", usn: "4PM24CG400", tenth: 80.4, puc: 83.36, sem1: 0, sem2: 0, sem3: 73.4, sem4: 63.4, backlogs: 2 },
      { name: "Rohit P Gokavi", usn: "4PM23CG038", tenth: 80.1, puc: 86, sem1: 78, sem2: 79, sem3: 82, sem4: 85, backlogs: 0 }
    ];

    try {
      for (const student of students) {
        // Compute aggregate (average of 4 sems). Guard against missing/NaN.
        const s1 = Number(student.sem1) || 0;
        const s2 = Number(student.sem2) || 0;
        const s3 = Number(student.sem3) || 0;
        const s4 = Number(student.sem4) || 0;
        const aggregate = Number(((s1 + s2 + s3 + s4) / 4).toFixed(2));

        // Eligible if aggregate >= 50 and no backlogs
        const placementEligible = aggregate >= 50 && Number(student.backlogs) === 0;

        // Default placement status
        let placementStatus = "Not Placed";

        // Diagnostic log — remove or keep as needed
        console.log(`[5th-seed] ${student.usn} - aggregate: ${aggregate}, backlogs: ${student.backlogs}, eligible: ${placementEligible}`);

        // Insert or update single row
        await studentDB.exec`
          INSERT INTO students (
            name, usn, batch, tenth_percentage, puc_percentage,
            sem1_percentage, sem2_percentage, sem3_percentage, sem4_percentage,
            aggregate_percentage, active_backlogs, placement_eligible, placement_status
          ) VALUES (
            ${student.name}, ${student.usn}, '5th-sem', ${student.tenth}, ${student.puc},
            ${s1}, ${s2}, ${s3}, ${s4},
            ${aggregate}, ${student.backlogs}, ${placementEligible}, ${placementStatus}
          )
          ON CONFLICT (usn) DO UPDATE SET
            name = EXCLUDED.name,
            tenth_percentage = EXCLUDED.tenth_percentage,
            puc_percentage = EXCLUDED.puc_percentage,
            sem1_percentage = EXCLUDED.sem1_percentage,
            sem2_percentage = EXCLUDED.sem2_percentage,
            sem3_percentage = EXCLUDED.sem3_percentage,
            sem4_percentage = EXCLUDED.sem4_percentage,
            aggregate_percentage = EXCLUDED.aggregate_percentage,
            active_backlogs = EXCLUDED.active_backlogs,
            placement_eligible = EXCLUDED.placement_eligible,
            placement_status = EXCLUDED.placement_status,
            updated_at = CURRENT_TIMESTAMP
        `;
      }

      // --- Guarantee correct flags for all existing 5th-sem rows ---
      // 1) mark eligible where aggregate >= 50 and no backlogs
      await studentDB.exec`
        UPDATE students
        SET placement_eligible = true, placement_status = COALESCE(placement_status, 'Not Placed'), updated_at = CURRENT_TIMESTAMP
        WHERE batch = '5th-sem' AND aggregate_percentage >= 50 AND active_backlogs = 0
      `;

      // 2) mark not eligible where condition not met
      await studentDB.exec`
        UPDATE students
        SET placement_eligible = false, updated_at = CURRENT_TIMESTAMP
        WHERE batch = '5th-sem' AND NOT (aggregate_percentage >= 50 AND active_backlogs = 0)
      `;

      return { message: `Successfully seeded ${students.length} 5th semester students and updated eligibility` };
    } catch (err) {
      console.error('[seedFifthSemData] error:', err);
      throw err; // return a non-200 so you see the error
    }
  }
);