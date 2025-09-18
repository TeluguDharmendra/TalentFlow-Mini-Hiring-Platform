import { rest } from "msw";
import { db } from "../utils/db.js";
import {
  simulateNetworkRequest,
  paginate,
  searchItems,
  filterItems,
  sortItems,
} from "../utils/api.js";
import { CANDIDATE_STAGES } from "../types/index.js";

// Seed some assessments to avoid 404
async function seedAssessments() {
  const existing = await db.assessments.toArray();
  if (existing.length === 0) {
    await db.assessments.bulkAdd([
      { id: 1, jobId: 1, title: "Assessment 1", questions: [] },
      { id: 2, jobId: 2, title: "Assessment 2", questions: [] },
      { id: 3, jobId: 3, title: "Assessment 3", questions: [] },
    ]);
  }
}
seedAssessments();

// Jobs endpoints
export const jobsHandlers = [
  rest.get("/api/jobs", async (req, res, ctx) => {
    console.log("MSW: Jobs endpoint called");
    return simulateNetworkRequest(async () => {
      const url = new URL(req.url, window.location.origin);
      const search = url.searchParams.get("search") || "";
      const status = url.searchParams.get("status") || "";
      const page = parseInt(url.searchParams.get("page")) || 1;
      const pageSize = parseInt(url.searchParams.get("pageSize")) || 10;
      const sort = url.searchParams.get("sort") || "createdAt";
      const order = url.searchParams.get("order") || "desc";

      let jobs = await db.jobs.toArray();
      console.log("MSW: Found jobs:", jobs.length);

      if (search) jobs = searchItems(jobs, search, ["title", "description", "tags"]);
      if (status && status !== "all") jobs = filterItems(jobs, { status });
      jobs = sortItems(jobs, sort, order);

      const result = paginate(jobs, page, pageSize);
      console.log("MSW: Returning jobs result:", result);
      return res(ctx.status(200), ctx.json(result));
    });
  }),

  rest.post("/api/jobs", async (req, res, ctx) => {
    return simulateNetworkRequest(async () => {
      const jobData = await req.json();
      const existingJob = await db.jobs.where("slug").equals(jobData.slug).first();
      if (existingJob) return res(ctx.status(400), ctx.json({ error: "Slug already exists" }));

      const maxOrder = await db.jobs.orderBy("order").last().catch(() => null);
      const order = maxOrder ? maxOrder.order + 1 : 0;

      const newJob = {
        ...jobData,
        order,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const id = await db.jobs.add(newJob);
      const job = await db.jobs.get(id);

      return res(ctx.status(201), ctx.json(job));
    });
  }),

  rest.patch("/api/jobs/:id", async (req, res, ctx) => {
    return simulateNetworkRequest(async () => {
      const id = parseInt(req.params.id);
      const updates = await req.json();

      const existingJob = await db.jobs.get(id);
      if (!existingJob) return res(ctx.status(404), ctx.json({ error: "Job not found" }));

      if (updates.slug && updates.slug !== existingJob.slug) {
        const duplicateJob = await db.jobs.where("slug").equals(updates.slug).first();
        if (duplicateJob) return res(ctx.status(400), ctx.json({ error: "Slug already exists" }));
      }

      const updatedJob = { ...existingJob, ...updates, updatedAt: new Date() };
      await db.jobs.update(id, updatedJob);

      const job = await db.jobs.get(id);
      return res(ctx.status(200), ctx.json(job));
    });
  }),

  rest.get("/api/jobs/:id", async (req, res, ctx) => {
    return simulateNetworkRequest(async () => {
      const id = parseInt(req.params.id);
      const job = await db.jobs.get(id);
      if (!job) return res(ctx.status(404), ctx.json({ error: "Job not found" }));
      return res(ctx.status(200), ctx.json(job));
    });
  }),

  rest.patch("/api/jobs/:id/reorder", async (req, res, ctx) => {
    return simulateNetworkRequest(async () => {
      const id = parseInt(req.params.id);
      const { newOrder } = await req.json();

      const job = await db.jobs.get(id);
      if (!job) return res(ctx.status(404), ctx.json({ error: "Job not found" }));

      // Update order for all jobs
      const allJobs = await db.jobs.toArray();
      for (let i = 0; i < allJobs.length; i++) {
        await db.jobs.update(allJobs[i].id, { order: i });
      }

      // Update the specific job's order
      await db.jobs.update(id, { order: newOrder, updatedAt: new Date() });

      return res(ctx.status(200), ctx.json({ success: true }));
    });
  }),

  rest.delete("/api/jobs/:id", async (req, res, ctx) => {
    return simulateNetworkRequest(async () => {
      const id = parseInt(req.params.id);
      const job = await db.jobs.get(id);
      if (!job) return res(ctx.status(404), ctx.json({ error: "Job not found" }));

      await db.jobs.delete(id);
      return res(ctx.status(200), ctx.json({ success: true }));
    });
  }),
];

// Candidates endpoints
export const candidatesHandlers = [
  rest.get("/api/candidates", async (req, res, ctx) => {
    return simulateNetworkRequest(async () => {
      const url = new URL(req.url, window.location.origin);
      const search = url.searchParams.get("search") || "";
      const stage = url.searchParams.get("stage") || "";
      const jobId = url.searchParams.get("jobId") || "";
      const page = parseInt(url.searchParams.get("page")) || 1;
      const pageSize = parseInt(url.searchParams.get("pageSize")) || 50;

      let candidates = await db.candidates.toArray();
      if (search) candidates = searchItems(candidates, search, ["name", "email"]);

      const filters = {};
      if (stage && stage !== "all") filters.stage = stage;
      if (jobId && jobId !== "all") filters.jobId = parseInt(jobId);
      if (Object.keys(filters).length > 0) candidates = filterItems(candidates, filters);

      candidates = sortItems(candidates, "createdAt", "desc");
      const result = paginate(candidates, page, pageSize);

      return res(ctx.status(200), ctx.json(result));
    });
  }),

  rest.post("/api/candidates", async (req, res, ctx) => {
    return simulateNetworkRequest(async () => {
      const candidateData = await req.json();
      const newCandidate = {
        ...candidateData,
        stage: candidateData.stage || CANDIDATE_STAGES.APPLIED,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const id = await db.candidates.add(newCandidate);

      await db.candidateTimeline.add({
        candidateId: id,
        stage: newCandidate.stage,
        notes: "Initial application",
        createdAt: new Date(),
      });

      const candidate = await db.candidates.get(id);
      return res(ctx.status(201), ctx.json(candidate));
    });
  }),

  rest.get("/api/candidates/:id", async (req, res, ctx) => {
    return simulateNetworkRequest(async () => {
      const id = parseInt(req.params.id);
      const candidate = await db.candidates.get(id);
      if (!candidate) return res(ctx.status(404), ctx.json({ error: "Candidate not found" }));
      return res(ctx.status(200), ctx.json(candidate));
    });
  }),

  rest.patch("/api/candidates/:id", async (req, res, ctx) => {
    return simulateNetworkRequest(async () => {
      const id = parseInt(req.params.id);
      const updates = await req.json();

      const existingCandidate = await db.candidates.get(id);
      if (!existingCandidate) return res(ctx.status(404), ctx.json({ error: "Candidate not found" }));

      const updatedCandidate = { ...existingCandidate, ...updates, updatedAt: new Date() };
      await db.candidates.update(id, updatedCandidate);

      // Add timeline entry if stage changed
      if (updates.stage && updates.stage !== existingCandidate.stage) {
        await db.candidateTimeline.add({
          candidateId: id,
          stage: updates.stage,
          notes: `Moved to ${updates.stage} stage`,
          createdAt: new Date(),
        });
      }

      const candidate = await db.candidates.get(id);
      return res(ctx.status(200), ctx.json(candidate));
    });
  }),

  rest.get("/api/candidates/:id/timeline", async (req, res, ctx) => {
    return simulateNetworkRequest(async () => {
      const id = parseInt(req.params.id);
      const candidate = await db.candidates.get(id);
      if (!candidate) return res(ctx.status(404), ctx.json({ error: "Candidate not found" }));

      const timeline = await db.candidateTimeline
        .where("candidateId")
        .equals(id)
        .orderBy("createdAt")
        .toArray();

      return res(ctx.status(200), ctx.json(timeline));
    });
  }),

  rest.post("/api/candidates/:id/notes", async (req, res, ctx) => {
    return simulateNetworkRequest(async () => {
      const id = parseInt(req.params.id);
      const { notes } = await req.json();

      const candidate = await db.candidates.get(id);
      if (!candidate) return res(ctx.status(404), ctx.json({ error: "Candidate not found" }));

      await db.candidateTimeline.add({
        candidateId: id,
        stage: candidate.stage,
        notes,
        createdAt: new Date(),
      });

      return res(ctx.status(201), ctx.json({ success: true }));
    });
  }),

  rest.delete("/api/candidates/:id", async (req, res, ctx) => {
    return simulateNetworkRequest(async () => {
      const id = parseInt(req.params.id);
      const candidate = await db.candidates.get(id);
      if (!candidate) return res(ctx.status(404), ctx.json({ error: "Candidate not found" }));

      await db.candidates.delete(id);
      await db.candidateTimeline.where("candidateId").equals(id).delete();
      return res(ctx.status(200), ctx.json({ success: true }));
    });
  }),
];

// Assessments endpoints
export const assessmentsHandlers = [
  rest.get("/api/assessments", async (req, res, ctx) => {
    try {
      return simulateNetworkRequest(async () => {
        const assessments = await db.assessments.toArray();
        return res(ctx.status(200), ctx.json(assessments));
      });
    } catch (err) {
      return res(ctx.status(500), ctx.json({ error: err.message }));
    }
  }),

  rest.get("/api/assessments/:jobId", async (req, res, ctx) => {
    try {
      return simulateNetworkRequest(async () => {
        const jobId = parseInt(req.params.jobId);
        console.log(`MSW: Assessment endpoint called for jobId: ${jobId}`);
        const assessment = await db.assessments.where("jobId").equals(jobId).first();
        console.log(`MSW: Found assessment:`, assessment);
        if (!assessment) {
          console.log(`MSW: No assessment found for jobId: ${jobId}`);
          return res(ctx.status(404), ctx.json({ error: "Assessment not found" }));
        }
        return res(ctx.status(200), ctx.json(assessment));
      });
    } catch (err) {
      console.error(`MSW: Error in assessment handler:`, err);
      return res(ctx.status(500), ctx.json({ error: err.message }));
    }
  }),

  rest.put("/api/assessments/:jobId", async (req, res, ctx) => {
    return simulateNetworkRequest(async () => {
      const jobId = parseInt(req.params.jobId);
      const assessmentData = await req.json();

      const existingAssessment = await db.assessments.where("jobId").equals(jobId).first();
      
      if (existingAssessment) {
        const updatedAssessment = {
          ...existingAssessment,
          ...assessmentData,
          updatedAt: new Date(),
        };
        await db.assessments.update(existingAssessment.id, updatedAssessment);
        return res(ctx.status(200), ctx.json(updatedAssessment));
      } else {
        const newAssessment = {
          ...assessmentData,
          jobId,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        const id = await db.assessments.add(newAssessment);
        const assessment = await db.assessments.get(id);
        return res(ctx.status(201), ctx.json(assessment));
      }
    });
  }),

  rest.post("/api/assessments/:jobId/submit", async (req, res, ctx) => {
    return simulateNetworkRequest(async () => {
      const jobId = parseInt(req.params.jobId);
      const { candidateId, responses } = await req.json();

      const assessment = await db.assessments.where("jobId").equals(jobId).first();
      if (!assessment) return res(ctx.status(404), ctx.json({ error: "Assessment not found" }));

      const responseData = {
        assessmentId: assessment.id,
        candidateId,
        responses,
        createdAt: new Date(),
      };

      const id = await db.assessmentResponses.add(responseData);
      return res(ctx.status(201), ctx.json({ id, ...responseData }));
    });
  }),

  rest.get("/api/assessments/:jobId/responses", async (req, res, ctx) => {
    return simulateNetworkRequest(async () => {
      const jobId = parseInt(req.params.jobId);
      const assessment = await db.assessments.where("jobId").equals(jobId).first();
      if (!assessment) return res(ctx.status(404), ctx.json({ error: "Assessment not found" }));

      const responses = await db.assessmentResponses
        .where("assessmentId")
        .equals(assessment.id)
        .toArray();

      return res(ctx.status(200), ctx.json(responses));
    });
  }),

  rest.delete("/api/assessments/:jobId", async (req, res, ctx) => {
    return simulateNetworkRequest(async () => {
      const jobId = parseInt(req.params.jobId);
      const assessment = await db.assessments.where("jobId").equals(jobId).first();
      if (!assessment) return res(ctx.status(404), ctx.json({ error: "Assessment not found" }));

      await db.assessments.delete(assessment.id);
      await db.assessmentResponses.where("assessmentId").equals(assessment.id).delete();
      return res(ctx.status(200), ctx.json({ success: true }));
    });
  }),
];

// Combine all
export const handlers = [
  ...jobsHandlers,
  ...candidatesHandlers,
  ...assessmentsHandlers,
];
