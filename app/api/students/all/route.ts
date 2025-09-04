import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import vm from 'vm';

type RawSeventh = {
  name: string;
  usn: string;
  tenth: number;
  puc: number;
  sem1: number; sem2: number; sem3: number; sem4: number; sem5: number; sem6: number;
  aggregate: number;
  backlogs: number;
};

type RawFifth = {
  name: string;
  usn: string;
  tenth: number;
  puc: number;
  sem1: number; sem2: number; sem3: number; sem4: number;
  backlogs: number;
};

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'seed.ts');
    const content = await fs.readFile(filePath, 'utf8');

    const extractArray = (sectionMarker: string) => {
      const sectionRegex = new RegExp(`${sectionMarker}[\\s\\S]*?const\\s+students\\s*=\\s*\\[(\\s*[\\s\\S]*?)\\];`);
      const match = content.match(sectionRegex);
      if (!match || !match[1]) return [] as any[];
      const arrayLiteral = `[${match[1]}]`;
      // Use a sandbox to safely evaluate the array literal
      const sandbox: any = {};
      return vm.runInNewContext(arrayLiteral, sandbox);
    };

    const rawSeventh = extractArray('// Seed data for 7th semester students') as RawSeventh[];
    const rawFifth = extractArray('// Seed data for 5th semester students') as RawFifth[];

    const placedNames = new Set(['Shankar', 'Vaishnavi G K', 'Kartik Gopal Madivala']);

    const students7th = rawSeventh.map((s) => {
      const placementEligible = Number(s.aggregate) >= 50 && Number(s.backlogs) === 0;
      const placementStatus = placedNames.has(s.name) ? 'Placed' : 'Not Placed';
      return {
        name: s.name,
        usn: s.usn,
        batch: '7th-sem',
        tenth_percentage: Number(s.tenth) || 0,
        puc_percentage: Number(s.puc) || 0,
        sem1_percentage: Number(s.sem1) || 0,
        sem2_percentage: Number(s.sem2) || 0,
        sem3_percentage: Number(s.sem3) || 0,
        sem4_percentage: Number(s.sem4) || 0,
        sem5_percentage: Number(s.sem5) || 0,
        sem6_percentage: Number(s.sem6) || 0,
        aggregate_percentage: Number(s.aggregate) || 0,
        active_backlogs: Number(s.backlogs) || 0,
        placement_eligible: placementEligible,
        placement_status: placementStatus,
      };
    });

    const students5th = rawFifth.map((s) => {
      const s1 = Number(s.sem1) || 0;
      const s2 = Number(s.sem2) || 0;
      const s3 = Number(s.sem3) || 0;
      const s4 = Number(s.sem4) || 0;
      const aggregate = Number(((s1 + s2 + s3 + s4) / 4).toFixed(3));
      const placementEligible = aggregate >= 50 && Number(s.backlogs) === 0;
      return {
        name: s.name,
        usn: s.usn,
        batch: '5th-sem',
        tenth_percentage: Number(s.tenth) || 0,
        puc_percentage: Number(s.puc) || 0,
        sem1_percentage: s1,
        sem2_percentage: s2,
        sem3_percentage: s3,
        sem4_percentage: s4,
        aggregate_percentage: aggregate,
        active_backlogs: Number(s.backlogs) || 0,
        placement_eligible: placementEligible,
        placement_status: 'Not Placed' as const,
      };
    });

    return NextResponse.json({
      total: students5th.length + students7th.length,
      fifthCount: students5th.length,
      seventhCount: students7th.length,
      students5th,
      students7th,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to parse seed data' }, { status: 500 });
  }
}


